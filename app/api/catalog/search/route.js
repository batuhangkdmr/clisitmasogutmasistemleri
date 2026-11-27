import { publishedCatalog } from "../../../lib/catalog-store";
import { categoryTrail, productPath } from "../../../lib/catalog-view";

export async function GET() {
  const catalog = await publishedCatalog();
  if (!catalog.available) return globalThis.Response.json({ items: [] }, { status: 503 });
  const categories = catalog.categories.map(({ slug, name }) => ({
    title: name, category: "Ürün kategorisi", href: `/urunler?kategori=${slug}`,
  }));
  const items = catalog.products.map((product) => {
    const trail = categoryTrail(catalog.categories, product.categoryId);
    return {
      title: `${product.name} ${product.model}`,
      brand: product.brand,
      category: trail.at(-1)?.name || "Ürün",
      keywords: trail.map(({ name }) => name).join(" "),
      href: productPath(product),
    };
  });
  return globalThis.Response.json({ items: [...categories, ...items] }, { headers: { "Cache-Control": "no-store" } });
}
