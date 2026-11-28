import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "../components/Breadcrumb";
import CatalogResults from "../components/CatalogResults";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import WhatsAppButton from "../components/WhatsAppButton";
import { publishedCatalog } from "../lib/catalog-store";
import { categoryTrail, matchingProducts, quoteUrl } from "../lib/catalog-view";
import { catalogField as field, catalogPath as path, catalogResultPage, catalogResultsUrl, catalogUrl } from "../lib/catalog-results";
import { normalizeProductText } from "../lib/catalog";
import { pageMetadata } from "../lib/seo";
import { partnerBrands } from "../lib/partner-brands";
import { cloudinaryAssetUrl } from "../lib/cloudinary-loader";

const heroImage = cloudinaryAssetUrl("/assets/cl-urun-katalogu.webp");
const questions = [
  ["Fiyat ve stok bilgisini nasıl alırım?", "Ürün detayındaki WhatsApp düğmesine dokunun. Mesajınızda ürün modeli hazır gelir."],
  ["Klima veya kombi kapasitesini nasıl seçerim?", "Kullanım alanı ve mevcut tesisatı paylaşın. İhtiyaç duyduğunuz kapasiteyi birlikte değerlendirelim."],
  ["Yerinde keşif ücretli mi?", "Yerinde keşif ücretsizdir. Samsun’daki adresiniz için uygunluğu WhatsApp üzerinden sorabilirsiniz."],
  ["Montaj seçeneklerini nereden öğrenebilirim?", "Modeli ve montaj adresinin bulunduğu ilçeyi iletin. Uygulama kapsamını görüşelim."],
  ["Aradığım model listede yoksa ne yapmalıyım?", "Marka ve model kodunu WhatsApp üzerinden gönderin. Tedarik durumunu birlikte kontrol edelim."],
];

function CategoryNavigation({ categories, selected, trail }) {
  const active = new Set(trail.map(({ id }) => id));

  function renderBranches(parentId) {
    const nodes = categories.filter((category) => category.parentId === parentId);
    if (!nodes.length) return null;
    return <ul>{nodes.map((category) => (
      <li key={category.id}>
        <Link href={catalogResultsUrl({ kategori: category.slug })} prefetch={false}
          data-branch={active.has(category.id)}
          aria-current={selected === category.slug ? "page" : undefined}>
          {category.name}
        </Link>
        {active.has(category.id) && renderBranches(category.id)}
      </li>
    ))}</ul>;
  }

  return (
    <nav className="catalog-navigation" aria-label="Ürün kategorileri">
      <h2><span className="catalog-category-mark" aria-hidden="true" /> Kategoriler</h2>
      <Link href={catalogResultsUrl({})} prefetch={false} aria-current={!selected ? "page" : undefined}>
        Tüm ürünler
      </Link>
      {renderBranches(null)}
      <Link href="/hizmetler/petek-temizligi" className="catalog-service-link">Petek temizliği <span aria-hidden="true">↗</span></Link>
    </nav>
  );
}

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const slug = field(params, "kategori");
  const filtered = Boolean(field(params, "q") || field(params, "marka") || field(params, "sayfa"));
  const catalog = slug ? await publishedCatalog() : null;
  const category = catalog?.categories.find((item) => item.slug === slug);
  const hasCategoryProducts = category && matchingProducts(catalog, "", slug).length > 0;
  return pageMetadata({
    path: category ? catalogUrl({ kategori: category.slug }) : path,
    title: category ? `${category.name} – Samsun Tekkeköy` : "Ürünlerimiz – Samsun Isıtma ve Soğutma",
    description: category?.summary || (category
      ? `Samsun Tekkeköy’de CL Isıtma’nın ${category.name} kategorisindeki ürünleri inceleyin. Model ve montaj bilgisi için WhatsApp’tan ulaşın.`
      : "CL Isıtma’nın Samsun Tekkeköy’deki ısıtma, soğutma ve tesisat ürünlerini inceleyin. Marka, model ve montaj bilgisi için WhatsApp’tan ulaşın."),
    noindex: filtered || Boolean(slug && !hasCategoryProducts),
  });
}

export default async function ProductsPage({ searchParams }) {
  const [catalog, params] = await Promise.all([publishedCatalog(), searchParams]);
  const q = field(params, "q");
  const kategori = field(params, "kategori");
  const marka = field(params, "marka");
  const categories = [...catalog.categories]
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "tr"));
  const currentCategory = categories.find(({ slug }) => slug === kategori);
  const trail = currentCategory ? categoryTrail(categories, currentCategory.id) : [];
  const parents = currentCategory ? [
    { name: "Ürünlerimiz", href: path },
    ...trail.slice(0, -1).map(({ name, slug }) =>
      ({ name, href: catalogUrl({ kategori: slug }) })),
  ] : [];
  const categoryProducts = matchingProducts(catalog, "", kategori);
  const categoryBrands = new Set(categoryProducts.map(({ brand }) => normalizeProductText(brand)));
  const catalogBrands = new Map(partnerBrands(catalog).map(({ name, image }) => [normalizeProductText(name), { name, image }]));
  for (const { brand } of catalog.products) {
    const key = normalizeProductText(brand);
    if (!catalogBrands.has(key)) catalogBrands.set(key, { name: brand });
  }
  const sayfa = field(params, "sayfa");
  const results = catalogResultPage(catalog, { q, kategori, marka, sayfa });
  const brandOptions = [
    { value: "", label: "Tüm markalar" },
    ...[...catalogBrands]
      .sort(([a, x], [b, y]) => Number(categoryBrands.has(b)) - Number(categoryBrands.has(a)) || x.name.localeCompare(y.name, "tr"))
      .map(([key, { name, image }]) => {
        const value = marka && key === normalizeProductText(marka) ? marka : name;
        return { value, label: name, image };
      }),
  ];
  const categoryOptions = [
    { value: "", label: "Tüm kategoriler" },
    ...categories.map((item) => ({
      value: item.slug, label: item.name, parent: categories.find(({ id }) => id === item.parentId)?.slug ?? null,
    })),
  ];
  const emptyCategory = currentCategory && categoryProducts.length === 0;

  return (
    <>
      <SiteHeader />
      <main className="store-page catalog-index">
        <header className="corporate-hero store-hero">
          <div className="container store-container">
            <Breadcrumb title={currentCategory?.name || "Ürünlerimiz"} path={currentCategory ? catalogUrl({ kategori }) : path}
              parents={parents} indexable={!q && !marka && !params.sayfa && (!kategori || Boolean(currentCategory && !emptyCategory))} />
            <div className={`catalog-hero-content${heroImage ? " catalog-hero-illustrated" : ""}`}>
              <div className="catalog-hero-copy">
                <p className="home-kicker">Samsun / Tekkeköy</p>
                <h1>{currentCategory?.name || "Isıtma ve soğutma ürünleri"}</h1>
                <p className="store-lead">{currentCategory?.summary || "Klima, kombi, ısı pompası ve tesisat ürünlerini keşfedin. İhtiyacınıza uygun modeli seçmek için ekibimize danışın."}</p>
                <div className="catalog-hero-actions">
                  <a className="button primary" href="#catalog-heading">Kataloğu incele <span aria-hidden="true">↓</span></a>
                  <a className="catalog-hero-contact" href={quoteUrl()}>WhatsApp’tan bilgi alın <span aria-hidden="true">↗</span></a>
                </div>
              </div>
              {heroImage && (
                <div className="catalog-hero-illustration">
                  <Image src={heroImage} fill fetchPriority="high"
                    sizes="(max-width: 760px) 92vw, (max-width: 1400px) 38vw, 520px"
                    alt="Doğalgaz, klima, sıhhi tesisat, yerden ısıtma, ısı pompası, katı yakıtlı kazan ve soba, kombi, petek temizliği, güneş enerjisi ve yangın tesisatını gösteren çizim" />
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="container store-container store-list catalog-layout">
          <CategoryNavigation categories={categories} selected={kategori} trail={trail} />
          <CatalogResults key={catalogUrl({ q, kategori, marka, sayfa })}
            initialQuery={q} initialResults={results} available={catalog.available}
            kategori={kategori} marka={marka} categoryName={currentCategory?.name} emptyCategory={Boolean(emptyCategory)}
            categoryOptions={categoryOptions} brandOptions={brandOptions} />
        </div>
        <section className="container store-container store-faq">
          <div className="catalog-faq-intro">
            <h2>Sıkça sorulan sorular</h2>
            <Link className="home-text-link" href="/hizmetler">Kurulum ve tesisat hizmetlerimiz →</Link>
            <Link className="home-text-link catalog-mobile-service" href="/hizmetler/petek-temizligi">Petek temizliği →</Link>
          </div>
          <div>
            {questions.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
