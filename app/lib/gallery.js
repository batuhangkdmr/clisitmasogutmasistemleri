import { cloudinaryFiles, mediaUrl } from "./cloudinary-loader";
import { featuredProjects, projectImage } from "./home-projects";

export const galleryPageSize = 24;
export const galleryPageUrl = (page) => page === 1 ? "/galeri" : `/galeri?sayfa=${page}`;

const featured = new Map(featuredProjects);
const available = cloudinaryFiles("galeri").filter((file) => file !== "firmayeri.jpg" && /\.(jpe?g|png|webp)$/i.test(file));
const availableFiles = new Set(available);
const initialPhotos = [
  ...featuredProjects.flatMap(([file, title], index) => availableFiles.has(file)
    ? [{ id: String(index + 1), src: projectImage(file), title, alt: title, featured: true }] : []),
  ...available.filter((file) => !featured.has(file)).sort().map((file, index) => ({
    id: String(featuredProjects.length + index + 1), src: projectImage(file), title: "Saha uygulaması", alt: "Saha uygulaması",
  })),
];

export function galleryPhotos(catalog) {
  return catalog.galleryPhotos ?? initialPhotos;
}

export function galleryIntroPhotos(photos, selectedIds = ["3", "2", "5"]) {
  const byId = new Map(photos.map((photo) => [photo.id, photo]));
  const slots = selectedIds.slice(0, 3).map((id) => byId.get(id));
  const fallback = photos.filter((photo) => !slots.includes(photo));
  return Array.from({ length: 3 }, (_, index) => slots[index] ?? fallback.shift()).filter(Boolean);
}

export function galleryPhotoUrl(photo, index) {
  return `${galleryPageUrl(Math.floor(index / galleryPageSize) + 1)}#ornek-${photo.id}`;
}

export function galleryImageUrl(src, { width, format = "auto" }) {
  if (!src.startsWith("https://res.cloudinary.com/")) return mediaUrl(src, { width, format });
  return src.replace("/image/upload/", `/image/upload/c_limit,w_${width},f_${format},q_auto:good/`);
}
