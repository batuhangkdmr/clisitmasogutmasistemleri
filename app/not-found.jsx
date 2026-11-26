import Link from "next/link";
import { site } from "./lib/site";

export default function NotFound() {
  return (
    <main className="utility-page">
      <section className="utility">
        <p className="eyebrow blue">404</p>
        <div className="utility-mark">CL</div>
        <h1>Bu sayfa yok.</h1>
        <p>Ana sayfadan hizmetlere bakabilir veya bizi arayabilirsiniz.</p>
        <div className="utility-actions">
          <Link className="button primary" href="/">
            Ana sayfa <span>→</span>
          </Link>
          <a className="phone-link" href={`tel:${site.phones[0].tel}`}>
            {site.phones[0].display}
          </a>
        </div>
      </section>
    </main>
  );
}
