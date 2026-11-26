import Image from "next/image";
import Breadcrumb from "../components/Breadcrumb";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { catalogAnchor, klimalar, kombiler } from "../lib/catalog";
import { pageMetadata } from "../lib/seo";

export const metadata = pageMetadata({
  path: "/urunler",
  title: "Samsun Klima ve Kombi Satışı",
  description: "Samsun Tekkeköy’de klima ve kombi marka ve modellerini inceleyin. Fiyat, stok ve ücretsiz yerinde keşif için CL Isıtma’ya ulaşın.",
});

export default function ProductsPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-main product-catalog">
        <div className="container">
          <Breadcrumb title="Ürünler" path="/urunler" />
          <p className="eyebrow blue">Ürünler</p>
          <h1>Klima ve kombi seçenekleri.</h1>
          <p className="lead">
            Marka ve kapasiteyi yerinde bakarak netleştiriyoruz. Keşif ücretsiz; peşin fiyatına taksit imkânı var.
          </p>

          <div className="catalog-tabs" aria-label="Ürün kategorileri">
            <a href="#klimalar">Klimalar</a>
            <a href="#kombiler">Kombiler</a>
          </div>

          <section className="catalog-section" id="klimalar">
            <h2>Klimalar</h2>
            <p>Duvar tipi split klimalar. Oda sayısına ve kullanım tipine göre kapasite öneriyoruz.</p>
            <div className="catalog-grid">
              {klimalar.map(([brand, name, text, image, tags]) => (
                <article className="product-card" key={name} id={catalogAnchor("klima", name)}>
                  <div className="product-top">
                    <span className="brand">{brand}</span>
                    <span>Duvar tipi</span>
                  </div>
                  <div className="ac-visual has-product-image">
                    <Image
                      src={image}
                      alt={`${name} klima`}
                      width={560}
                      height={280}
                      sizes="(max-width: 800px) 100vw, 40vw"
                    />
                  </div>
                  <h2>{name}</h2>
                  <p>{text}</p>
                  <div className="product-tags">
                    {tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <a href="/#iletisim">
                    Keşif / fiyat sor <b>→</b>
                  </a>
                </article>
              ))}
            </div>
          </section>

          <section className="catalog-section" id="kombiler">
            <h2>Kombiler</h2>
            <p>
              Yoğuşmalı kombi seçenekleri. Doğalgaz hattı ve petek yapınıza göre modeli birlikte belirliyoruz.
            </p>
            <div className="catalog-grid">
              {kombiler.map(([brand, name, text, tags]) => (
                <article className="product-card" key={name} id={catalogAnchor("kombi", name)}>
                  <div className="product-top">
                    <span className="brand">{brand}</span>
                    <span>Yoğuşmalı kombi</span>
                  </div>
                  <div className="kombi-visual" aria-hidden="true">
                    KOMBİ
                  </div>
                  <h2>{name}</h2>
                  <p>{text}</p>
                  <div className="product-tags">
                    {tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <a href="/#iletisim">
                    Keşif / fiyat sor <b>→</b>
                  </a>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
