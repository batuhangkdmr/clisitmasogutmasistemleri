import { site } from "./lib/site";
import { publishedCatalog } from "./lib/catalog-store";
import { categoryTrail, productPath } from "./lib/catalog-view";
import { servicePath, services } from "./lib/services";
import { blogPath, publishedBlogPosts } from "./lib/blog";

export const dynamic = "force-dynamic";

const pages = ["/", "/hizmetler", "/urunler", "/kurumsal", "/nasil-calisiyoruz", "/iletisim", "/galeri", "/blog",
  "/gizlilik-politikasi", "/kvkk-aydinlatma-metni", "/cerez-politikasi", ...services.map(({ slug }) => servicePath(slug))];

export default async function sitemap() {
  const catalog = await publishedCatalog();
  const { categories, products } = catalog;
  const categorySlugs = new Set(products.flatMap((product) =>
    categoryTrail(categories, product.categoryId).map(({ slug }) => slug)));
  const categoriesPaths = [...categorySlugs].map((slug) => `/urunler?kategori=${slug}`);
  return [
    ...[...pages, ...categoriesPaths].map((path) => ({ url: new URL(path, site.url).href })),
    ...publishedBlogPosts(catalog).map((post) => ({
      url: new URL(blogPath(post.slug), site.url).href,
      ...(post.updatedAt && { lastModified: post.updatedAt }),
    })),
    ...products.map((product) => ({
      url: new URL(productPath(product), site.url).href,
      ...(product.updatedAt && { lastModified: product.updatedAt }),
    })),
  ];
}
