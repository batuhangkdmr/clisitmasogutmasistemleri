import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import Breadcrumb from "../components/Breadcrumb";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { blogPath, publishedBlogPosts } from "../lib/blog";
import { readCatalog } from "../lib/catalog-store";
import { pageMetadata } from "../lib/seo";
import { services } from "../lib/services";
import BlogCard from "./BlogCard";

const pageSize = 12;
const pagePath = (page) => page === 1 ? "/blog" : `/blog?sayfa=${page}`;

const getPage = cache(async (requested) => {
  if (requested !== undefined && (typeof requested !== "string" || !/^[1-9]\d*$/.test(requested))) notFound();
  const allPosts = publishedBlogPosts(await readCatalog());
  const page = requested === undefined ? 1 : Number(requested);
  const pageCount = Math.max(1, Math.ceil(allPosts.length / pageSize));
  if (page > pageCount) notFound();
  const offset = (page - 1) * pageSize;
  return { allPosts, posts: allPosts.slice(offset, offset + pageSize), page, pageCount };
});

export async function generateMetadata({ searchParams }) {
  const { page } = await getPage((await searchParams).sayfa);
  return pageMetadata({
    path: pagePath(page),
    title: page === 1 ? "Samsun Isıtma ve Soğutma Blogu" : `Samsun Isıtma ve Soğutma Blogu – Sayfa ${page}`,
    description: page === 1
      ? "Samsun Tekkeköy’de klima, kombi, ısı pompası ve tesisat seçimi hakkında CL Isıtma’nın saha notlarını ve kullanım rehberlerini okuyun."
      : `CL Isıtma blogunun ${page}. sayfasındaki Samsun ve Tekkeköy odaklı ısıtma, soğutma ve tesisat yazılarını inceleyin.`,
  });
}

export default async function BlogPage({ searchParams }) {
  const { allPosts, posts, page, pageCount } = await getPage((await searchParams).sayfa);
  const featured = page === 1 ? posts[0] : null;
  const cards = featured ? posts.slice(1) : posts;
  const firstPageLink = Math.max(1, Math.min(page - 2, pageCount - 4));
  const pageLinks = Array.from({ length: Math.min(5, pageCount) }, (_, index) => firstPageLink + index);
  const topics = services.flatMap(({ slug, title }) => {
    const post = allPosts.find((entry) => entry.serviceSlug === slug);
    return post ? [{ slug, title, post }] : [];
  });
  return (
    <>
      <SiteHeader />
      <main className="blog-page">
        <div className="container">
          <Breadcrumb title="Blog" path="/blog" />
          <header className="blog-intro">
            <div>
              <h1>Isıtma ve soğutma rehberi</h1>
              <p>Samsun ve Tekkeköy’deki ev ve iş yerleri için sistem seçimi, montaj hazırlığı ve tesisat üzerine saha notları.</p>
              {posts.length > 0 && <a href="#blog-yazilari" className="button light">Yazılara göz at <span aria-hidden="true">↓</span></a>}
            </div>
            {topics.length > 0 && <nav className="blog-topics" aria-label="Blog konuları">
              <h2>Konulara göre oku</h2>
              <ul>{topics.map(({ slug, title, post }) => (
                <li key={slug}><Link href={blogPath(post.slug)}>{title} <span aria-hidden="true">↗</span></Link></li>
              ))}</ul>
            </nav>}
          </header>
          {posts.length > 0 ? (
            <div className="blog-entries" id="blog-yazilari">
              {featured && <BlogCard post={featured} featured />}
              {cards.length > 0 && (
                <section aria-labelledby="blog-more">
                  <h2 id="blog-more">{featured ? "Diğer yazılar" : `Blog yazıları · Sayfa ${page}`}</h2>
                  <div className="blog-entries-grid">{cards.map((post) => <BlogCard key={post.id} post={post} />)}</div>
                </section>
              )}
            </div>
          ) : <p>Yayında yazı bulunmuyor.</p>}
          {pageCount > 1 && <nav className="store-pagination blog-pagination" aria-label="Blog sayfaları">
            {page > 1 && <Link href={pagePath(page - 1)}>Önceki</Link>}
            {pageLinks.map((number) => (
              <Link key={number} href={pagePath(number)} aria-label={`Sayfa ${number}`}
                aria-current={number === page ? "page" : undefined}>{number}</Link>
            ))}
            {page < pageCount && <Link href={pagePath(page + 1)}>Sonraki</Link>}
          </nav>}
          <section className="blog-help">
            <div>
              <h2>Mekânınıza uygun sistemi birlikte seçelim</h2>
              <p>Mevcut tesisatınızı ve ihtiyacınızı paylaşın. Keşif ve uygulama seçeneklerini birlikte değerlendirelim.</p>
            </div>
            <div>
              <Link className="button primary" href="/iletisim#iletisim-formu">Ücretsiz keşif iste <span aria-hidden="true">→</span></Link>
              <Link className="home-text-link" href="/hizmetler">Hizmetleri incele</Link>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
