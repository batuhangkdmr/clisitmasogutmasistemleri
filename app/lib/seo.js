import { site } from "./site";

const shareImage = {
  url: "/assets/cl-hero.webp",
  alt: "Duvar tipi klima üzerinde çalışan teknisyen",
};

export function pageMetadata({ path, title, description, noindex = false }) {
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
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [shareImage],
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
