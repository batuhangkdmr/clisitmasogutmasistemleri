import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import BrandMarquee from "./components/BrandMarquee";
import CardRail from "./components/CardRail";
import ContactForm from "./components/ContactForm";
import HomeHero from "./components/HomeHero";
import HomeScrollReveal from "./components/HomeScrollReveal";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import WhatsAppButton from "./components/WhatsAppButton";
import { publishedCatalog, readCatalog } from "./lib/catalog-store";
import { productPath } from "./lib/catalog-view";
import { productImages } from "./lib/product-images";
import { galleryPhotoUrl, galleryPhotos } from "./lib/gallery";
import { pageMetadata } from "./lib/seo";
import { homeContent, orderedHomeItems, selectHomeProducts } from "./lib/home-content";
import { site } from "./lib/site";
import { servicePath, services } from "./lib/services";

export const metadata = pageMetadata({
  path: "/",
  title: "CL Isıtma Sistemleri – Samsun Klima, Kombi ve Isı Pompası",
  description: "Samsun Tekkeköy’de klima, kombi ve ısı pompası satışı, yerden ısıtma, tesisat ve petek temizliği. Ücretsiz yerinde keşif için CL Isıtma’ya ulaşın.",
});

const faqs = [
  ["Keşif ücretli mi?", "Yerinde keşif ücretsizdir. İhtiyacınızı değerlendirip uygun seçenekleri ve fiyatı konuşuyoruz."],
  ["Farklı markalar arasından seçim yapabilir miyim?", "Evet. İhtiyacınıza ve bütçenize göre farklı marka ve model seçenekleri sunuyoruz."],
  ["Hangi bakım hizmetlerini veriyorsunuz?", "Bakım hizmetimiz petek temizliğidir."],
  ["Taksit imkânınız var mı?", "Peşin fiyatına taksit imkânı var. Ayrıntıları seçtiğiniz ürüne göre görüşebilirsiniz."],
  ["Hangi bölgede hizmet veriyorsunuz?", "Samsun’un Tekkeköy ilçesindeyiz. Adresiniz için keşif durumunu bize ulaşarak öğrenebilirsiniz."],
];

const cardSizes = "(max-width: 700px) 46vw, (max-width: 1200px) 23vw, 275px";

async function HomeProjects() {
  await connection();
  const catalog = await readCatalog();
  const photos = catalog.available ? galleryPhotos(catalog) : [];
  const { projects } = homeContent(catalog);
  const indexed = photos.map((photo, index) => ({ ...photo, index }));
  const selected = orderedHomeItems(indexed, projects.ids, indexed.filter(({ featured }) => featured));
  return (
    <CardRail id="projelerimiz" title="Projelerimiz" intro={projects.intro}
      action={<Link className="home-text-link" href="/galeri">Tüm proje fotoğraflarını gör <span aria-hidden="true">→</span></Link>}>
      {selected.map((photo) => (
        <li key={photo.id} className="home-card">
          <Link href={galleryPhotoUrl(photo, photo.index)} className="home-project-link">
            <div className="home-card-photo">
              <Image src={photo.src} alt={photo.alt || photo.title} fill sizes={cardSizes} />
            </div>
            <div className="home-card-body">
              <h3>{photo.title}</h3>
              <span className="home-text-link">İncele <span aria-hidden="true">→</span></span>
            </div>
          </Link>
        </li>
      ))}
    </CardRail>
  );
}

async function HomeProducts() {
  await connection();
  const catalog = await publishedCatalog();
  const { products: settings } = homeContent(catalog);
  const products = orderedHomeItems(catalog.products, settings.ids, settings.ids ? [] : selectHomeProducts(catalog));
  return (
    <CardRail id="urunlerimiz" title="Ürünlerimiz" intro={settings.intro}
      action={<Link className="home-text-link" href="/urunler">Ürün kataloğunu aç <span aria-hidden="true">→</span></Link>}>
      {products.map((product) => {
        const [cover] = productImages(product);
        return (
        <li key={product.id} className="home-card home-product">
          {cover && <div className="home-card-photo">
            <Image src={cover.url} alt={cover.alt} fill sizes={cardSizes} unoptimized={cover.placeholder} />
          </div>}
          <div className="home-card-body">
            <p className="home-kicker">{product.brand}</p>
            <h3>{product.name}</h3>
            {product.summary?.trim() && <p className="home-product-summary">{product.summary}</p>}
            <Link className="home-text-link" href={productPath(product)}>Ürünü incele <span aria-hidden="true">→</span></Link>
          </div>
        </li>
        );
      })}
    </CardRail>
  );
}

export default async function Home() {
  await connection();
  const { hero, slides, contact, about } = homeContent(await readCatalog());
  const phone = site.phones[0];
  return (
    <>
      <SiteHeader />
      <main>
        <HomeScrollReveal />
        <HomeHero key={slides.map(({ id }) => id).join(",")} slides={slides} eyebrow={hero.eyebrow} />

        <section className="container home-hero-contact" aria-label="İletişim ve adres bilgileri">
          <div className="home-hero-contact-detail">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 3H4a1 1 0 0 0-1 1 17 17 0 0 0 17 17 1 1 0 0 0 1-1v-3l-5-2-1.5 2.5a14 14 0 0 1-8-8L9 8 7 3Z" />
            </svg>
            <div>
              <h2>{contact.title}</h2>
              <a href={`tel:${contact.phone === site.phones[0].display ? site.phones[0].tel : contact.phone.replace(/[^+0-9]/g, "")}`}>{contact.phone}</a>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </div>
          </div>
          <div className="home-hero-contact-detail">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <div>
              <h2>{contact.addressTitle}</h2>
              <address>{contact.address}</address>
            </div>
          </div>
          <a className="home-hero-contact-card" href="#iletisim">
            <Image src="/assets/cl-logo.png" alt="" width={58} height={58} />
            <span>
              <strong>{contact.cardTitle}</strong>
              {contact.cardText} <span aria-hidden="true">→</span>
            </span>
          </a>
        </section>

        <section className="home-section" id="hakkimizda">
          <div className="container home-about" data-home-reveal="pending">
            <div className="home-about-copy">
              <p className="home-kicker">{about.eyebrow}</p>
              <h2>{about.title}</h2>
              <p><strong>{about.lead}</strong></p>
              <p>{about.body}</p>
              <div className="home-about-actions">
                <a className="button primary" href="#iletisim">Ücretsiz keşif iste <span aria-hidden="true">→</span></a>
                <Link className="home-text-link" href="/kurumsal">Hakkımızda <span aria-hidden="true">→</span></Link>
              </div>
            </div>
            <figure className="home-about-photo">
              <Image src={about.image} alt={about.alt} fill sizes="(max-width: 700px) 94vw, 540px" />
              <figcaption><strong>{about.badgeTitle}</strong><span>{about.badgeText}</span></figcaption>
            </figure>
          </div>
        </section>

        <Suspense fallback={<div className="container"><Link href="/galeri">Tüm proje fotoğraflarını gör</Link></div>}>
          <HomeProjects />
        </Suspense>

        <Suspense fallback={<div className="container"><Link href="/urunler">Ürün kataloğunu aç</Link></div>}>
          <HomeProducts />
        </Suspense>

        <Suspense><BrandMarquee /></Suspense>

        <section id="hizmetler" className="home-section home-solutions">
          <div className="container" data-home-reveal="pending">
            <div className="home-section-head">
              <div>
                <h2>İhtiyaçlarınıza özel çözümler</h2>
                <p>Doğru sistemi seçmek için kullanım alanınızı, mevcut tesisatınızı ve bütçenizi ücretsiz keşifte birlikte değerlendiriyoruz.</p>
              </div>
            </div>
            <div className="home-solutions-grid">
              {services.map(({ slug, title, summary, photo, position }) => (
                <article key={slug}>
                  <Link className="home-solution" href={servicePath(slug)}>
                    <div className="home-solution-photo">
                      <Image src={photo} alt="" fill sizes="(max-width: 480px) 90vw, (max-width: 900px) 46vw, 275px"
                        style={{ objectPosition: position }} />
                    </div>
                    <div className="home-solution-copy">
                      <h3>{title}</h3>
                      <p>{summary}</p>
                      <span className="home-solution-action">İncele <span aria-hidden="true">↗</span></span>
                    </div>
                  </Link>
                </article>
              ))}
              <article className="home-solution-cta">
                <h3>Ücretsiz yerinde keşif</h3>
                <p>Mekânınıza uygun sistemi ve bütçenize göre seçenekleri birlikte belirleyelim.</p>
                <a className="button light" href="#iletisim">Keşif iste <span aria-hidden="true">→</span></a>
              </article>
            </div>
          </div>
        </section>

        <section id="iletisim" className="home-section home-contact" aria-labelledby="home-contact-title">
          <div className="container home-contact-panel" data-home-reveal="pending">
            <header className="home-contact-heading">
              <h2 id="home-contact-title">Size nasıl yardımcı olabiliriz?</h2>
              <p>Ürün bilgisi, fiyat teklifi, montaj veya ücretsiz keşif için formu doldurun. Talebinizi ekibimize e-posta ile iletelim.</p>
            </header>
            <div className="home-contact-form">
              <Suspense fallback={<p>Form yükleniyor…</p>}>
                <ContactForm />
              </Suspense>
            </div>
            <address className="home-contact-info" id="hizmet-bolgelerimiz">
              <div><span>Telefon</span><a href={`tel:${phone.tel}`}>{phone.display}</a></div>
              <div><span>E-posta</span><a href={`mailto:${site.email}`}>{site.email}</a></div>
              <div><span>Adres</span><strong>{site.address.full}</strong></div>
            </address>
          </div>
        </section>

        <section id="surec" className="home-section home-process" aria-labelledby="home-process-title">
          <div className="container" data-home-reveal="pending">
            <div className="home-section-head">
              <h2 id="home-process-title">Keşiften uygulamaya</h2>
              <Link className="button primary" href="/nasil-calisiyoruz">Nasıl çalışıyoruz? <span aria-hidden="true">→</span></Link>
            </div>
            <ol className="home-process-steps" role="list">
              {[
                ["message", "İhtiyacınızı anlatın", "Bizi arayın veya formu doldurun. Ne istediğinizi ve bulunduğunuz ilçeyi söyleyin."],
                ["location", "Gerekirse adresinize gelelim", "Yerinde inceleme gerekiyorsa ücretsiz keşif yapar, size uygun seçenekleri ve fiyatı paylaşırız."],
                ["calendar", "Uygun günü birlikte seçelim", "Teklifi onayladığınızda montaj veya temizlik için randevunuzu planlarız."],
              ].map(([symbol, title, description], index) => (
                <li key={title} className="home-process-step">
                  <div className="home-process-marker" aria-hidden="true">
                    <span className={`home-process-symbol home-process-symbol-${symbol}`} />
                    <span className="home-process-step-number">{index + 1}</span>
                  </div>
                  <div className="home-process-step-copy">
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="sss" className="home-section faq">
          <div className="container faq-grid" data-home-reveal="pending">
            <div>
              <h2>Sık sorulan sorular</h2>
              <a className="home-text-link" href="#iletisim">Başka bir sorunuz mu var? <span aria-hidden="true">→</span></a>
            </div>
            <div className="accordion">
              {faqs.map(([question, answer]) => (
                <details key={question}><summary>{question}</summary><p>{answer}</p></details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
