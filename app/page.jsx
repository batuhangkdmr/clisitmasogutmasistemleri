import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import BrandMarquee from "./components/BrandMarquee";
import CardRail from "./components/CardRail";
import ContactForm from "./components/ContactForm";
import HomeHero from "./components/HomeHero";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import WhatsAppButton from "./components/WhatsAppButton";
import { boilers } from "./lib/boilers";
import { featuredProjects, projectImage } from "./lib/home-projects";
import { pageMetadata } from "./lib/seo";
import { site } from "./lib/site";

export const metadata = pageMetadata({
  path: "/",
  title: "CL Isıtma Sistemleri – Samsun Klima, Kombi ve Isı Pompası",
  description: "Samsun Tekkeköy’de klima, kombi ve ısı pompası satışı, yerden ısıtma, tesisat ve petek temizliği. Ücretsiz yerinde keşif için CL Isıtma’ya ulaşın.",
});

const services = [
  ["Klima ve ısı pompası", "Mekânınıza uygun kapasiteyi belirleyip satış ve montaj seçeneklerini değerlendiriyoruz.", "/hizmetler", "/assets/hizmet-klima-isi-pompasi.webp", "center 60%"],
  ["Doğalgaz ve kombi", "Doğalgaz tesisatı, kombi satışı ve montajı için yerinde keşif yapıyoruz.", "/urunler#kombiler", projectImage("WhatsApp Image 2026-11-25 at 19.23.00 (2).jpeg"), "center 48%"],
  ["Yerden ısıtma", "Konut ve iş yerlerinde mekâna uygun yerden ısıtma uygulamaları.", "/hizmetler", "/assets/hero-yerden-isitma.webp"],
  ["Sıhhi tesisat ve yangın tesisatı", "Su ve yangın tesisatı ihtiyaçlarını proje kapsamında değerlendiriyoruz.", "/hizmetler", "/assets/hizmet-yangin-tesisati.webp"],
  ["Katı yakıtlı kazan ve soba", "Farklı ısınma ihtiyaçları ve bütçeler için kazan ve soba seçenekleri.", "/hizmetler", projectImage("WhatsApp Image 2026-11-25 at 19.23.03 (5).jpeg"), "center 70%"],
  ["Güneş enerjisi", "Binanız ve ihtiyaçlarınız için uygun güneş enerjisi sistemi seçenekleri.", "/hizmetler", "/assets/hero-gunes-enerjisi.webp"],
  ["Petek temizliği", "Petekler eşit ısınmıyorsa sistemi yerinde kontrol edip temizliyoruz.", "/bakim-onarim", "/assets/hizmet-petek-temizligi.webp"],
];

const faqs = [
  ["Keşif ücretli mi?", "Yerinde keşif ücretsizdir. İhtiyacınızı değerlendirip uygun seçenekleri ve fiyatı konuşuyoruz."],
  ["Farklı markalar arasından seçim yapabilir miyim?", "Evet. İhtiyacınıza ve bütçenize göre farklı marka ve model seçenekleri sunuyoruz."],
  ["Hangi bakım hizmetlerini veriyorsunuz?", "Bakım hizmetimiz petek temizliğidir."],
  ["Taksit imkânınız var mı?", "Peşin fiyatına taksit imkânı var. Ayrıntıları seçtiğiniz ürüne göre görüşebilirsiniz."],
  ["Hangi bölgede hizmet veriyorsunuz?", "Samsun’un Tekkeköy ilçesindeyiz. Adresiniz için keşif durumunu bize ulaşarak öğrenebilirsiniz."],
];

const cardSizes = "(max-width: 700px) 46vw, (max-width: 1200px) 23vw, 275px";

export default function Home() {
  const phone = site.phones[0];

  return (
    <>
      <SiteHeader />
      <main>
        <HomeHero />

        <section className="container home-hero-contact" aria-label="İletişim ve adres bilgileri">
          <div className="home-hero-contact-detail">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 3H4a1 1 0 0 0-1 1 17 17 0 0 0 17 17 1 1 0 0 0 1-1v-3l-5-2-1.5 2.5a14 14 0 0 1-8-8L9 8 7 3Z" />
            </svg>
            <div>
              <h2>İletişim</h2>
              <a href={`tel:${phone.tel}`}>{phone.display}</a>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </div>
          </div>
          <div className="home-hero-contact-detail">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <div>
              <h2>Adres</h2>
              <address>{site.address.full}</address>
            </div>
          </div>
          <a className="home-hero-contact-card" href="#iletisim">
            <Image src="/assets/cl-logo.png" alt="" width={58} height={58} />
            <span>
              <strong>CL Isıtma ve Soğutma Sistemleri</strong>
              Isıtma, soğutma ve tesisat ihtiyaçlarınız için konuşalım. <span aria-hidden="true">→</span>
            </span>
          </a>
        </section>

        <section className="home-section" id="hakkimizda">
          <div className="container home-about">
            <div className="home-about-copy">
              <p className="home-kicker">Samsun / Tekkeköy</p>
              <h2>CL Isıtma ve Soğutma Sistemleri</h2>
              <p><strong>20 yıllık ustalık tecrübesiyle ev ve iş yerlerine ısıtma, soğutma ve tesisat çözümleri sunuyoruz.</strong></p>
              <p>Klima ve kombiden yerden ısıtmaya kadar önce mekânı ve ihtiyacınızı yerinde değerlendiriyoruz. Ücretsiz keşif sonrası bütçenize uygun marka, montaj ve ödeme seçeneklerini birlikte netleştiriyoruz.</p>
              <div className="home-about-actions">
                <a className="button primary" href="#iletisim">Ücretsiz keşif iste <span aria-hidden="true">→</span></a>
                <Link className="home-text-link" href="/kurumsal">Hakkımızda <span aria-hidden="true">→</span></Link>
              </div>
            </div>
            <figure className="home-about-photo">
              <Image src="/assets/cl-hero.webp" alt="Duvar tipi klima üzerinde çalışan teknisyen" fill sizes="(max-width: 700px) 94vw, 540px" />
              <figcaption><strong>20 yıl</strong><span>Ustalık tecrübesi</span></figcaption>
            </figure>
          </div>
        </section>

        <CardRail id="projelerimiz" title="Projelerimiz" intro="Isıtma, montaj ve tesisat çalışmalarımızdan sahada çekilen kareler."
          action={<Link className="home-text-link" href="/galeri">Tüm proje fotoğraflarını gör <span aria-hidden="true">→</span></Link>}>
          {featuredProjects.map(([file, title], index) => (
            <li key={file} className="home-card">
              <Link href={`/galeri#ornek-${index + 1}`} className="home-project-link">
                <div className="home-card-photo">
                  <Image src={projectImage(file)} alt={title} fill sizes={cardSizes} />
                </div>
                <div className="home-card-body">
                  <h3>{title}</h3>
                  <span className="home-text-link">İncele <span aria-hidden="true">→</span></span>
                </div>
              </Link>
            </li>
          ))}
        </CardRail>

        <CardRail id="urunlerimiz" title="Ürünlerimiz" intro="Farklı markaların kombi modellerini inceleyin. Fiyat ve stok bilgisi için bize ulaşın."
          action={<Link className="home-text-link" href="/urunler#kombiler">Ürün kataloğunu aç <span aria-hidden="true">→</span></Link>}>
          {boilers.map(([brand, model, src]) => (
            <li key={brand} className="home-card home-boiler">
              <div className="home-card-photo">
                <Image src={src} alt={`${brand} ${model} kombi`} fill sizes={cardSizes} />
              </div>
              <div className="home-card-body">
                <p className="home-kicker">{brand}</p>
                <h3>{model}</h3>
                <Link className="home-text-link" href={`/?urun=${encodeURIComponent(`${brand} ${model}`)}#iletisim`} aria-label={`${brand} ${model} için bilgi alın`}>Bilgi al <span aria-hidden="true">→</span></Link>
              </div>
            </li>
          ))}
        </CardRail>

        <BrandMarquee />

        <section id="hizmetler" className="home-section home-solutions">
          <div className="container">
            <div className="home-section-head">
              <div>
                <h2>İhtiyaçlarınıza özel çözümler</h2>
                <p>Doğru sistemi seçmek için kullanım alanınızı, mevcut tesisatınızı ve bütçenizi ücretsiz keşifte birlikte değerlendiriyoruz.</p>
              </div>
            </div>
            <div className="home-solutions-grid">
              {services.map(([title, description, href, photo, objectPosition]) => (
                <article key={title}>
                  <Link className="home-solution" href={href}>
                    <div className="home-solution-photo">
                      <Image src={photo} alt="" fill sizes="(max-width: 480px) 90vw, (max-width: 900px) 46vw, 275px"
                        style={{ objectPosition }} />
                    </div>
                    <div className="home-solution-copy">
                      <h3>{title}</h3>
                      <p>{description}</p>
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
          <div className="container home-contact-panel">
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
          <div className="container">
            <div className="home-section-head">
              <h2 id="home-process-title">Keşiften uygulamaya</h2>
              <a className="button primary" href="#iletisim">Talebinizi iletin <span aria-hidden="true">→</span></a>
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
          <div className="container faq-grid">
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
