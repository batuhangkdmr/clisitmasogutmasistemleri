import { cloudinaryAssetUrl } from "./cloudinary-loader";
import { site } from "./site";

export function productImages(product) {
  if (product.images.length) return product.images;
  const url = cloudinaryAssetUrl("/assets/cl-logo-transparent.png",
    "c_fit,w_290,h_245/c_lpad,g_center,w_640,h_480,b_rgb:edf4f8/f_webp,q_auto:good");
  return url ? [{ id: "placeholder", url, alt: site.name, placeholder: true }] : [];
}
