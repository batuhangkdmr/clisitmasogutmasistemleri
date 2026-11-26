import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { cwd } from "node:process";
import Image from "next/image";

const brandNames = {
  arcelik: "Arçelik",
  demirdokum: "DemirDöküm",
  eca: "E.C.A.",
  lg: "LG",
  tcl: "TCL",
};

function BrandRow({ logos, reverse }) {
  return (
    <div className={`brand-marquee-row${reverse ? " brand-marquee-reverse" : ""}`}>
      <div className="brand-marquee-track">
        {[false, true].map((duplicate) => (
          <ul key={String(duplicate)} className="brand-marquee-group" aria-hidden={duplicate || undefined}>
            {logos.map(({ file, name }) => (
              <li key={file} className="brand-marquee-logo">
                <Image src={`/brands/${encodeURIComponent(file)}`} alt={duplicate ? "" : name}
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
  const files = await readdir(join(cwd(), "public", "brands"));
  const logos = files.filter((file) => /\.(png|webp|jpe?g|svg)$/i.test(file)).sort().map((file) => {
    const slug = file.replace(/\.[^.]+$/, "");
    const name = brandNames[slug] ?? slug.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
    return { file, name };
  });
  if (logos.length === 0) return null;
  const split = Math.ceil(logos.length / 2);

  return (
    <section className="home-section home-brands" aria-labelledby="home-brands-title">
      <div className="container">
        <h2 id="home-brands-title">Çalıştığımız Markalar</h2>
        <p>Isıtma ve soğutma ihtiyaçlarınız için farklı marka ve model seçenekleri sunuyoruz.</p>
        <BrandRow logos={logos.slice(0, split)} />
        {split < logos.length && <BrandRow logos={logos.slice(split)} reverse />}
      </div>
    </section>
  );
}
