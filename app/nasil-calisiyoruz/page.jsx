import Link from "next/link";
import Breadcrumb from "../components/Breadcrumb";
import ProcessPhotoCarousel from "../components/ProcessPhotoCarousel";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import WhatsAppButton from "../components/WhatsAppButton";
import { cloudinaryAssetUrl, mediaUrl } from "../lib/cloudinary-loader";
import { featuredProjects, projectImage } from "../lib/home-projects";
import { pageMetadata } from "../lib/seo";
import { servicePath, services } from "../lib/services";
import { site } from "../lib/site";

const path = "/nasil-calisiyoruz";
const formHref = "/iletisim#iletisim-formu";
const photos = [2, 1, 4, 0, 3].map((index) => {
  const [file, alt] = featuredProjects[index];
  return { src: projectImage(file), alt };
}).filter(({ src }) => cloudinaryAssetUrl(src));
const cover = photos[0];

export const metadata = pageMetadata({
  path,
  title: "Nasıl Çalışıyoruz? | Samsun Isıtma ve Tesisat Süreci",
  description: "CL Isıtma’nın Samsun Tekkeköy’de klima, kombi ve tesisat işlerinde ücretsiz keşif, teklif, uygulama ve teslim sürecini öğrenin.",
  ...(cover && { image: { url: mediaUrl(cover.src, { width: 1200, format: "jpg" }), alt: cover.alt } }),
});

const steps = [
  ["İhtiyacınızı dinliyoruz", "Telefon, WhatsApp veya form üzerinden bize ulaşın. İlçenizi, neye ihtiyaç duyduğunuzu ve varsa kullandığınız cihazı paylaşın."],
  ["Gerekirse yerinde keşif yapıyoruz", "Alanı, mevcut tesisatı ve ekipmanın kurulacağı yeri inceliyoruz. Örneğin klima için iç ve dış ünite konumuna, yerden ısıtma için zemin ve ısı kaynağına bakıyoruz."],
  ["Seçenekleri ve teklifi netleştiriyoruz", "Uygun marka ve modelleri değerlendiriyoruz. Ürün, malzeme ve işçilik kapsamını görüşüp montaj veya temizlik için teklif ve randevu seçeneklerini paylaşıyoruz."],
  ["Onayınızla uygulamayı planlıyoruz", "İş kapsamı netleşince malzeme ve randevuyu planlıyoruz. Proje, yetkili servis ya da dağıtım şirketi onayı gereken işleri teklif aşamasında ayrı ayrı konuşuyoruz."],
  ["Kontrol edip teslim ediyoruz", "Uygulamanın gerektirdiği bağlantı ve çalışma kontrolleri yapılır. Teslimde temel kullanım bilgilerini ve varsa devreye alma veya garanti için ilgili servis adımını paylaşırız."],
];

const serviceChecks = {
  "klima-isi-pompasi": "Klima için oda yükü ve ünite konumları, ısı pompası için binanın ısı ihtiyacı, mevcut tesisat ve dış ünite alanı değerlendirilir.",
  "dogalgaz-kombi": "Yeni hat veya kombi değişimi kapsamı belirlenir. Doğalgaz iç tesisatında sertifikalı firma ve dağıtım şirketinin proje, kontrol ve gaz açma adımları dikkate alınır.",
  "yerden-isitma": "Zemin katmanları, oda devreleri ve ısı kaynağı birlikte planlanır. Uygulama kapsamına göre, zemin kapatılmadan önce tesisatın kontrolü planlanır.",
  "sihhi-tesisat-yangin-tesisati": "Temiz su ve atık su hatları kullanım noktalarına göre incelenir. Yangın tesisatında bina kullanımı, mevcut altyapı ve proje gereklilikleri değerlendirilir.",
  "kati-yakitli-kazan-soba": "Kazan ve soba seçenekleri ısıtılacak alan, üreticinin belirttiği yakıt ve mevcut baca koşullarına göre değerlendirilir.",
  "gunes-enerjisi": "Kolektör konumu, gölgelenme, günlük sıcak su ihtiyacı ve depolama kapasitesi birlikte değerlendirilir.",
  "petek-temizligi": "Az ısınan petekler ve erişilebilir bağlantılar incelenir. Temizlik gerekip gerekmediği ve işlem kapsamı yerinde netleşir.",
};

const faqs = [
  ["Keşif ücretli mi?", "Yerinde keşif ücretsizdir. Randevu planlamak için adresinizi ve ihtiyacınızı paylaşabilirsiniz."],
  ["İlk görüşmede hangi bilgileri paylaşmalıyım?", "İlçe ve mahalle, ev veya iş yeri bilgisi ve ihtiyacınız yeterli. Varsa mevcut cihazın modelini veya fotoğrafını da paylaşabilirsiniz."],
  ["Teklif neleri kapsar?", "İşin türüne göre ürün, malzeme ve işçiliğin hangilerinin dahil olduğunu teklif aşamasında konuşuruz. Gerekli servis ve onay adımlarını ayrıca belirtiriz."],
  ["Montaj veya temizlik ne zaman yapılır?", "Süre ve randevu, teklif onaylandıktan sonra iş kapsamına ve varsa ürün tedariki ya da onay işlemlerine göre belirlenir."],
  ["Kombi veya klima bakımı yapıyor musunuz?", "Bakım hizmetimiz petek temizliğidir. Klima ve kombi için ürün ve montaj seçeneklerini görüşebilirsiniz."],
];

export default function ProcessPage() {
  const phone = site.phones[0];

  return (
    <>
      <SiteHeader />
      <main className="service-page process-page">
        <div className="container">
          <Breadcrumb title="Nasıl çalışıyoruz?" path={path} />
          <section className="service-hero process-hero">
            <div className="service-hero-copy">
              <p className="home-kicker">{site.address.city} / {site.address.district}</p>
              <h1>Keşiften teslime nasıl çalışıyoruz?</h1>
              <p>Isıtma, soğutma veya tesisat ihtiyacınızı dinliyoruz. Uygun sistemi, teklifin kapsamını ve uygulama gününü birlikte netleştiriyoruz.</p>
              <div className="service-actions">
                <Link href={formHref} className="button light">Ücretsiz keşif iste <span aria-hidden="true">→</span></Link>
                <a href={`tel:${phone.tel}`} className="home-text-link">{phone.display}</a>
              </div>
            </div>
            {photos.length > 0 && <ProcessPhotoCarousel photos={photos} />}
          </section>

          <section className="process-section process-overview" aria-labelledby="process-steps-heading">
            <div>
              <h2 id="process-steps-heading">Süreç nasıl ilerliyor?</h2>
              <p>İlk görüşmeden sonra ne olacağını ve hangi aşamada karar vereceğinizi adım adım görün.</p>
              <Link className="home-text-link" href="/galeri">Saha uygulamalarını incele <span aria-hidden="true">→</span></Link>
            </div>
            <ol className="process-timeline" role="list">
              {steps.map(([title, description], index) => (
                <li key={title}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <div><h3>{title}</h3><p>{description}</p></div>
                </li>
              ))}
            </ol>
          </section>

          <section className="process-section process-services" aria-labelledby="process-services-heading">
            <div className="service-more-heading">
              <h2 id="process-services-heading">Hizmete göre neleri değerlendiriyoruz?</h2>
              <Link className="home-text-link" href="/hizmetler">Tüm hizmetler <span aria-hidden="true">↗</span></Link>
            </div>
            <ul className="process-services-list">
              {services.map(({ slug, title }) => (
                <li key={slug}>
                  <h3><Link href={servicePath(slug)}>{title} <span aria-hidden="true">↗</span></Link></h3>
                  <p>{serviceChecks[slug]}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="service-faq" aria-labelledby="process-faq-heading">
            <h2 id="process-faq-heading">Sık sorulan sorular</h2>
            <div>{faqs.map(([question, answer]) => (
              <details key={question}><summary>{question}</summary><p>{answer}</p></details>
            ))}</div>
          </section>
        </div>
      </main>
      <SiteFooter />
      <WhatsAppButton showPhone />
    </>
  );
}
