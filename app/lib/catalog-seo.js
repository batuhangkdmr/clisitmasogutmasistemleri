import { normalizeProductText } from "./catalog";
import { productPath } from "./catalog-view";
import { pageMetadata } from "./seo";
import { site } from "./site";
import { productImages } from "./product-images";

function compact(text) {
  return text.replace(/\s+/g, " ").trim();
}

function includesWords(text, phrase) {
  const words = normalizeProductText(phrase);
  return Boolean(words) && ` ${normalizeProductText(text)} `.includes(` ${words} `);
}

export function productTitle(product) {
  const name = compact(product.name);
  const brand = compact(product.brand);
  const model = compact(product.model);
  const brandedName = includesWords(name, brand) ? name : `${brand} ${name}`;
  return includesWords(brandedName, model) ? brandedName : `${brandedName} ${model}`;
}

function excerpt(text, limit) {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit - 1);
  const boundary = cut.lastIndexOf(" ");
  return `${(boundary >= limit * .65 ? cut.slice(0, boundary) : cut).trimEnd()}…`;
}

export function catalogProductSeo(product, trail) {
  const { district, city } = site.address;
  const path = productPath(product);
  const name = productTitle(product);
  const category = trail.at(-1)?.name;
  const locality = `${district} / ${city}`;
  const summary = compact(product.summary);
  const detail = includesWords(name, summary) ? "" : summary;
  const context = detail || category || "Ürün özellikleri ve WhatsApp ile bilgi alma";
  const identity = `${excerpt(name, 90)} · ${locality}`;
  const description = `${identity}. ${excerpt(context, 158 - identity.length - 2)}`;
  const [cover] = productImages(product);
  const metadata = pageMetadata({
    path,
    title: `${name} – ${city}`,
    description,
    ...(cover && { image: cover }),
  });
  const url = metadata.alternates.canonical;

  return {
    name,
    metadata,
    webPage: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#sayfa`,
      url,
      name: metadata.title,
      description,
      inLanguage: "tr-TR",
      publisher: { "@id": `${site.url}/#isletme` },
      ...(product.updatedAt && { dateModified: product.updatedAt }),
      ...(cover && { primaryImageOfPage: { "@type": "ImageObject", contentUrl: cover.url, caption: cover.alt } }),
    },
  };
}
