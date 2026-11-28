import { matchingProducts } from "./catalog-view";

export const catalogPath = "/urunler";

export function catalogField(params, key) {
  const value = params[key];
  return typeof value === "string" ? value.trim().slice(0, 100) : "";
}

export function catalogUrl(values) {
  const query = new globalThis.URLSearchParams(Object.entries(values).filter(([, value]) => value));
  return query.size ? `${catalogPath}?${query}` : catalogPath;
}

export function catalogResultsUrl(values) {
  return `${catalogUrl(values)}#catalog-heading`;
}

export function catalogResultPage(catalog, { q, kategori, marka, sayfa }) {
  const pageSize = 12;
  const matches = matchingProducts(catalog, q, kategori, marka);
  const pages = Math.max(1, Math.ceil(matches.length / pageSize));
  const page = Math.min(pages, Math.max(1, Math.floor(Number(sayfa)) || 1));
  const products = matches.slice((page - 1) * pageSize, page * pageSize)
    .map(({ id, slug, name, brand, model, images, specs }) => ({
      id, slug, name, brand, model, images: images.map(({ id, url, alt }) => ({ id, url, alt })),
      specs: specs.slice(0, 1).map(({ value }) => ({ value })),
    }));
  return { products, page, pages, hasProducts: catalog.products.length > 0 };
}
