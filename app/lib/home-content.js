import { categoryTrail } from "./catalog-view";
import { site } from "./site";

const slideDefaults = [
  ["klima-hd", "Klima satışı ve montajı", "Evinize veya iş yerinize uygun kapasiteyi ve marka seçeneklerini ücretsiz keşifte belirleyelim.", "Duvar tipi klima iç ünitesini monte eden teknisyen", "63% 30%"],
  ["kombi", "Kombi ve doğalgaz", "Isınma ve sıcak su ihtiyacınıza uygun kombiyi seçelim, doğalgaz tesisatını ve montajı planlayalım.", "Mutfakta duvara monte edilmiş kombi"],
  ["isi-pompasi-hd", "Isı pompası sistemleri", "Yazın soğutma, kışın ısıtma için mekânınıza uygun ısı pompasını birlikte seçelim.", "Evin dış cephesine kurulmuş hava kaynaklı ısı pompası", "54% 58%"],
  ["yerden-isitma-hd", "Yerden ısıtma", "Yeni yapınız ya da tadilatınız için zeminden ısıtma sistemini yerinde değerlendirelim.", "Döşeme kapatılmadan önce zemine serilmiş kırmızı ısıtma boruları", "62% 62%"],
  ["gunes-enerjisi-hd", "Güneş enerjisi", "Sıcak su ihtiyacınız için binanıza uygun güneş enerjisi sistemi seçeneklerini değerlendirelim.", "Kiremit çatıda sıcak su için kullanılan güneş kolektörleri", "68% 58%"],
];

export const homeFields = {
  hero: [
    ["eyebrow", "Carousel üst başlığı", 65, "CL Isıtma ve Soğutma Sistemleri"],
  ],
  contact: [
    ["title", "İletişim başlığı", 60, "İletişim"],
    ["phone", "Telefon", 35, site.phones[0].display],
    ["email", "E-posta", 160, site.email, "email"],
    ["addressTitle", "Adres başlığı", 60, "Adres"],
    ["address", "Adres", 250, site.address.full, "textarea"],
    ["cardTitle", "İletişim kartı başlığı", 90, "CL Isıtma ve Soğutma Sistemleri"],
    ["cardText", "İletişim kartı açıklaması", 160, "Isıtma, soğutma ve tesisat ihtiyaçlarınız için konuşalım.", "textarea"],
  ],
  about: [
    ["eyebrow", "Üst başlık", 60, "Samsun / Tekkeköy"],
    ["title", "Başlık", 100, "CL Isıtma ve Soğutma Sistemleri"],
    ["lead", "Vurgulu metin", 220, "20 yıllık ustalık tecrübesiyle ev ve iş yerlerine ısıtma, soğutma ve tesisat çözümleri sunuyoruz.", "textarea"],
    ["body", "Açıklama", 500, "Klima ve kombiden yerden ısıtmaya kadar önce mekânı ve ihtiyacınızı yerinde değerlendiriyoruz. Ücretsiz keşif sonrası bütçenize uygun marka, montaj ve ödeme seçeneklerini birlikte netleştiriyoruz.", "textarea"],
    ["badgeTitle", "Görsel üzerindeki başlık", 30, "20 yıl"],
    ["badgeText", "Görsel üzerindeki açıklama", 60, "Ustalık tecrübesi"],
    ["alt", "Görsel alt metni", 160, "Duvar tipi klima üzerinde çalışan teknisyen"],
  ],
  projects: [
    ["intro", "Açıklama", 240, "Isıtma, montaj ve tesisat çalışmalarımızdan sahada çekilen kareler.", "textarea"],
  ],
  products: [
    ["intro", "Açıklama", 240, "Isıtma, soğutma ve tesisat ürünlerimizi keşfedin. Model ve tedarik bilgisi için bize ulaşın.", "textarea"],
  ],
  slide: [
    ["title", "Başlık", 55],
    ["description", "Açıklama", 140, "", "textarea"],
    ["alt", "Görsel alt metni", 160],
  ],
};

export const homeSlideIds = slideDefaults.map(([id]) => id);

export function homeContent(catalog) {
  const saved = catalog.home ?? {};
  const sections = Object.fromEntries(["hero", "contact", "about", "projects", "products"].map((section) => [
    section,
    {
      ...Object.fromEntries(homeFields[section].map(([key, , , fallback]) => [key, fallback])),
      ...saved[section],
    },
  ]));
  const slides = [
    ...slideDefaults.map(([id, title, description, alt, objectPosition]) => ({
      id, title, description, alt, objectPosition, image: `/assets/hero-${id}.webp`,
      ...saved.slides?.[id],
    })),
    ...Object.entries(saved.slides ?? {}).filter(([id]) => !homeSlideIds.includes(id))
      .map(([id, slide]) => ({ ...slide, id })),
  ];
  const orderedSlides = orderedHomeItems(slides, saved.slideOrder, []);
  const orderedIds = new Set(orderedSlides.map(({ id }) => id));
  return {
    ...sections,
    about: { ...sections.about, image: sections.about.image ?? "/assets/cl-hero.webp" },
    slides: [...orderedSlides, ...slides.filter(({ id }) => !orderedIds.has(id))],
  };
}

export function orderedHomeItems(items, ids, fallback) {
  if (!Array.isArray(ids)) return fallback;
  const byId = new Map(items.map((item) => [item.id, item]));
  return ids.map((id) => byId.get(id)).filter(Boolean);
}

const featuredProductSlots = [
  ["kombiler", "VUW 24/24 AS/2-1"],
  ["klimalar", "FTXF25F"],
  ["isi-pompalari", "VWL 55/6 A"],
  ["kati-yakitli-sobalar", "Venüs"],
  ["kombiler", "Duotec Compact 24"],
  ["gunes-enerjisi", "Açık Devre"],
  ["klimalar", "Climate 4000i"],
  ["yerden-isitma", "Paslanmaz Kollektör"],
  ["kombiler", "P 24"],
  ["isi-pompalari", "VWL 85/7.2 AS"],
  ["kati-yakitli-kazan", "YTP-S"],
  ["yangin-tesisati", "Sidewall"],
];

export function selectHomeProducts({ products, categories }) {
  const candidates = products.filter((product) => product.images?.[0]?.url).map((product) => ({
    product,
    group: categoryTrail(categories, product.categoryId)[0]?.slug,
    coverUrl: product.images[0].url,
  }));
  const selected = [];
  const usedCovers = new Set();
  for (const [group, preferredModel] of featuredProductSlots) {
    const options = candidates.filter((item) => item.group === group && !usedCovers.has(item.coverUrl));
    const choice = options.find(({ product }) => product.model === preferredModel) ?? options[0];
    if (!choice) continue;
    selected.push(choice.product);
    usedCovers.add(choice.coverUrl);
  }
  for (const { product, group, coverUrl } of candidates) {
    if (selected.length === featuredProductSlots.length) break;
    if (group === "kombiler" || usedCovers.has(coverUrl)) continue;
    selected.push(product);
    usedCovers.add(coverUrl);
  }
  return selected;
}
