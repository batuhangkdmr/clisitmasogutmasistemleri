import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import CatalogCard from "../../components/CatalogCard";
import ProductDetailGallery from "../../components/ProductDetailGallery";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import { publishedCatalog } from "../../lib/catalog-store";
import { catalogProductSeo } from "../../lib/catalog-seo";
import { categoryTrail, productPath, quoteUrl } from "../../lib/catalog-view";
import { site } from "../../lib/site";
import { productImages } from "../../lib/product-images";

const lookup = cache(async (slug) => {
  const { products, categories, available } = await publishedCatalog();
  if (!available) throw new Error("Product catalog unavailable");
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  return { product, products, categories, trail: categoryTrail(categories, product.categoryId) };
});

export async function generateMetadata({ params }) {
  const { product, trail } = await lookup((await params).urun);
  return catalogProductSeo(product, trail).metadata;
}

export default async function ProductPage({ params }) {
  const { product, products, categories, trail } = await lookup((await params).urun);
  const { webPage } = catalogProductSeo(product, trail);
  const images = productImages(product);
  const category = trail.at(-1);
  const catalogHref = category ? `/urunler?kategori=${category.slug}` : "/urunler";
  const depthByCategory = new Map(trail.map(({ id }, index) => [id, index + 1]));
  const related = products.filter(({ id }) => id !== product.id)
    .map((item) => {
      const depth = categoryTrail(categories, item.categoryId)
        .reduce((closest, { id }) => Math.max(closest, depthByCategory.get(id) ?? 0), 0);
      return { item, depth };
    })
    .filter(({ depth }) => depth > 0)
    .sort((a, b) => b.depth - a.depth || a.item.name.localeCompare(b.item.name, "tr"))
    .slice(0, 8);
  return (
    <>
      <SiteHeader />
      <main className="store-page">
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage).replace(/</g, "\\u003c") }} />
        <div className="container store-container store-detail">
          <Breadcrumb title={product.name} path={productPath(product)} parents={[
            { name: "Ürünlerimiz", href: "/urunler" },
            ...trail.map(({ name, slug }) => ({ name, href: `/urunler?kategori=${slug}` })),
          ]} />
          <div className="store-detail-grid">
            <ProductDetailGallery key={product.id} images={images} />
            <div className="store-detail-info">
              <div className="store-detail-labels">
                <span>{product.brand}</span>
                {category && <Link href={catalogHref}>{category.name}</Link>}
              </div>
              <h1>{product.name}</h1>
              <dl className="store-model"><dt>Model</dt><dd>{product.model}</dd></dl>
              <p className="store-lead">{product.summary}</p>
              <div className="store-detail-contact">
                <p>Fiyat, stok ve montaj bilgisi için {site.address.district} / {site.address.city} ekibimize ulaşın.</p>
                <div className="store-detail-actions">
                  <a className="button primary" href={quoteUrl(product)}>WhatsApp’tan bilgi al <span aria-hidden="true">→</span></a>
                  <Link href="/iletisim" className="home-text-link">İletişim</Link>
                </div>
              </div>
            </div>
          </div>
          {(product.description || product.specs.length > 0) && (
            <div className="store-detail-panels">
              {product.description && <section className="store-detail-panel"><h2>Ürün hakkında</h2><p className="store-description">{product.description}</p></section>}
              {product.specs.length > 0 && <section className="store-detail-panel"><h2>Teknik özellikler</h2>
                <div className="store-specs">{product.specs.map(({ label, value }, index) =>
                  label ? <dl key={index}><dt>{label}</dt><dd>{value}</dd></dl> :
                    <p key={index}>{value}</p>)}</div>
              </section>}
            </div>
          )}
          {related.length > 0 && (
            <section className="catalog-index store-related" aria-labelledby="store-related-heading">
              <div className="store-related-heading">
                <h2 id="store-related-heading">Göz atmak isteyebileceğiniz ürünler</h2>
                <Link href={catalogHref} className="home-text-link">Kategoriye göz at <span aria-hidden="true">→</span></Link>
              </div>
              <div className="store-grid">{related.map(({ item }) => <CatalogCard key={item.id} product={item} />)}</div>
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
