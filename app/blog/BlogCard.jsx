import Image from "next/image";
import Link from "next/link";
import { blogDate, blogPath } from "../lib/blog";
import { services } from "../lib/services";

export default function BlogCard({ post, featured = false }) {
  const service = services.find(({ slug }) => slug === post.serviceSlug);
  return (
    <article className={`blog-entry${featured ? " blog-entry-featured" : ""}`}>
      <Link href={blogPath(post.slug)}>
        {post.cover && <div className="blog-entry-photo">
          <Image src={post.cover.src} alt={post.cover.alt} fill
            sizes={featured ? "(max-width: 720px) 94vw, 620px" : "(max-width: 720px) 94vw, (max-width: 1000px) 46vw, 385px"}
            preload={featured} />
        </div>}
        <div className="blog-entry-copy">
          <p className="blog-entry-meta">
            {service && <span>{service.title}</span>}
            {post.publishedAt ? <time dateTime={post.publishedAt}>{blogDate(post)}</time> : <span>{blogDate(post)}</span>}
          </p>
          {featured ? <h2>{post.title}</h2> : <h3>{post.title}</h3>}
          <p>{post.summary}</p>
          <span className="blog-entry-action">Yazıyı oku <span aria-hidden="true">↗</span></span>
        </div>
      </Link>
    </article>
  );
}
