import { createHash, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { env } from "node:process";
import { openMySqlConnection } from "../app/lib/mysql.mjs";
import { categories, products } from "./catalog-starter-data.mjs";

const manifest = JSON.parse(readFileSync(new URL("../app/lib/cloudinary-assets.json", import.meta.url), "utf8"));
const sourceImages = JSON.parse(readFileSync(new URL("./catalog-starter-images.json", import.meta.url), "utf8"));
const { NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: cloud, CLOUDINARY_API_KEY: key, CLOUDINARY_API_SECRET: secret } = env;
if (!cloud || !key || !secret) throw new Error("Cloudinary ayarları eksik.");

function slugify(value) {
  return value.toLocaleLowerCase("tr").replaceAll("ı", "i").normalize("NFD")
    .replace(/\p{M}/gu, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 120);
}

function productSlug([category, brand, name, model]) {
  return slugify(`${category} ${brand} ${name} ${model}`);
}

async function upload(source) {
  const asset = manifest[source];
  const delivery = `https://res.cloudinary.com/${cloud}/image/upload`;
  if (asset?.account === cloud) return `${delivery}/v${asset.version}/${asset.id}`;
  if (!source.startsWith("https://")) throw new Error("Görsel kaynağı bulunamadı.");

  const digest = createHash("sha256").update(source).digest("hex").slice(0, 22);
  const publicId = `cl-isitma/katalog/urun-${digest}`;
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHash("sha1").update(`overwrite=false&public_id=${publicId}&timestamp=${timestamp}${secret}`).digest("hex");
  const form = new FormData();
  form.set("file", source);
  form.set("api_key", key);
  form.set("overwrite", "false");
  form.set("public_id", publicId);
  form.set("timestamp", String(timestamp));
  form.set("signature", signature);
  const send = () => fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST", body: form, signal: AbortSignal.timeout(35000),
  });
  let response = await send();
  if (response.status === 400) {
    await response.body?.cancel();
    const original = await fetch(source, { signal: AbortSignal.timeout(10000) });
    if (!original.ok || !original.headers.get("content-type")?.startsWith("image/")) {
      throw new Error(`Üretici görseli HTTP ${original.status}`);
    }
    const image = await original.blob();
    if (image.size > 10 * 1024 * 1024) throw new Error("Üretici görseli 10 MB sınırını aşıyor.");
    form.set("file", image, new URL(source).pathname.split("/").at(-1));
    response = await send();
  }
  const data = await response.json();
  if (!response.ok || data.public_id !== publicId || !data.version || !["jpg", "png", "webp", "avif"].includes(data.format)) {
    throw new Error(`Cloudinary HTTP ${response.status}`);
  }
  return `${delivery}/v${data.version}/${publicId}.${data.format}`;
}

const connection = await openMySqlConnection();
try {
  const [[row]] = await connection.query("SELECT content FROM cl_catalog WHERE id = 1");
  const current = JSON.parse(row.content);
  const existingSlugs = new Set(current.products.map(({ slug }) => slug));
  const pending = products.filter((product) => !existingSlugs.has(productSlug(product)));
  const images = new Map();
  const errors = [];
  let queue = 0;
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (queue < pending.length) {
      const item = pending[queue++];
      const [, , , model, , , givenImage] = item;
      const source = givenImage || sourceImages[model];
      if (!source) {
        errors.push(`${model} — eşleşen görsel bulunamadı`);
        continue;
      }
      if (!images.has(source)) images.set(source, upload(source));
      try {
        await images.get(source);
      } catch (error) {
        errors.push(`${model} — ${error.message}`);
      }
    }
  }));

  if (errors.length) throw new Error(errors.join("\n"));
  await connection.beginTransaction();
  const [[locked]] = await connection.query("SELECT content FROM cl_catalog WHERE id = 1 FOR UPDATE");
  const catalog = JSON.parse(locked.content);
  const entries = new Map(catalog.categories.map((category) => [category.slug, category]));
  let categoriesAdded = 0;
  for (const [order, [slug, name, parent, summary]] of categories.entries()) {
    if (entries.has(slug)) continue;
    const category = { id: randomUUID(), name, slug, summary, order, parentId: parent ? entries.get(parent).id : null };
    entries.set(slug, category);
    catalog.categories.push(category);
    categoriesAdded++;
  }

  const now = new Date().toISOString();
  let productsAdded = 0;
  for (const item of pending) {
    const [category, brand, name, model, summary, document, givenImage] = item;
    const slug = productSlug(item);
    if (catalog.products.some((product) => product.slug === slug ||
        (product.brand.toLocaleLowerCase("tr") === brand.toLocaleLowerCase("tr") &&
         product.model.toLocaleLowerCase("tr") === model.toLocaleLowerCase("tr")))) continue;
    const imageUrl = await images.get(givenImage || sourceImages[model]);
    catalog.products.push({
      id: randomUUID(), categoryId: entries.get(category).id, brand, name, model, slug, summary,
      description: "", document, status: "published", updatedAt: now,
      specs: [{ label: "Ürün grubu", value: entries.get(category).name }],
      images: [{ id: randomUUID(), url: imageUrl, alt: `${brand} ${name} – ${model} serisi ürün görseli` }],
    });
    productsAdded++;
  }
  if (categoriesAdded || productsAdded) {
    await connection.execute("UPDATE cl_catalog SET content = ? WHERE id = 1", [JSON.stringify(catalog)]);
  }
  await connection.commit();
  console.log(`${categoriesAdded} kategori ve ${productsAdded} ürün eklendi. ${images.size} farklı görsel kaynağı doğrulandı.`);
} catch (error) {
  await connection.rollback();
  console.error(error.code ?? error.message);
  process.exitCode = 1;
} finally {
  await connection.end();
}
