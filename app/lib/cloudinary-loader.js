/* global process */
import assets from "./cloudinary-assets.json";

const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export function cloudinaryFiles(directory) {
  if (!cloud) return [];
  const prefix = `/${directory}/`;
  return Object.keys(assets).filter((src) =>
    assets[src].account === cloud && src.startsWith(prefix) && !src.slice(prefix.length).includes("/")
  ).map((src) => decodeURIComponent(src.slice(prefix.length)));
}

export function mediaUrl(src, { width, format = "auto", quality = "auto:good" } = {}) {
  const asset = Object.hasOwn(assets, src) ? assets[src] : null;
  if (!cloud || asset?.account !== cloud) return src;
  const resize = width ? `,c_limit,w_${Math.min(width, asset.width)}` : "";
  return `https://res.cloudinary.com/${cloud}/image/upload/f_${format},q_${quality}${resize}/v${asset.version}/${asset.id}`;
}

export function cloudinaryAssetUrl(src, transformation = "") {
  const asset = Object.hasOwn(assets, src) ? assets[src] : null;
  if (!cloud || asset?.account !== cloud) return null;
  return `https://res.cloudinary.com/${cloud}/image/upload/${transformation ? `${transformation}/` : ""}v${asset.version}/${asset.id}`;
}

export default function cloudinaryLoader({ src, width }) {
  const delivery = cloud && `https://res.cloudinary.com/${cloud}/image/upload/`;
  if (delivery && src.startsWith(delivery)) {
    return `${delivery}f_auto,q_auto:good,c_limit,w_${width}/${src.slice(delivery.length)}`;
  }
  return mediaUrl(src, { width });
}
