import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "../components/Breadcrumb";
import ContactForm from "../components/ContactForm";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import WhatsAppButton from "../components/WhatsAppButton";
import { mediaUrl } from "../lib/cloudinary-loader";
import { pageMetadata } from "../lib/seo";
import { site } from "../lib/site";

const path = "/iletisim";
const storefront = "/galeri/firmayeri.jpg";
const storefrontAlt = "CL Isıtma Sistemleri’nin Samsun Tekkeköy’deki mağazasının dış cephesi";

export const metadata = pageMetadata({
  path,
  title: "İletişim – Samsun Tekkeköy",
  description: "Samsun Tekkeköy’de CL Isıtma’nın telefon ve adres bilgilerine ulaşın. Ürün bilgisi, fiyat teklifi, montaj ya da ücretsiz keşif için talebinizi iletin.",
});

export default function ContactPage() {
  const phone = site.phones[0];

  return (
    <>
      <SiteHeader />
      <main className="contact-page">
        <header className="corporate-hero">
          <div className="container">
            <Breadcrumb title="İletişim" path={path} />
            <div className="corporate-hero-grid">
              <div>
                <p className="home-kicker">Samsun / Tekkeköy</p>
                <h1>Bize ulaşın</h1>
                <p>Klima, kombi ve ısı pompası seçeneklerini sorun veya montaj, petek temizliği ve ücretsiz keşif için talebinizi iletin.</p>
                <div className="corporate-actions">
                  <a className="button primary" href="#iletisim-formu">Talebinizi iletin <span aria-hidden="true">→</span></a>
                  <a className="corporate-phone" href={`tel:${phone.tel}`}>{phone.display}</a>
                </div>
              </div>
              {mediaUrl(storefront) !== storefront && (
                <figure className="corporate-storefront">
                  <Image src={storefront} alt={storefrontAlt} width={1376} height={768}
                    sizes="(max-width: 900px) 94vw, (max-width: 1200px) 53vw, 620px"
                    loading="eager" fetchPriority="high" />
                </figure>
              )}
            </div>
          </div>
        </header>

        <div className="container contact-page-grid">
          <section className="home-contact-form contact-page-form" id="iletisim-formu" aria-labelledby="contact-form-title">
            <h2 id="contact-form-title">İletişim formu</h2>
            <p>İlgilendiğiniz hizmeti seçin. Varsa ürün modelini veya ihtiyacınızla ilgili ayrıntıları mesajınıza ekleyin.</p>
            <Suspense fallback={<p>Form yükleniyor…</p>}>
              <ContactForm />
            </Suspense>
          </section>

          <aside className="contact-page-details" aria-labelledby="contact-details-title">
            <h2 id="contact-details-title">İletişim bilgilerimiz</h2>
            <address className="home-contact-info">
              <div><span>Telefon</span><a href={`tel:${phone.tel}`}>{phone.display}</a></div>
              <div><span>E-posta</span><a href={`mailto:${site.email}`}>{site.email}</a></div>
              <div><span>Adres</span><strong>{site.address.full}</strong></div>
            </address>
            <nav className="contact-page-links" aria-label="İlgili sayfalar">
              <Link className="home-text-link" href="/urunler">Ürünleri inceleyin <span aria-hidden="true">→</span></Link>
              <Link className="home-text-link" href="/hizmetler">Hizmetleri inceleyin <span aria-hidden="true">→</span></Link>
            </nav>
          </aside>
        </div>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
