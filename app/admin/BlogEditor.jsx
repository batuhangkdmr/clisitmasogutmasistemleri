import Image from "next/image";
import Link from "next/link";
import { blogPath } from "../lib/blog";
import { services } from "../lib/services";
import BlogContentFields from "./BlogContentFields";
import DeleteProduct from "./DeleteProduct";
import EditorForm from "./EditorForm";
import ImagePicker from "./ImagePicker";
import { deleteBlogPost, saveBlogPost } from "./actions";

export default function BlogEditor({ post }) {
  return (
    <>
      <h2>{post ? "Yazıyı düzenle" : "Yeni blog yazısı"}</h2>
      <EditorForm save={saveBlogPost} remountOnSave key={post?.updatedAt ?? post?.id}>
        <input type="hidden" name="id" value={post?.id ?? ""} />
        <label>Yazı başlığı<input name="title" defaultValue={post?.title} maxLength={120} required /></label>
        <label>Yayın durumu
          <select name="status" defaultValue={post?.status ?? "published"}>
            <option value="published">Yayında · Blog sayfasında görünür</option>
            <option value="draft">Taslak · Yalnızca admin panelinde görünür</option>
          </select>
        </label>
        <label>Kısa açıklama<textarea name="summary" defaultValue={post?.summary} maxLength={160} rows={2} required /></label>
        <BlogContentFields initialBody={post?.body ?? ""} initialService={post?.serviceSlug ?? ""}
          initialServiceSummary={post?.serviceSummary || null}
          services={services.map(({ slug, title, summary }) => ({ slug, title, summary }))} />
        {post?.cover && <figure className="admin-image-preview">
          <Image src={post.cover.src} alt={post.cover.alt} width={280} height={180} />
          <figcaption>Mevcut kapak</figcaption>
        </figure>}
        <ImagePicker label={post?.cover ? "Yeni kapak görseli (isteğe bağlı)" : "Kapak görseli (isteğe bağlı)"} />
        <label>Görsel alt metni<input name="imageAlt" defaultValue={post?.cover?.alt} maxLength={160} placeholder="Görsel ne gösteriyor?" /></label>
        {post?.cover && <label className="admin-blog-checkbox"><input type="checkbox" name="removeCover" /> Mevcut kapak görselini kaldır</label>}
        <div className="admin-inline">
          <button type="submit" className="button primary">Yazıyı kaydet</button>
          {post?.status === "published" && <Link href={blogPath(post.slug)} className="home-text-link">Yazıyı görüntüle ↗</Link>}
        </div>
      </EditorForm>
      {post && <DeleteProduct id={post.id} name={post.title} action={deleteBlogPost} label="yazıyı" location="blogdan" />}
    </>
  );
}
