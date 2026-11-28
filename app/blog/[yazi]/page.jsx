import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import WhatsAppButton from "../../components/WhatsAppButton";
import { blogDate, blogPath, publishedBlogPosts } from "../../lib/blog";
import { articleBlocks } from "../../lib/blog-content";
import { readCatalog } from "../../lib/catalog-store";
import { mediaUrl } from "../../lib/cloudinary-loader";
import { pageMetadata } from "../../lib/seo";
import { servicePath, services } from "../../lib/services";
import { site } from "../../lib/site";
import BlogCard from "../BlogCard";

const lookup = cache(async (slug) => {
  const catalog = await readCatalog();
  const posts = publishedBlogPosts(catalog);
  const post = posts.find((entry) => entry.slug === slug);
  if (!post) {
    if (!catalog.available) throw new Error("Blog catalog unavailable");
    notFound();
  }
  return { post, posts };
});

function shareImage(post) {
  if (!post.cover) return undefined;
  const { src, alt } = post.cover;
  const path = src.startsWith("https://res.cloudinary.com/") ?
    src.replace("/image/upload/", "/image/upload/c_limit,w_1200,f_jpg,q_auto:good/") : mediaUrl(src, { width: 1200, format: "jpg" });
  return { url: new URL(path, site.url).href, alt };
}

export async function generateMetadata({ params }) {
  const { post } = await lookup((await params).yazi);
  const metadata = pageMetadata({
    path: blogPath(post.slug),
    title: post.title,
    description: post.summary,
    image: shareImage(post),
  });
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt ?? undefined,
      authors: [new URL("/kurumsal", site.url).href],
    },
  };
}

function ArticleBody({ blocks }) {
  return blocks.map(({ text, id, heading }) => {
      if (heading) return <h2 id={id} key={id}>{heading}</h2>;
      const lines = text.split(/\r?\n/);
      if (lines.every((line) => line.startsWith("- "))) {
        return <ul key={id}>{lines.map((line, position) => <li key={position}>{line.slice(2)}</li>)}</ul>;
      }
      return <p key={id}>{text}</p>;
    });
}

export default async function BlogPostPage({ params }) {
  const { post, posts } = await lookup((await params).yazi);
  const path = blogPath(post.slug);
  const url = new URL(path, site.url).href;
  const service = services.find(({ slug }) => slug === post.serviceSlug);
  const blocks = articleBlocks(post.body);
  const headings = blocks.filter(({ heading }) => heading);
  const related = posts.filter(({ id }) => id !== post.id).sort((a, b) =>
    Number(b.serviceSlug === post.serviceSlug) - Number(a.serviceSlug === post.serviceSlug)).slice(0, 3);
  const image = shareImage(post);
  const article = {
    "@context": "https://schema.org", "@type": "BlogPosting",
    mainEntityOfPage: url, url, headline: post.title, description: post.summary, inLanguage: "tr-TR",
    author: { "@type": "Organization", name: site.name, url: new URL("/kurumsal", site.url).href },
    publisher: { "@id": `${site.url}/#isletme` },
    ...(image && { image: [image.url] }),
    ...(post.publishedAt && { datePublished: post.publishedAt }),
    ...(post.updatedAt && { dateModified: post.updatedAt }),
  };
  return (
    <>
      <SiteHeader />
      <main className="blog-page">
        <div className="container">
          <Breadcrumb title={post.title} path={path} parents={[{ href: "/blog", name: "Blog" }]} />
          <article className="blog-article">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article).replace(/</g, "\\u003c") }} />
            <header className="blog-article-hero">
              <div className="blog-article-hero-copy">
                {service && <Link className="home-text-link" href={servicePath(service.slug)}>{service.title}</Link>}
                <h1>{post.title}</h1>
                <p className="blog-article-lead">{post.summary}</p>
                <p className="blog-entry-meta"><Link href="/kurumsal">{site.shortName}</Link>
                  {post.publishedAt ? <time dateTime={post.publishedAt}>{blogDate(post)}</time> : <span>{blogDate(post)}</span>}
                </p>
                <Link className="button primary" href="/iletisim#iletisim-formu">Ücretsiz keşif iste <span aria-hidden="true">→</span></Link>
              </div>
              {post.cover && <div className="blog-article-photo">
                <Image src={post.cover.src} alt={post.cover.alt} fill sizes="(max-width: 720px) 94vw, 570px" preload />
              </div>}
            </header>
            <div className="blog-article-layout">
              {(headings.length > 0 || service) && <aside className="blog-article-sidebar">
                {headings.length > 0 && <nav className="blog-toc" aria-label="Bu yazıda">
                  <h2>Bu yazıda</h2>
                  <ul>{headings.map(({ id, heading }) => <li key={id}><a href={`#${id}`}>{heading}</a></li>)}</ul>
                </nav>}
                {service && <section className="blog-service-note">
                  <h2>{service.title}</h2>
                  <p>{post.serviceSummary || service.summary}</p>
                  <Link className="home-text-link" href={servicePath(service.slug)}>Hizmeti incele <span aria-hidden="true">→</span></Link>
                </section>}
              </aside>}
              <div className="blog-article-body"><ArticleBody blocks={blocks} /></div>
            </div>
            <footer className="blog-article-links">
              <Link className="home-text-link" href="/blog">Tüm yazılara dön →</Link>
              <Link className="home-text-link" href="/nasil-calisiyoruz">Keşiften teslime nasıl çalışıyoruz? →</Link>
            </footer>
          </article>
          {related.length > 0 && <section className="blog-related" aria-labelledby="blog-related-heading">
            <h2 id="blog-related-heading">İlginizi çekebilecek yazılar</h2>
            <div className="blog-entries-grid">{related.map((entry) => <BlogCard key={entry.id} post={entry} />)}</div>
          </section>}
        </div>
      </main>
      <SiteFooter />
      <WhatsAppButton showPhone />
    </>
  );
}
