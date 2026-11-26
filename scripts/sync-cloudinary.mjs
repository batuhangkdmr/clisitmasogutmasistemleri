import { createHash } from "node:crypto";
import { readdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { env } from "node:process";
import { klimalar } from "../app/lib/catalog.js";

const cloud = env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const key = env.CLOUDINARY_API_KEY;
const secret = env.CLOUDINARY_API_SECRET;
if (!cloud || !key || !secret || !/^[a-z0-9-]+$/i.test(cloud)) {
  throw new Error("Cloudinary ortam ayarları eksik veya geçersiz.");
}

const manifestPath = "app/lib/cloudinary-assets.json";
const previous = JSON.parse(await readFile(manifestPath, "utf8"));
const manifest = Object.fromEntries(Object.entries(previous).filter(([, asset]) => asset.account === cloud));

async function localImages(directory = "public", parent = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const assets = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    const src = `${parent}/${encodeURIComponent(entry.name)}`;
    if (entry.isDirectory()) return localImages(path, src);
    return /\.(png|webp|jpe?g|gif|svg|avif)$/i.test(entry.name) ? [{ src, path }] : [];
  }));
  return assets.flat();
}

const files = [
  ...await localImages(),
  ...new Set(klimalar.map(([, , , src]) => src)),
].map((item) => typeof item === "string" ? { src: item } : item);
const errors = [];
let uploaded = 0;
let reused = 0;
let next = 0;

async function upload({ src, path }) {
  const data = path ? await readFile(path) : null;
  const digest = createHash("sha256").update(data ?? src).digest("hex");
  const cached = previous[src];
  if (cached?.digest === digest && cached.account === cloud) {
    manifest[src] = cached;
    reused++;
    return;
  }

  const name = decodeURIComponent(src.split("/").at(-1)).replace(/\.[^.]+$/, "")
    .normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "").slice(0, 45) || "image";
  const id = `cl-isitma/site/${name}-${digest.slice(0, 16)}`;
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHash("sha1").update(`overwrite=false&public_id=${id}&timestamp=${timestamp}${secret}`).digest("hex");
  const form = new FormData();
  if (data) form.set("file", new Blob([data]), path.split(/[\\/]/).at(-1));
  else form.set("file", src);
  form.set("public_id", id);
  form.set("overwrite", "false");
  form.set("timestamp", String(timestamp));
  form.set("signature", signature);
  form.set("api_key", key);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST", body: form, signal: AbortSignal.timeout(45000),
  });
  const result = await response.json();
  if (!response.ok || !result.version || !result.width || !result.public_id) {
    throw new Error(`HTTP ${response.status}: ${result.error?.message ?? "Eksik yükleme yanıtı"}`);
  }
  manifest[src] = { id: result.public_id, version: result.version, width: result.width, digest, account: cloud };
  uploaded++;
}

async function worker() {
  while (next < files.length) {
    const file = files[next++];
    try {
      await upload(file);
    } catch (error) {
      errors.push([file.src, error.message]);
    }
  }
}

await Promise.all(Array.from({ length: 4 }, worker));
const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
await writeFile(`${manifestPath}.tmp`, `${JSON.stringify(sorted, null, 2)}\n`);
await rename(`${manifestPath}.tmp`, manifestPath);
console.log(`Cloudinary: ${uploaded} yüklendi, ${reused} hazırdı, ${errors.length} hata.`);
for (const [src, error] of errors) console.error(`${src}: ${error}`);
if (errors.length) process.exitCode = 1;
