import Image from "next/image";
import EditorForm from "./EditorForm";
import ImagePicker from "./ImagePicker";
import DeleteProduct from "./DeleteProduct";
import { deleteGalleryPhoto, saveGalleryPhoto } from "./actions";

export default function GalleryEditor({ photo, publicHref }) {
  return (
    <>
      <h2>{photo ? "Fotoğrafı düzenle" : "Galeriye fotoğraf ekle"}</h2>
      {photo && <figure className="admin-image-preview">
        <Image src={photo.src} alt={photo.alt || photo.title} width={280} height={180} />
        <figcaption><a href={publicHref}>Galeride görüntüle ↗</a></figcaption>
      </figure>}
      <EditorForm save={saveGalleryPhoto}>
        <input type="hidden" name="id" value={photo?.id ?? ""} />
        <label>Fotoğraf başlığı<input name="title" defaultValue={photo?.title} maxLength={120} required /></label>
        <label>Açıklama (isteğe bağlı)
          <textarea name="description" defaultValue={photo?.description} maxLength={500} rows={4} />
          <small>Bu metin galeride fotoğrafın altında ve büyük görünümde gösterilir.</small>
        </label>
        <ImagePicker label={photo ? "Fotoğrafı değiştir (isteğe bağlı)" : "Fotoğraf seç"} required={!photo} />
        <button className="button primary" type="submit">Fotoğrafı kaydet</button>
      </EditorForm>
      {photo && <DeleteProduct id={photo.id} name={photo.title} action={deleteGalleryPhoto} label="fotoğrafı" location="galeriden" />}
    </>
  );
}
