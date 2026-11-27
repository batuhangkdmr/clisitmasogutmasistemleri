import { cloudinaryAssetUrl, cloudinaryFiles } from "./cloudinary-loader";

const names = {
  arcelik: "Arçelik",
  demirdokum: "DemirDöküm",
  eca: "E.C.A.",
  lg: "LG",
  tcl: "TCL",
};

export function partnerBrands(catalog = {}) {
  if (Array.isArray(catalog.brands)) return catalog.brands;
  return cloudinaryFiles("brands").filter((file) => /\.(png|webp|jpe?g|svg)$/i.test(file)).sort().map((file) => {
    const slug = file.replace(/\.[^.]+$/, "");
    const name = names[slug] ?? slug.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
    return { id: slug, name, image: { url: cloudinaryAssetUrl(`/brands/${encodeURIComponent(file)}`), alt: name } };
  });
}
