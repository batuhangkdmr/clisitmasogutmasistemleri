"use server";

import { Buffer } from "node:buffer";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { env } from "node:process";
import { URLSearchParams } from "node:url";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authenticate, clearAdminSession, isAdmin } from "../lib/admin-auth";
import { changeCatalog } from "../lib/catalog-store";
import { categoryTrail } from "../lib/catalog-view";
import { catalogImagePublicId, destroyCatalogImage, uploadCatalogImage } from "../lib/catalog-upload";
import { normalizeProductText } from "../lib/catalog";
import { productTitle } from "../lib/catalog-seo";
import { partnerBrands } from "../lib/partner-brands";

class InputError extends Error {}

function value(form, key, limit, required = false) {
  const raw = form.get(key);
  const text = typeof raw === "string" ? raw.trim() : "";
  if (text.length > limit || (required && !text)) throw new InputError("Zorunlu alanları ve karakter sınırlarını kontrol edin.");
  return text;
}

function slugify(input) {
  const slug = input.toLocaleLowerCase("tr").replaceAll("ı", "i").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 120).replace(/-$/, "");
  if (!slug) throw new InputError("Bağlantı adresi için harf veya rakam girin.");
  return slug;
}

function uniqueSlug(items, slug, id) {
  if (items.some((item) => item.slug === slug && item.id !== id)) {
    throw new InputError("Bu bağlantı adresi kullanılıyor. Farklı bir adres yazın.");
  }
}

function nextProductSlug(products, product) {
  const base = slugify(productTitle(product));
  const used = new Set(products.map(({ slug }) => slug));
  let candidate = base;
  for (let index = 2; used.has(candidate); index++) {
    const suffix = `-${index}`;
    candidate = base.slice(0, 120 - suffix.length).replace(/-$/, "") + suffix;
  }
  return candidate;
}

function parseSpecs(text) {
  return text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
    const separator = line.indexOf(":");
    const label = line.slice(0, separator).trim();
    const detail = line.slice(separator + 1).trim();
    return separator > 0 && label.length <= 80 && detail ? { label, value: detail } : { label: "", value: line };
  });
}

function find(items, id) {
  const item = items.find((entry) => entry.id === id);
  if (!item) throw new InputError("Kayıt bulunamadı. Listeyi yenileyin.");
  return item;
}

async function adminOnly() {
  if (!(await isAdmin())) redirect("/admin/giris");
}

function editorUrl(view, id, status) {
  const params = new URLSearchParams({ gorunum: view, durum: status });
  if (id) params.set("id", id);
  return `/admin?${params}`;
}

function catalogMediaIds(catalog) {
  const urls = [
    ...catalog.products.flatMap(({ images }) => (images ?? []).map(({ url }) => url)),
    ...partnerBrands(catalog).map(({ image }) => image?.url),
  ];
  return new Set(urls.map(catalogImagePublicId).filter(Boolean));
}

async function cleanPendingMedia() {
  let remaining = 0;
  await changeCatalog(async (catalog) => {
    const used = catalogMediaIds(catalog);
    const pending = (catalog.pendingMediaDeletes ?? []).filter((id) => !used.has(id));
    const batch = pending.slice(0, 12);
    const deleted = await Promise.all(batch.map(destroyCatalogImage));
    catalog.pendingMediaDeletes = [...pending.slice(batch.length), ...batch.filter((id, index) => !deleted[index])];
    remaining = catalog.pendingMediaDeletes.length;
  });
  return remaining;
}

const mediaPendingMessage = "Değişiklik kaydedildi. Cloudinary temizliği sırada. Panelden tekrar deneyebilirsiniz.";

async function mutate(view, id, change, afterId = id, returnResult = false) {
  const trackMedia = view === "urunler" || view === "markalar";
  let pending = 0;
  try {
    await changeCatalog((catalog) => {
      const before = trackMedia ? catalogMediaIds(catalog) : null;
      change(catalog);
      if (!before) return;
      const after = catalogMediaIds(catalog);
      const removed = [...before].filter((publicId) => !after.has(publicId));
      const queued = new Set([...(catalog.pendingMediaDeletes ?? []), ...removed]);
      if (queued.size || catalog.pendingMediaDeletes) catalog.pendingMediaDeletes = [...queued];
      pending = queued.size;
    });
  } catch (error) {
    return writeError(error, view, id, returnResult);
  }
  if (pending) pending = await cleanPendingMedia().catch(() => pending);
  revalidatePath("/admin");
  revalidatePath("/urunler", "layout");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  const next = editorUrl(view, afterId, pending ? mediaPendingMessage : "saved");
  if (returnResult) return { next };
  redirect(next);
}

export async function retryCatalogMediaCleanup(form) {
  await adminOnly();
  const view = form.get("view") === "markalar" ? "markalar" : "urunler";
  const remaining = await cleanPendingMedia().catch(() => 1);
  revalidatePath("/admin");
  redirect(editorUrl(view, "", remaining ? "Cloudinary temizliği henüz tamamlanmadı." : "Cloudinary temizliği tamamlandı."));
}

function writeError(error, view, id, returnResult) {
  const message = error instanceof InputError ? error.message : "Veritabanı işlemi tamamlanamadı.";
  if (returnResult) return { error: message };
  redirect(editorUrl(view, id, message));
}

async function selectedImage(file, alt, options) {
  if (!file?.size) return null;
  try {
    return await uploadCatalogImage(file, alt.slice(0, 160), options);
  } catch (error) {
    throw new InputError(error instanceof TypeError ? "Görsel yüklenemedi. Tekrar deneyin." : error.message);
  }
}

export async function login(form) {
  let result;
  try {
    result = await authenticate(String(form.get("username") ?? "").trim(), String(form.get("password") ?? ""));
  } catch {
    result = "database";
  }
  redirect(result === "ok" ? "/admin" : `/admin/giris?durum=${result}`);
}

export async function logout() {
  await clearAdminSession();
  redirect("/admin/giris");
}

export async function saveCategory(form, keepValuesOnError = false) {
  await adminOnly();
  const id = String(form.get("id") ?? "");
  const categoryId = id || randomUUID();
  return mutate("kategoriler", id, (catalog) => {
    const old = id ? find(catalog.categories, id) : null;
    const name = value(form, "name", 90, true);
    const slug = slugify(value(form, "slug", 120) || name);
    uniqueSlug(catalog.categories, slug, id);
    const parentId = value(form, "parentId", 36) || null;
    if (parentId) find(catalog.categories, parentId);
    const order = Number(value(form, "order", 4));
    if (!Number.isInteger(order) || order < 0 || order > 9999) throw new InputError("Sıra 0 ile 9999 arasında olmalı.");
    const category = { id: categoryId, name, slug, parentId, order, summary: value(form, "summary", 160) };
    catalog.categories = old ? catalog.categories.map((item) => item.id === id ? category : item) : [...catalog.categories, category];
    for (const item of catalog.categories) {
      const trail = categoryTrail(catalog.categories, item.id);
      if (trail.length > 3 || trail[0]?.parentId !== null) {
        throw new InputError("Kategoriler en fazla üç seviyeli olabilir ve kendi altına taşınamaz.");
      }
    }
  }, "", keepValuesOnError);
}

export async function deleteCategory(form) {
  await adminOnly();
  const id = String(form.get("id") ?? "");
  await mutate("kategoriler", id, (catalog) => {
    find(catalog.categories, id);
    if (catalog.categories.some((item) => item.parentId === id) || catalog.products.some((item) => item.categoryId === id)) {
      throw new InputError("Önce bu kategorideki ürünleri ve alt kategorileri taşıyın.");
    }
    catalog.categories = catalog.categories.filter((item) => item.id !== id);
  }, "");
}

function imageSignature(payload) {
  return createHmac("sha256", env.ADMIN_SESSION_SECRET).update("catalog-image:").update(payload).digest();
}

export async function uploadProductImage(form) {
  await adminOnly();
  try {
    const productId = value(form, "id", 128);
    const image = await selectedImage(form.get("image"), "");
    if (!image) throw new InputError("Yüklenecek görseli seçin.");
    const payload = Buffer.from(JSON.stringify({ productId, image })).toString("base64url");
    return { receipt: `${payload}.${imageSignature(payload).toString("base64url")}` };
  } catch (error) {
    return { error: error instanceof InputError ? error.message : "Görsel yüklenemedi. Tekrar deneyin." };
  }
}

function resolveImageOrder(raw, existing, productId, title) {
  if (raw === null) return existing;
  const invalid = () => new InputError("Görsel sırası kaydedilemedi. Seçimleri kontrol edin.");
  let order;
  try {
    order = JSON.parse(raw);
  } catch {
    throw invalid();
  }
  if (!Array.isArray(order?.previousIds) || !Array.isArray(order?.entries)) throw invalid();
  if (JSON.stringify(order.previousIds) !== JSON.stringify(existing.map(({ id }) => id))) {
    throw new InputError("Ürün görselleri başka bir oturumda değiştirildi. Sayfayı yenileyin.");
  }
  const byId = new Map(existing.map((image) => [image.id, image]));
  const used = new Set();
  return order.entries.map((entry) => {
    let image;
    if (typeof entry?.id === "string") {
      image = byId.get(entry.id);
    } else if (typeof entry?.receipt === "string") {
      const [payload, signature, extra] = entry.receipt.split(".");
      if (!payload || !signature || extra !== undefined) throw invalid();
      const provided = Buffer.from(signature, "base64url");
      const expected = imageSignature(payload);
      if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) throw invalid();
      const uploaded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
      if (uploaded.productId !== productId) throw invalid();
      image = { ...uploaded.image, alt: `${title} ürün görseli`.slice(0, 160) };
    }
    if (!image?.id || used.has(image.id)) throw invalid();
    used.add(image.id);
    return image;
  });
}

export async function saveProduct(form, keepValuesOnError = false) {
  await adminOnly();
  const id = String(form.get("id") ?? "");
  const productId = id || randomUUID();
  let fields;
  try {
    const name = value(form, "name", 110, true);
    const brand = value(form, "brand", 60, true);
    const model = value(form, "model", 90, true);
    const categoryId = value(form, "categoryId", 36, true);
    const status = value(form, "status", 10, true);
    if (!["draft", "published", "archived"].includes(status)) throw new InputError("Geçerli bir yayın durumu seçin.");
    fields = {
      name, brand, model, categoryId, status, specs: parseSpecs(value(form, "specs", 4000)),
      summary: value(form, "summary", 160, true),
      description: value(form, "description", 5000),
    };
  } catch (error) {
    return writeError(error, "urunler", id, keepValuesOnError);
  }
  return mutate("urunler", id, (catalog) => {
    const old = id ? find(catalog.products, id) : null;
    find(catalog.categories, fields.categoryId);
    const images = resolveImageOrder(form.get("imageOrder"), old?.images ?? [], id, productTitle(fields));
    const product = {
      ...old, ...fields, id: productId,
      slug: old?.slug ?? nextProductSlug(catalog.products, fields),
      images,
      updatedAt: new Date().toISOString(),
    };
    catalog.products = old ? catalog.products.map((item) => item.id === id ? product : item) : [...catalog.products, product];
  }, "", keepValuesOnError);
}

export async function saveBrand(form, keepValuesOnError = false) {
  await adminOnly();
  const id = String(form.get("id") ?? "");
  let name;
  let image;
  try {
    name = value(form, "name", 60, true);
    if (!normalizeProductText(name)) throw new InputError("Marka adı için harf veya rakam girin.");
    if (!id && !form.get("image")?.size) throw new InputError("Marka logosu için bilgisayarınızdan bir görsel seçin.");
    image = await selectedImage(form.get("image"), name, { logo: true });
  } catch (error) {
    return writeError(error, "markalar", id, keepValuesOnError);
  }
  return mutate("markalar", id, (catalog) => {
    const brands = partnerBrands(catalog);
    const old = id ? find(brands, id) : null;
    const normalized = normalizeProductText(name);
    if (brands.some((brand) => brand.id !== id && normalizeProductText(brand.name) === normalized)) {
      throw new InputError("Bu marka adı zaten kayıtlı.");
    }
    const brand = { id: id || randomUUID(), name, image: { ...(image ?? old.image), alt: name } };
    catalog.brands = old ? brands.map((entry) => entry.id === id ? brand : entry) : [...brands, brand];
    if (old && old.name !== name) {
      const now = new Date().toISOString();
      for (const product of catalog.products) {
        if (normalizeProductText(product.brand) === normalizeProductText(old.name)) {
          product.brand = name;
          product.updatedAt = now;
        }
      }
    }
  }, "", keepValuesOnError);
}

export async function deleteBrand(form) {
  await adminOnly();
  const id = String(form.get("id") ?? "");
  await mutate("markalar", id, (catalog) => {
    const brands = partnerBrands(catalog);
    const brand = find(brands, id);
    if (catalog.products.some((product) => normalizeProductText(product.brand) === normalizeProductText(brand.name))) {
      throw new InputError("Markayı silmeden önce bu markaya bağlı ürünlerin markasını değiştirin.");
    }
    catalog.brands = brands.filter((item) => item.id !== id);
  }, "");
}

export async function deleteProduct(form) {
  await adminOnly();
  const id = String(form.get("id") ?? "");
  await mutate("urunler", id, (catalog) => {
    if (form.get("confirmation") !== "delete") throw new InputError("Ürünü silmek için işlemi onaylayın.");
    find(catalog.products, id);
    catalog.products = catalog.products.filter((item) => item.id !== id);
  }, "");
}
