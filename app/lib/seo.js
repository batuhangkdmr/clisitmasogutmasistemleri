import { site } from "./site";
import { mediaUrl } from "./cloudinary-loader";

const shareImage = {
  url: mediaUrl("/assets/cl-hero.webp", { width: 1200, format: "jpg" }),
  alt: "Duvar tipi klima üzerinde çalışan teknisyen",
};

export function pageMetadata({ path, title, description, noindex = false, image = shareImage }) {
  const url = new URL(path, site.url).href;
  const shareTitle = path === "/" ? title : `${title} | ${site.shortName}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      siteName: site.name,
      url,
      title: shareTitle,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [image],
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
