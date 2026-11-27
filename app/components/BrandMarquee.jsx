import Image from "next/image";
import { connection } from "next/server";
import { readCatalog } from "../lib/catalog-store";
import { partnerBrands } from "../lib/partner-brands";

function BrandRow({ logos, reverse }) {
  return (
    <div className={`brand-marquee-row${reverse ? " brand-marquee-reverse" : ""}`}>
      <div className="brand-marquee-track">
        {[false, true].map((duplicate) => (
          <ul key={String(duplicate)} className="brand-marquee-group" aria-hidden={duplicate || undefined}>
            {logos.map(({ id, name, image }) => (
              <li key={id} className="brand-marquee-logo">
                <Image src={image.url} alt={duplicate ? "" : name}
                  fill sizes="(max-width: 700px) 100px, 142px" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export default async function BrandMarquee() {
  await connection();
  const logos = partnerBrands(await readCatalog());
  if (logos.length === 0) return null;
  const split = Math.ceil(logos.length / 2);

  return (
    <section className="home-section home-brands" aria-labelledby="home-brands-title">
      <div className="container" data-home-reveal="pending">
        <h2 id="home-brands-title">Çalıştığımız Markalar</h2>
        <p>Isıtma ve soğutma ihtiyaçlarınız için farklı marka ve model seçenekleri sunuyoruz.</p>
        <BrandRow logos={logos.slice(0, split)} />
        {split < logos.length && <BrandRow logos={logos.slice(split)} reverse />}
      </div>
    </section>
  );
}
