import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import Breadcrumb from "../components/Breadcrumb";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { featuredProjects, projectImage } from "../lib/home-projects";
import { mediaUrl } from "../lib/cloudinary-loader";
import { mediaFiles } from "../lib/media-files";
import { pageMetadata } from "../lib/seo";
import { site } from "../lib/site";
import { servicePath, services } from "../lib/services";

const pages = {
  hizmetler: {
    eyebrow: "HİZMETLER",
    title: "Ne işlere bakıyoruz?",
    seoTitle: "Samsun Isıtma, Soğutma ve Tesisat Hizmetleri",
    description: "Samsun ve Tekkeköy’de klima, ısı pompası, doğalgaz, kombi, yerden ısıtma ve tesisat çözümlerini inceleyin.",
    lead: "Tekkeköy ve çevresinde klima, doğalgaz, tesisat ve petek temizliği. Yerinde bakıp net fiyat veriyoruz.",
    cards: services,
  },
  galeri: {
    eyebrow: "UYGULAMALAR",
    title: "Projelerimiz",
    seoTitle: "Samsun Isıtma ve Tesisat Projeleri",
    description: "CL Isıtma’nın Samsun ve çevresindeki ısıtma, montaj ve tesisat uygulamalarından saha fotoğraflarını inceleyin.",
    lead: "Saha uygulamalarımızdan ısıtma, montaj ve tesisat fotoğrafları.",
    gallery: true,
  },
  tesekkurler: {
    eyebrow: "İLETİŞİM",
    title: "Talebiniz için teşekkürler.",
    lead: "Talebiniz e-posta gönderim sistemine iletildi. Gerekirse paylaştığınız iletişim bilgileri üzerinden size ulaşacağız.",
    noindex: true,
    thanks: true,
  },
  "gizlilik-politikasi": {
    eyebrow: "YASAL",
    title: "Gizlilik Politikası",
    lead: "Keşif, ürün ve hizmet taleplerinizde paylaştığınız iletişim bilgilerinin nasıl kullanıldığını öğrenin.",
    description: "CL Isıtma’nın iletişim formu, telefon ve WhatsApp üzerinden aldığı keşif, ürün ve hizmet taleplerinde kişisel bilgileri nasıl kullandığını öğrenin.",
    sections: [
      {
        title: "1. Kim işliyor?",
        body: `${site.name} — ${site.address.full}. Tel: ${site.phones.map((p) => p.display).join(" / ")}.`,
      },
      {
        title: "2. Hangi bilgiler?",
        body: "İletişim formunda ad soyad, telefon ve hizmet seçimi alınır. Paylaşmanız hâlinde e-posta adresiniz, mesajınız ve ilgilendiğiniz ürün de talebinize eklenir. Telefonla veya WhatsApp’tan ulaştığınızda talebiniz için paylaştığınız bilgileri kullanırız.",
      },
      {
        title: "3. Ne için?",
        body: "Teklif vermek, keşif ayarlamak ve sizinle iletişime geçmek için.",
      },
      {
        title: "4. Kimlere gider?",
        body: "Form bilgileri Resend altyapısı üzerinden iletişim adresimize iletilir. WhatsApp’ı seçtiğinizde görüşme WhatsApp üzerinden yürür. Site görselleri Cloudinary üzerinden sunulur. Ayrıntılar için KVKK Aydınlatma Metni’ne bakabilirsiniz.",
      },
      {
        title: "5. Çerezler",
        body: "Sitenin çalışması için gerekli teknik kayıtlar tutulabilir. Pazarlama çerezi kullanmıyoruz.",
      },
      {
        title: "6. Saklama",
        body: "Talep sonuçlanana ve yasal süreler dolana kadar tutulur; sonra silinir veya anonimleştirilir.",
      },
      {
        title: "7. Haklarınız",
        body: "KVKK kapsamındaki haklarınızı ve yazılı başvuru yöntemini KVKK Aydınlatma Metni’nde bulabilirsiniz.",
      },
    ],
  },
  "kvkk-aydinlatma-metni": {
    eyebrow: "YASAL",
    title: "KVKK Aydınlatma Metni",
    lead: "Fiyat, ürün, ücretsiz keşif ve hizmet taleplerinizde kişisel verilerinizi nasıl kullandığımızı ve KVKK kapsamındaki haklarınızı öğrenin.",
    description: "Samsun Tekkeköy’de CL Isıtma’ya ilettiğiniz teklif, keşif ve hizmet taleplerinde işlenen kişisel veriler, işleme nedenleri ve KVKK başvuru yolu.",
    sections: [
      {
        title: "1. Veri sorumlusu",
        body: `Veri sorumlusu ${site.name}’dır. Adresimiz ${site.address.full}. İşletmeyle iletişim için ${site.email} adresine yazabilir veya ${site.phones[0].display} numarasını arayabilirsiniz.`,
      },
      {
        title: "2. Hangi verileri nasıl topluyoruz?",
        items: [
          "İletişim formundan adınızı, soyadınızı, telefon numaranızı ve seçtiğiniz hizmeti alırız. Paylaştığınız takdirde e-posta adresinizi, mesajınızı ve ilgilendiğiniz ürünü de alırız.",
          "Telefon, e-posta veya WhatsApp üzerinden bize ulaştığınızda iletişim bilgilerinizi ve talebiniz için paylaştığınız bilgileri alırız. Yerinde keşif isterseniz planlama için keşif adresinizi isteyebiliriz.",
          "Site ve görseller yüklenirken IP adresi ve istek bilgileri, sunucular ve görsel dağıtım altyapısı tarafından elektronik ortamda işlenebilir.",
        ],
      },
      {
        title: "3. İşleme amaçları ve hukuki sebepler",
        items: [
          "Kombi ve klima gibi ürünler için fiyat ve stok taleplerini yanıtlamak, teklif hazırlamak, yerinde keşif, montaj veya petek temizliği planlamak için talebinizle doğrudan ilgili verileri işleriz. Dayanak, sözleşmenin kurulması veya ifasıyla doğrudan ilgili ve gerekli olmasıdır (KVKK m. 5/2-c).",
          "Genel soruları yanıtlamak ve sitenin güvenli çalışmasını sağlamak için gerekli verileri, temel hak ve özgürlüklerinize zarar vermemek kaydıyla meşru menfaatimiz kapsamında işleriz (KVKK m. 5/2-f).",
          "Yetkili makamların mevzuata dayanan taleplerini karşılamak için gerekli verileri hukuki yükümlülüğümüz kapsamında işleriz (KVKK m. 5/2-ç).",
        ],
      },
      {
        title: "4. Veriler kimlere ve hangi amaçla aktarılır?",
        items: [
          "Formda paylaştığınız bilgiler, talebinizi işletme posta kutusuna iletmek için Resend e-posta altyapısından geçer. E-posta adresi girerseniz size yanıt verebilmemiz için bu adres iletide yanıt adresi olarak kullanılır.",
          "Barındırma sağlayıcısı siteyi sunmak, Cloudinary ise görselleri iletmek için bağlantı ve istek bilgilerini işleyebilir. WhatsApp üzerinden yazmayı seçerseniz mesajınız ve iletişim bilgileriniz WhatsApp altyapısı üzerinden iletilir.",
          "Kanuni yükümlülüğümüz doğduğunda ilgili bilgiler yetkili kamu kurumları ve adli makamlarla talep kapsamıyla sınırlı olarak paylaşılabilir.",
          "Bu sağlayıcıların altyapısına bağlı olarak veriler yurt dışında işlenebilir. Yurt dışına aktarımlarda KVKK’nın 9. maddesindeki aktarım şartları uygulanır.",
        ],
      },
      {
        title: "5. KVKK kapsamındaki haklarınız",
        body: "Kanun’un 11. maddesi uyarınca aşağıdaki haklarınızı kullanabilirsiniz.",
        items: [
          "Kişisel verilerinizin işlenip işlenmediğini öğrenmek ve işlenmişse bilgi istemek.",
          "İşleme amacını ve verilerin bu amaca uygun kullanılıp kullanılmadığını öğrenmek.",
          "Verilerin aktarıldığı yurt içindeki veya yurt dışındaki üçüncü kişileri bilmek.",
          "Eksik veya yanlış verilerin düzeltilmesini, Kanun’un 7. maddesindeki şartlar oluştuğunda verilerin silinmesini veya yok edilmesini istemek.",
          "Düzeltme, silme veya yok etme işlemlerinin verilerin aktarıldığı üçüncü kişilere bildirilmesini istemek.",
          "Verilerin yalnızca otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonuç çıkmasına itiraz etmek.",
          "Kanuna aykırı işleme nedeniyle zarara uğrarsanız zararın giderilmesini talep etmek.",
        ],
      },
      {
        title: "6. KVKK başvurusu nasıl yapılır?",
        body: `İmzalı yazılı başvurunuzu ${site.address.full} adresine iletebilirsiniz. Başvurunuzu niteliğine göre en kısa sürede ve en geç 30 gün içinde sonuçlandırırız.`,
        items: [
          "Adınızı, soyadınızı, imzanızı, T.C. kimlik numaranızı ve tebligata esas ikametgâh veya iş yeri adresinizi belirtin. Yabancı uyrukluysanız uyruğunuzu ve pasaport numaranızı ya da varsa kimlik numaranızı belirtin.",
          "Talebinizin konusunu ve varsa bildirime esas e-posta adresinizi, telefon ve faks numaranızı yazın. Talebinizle ilgili bilgi ve belgeleri varsa ekleyin.",
        ],
      },
    ],
  },
  "cerez-politikasi": {
    eyebrow: "YASAL",
    title: "Çerez Politikası",
    lead: "Bu sitede kullanılan çerezler ve benzeri teknolojiler hakkında kısa bilgilendirme.",
    sections: [
      {
        title: "1. Çerez nedir?",
        body: "Çerezler, siteyi ziyaret ettiğinizde tarayıcınızda tutulan küçük metin dosyalarıdır. Oturumun düzgün çalışmasına yardımcı olur.",
      },
      {
        title: "2. Ne kullanıyoruz?",
        body: "Yönetim panelinde giriş yapan yetkili kullanıcının oturumunu sürdürmek için sekiz saat geçerli bir oturum çerezi kullanırız. Reklam veya yeniden pazarlama çerezi kullanmıyoruz.",
      },
      {
        title: "3. Üçüncü taraflar",
        body: "İletişim formu talepleri Resend üzerinden e-posta olarak iletilir.",
      },
      {
        title: "4. Yönetim",
        body: "Çerezleri tarayıcı ayarlarından silebilir veya engelleyebilirsiniz. Engellemek bazı sayfa işlevlerini etkileyebilir.",
      },
      {
        title: "5. İletişim",
        body: `${site.name} — ${site.address.full}. Tel: ${site.phones.map((p) => p.display).join(" / ")}.`,
      },
    ],
  },
};

export function generateStaticParams() {
  return [...Object.keys(pages), "bakim-onarim"].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (!Object.hasOwn(pages, slug)) return {};
  const page = pages[slug];
  return pageMetadata({
    path: `/${slug}`,
    title: page.seoTitle ?? page.title,
    description: page.description ?? page.lead,
    noindex: page.noindex,
  });
}

export default async function Page({ params }) {
  const { slug } = await params;
  if (slug === "bakim-onarim") permanentRedirect(servicePath("petek-temizligi"));
  if (!Object.hasOwn(pages, slug)) notFound();
  const page = pages[slug];

  const galleryFiles = page.gallery
    ? (await mediaFiles("galeri")).filter((file) => file !== "firmayeri.jpg" && /\.(jpe?g|png|webp)$/i.test(file))
    : [];
  const featuredFiles = new Set(featuredProjects.map(([file]) => file));
  const galleryPhotos = page.gallery
    ? [...featuredProjects, ...galleryFiles.filter((file) => !featuredFiles.has(file)).map((file) => [file, "Saha uygulaması"])]
    : [];

  return (
    <>
      <SiteHeader />
      <main className={`page-main${page.sections ? " legal-page" : ""}`}>
        <div className="container">
          <Breadcrumb title={page.title} path={`/${slug}`} indexable={!page.noindex} />
          <p className="eyebrow blue">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p className="lead">{page.lead}</p>

          {page.cards ? (
            <div className="detail-grid">
              {page.cards.map(({ slug, title, summary }) => (
                <article key={slug} id={slug === "sihhi-tesisat-yangin-tesisati" ? "sihhi-tesisat" : slug}>
                  <h2><Link href={servicePath(slug)}>{title}</Link></h2>
                  <p>{summary}</p>
                </article>
              ))}
            </div>
          ) : null}

          {page.gallery ? (
            <>
              <div className="project-gallery">
                {galleryPhotos.map(([file, title], index) => (
                  <figure key={file} id={`ornek-${index + 1}`}>
                    <a href={mediaUrl(projectImage(file), { width: 1800 })} aria-label={`${title} fotoğrafını aç (${index + 1})`}>
                      <Image src={projectImage(file)} alt={title} fill sizes="(max-width: 700px) 46vw, (max-width: 1200px) 23vw, 275px" />
                    </a>
                    <figcaption>{title}</figcaption>
                  </figure>
                ))}
              </div>
              <p className="gallery-note">
                Daha fazla fotoğraf için{" "}
                <a href={site.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
                ’a bakabilirsiniz.
              </p>
            </>
          ) : null}

          {page.sections
            ? page.sections.map((section) => (
                <section className="legal-block" key={section.title}>
                  <h2>{section.title}</h2>
                    {section.body && <p>{section.body}</p>}
                    {section.items && (
                      <ul>
                        {section.items.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    )}
                </section>
              ))
            : null}

          {page.thanks ? (
            <div className="utility-actions page-thanks-actions">
              <Link className="button primary" href="/">
                Ana sayfaya dön <span>→</span>
              </Link>
              <a className="phone-link" href={`tel:${site.phones[0].tel}`}>
                {site.phones[0].display}
              </a>
            </div>
          ) : null}

          {!page.sections && !page.thanks ? (
            <div className="page-cta">
              <div>
                <p className="eyebrow">KEŞİF</p>
                <h2>Yerinize gelip bakalım, fiyatı net söyleyelim.</h2>
              </div>
              <a className="button light" href="/#iletisim">
                Teklif iste <span>→</span>
              </a>
            </div>
          ) : null}

          {page.sections ? (
            <p className="legal-related">
              Ayrıca{" "}
              <Link href="/kvkk-aydinlatma-metni">KVKK</Link>,{" "}
              <Link href="/gizlilik-politikasi">Gizlilik</Link> ve{" "}
              <Link href="/cerez-politikasi">Çerez Politikası</Link> sayfalarına da bakabilirsiniz.
            </p>
          ) : null}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
