import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { cwd } from "node:process";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "../components/Breadcrumb";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { featuredProjects, projectImage } from "../lib/home-projects";
import { pageMetadata } from "../lib/seo";
import { site } from "../lib/site";

const pages = {
  hizmetler: {
    eyebrow: "HİZMETLER",
    title: "Ne işlere bakıyoruz?",
    seoTitle: "Samsun Isıtma, Soğutma ve Tesisat Hizmetleri",
    description: "Samsun ve Tekkeköy’de klima, ısı pompası, doğalgaz, kombi, yerden ısıtma ve tesisat çözümlerini inceleyin.",
    lead: "Tekkeköy ve çevresinde klima, doğalgaz, tesisat ve petek temizliği. Yerinde bakıp net fiyat veriyoruz.",
    cards: [
      ["01", "Klima & Isı Pompası", "Satış, montaj ve kapasite seçimi. Markayı bütçenize göre konuşuyoruz.", "klima-isi-pompasi"],
      ["02", "Doğalgaz & Kombi", "Kombi, doğalgaz hattı, kazan ve soba işleri.", "dogalgaz-kombi"],
      ["03", "Sıhhi Tesisat", "Yerden ısıtma, güneş enerjisi ve yangın tesisatı.", "sihhi-tesisat"],
      ["04", "Petek Temizliği", "Bakım tarafında sadece petek temizliği yapıyoruz.", "petek-temizligi"],
    ],
  },
  "bakim-onarim": {
    eyebrow: "PETEK TEMİZLİĞİ",
    title: "Petekler eşit ısınmıyor mu?",
    seoTitle: "Samsun ve Tekkeköy Petek Temizliği",
    description: "Samsun Tekkeköy’de petek temizliği. Tıkanıklık, vana, basınç ve sızıntı kontrolleriyle ilgili süreç ve keşif bilgisi.",
    lead: "Bakım hizmetimiz petek temizliği. Önce yerinde bakıyoruz; gerekirse temizlik yapıyoruz.",
    image: true,
    checklist: {
      title: "Temizlikte ne yapıyoruz?",
      items: [
        "Vana ve tıkanıklık kontrolü",
        "Petek içi temizlik",
        "Isının oda oda dengelenmesi",
        "Basınç ve sızıntı kontrolü",
        "İş bitince kısa kullanım notları",
      ],
    },
  },
  kurumsal: {
    eyebrow: "HAKKIMIZDA",
    title: "CL Isıtma Sistemleri & Tesisat",
    seoTitle: "Hakkımızda – Samsun Tekkeköy",
    lead: "Tekkeköy / Samsun’da klima, doğalgaz ve tesisat işleri. Sahada büyümüş bir ekibiz; adresimiz 19 Mayıs Mahallesi, 667. Sokak 5/2 B.",
    story: {
      title: "İşin başında biz varız",
      paragraphs: [
        "Keşiften montaja kadar aynı ekiple ilerliyoruz. Ne yapılacağını ve tutarını baştan konuşuyoruz.",
        "Ev ve iş yerleri için marka alternatifleri çıkarıyoruz. Peşin fiyatına taksit imkânı da var.",
      ],
      stats: [
        ["20+", "Yıl tecrübe"],
        [String(site.phones.length), "Telefon hattı"],
        ["Tekkeköy", "İşletme adresi"],
      ],
    },
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
    lead: "Site üzerinden bıraktığınız bilgilerin nasıl kullanıldığını aşağıda özetledik.",
    sections: [
      {
        title: "1. Kim işliyor?",
        body: `${site.name} — ${site.address.full}. Tel: ${site.phones.map((p) => p.display).join(" / ")}.`,
      },
      {
        title: "2. Hangi bilgiler?",
        body: "Ad soyad, telefon, hizmet seçimi ve varsa seçilen ürün, e-posta ve mesaj. Bu bilgiler form talebine eklenir.",
      },
      {
        title: "3. Ne için?",
        body: "Teklif vermek, keşif ayarlamak ve sizinle iletişime geçmek için.",
      },
      {
        title: "4. Kimlere gider?",
        body: "Form bilgileri e-posta iletimi için Resend altyapısı üzerinden iletişim adresimize gönderilir.",
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
        body: "KVKK haklarınız için aydınlatma metnine bakın. Başvuru için telefon hatlarımızı kullanın.",
      },
    ],
  },
  "kvkk-aydinlatma-metni": {
    eyebrow: "YASAL",
    title: "KVKK Aydınlatma Metni",
    lead: "6698 sayılı Kanun kapsamında kişisel verileriniz hakkında bilgilendirme.",
    sections: [
      {
        title: "1. Veri sorumlusu",
        body: `${site.name}, ${site.address.full}. İletişim: ${site.phones.map((p) => p.display).join(" / ")}.`,
      },
      {
        title: "2. İşlenen veriler",
        body: "Ad soyad, telefon, hizmet seçimi ve varsa seçilen ürün, e-posta ve mesaj.",
      },
      {
        title: "3. Amaç",
        body: "Teklif, keşif, müşteri iletişimi ve yasal yükümlülükler.",
      },
      {
        title: "4. Hukuki sebep",
        body: "Sözleşmenin kurulması/ifası, meşru menfaat ve formdaki açık onayınız.",
      },
      {
        title: "5. Aktarım",
        body: "Form bilgileriniz talebinizi e-posta ile iletmek için Resend altyapısı üzerinden işlenir. WhatsApp üzerinden doğrudan yazarsanız ilgili mesaj o hizmet üzerinden iletilir.",
      },
      {
        title: "6. Toplama",
        body: "Web formu, telefon ve WhatsApp üzerinden elektronik ortamda.",
      },
      {
        title: "7. Haklarınız (KVKK m.11)",
        body: "İşlenip işlenmediğini öğrenme, bilgi isteme, düzeltme, silme, aktarılan üçüncü kişileri bilme, otomatik analiz sonucuna itiraz ve zararın giderilmesini talep etme haklarınız vardır.",
      },
      {
        title: "8. Başvuru",
        body: `Başvurularınızı ${site.phones.map((p) => p.display).join(" veya ")} numaralarından iletebilirsiniz.`,
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
        body: "Sitenin açılması ve temel işlevler için gerekli teknik çerezler tutulabilir. Reklam veya yeniden pazarlama çerezi kullanmıyoruz.",
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
  blog: {
    eyebrow: "BLOG",
    title: "Saha notları ve kullanım ipuçları",
    lead: "Klima, kombi ve petek temizliği hakkında kısa yazılar. Satış vaadi değil; pratik bilgi.",
    blogPosts: [
      {
        date: "Mart 2026",
        title: "Petekler eşit ısınmıyorsa ne bakılır?",
        summary: "Alt kat soğuk, üst kat fazla sıcaksa önce denge ve tıkanıklığa bakıyoruz. Temizlik gerekip gerekmediğini yerinde anlıyoruz.",
      },
      {
        date: "Şubat 2026",
        title: "Klima kapasitesi nasıl seçilir?",
        summary: "Sadece metrekare yetmez. Oda yönü, yalıtım ve kullanım şekli kapasiteyi değiştirir. Keşifte bunları ölçüyoruz.",
      },
      {
        date: "Ocak 2026",
        title: "Kombi değişiminde nelere dikkat edilir?",
        summary: "Yoğuşmalı geçiş, baca ve petek uyumu önemli. Eski tesisata göre modeli netleştiriyoruz.",
      },
      {
        date: "Aralık 2025",
        title: "Kış öncesi kısa kontrol listesi",
        summary: "Basınç, filtre ve petek ısısı. Küçük kontroller büyük arızaları azaltır.",
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
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
  if (!Object.hasOwn(pages, slug)) notFound();
  const page = pages[slug];

  const galleryFiles = page.gallery
    ? (await readdir(join(cwd(), "public", "galeri"))).filter((file) => /\.(jpe?g|png|webp)$/i.test(file)).sort()
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
              {page.cards.map(([no, title, text, anchor]) => (
                <article key={title} id={anchor}>
                  <span>{no}</span>
                  <h2>{title}</h2>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          ) : null}

          {page.gallery ? (
            <>
              <div className="project-gallery">
                {galleryPhotos.map(([file, title], index) => (
                  <figure key={file} id={`ornek-${index + 1}`}>
                    <a href={projectImage(file)} aria-label={`${title} fotoğrafını aç (${index + 1})`}>
                      <Image src={projectImage(file)} alt={title} fill sizes="(max-width: 700px) 46vw, 275px" />
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

          {page.story ? (
            <div className="company-story">
              <div>
                <h2>{page.story.title}</h2>
                {page.story.paragraphs.map((text) => (
                  <p key={text}>{text}</p>
                ))}
                <p className="story-address">{site.address.full}</p>
              </div>
              <div className="numbers">
                {page.story.stats.map(([value, label]) => (
                  <div key={label}>
                    <b>{value}</b>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {page.checklist ? (
            <div className="check-panel">
              <h2>{page.checklist.title}</h2>
              <ul>
                {page.checklist.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {page.sections
            ? page.sections.map((section) => (
                <section className="legal-block" key={section.title}>
                  <h2>{section.title}</h2>
                  <p>{section.body}</p>
                </section>
              ))
            : null}

          {page.blogPosts ? (
            <div className="blog-grid">
              {page.blogPosts.map((post) => (
                <article className="blog-card" key={post.title}>
                  <span>{post.date}</span>
                  <strong>{post.title}</strong>
                  <p>{post.summary}</p>
                </article>
              ))}
            </div>
          ) : null}

          {page.image ? (
            <Image className="page-image" src="/assets/teknik-servis.webp"
              alt="Dış ünitede ölçüm yapan teknik servis çalışanı" width={1086} height={1448}
              sizes="(max-width: 800px) 94vw, 740px" />
          ) : null}

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
