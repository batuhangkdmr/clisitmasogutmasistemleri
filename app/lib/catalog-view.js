import { site } from "./site";
import { normalizeProductText } from "./catalog";

export function categoryTrail(categories, id) {
  const trail = [];
  let category = categories.find((item) => item.id === id);
  while (category && !trail.includes(category)) {
    trail.unshift(category);
    category = categories.find((item) => item.id === category.parentId);
  }
  return trail;
}

export function matchingProducts(catalog, query = "", category = "", brand = "") {
  const terms = normalizeProductText(query).split(" ").filter(Boolean);
  const selectedBrand = normalizeProductText(brand);
  return catalog.products.filter((product) => {
    const trail = categoryTrail(catalog.categories, product.categoryId);
    const searchable = normalizeProductText([
      product.name, product.brand, product.model, product.summary,
      ...trail.map((item) => item.name), ...product.specs.flatMap(({ label, value }) => [label, value]),
    ].join(" "));
    return (!category || trail.some((item) => item.slug === category)) &&
      (!selectedBrand || normalizeProductText(product.brand) === selectedBrand) && terms.every((term) => searchable.includes(term));
  });
}

export function productPath(product) {
  return `/urunler/${product.slug}`;
}

export function quoteUrl(product) {
  const message = product
    ? `Merhaba, ${product.brand} ${product.name} (${product.model}) için fiyat, stok ve montaj bilgisi alabilir miyim?\n${site.url}${productPath(product)}`
    : "Merhaba, ürün seçenekleri ve fiyat hakkında bilgi alabilir miyim?";
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
