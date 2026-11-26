import { site } from "./lib/site";

const pages = ["/", "/hizmetler", "/urunler", "/bakim-onarim", "/kurumsal", "/galeri", "/blog",
  "/gizlilik-politikasi", "/kvkk-aydinlatma-metni", "/cerez-politikasi"];

export default function sitemap() {
  return pages.map((path) => ({ url: new URL(path, site.url).href }));
}
