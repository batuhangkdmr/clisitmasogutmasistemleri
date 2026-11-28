import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "../lib/admin-auth";
import { orderedBlogPosts } from "../lib/blog";
import { readCatalog } from "../lib/catalog-store";
import { categoryTrail, productPath } from "../lib/catalog-view";
import { partnerBrands } from "../lib/partner-brands";
import { productImages } from "../lib/product-images";
import EditorForm from "./EditorForm";
import BlogEditor from "./BlogEditor";
import DeleteProduct from "./DeleteProduct";
import ImagePicker from "./ImagePicker";
import ProductEditorForm from "./ProductEditorForm";
import { deleteBrand, deleteCategory, deleteProduct, logout, moveBlogPost, retryCatalogMediaCleanup, saveBrand, saveCategory } from "./actions";

const statuses = { draft: "Taslak", published: "Yayında", archived: "Arşivde" };

function editorLink(view, id, parentId) {
  return `/admin?gorunum=${view}${id ? `&id=${id}` : ""}${parentId ? `&ust=${parentId}` : ""}#yonetim-editoru`;
}

function categoryLabel(categories, id) {
  return categoryTrail(categories, id).map(({ name }) => name).join(" / ");
}

function CategoryEditor({ category, categories, parentId }) {
  const eligibleParents = categories.filter((item) => {
    const trail = categoryTrail(categories, item.id);
    return trail.length < 3 && !trail.some(({ id }) => id === category?.id);
  });
  const parent = eligibleParents.find(({ id }) => id === (category ? category.parentId : parentId));
  const canAddChild = category && categoryTrail(categories, category.id).length < 3;
  return (
    <>
      <h2>{category ? "Kategoriyi düzenle" : parent ? "Yeni alt kategori" : "Yeni kategori"}</h2>
      {canAddChild && <p><Link href={editorLink("kategoriler", null, category.id)} prefetch={false}
        className="home-text-link">Bu kategoriye alt kategori ekle →</Link></p>}
      <EditorForm save={saveCategory}>
        <input type="hidden" name="id" value={category?.id || ""} />
        <div className="admin-fields">
          <label>Kategori adı<input name="name" defaultValue={category?.name} maxLength={90} required /></label>
          <label>Bağlantı adresi<input name="slug" defaultValue={category?.slug} maxLength={120} placeholder="Boş bırakılırsa addan oluşturulur" /></label>
          <label>Üst kategori<select name="parentId" defaultValue={parent?.id || ""}>
            <option value="">Ana kategori</option>
            {eligibleParents.map((item) => <option key={item.id} value={item.id}>{categoryLabel(categories, item.id)}</option>)}
          </select></label>
          <label>Görünüm sırası<input type="number" name="order" min={0} max={9999} defaultValue={category?.order ?? 0} required /></label>
        </div>
        <label>Kısa kategori açıklaması<textarea name="summary" defaultValue={category?.summary} rows={3} maxLength={160} /></label>
        <button className="button primary" type="submit">Kategoriyi kaydet</button>
      </EditorForm>
      {category && <form action={deleteCategory} className="admin-delete">
        <input type="hidden" name="id" value={category.id} />
        <button type="submit" className="admin-danger">Kategoriyi sil</button>
      </form>}
    </>
  );
}

function ProductEditor({ product, categories, brands }) {
  return (
    <>
      <h2>{product ? "Ürünü düzenle" : "Yeni ürün"}</h2>
      {!categories.length ? <p>Ürün eklemek için önce <Link href="/admin?gorunum=kategoriler">bir kategori oluşturun</Link>.</p> : (
        <ProductEditorForm images={product?.images ?? []}>
          <input type="hidden" name="id" value={product?.id || ""} />
          <div className="admin-fields">
            <label>Ürün adı<input name="name" defaultValue={product?.name} maxLength={110} required /></label>
            <label>Marka<input name="brand" list="catalog-brands" defaultValue={product?.brand} maxLength={60} required />
              <datalist id="catalog-brands">{brands.map((brand) => <option key={brand} value={brand} />)}</datalist>
            </label>
            <label>Model kodu<input name="model" defaultValue={product?.model} maxLength={90} required /></label>
            <label>Kategori<select name="categoryId" defaultValue={product?.categoryId || ""} required>
              <option value="" disabled>Kategori seçin</option>
              {categories.map((item) => <option key={item.id} value={item.id}>{categoryLabel(categories, item.id)}</option>)}
            </select></label>
            <label>Yayın durumu<select name="status" defaultValue={product?.status || "draft"}>
              {Object.entries(statuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select></label>
          </div>
          <label>Kısa açıklama<textarea name="summary" defaultValue={product?.summary} maxLength={160} rows={2} required /></label>
          <label>Ürün açıklaması<textarea name="description" defaultValue={product?.description} maxLength={5000} rows={6} /></label>
          <label>Teknik özellikler (isteğe bağlı)<textarea name="specs" defaultValue={product?.specs.map(({ label, value }) => label ? `${label}: ${value}` : value).join("\n")}
            maxLength={4000} rows={5} placeholder={"Isıtma kapasitesi: 24 kW\nEnerji sınıfı: A"} />
            <small>Serbest metin yazabilir veya “Kapasite: 12.000 BTU/h” gibi başlık ve değer kullanabilirsin.</small>
          </label>
        </ProductEditorForm>
      )}
      {product && <DeleteProduct id={product.id} name={product.name} action={deleteProduct} />}
      {!!categories.length && <div className="admin-inline admin-product-actions">
        <button className="button primary" type="submit" form="admin-product-editor">Ürünü kaydet</button>
        {product?.status === "published" && <Link href={productPath(product)} className="home-text-link">Yayındaki ürünü aç →</Link>}
      </div>}
    </>
  );
}

function BrandEditor({ brand }) {
  return (
    <>
      <h2>{brand ? "Markayı düzenle" : "Yeni marka"}</h2>
      {brand && <Image className="admin-brand-logo" src={brand.image.url} alt={brand.name} width={160} height={90} />}
      <EditorForm save={saveBrand}>
        <input type="hidden" name="id" value={brand?.id ?? ""} />
        <label>Marka adı<input name="name" maxLength={60} defaultValue={brand?.name} required /></label>
        <ImagePicker label={brand ? "Yeni logo (isteğe bağlı)" : "Marka logosu"} required={!brand} />
        <button type="submit" className="button primary">Markayı kaydet</button>
      </EditorForm>
      {brand && <form action={deleteBrand} className="admin-delete">
        <input type="hidden" name="id" value={brand.id} />
        <button type="submit" className="admin-danger">Markayı sil</button>
      </form>}
    </>
  );
}

export default async function AdminPage({ searchParams }) {
  if (!(await isAdmin())) redirect("/admin/giris");
  const [{ gorunum, id, durum, ara, ust }, catalog] = await Promise.all([searchParams, readCatalog()]);
  const logos = [...partnerBrands(catalog)].sort((a, b) => a.name.localeCompare(b.name, "tr"));
  const categories = [...catalog.categories].sort((a, b) =>
    categoryLabel(catalog.categories, a.id).localeCompare(categoryLabel(catalog.categories, b.id), "tr"));
  const parentId = typeof ust === "string" ? ust : "";
  const brands = [...new Set([...logos.map(({ name }) => name), ...catalog.products.map(({ brand }) => brand)])]
    .sort((a, b) => a.localeCompare(b, "tr"));
  const categoryMode = gorunum === "kategoriler";
  const brandMode = gorunum === "markalar";
  const blogMode = gorunum === "blog";
  const posts = orderedBlogPosts(catalog);
  const blogPositions = new Map(posts.map((post, index) => [post.id, index + 1]));
  const featuredPostId = posts.find((post) => post.status === "published")?.id;
  const view = categoryMode ? "kategoriler" : brandMode ? "markalar" : blogMode ? "blog" : "urunler";
  const items = categoryMode ? categories : brandMode ? logos : blogMode ? posts : [...catalog.products].sort((a, b) => a.name.localeCompare(b.name, "tr"));
  const listTitle = categoryMode ? "Kategoriler" : brandMode ? "Markalar" : blogMode ? "Blog yazıları" : "Ürünler";
  const addLabel = categoryMode ? "Kategori ekle" : brandMode ? "Marka ekle" : blogMode ? "Yazı ekle" : "Ürün ekle";
  const selected = items.find((item) => item.id === id);
  const query = typeof ara === "string" ? ara.slice(0, 100) : "";
  const list = items.filter((item) => [item.title ?? item.name, item.brand, item.model].join(" ").toLocaleLowerCase("tr").includes(query.toLocaleLowerCase("tr")));
  return (
    <div className="container admin-container">
      <header className="admin-heading">
        <div><p className="home-kicker">CL Isıtma</p><h1>{blogMode ? "Blog yönetimi" : "Katalog yönetimi"}</h1></div>
        <div className="admin-inline"><Link href={blogMode ? "/blog" : "/urunler"} className="admin-secondary">{blogMode ? "Blogu aç ↗" : "Kataloğu aç ↗"}</Link>
          <form action={logout}><button className="admin-secondary">Çıkış yap</button></form>
        </div>
      </header>
      <nav className="store-tabs admin-tabs" aria-label="Yönetim bölümleri">
        <Link href="/admin" aria-current={view === "urunler" ? "page" : undefined}>Ürünler ({catalog.products.length})</Link>
        <Link href="/admin?gorunum=kategoriler" aria-current={categoryMode ? "page" : undefined}>Kategoriler ({catalog.categories.length})</Link>
        <Link href="/admin?gorunum=markalar" aria-current={brandMode ? "page" : undefined}>Markalar ({logos.length})</Link>
        <Link href="/admin?gorunum=blog" aria-current={blogMode ? "page" : undefined}>Blog ({posts.length})</Link>
      </nav>
      {!catalog.available ? <p className="admin-notice" role="alert">Katalog veritabanına ulaşılamıyor.</p> : (
        <div className="admin-grid">
          <aside className="admin-panel admin-list">
            <header className="admin-list-heading">
              <h2>{listTitle}</h2>
              <Link href={editorLink(view)} prefetch={false} className="button primary">{addLabel}</Link>
            </header>
            <form className="admin-form" action="/admin">
              <input type="hidden" name="gorunum" value={view} />
              <label>Listede ara<input type="search" name="ara" defaultValue={query} maxLength={100} /></label>
            </form>
            {blogMode && posts.length > 1 && <p className="admin-blog-order-help">İlk sıradaki yayımlanmış yazı blog sayfasında öne çıkar.</p>}
            {list.length ? <ul className="admin-records">{list.map((item, index) => {
              const image = blogMode ? item.cover : brandMode ? item.image : categoryMode ? null : productImages(item)[0];
              const imageSrc = image?.src ?? image?.url;
              const active = selected?.id === item.id;
              return <li key={item.id} className={`admin-record${active ? " is-selected" : ""}${blogMode && featuredPostId === item.id ? " is-featured" : ""}`}>
              <Link href={editorLink(view, item.id)} prefetch={false}
                className={`admin-record-link${categoryMode ? "" : " has-thumbnail"}`}
                aria-current={active ? "page" : undefined}>
                {!categoryMode && <span className={`admin-record-thumbnail${blogMode ? " is-blog-cover" : ""}`}>
                  {imageSrc ? <Image src={imageSrc} alt="" fill sizes="84px" unoptimized={image?.placeholder} /> : <span>Görsel yok</span>}
                  {blogMode && <span className="admin-record-position" aria-label={`${blogPositions.get(item.id)}. sıra`}>{blogPositions.get(item.id)}</span>}
                </span>}
                <span className="admin-record-copy">
                  <strong>{categoryMode ? categoryLabel(catalog.categories, item.id) : item.title ?? item.name}</strong>
                  {view === "urunler" && <small>{item.brand} · {item.model}</small>}
                  {(blogMode || view === "urunler") && <span className="admin-record-meta">
                    <small className={`admin-status admin-status-${item.status}`}>{statuses[item.status]}</small>
                    {blogMode && featuredPostId === item.id && <small className="admin-record-featured">Öne çıkan</small>}
                  </span>}
                </span>
              </Link>
              {blogMode && !query && posts.length > 1 && (
                <form action={moveBlogPost} className="admin-blog-order" aria-label={`${item.title} sırası`}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="selectedId" value={selected?.id ?? ""} />
                  <button className="admin-secondary" type="submit" name="direction" value="top" disabled={index === 0}
                    title="En üste taşı"><span aria-hidden="true">⇈</span> En üste</button>
                  <button className="admin-secondary" type="submit" name="direction" value="up" disabled={index === 0}
                    aria-label="Yukarı taşı" title="Yukarı taşı">↑</button>
                  <button className="admin-secondary" type="submit" name="direction" value="down" disabled={index === posts.length - 1}
                    aria-label="Aşağı taşı" title="Aşağı taşı">↓</button>
                </form>
              )}
              </li>;
            })}</ul> : <p className="store-muted">Gösterilecek kayıt yok.</p>}
          </aside>
          <section className="admin-panel admin-editor" id="yonetim-editoru" key={`${view}-${id ?? ""}-${parentId}`}>
            {typeof durum === "string" && <p className="admin-notice" role="status">{durum === "saved" ? "Değişiklik kaydedildi." : durum.slice(0, 200)}</p>}
            {!categoryMode && catalog.pendingMediaDeletes?.length > 0 && (
              <form action={retryCatalogMediaCleanup} className="admin-notice admin-inline">
                <input type="hidden" name="view" value={view} />
                <span>Cloudinary temizliği bekleyen {catalog.pendingMediaDeletes.length} görsel var.</span>
                <button type="submit" className="admin-secondary">Temizliği tekrar dene</button>
              </form>
            )}
            {categoryMode ? <CategoryEditor category={selected} categories={categories} parentId={parentId} /> :
              brandMode ? <BrandEditor brand={selected} /> :
              blogMode ? <BlogEditor post={selected} /> :
              <ProductEditor product={selected} categories={categories} brands={brands} />}
          </section>
        </div>
      )}
    </div>
  );
}
