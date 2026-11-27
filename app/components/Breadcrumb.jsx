import Link from "next/link";
import { site } from "../lib/site";

export default function Breadcrumb({ title, path, indexable = true, parents = [] }) {
  const linked = [{ name: "Ana Sayfa", href: "/" }, ...parents];
  const trail = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [...linked, { name: title, href: path }].map(({ name, href }, index) =>
      ({ "@type": "ListItem", position: index + 1, name, item: new URL(href, site.url).href })),
  };

  return (
    <>
      {indexable && <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(trail).replace(/</g, "\\u003c") }} />}
      <nav className="legal-breadcrumb" aria-label="Sayfa yolu">
        {linked.map(({ name, href }) => <span key={href}><Link href={href}>{name}</Link> <span aria-hidden="true">›</span></span>)}
        <span aria-current="page">{title}</span>
      </nav>
    </>
  );
}
