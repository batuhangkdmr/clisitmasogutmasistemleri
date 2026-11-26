import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "../components/Breadcrumb";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import WhatsAppButton from "../components/WhatsAppButton";
import { mediaUrl } from "../lib/cloudinary-loader";
import { pageMetadata } from "../lib/seo";
import { site } from "../lib/site";

const storefront = "/galeri/firmayeri.jpg";
const storefrontAlt = "CL Isıtma Sistemleri’nin Samsun Tekkeköy’deki mağazasının dış cephesi";
const path = "/kurumsal";

export const metadata = pageMetadata({
  path,
  title: "Hakkımızda – Samsun Tekkeköy",
  description: "CL Isıtma’nın Tekkeköy’deki mağazasını, 20 yıllık ustalık tecrübesini, klima ve kombi satışını ve ücretsiz keşif sürecini keşfedin.",
  image: { url: mediaUrl(storefront, { width: 1200, format: "jpg" }), alt: storefrontAlt },
});

const services = [
  ["Klima, kombi ve ısı pompası", "Mekânınıza ve bütçenize göre farklı marka ve kapasite seçeneklerini birlikte değerlendirelim.", "/urunler", "Ürünleri inceleyin"],
  ["Isıtma ve tesisat", "Doğalgaz, yerden ısıtma, güneş enerjisi, sıhhi tesisat ve yangın tesisatı ihtiyaçlarınızı konuşalım.", "/hizmetler", "Hizmetleri inceleyin"],
  ["Petek temizliği", "Petekleriniz eşit ısınmıyorsa yerinde kontrol edip temizlik gerekip gerekmediğini değerlendirelim.", "/bakim-onarim", "Petek temizliğini inceleyin"],
];

const processSteps = [
  ["İhtiyacınızı anlatın", "Mekânınızı, bulunduğunuz ilçeyi ve neye ihtiyacınız olduğunu bize söyleyin."],
  ["Yerinde değerlendirelim", "Gerekirse ücretsiz keşfe gelip uygun ürün ve uygulama seçeneklerini fiyatlarıyla paylaşalım."],
  ["Uygulama gününü belirleyelim", "Teklifi onayladığınızda montaj veya temizlik için size uygun bir gün planlayalım."],
];

const questions = [
  ["Mağazanız nerede?", `Mağazamız ${site.address.full} adresinde.`],
  ["Keşif ücretli mi?", "Yerinde keşif ücretsiz. Adresinize keşif yapılıp yapılamayacağını telefonla veya formdan sorabilirsiniz."],
  ["Bütçeme göre model seçebilir miyim?", "Evet. Kullanım alanınıza ve bütçenize uygun marka ve kapasite seçeneklerini birlikte değerlendiriyoruz."],
  ["Satış ve montajı birlikte yapıyor musunuz?", "Klima, kombi ve ısı pompası için satış ve montaj seçeneklerini ihtiyacınıza göre görüşebilirsiniz."],
  ["Hangi bakım hizmetini veriyorsunuz?", "Bakım hizmetimiz petek temizliğidir. Önce yerinde kontrol edip temizliğin gerekip gerekmediğini değerlendiriyoruz."],
];

export default function CorporatePage() {
  const phone = site.phones[0];

  return (
    <>
      <SiteHeader />
      <main className="corporate-page">
        <section className="corporate-hero">
          <div className="container">
            <Breadcrumb title="Hakkımızda" path={path} />
            <div className="corporate-hero-grid">
              <div>
                <p className="home-kicker">Samsun / Tekkeköy</p>
                <h1>CL Isıtma Sistemleri ve Tesisat</h1>
                <p className="corporate-hero-lead">20 yıllık ustalık tecrübemizle ev ve iş yerleri için ısıtma, soğutma ve tesisat çözümleri sunuyoruz.</p>
                <p>Klima, kombi ve ısı pompası seçeneklerini bütçenize ve kullanım alanınıza göre değerlendirmek için bize ulaşabilirsiniz.</p>
                <div className="corporate-actions">
                  <Link className="button primary" href="/#iletisim">Ücretsiz keşif iste <span aria-hidden="true">→</span></Link>
                  <a className="corporate-phone" href={`tel:${phone.tel}`}>{phone.display}</a>
                </div>
              </div>
              <figure className="corporate-storefront">
                <Image src={storefront} alt={storefrontAlt} width={1376} height={768}
                  sizes="(max-width: 900px) 94vw, (max-width: 1200px) 53vw, 620px"
                  loading="eager" fetchPriority="high" />
                <figcaption>
                  <div><strong>Tekkeköy mağazamız</strong><span>{site.address.full}</span></div>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="container corporate-section" aria-labelledby="corporate-services">
          <h2 id="corporate-services">Nasıl yardımcı oluyoruz?</h2>
          <div className="corporate-services">
            {services.map(([title, copy, href, label]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{copy}</p>
                <Link className="home-text-link" href={href}>{label} <span aria-hidden="true">→</span></Link>
              </article>
            ))}
          </div>
        </section>

        <section className="corporate-process corporate-section" aria-labelledby="corporate-process-title">
          <div className="container corporate-split">
            <div>
              <h2 id="corporate-process-title">İlk görüşmeden uygulamaya</h2>
              <Link className="home-text-link" href="/galeri">Saha projelerimizi görün <span aria-hidden="true">→</span></Link>
            </div>
            <ol className="corporate-steps">
              {processSteps.map(([title, copy]) => <li key={title}><div><h3>{title}</h3><p>{copy}</p></div></li>)}
            </ol>
          </div>
        </section>

        <section className="container corporate-section corporate-split" aria-labelledby="corporate-faq">
          <h2 id="corporate-faq">Sık sorulan sorular</h2>
          <div className="accordion">
            {questions.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
          </div>
        </section>

        <section className="container corporate-visit" aria-labelledby="corporate-visit-title">
          <div>
            <h2 id="corporate-visit-title">Bize ulaşın</h2>
            <address>{site.address.full}</address>
          </div>
          <div className="corporate-actions">
            <a className="button light" href={`tel:${phone.tel}`}>Bizi arayın</a>
            <Link className="corporate-visit-link" href="/#iletisim">Talebinizi iletin <span aria-hidden="true">→</span></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
