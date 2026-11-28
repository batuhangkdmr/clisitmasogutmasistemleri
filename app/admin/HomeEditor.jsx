import Image from "next/image";
import { galleryPhotos } from "../lib/gallery";
import { homeContent, homeFields, orderedHomeItems, selectHomeProducts } from "../lib/home-content";
import { productImages } from "../lib/product-images";
import { retryCatalogMediaCleanup, saveHomeSection, saveHomeSlideOrder } from "./actions";
import EditorForm from "./EditorForm";
import HomeOrderFields from "./HomeOrderFields";
import ImagePicker from "./ImagePicker";

function HomeSectionForm({ section, settings, slideId, children }) {
  const newSlide = section === "slide" && !slideId;
  return (
    <EditorForm save={saveHomeSection}>
      <input type="hidden" name="section" value={section} />
      {slideId && <input type="hidden" name="slideId" value={slideId} />}
      {homeFields[section].map(([name, label, limit, , kind]) => (
        <label key={name}>{label}
          {kind === "textarea"
            ? <textarea name={name} maxLength={limit} defaultValue={settings[name]} rows={3} required />
            : <input name={name} type={kind ?? "text"} maxLength={limit} defaultValue={settings[name]} required />}
        </label>
      ))}
      {settings.image && (
        <figure className="admin-image-preview">
          <Image src={settings.image} alt={settings.alt} width={280} height={180} />
        </figure>
      )}
      {(settings.image || newSlide) && <ImagePicker
        label={newSlide ? "Slayt görseli" : "Yeni görsel (isteğe bağlı)"} required={newSlide} />}
      {children}
      <button className="button primary" type="submit">{newSlide ? "Slaytı ekle" : "Bölümü kaydet"}</button>
    </EditorForm>
  );
}

export default function HomeEditor({ catalog, status }) {
  const { hero, slides, contact, about, projects, products } = homeContent(catalog);
  const slideIds = slides.map(({ id }) => id);
  const photos = galleryPhotos(catalog);
  const published = catalog.products.filter(({ status }) => status === "published");
  const projectChoices = photos.map(({ id, src, title }, index) => ({
    id, src, label: `${index + 1}. ${title}`,
  }));
  const productChoices = published.map((item) => {
    const [image] = productImages(item);
    return { id: item.id, label: `${item.brand} · ${item.name} · ${item.model}`, src: image?.url, placeholder: image?.placeholder };
  }).sort((a, b) => a.label.localeCompare(b.label, "tr"));
  const projectIds = orderedHomeItems(photos, projects.ids, photos.filter(({ featured }) => featured)).map(({ id }) => id);
  const productIds = orderedHomeItems(published, products.ids, products.ids ? [] : selectHomeProducts({ ...catalog, products: published })).map(({ id }) => id);

  return (
    <div className="admin-home">
      {typeof status === "string" && <p className="admin-notice" role="status">{status === "saved" ? "Değişiklik kaydedildi." : status.slice(0, 200)}</p>}
      {catalog.pendingMediaDeletes?.length > 0 && (
        <form className="admin-notice admin-inline" action={retryCatalogMediaCleanup}>
          <input type="hidden" name="view" value="anasayfa" />
          <button className="admin-secondary" type="submit">Bekleyen Cloudinary temizliğini tekrar dene</button>
        </form>
      )}
      <section className="admin-panel">
        <h2>Carousel</h2>
        <HomeSectionForm key={JSON.stringify(hero)} section="hero" settings={hero} />
        <details>
          <summary>Slayt sırasını değiştir</summary>
          <EditorForm key={JSON.stringify(slideIds)} save={saveHomeSlideOrder}>
            <HomeOrderFields reorderOnly initialIds={slideIds}
              choices={slides.map(({ id, title, image }) => ({ id, label: title, src: image }))} />
            <button className="button primary" type="submit">Slayt sırasını kaydet</button>
          </EditorForm>
        </details>
        {slides.map((slide, index) => (
          <details key={slide.id}>
            <summary>{index + 1}. {slide.title}</summary>
            <HomeSectionForm key={JSON.stringify(slide)} section="slide" settings={slide} slideId={slide.id} />
          </details>
        ))}
        <details>
          <summary>Yeni slayt ekle</summary>
          <HomeSectionForm section="slide" settings={{}} />
        </details>
      </section>
      <section className="admin-panel">
        <h2>Carousel altındaki iletişim ve adres</h2>
        <HomeSectionForm key={JSON.stringify(contact)} section="contact" settings={contact} />
      </section>
      <section className="admin-panel">
        <h2>Hakkımızda özeti</h2>
        <HomeSectionForm key={JSON.stringify(about)} section="about" settings={about} />
      </section>
      <section className="admin-panel">
        <h2>Projelerimiz</h2>
        <HomeSectionForm key={JSON.stringify([projects, projectIds])} section="projects" settings={projects}>
          <HomeOrderFields label="Galeriden fotoğraf seçin" choices={projectChoices} initialIds={projectIds} />
        </HomeSectionForm>
      </section>
      <section className="admin-panel">
        <h2>Ürünlerimiz</h2>
        <HomeSectionForm key={JSON.stringify([products, productIds])} section="products" settings={products}>
          <HomeOrderFields label="Yayındaki ürünlerden seçin" choices={productChoices} initialIds={productIds} />
        </HomeSectionForm>
      </section>
    </div>
  );
}
