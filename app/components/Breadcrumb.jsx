import Link from "next/link";
import { site } from "../lib/site";

export default function Breadcrumb({ title, path, indexable = true }) {
  const trail = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: new URL("/", site.url).href },
      { "@type": "ListItem", position: 2, name: title, item: new URL(path, site.url).href },
    ],
  };

  return (
    <>
      {indexable && <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(trail).replace(/</g, "\\u003c") }} />}
      <nav className="legal-breadcrumb" aria-label="Sayfa yolu">
        <Link href="/">Ana Sayfa</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{title}</span>
      </nav>
    </>
  );
}
