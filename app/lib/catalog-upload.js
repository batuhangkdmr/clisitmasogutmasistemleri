import { createHash, randomUUID } from "node:crypto";
import { Buffer } from "node:buffer";
import { env } from "node:process";
import { URLSearchParams } from "node:url";
import sharp from "sharp";
import { imageFileError } from "./catalog-image-policy.mjs";

const catalogImageId = /^cl-isitma\/katalog\/(?:[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}|urun-[a-f0-9]{22})$/i;

export function catalogImagePublicId(url) {
  if (typeof url !== "string") return null;
  const prefix = `https://res.cloudinary.com/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/`;
  if (!env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !url.startsWith(prefix)) return null;
  const path = url.slice(prefix.length).split(/[?#]/, 1)[0];
  const folder = path.lastIndexOf("cl-isitma/katalog/");
  if (folder === -1 || (folder > 0 && path[folder - 1] !== "/")) return null;
  const publicId = path.slice(folder).replace(/\.(?:jpe?g|png|webp|avif)$/i, "");
  return catalogImageId.test(publicId) ? publicId : null;
}

export async function destroyCatalogImage(publicId) {
  const { NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: cloud, CLOUDINARY_API_KEY: key, CLOUDINARY_API_SECRET: secret } = env;
  if (!cloud || !key || !secret || !catalogImageId.test(publicId)) return false;
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = createHash("sha1").update(`invalidate=true&public_id=${publicId}&timestamp=${timestamp}${secret}`).digest("hex");
  const body = new URLSearchParams({ invalidate: "true", public_id: publicId, timestamp, api_key: key, signature });
  try {
    const response = await globalThis.fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/destroy`, {
      method: "POST", body, signal: globalThis.AbortSignal.timeout(6000),
    });
    if (!response.ok) return false;
    const { result } = await response.json();
    return result === "ok" || result === "not found";
  } catch {
    return false;
  }
}

async function optimizeImage(file, logo) {
  const error = imageFileError(file);
  if (error) throw new Error(error);
  const limit = logo ? 1200 : 2048;
  try {
    const input = sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 60_000_000 });
    const { format } = await input.metadata();
    if (!["jpeg", "png", "webp"].includes(format)) throw new Error("Unsupported format");
    return await input.autoOrient()
      .resize({ width: limit, height: limit, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 86, alphaQuality: 100 })
      .toBuffer();
  } catch {
    throw new Error("Görsel okunamadı. Geçerli, 60 megapikseli aşmayan bir JPG, PNG veya WebP dosyası seçin.");
  }
}

export async function uploadCatalogImage(file, alt, { logo = false } = {}) {
  const { NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: cloud, CLOUDINARY_API_KEY: key, CLOUDINARY_API_SECRET: secret } = env;
  if (!cloud || !key || !secret) throw new Error("Cloudinary yükleme ayarları eksik.");
  const id = randomUUID();
  const webp = await optimizeImage(file, logo);
  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = `cl-isitma/katalog/${id}`;
  const signature = createHash("sha1").update(`overwrite=false&public_id=${publicId}&timestamp=${timestamp}${secret}`).digest("hex");
  const form = new FormData();
  form.set("file", new globalThis.Blob([webp], { type: "image/webp" }), `${id}.webp`);
  form.set("api_key", key);
  form.set("overwrite", "false");
  form.set("public_id", publicId);
  form.set("timestamp", String(timestamp));
  form.set("signature", signature);
  const response = await globalThis.fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST", body: form, signal: globalThis.AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error("Görsel Cloudinary’ye yüklenemedi. Tekrar deneyin.");
  const data = await response.json();
  if (data.public_id !== publicId || !Number.isInteger(data.version) ||
      data.format !== "webp") {
    throw new Error("Yüklenen görselin biçimi desteklenmiyor.");
  }
  return {
    id, alt,
    url: `https://res.cloudinary.com/${cloud}/image/upload/v${data.version}/${publicId}.${data.format}`,
  };
}
