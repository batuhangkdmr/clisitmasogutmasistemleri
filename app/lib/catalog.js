export const klimalar = [
  [
    "DAIKIN",
    "Daikin Sensira",
    "Günlük kullanım için dengeli, yeni nesil duvar tipi seri.",
    "https://st-daikin.mncdn.com/mnresize/700/700/Content/media/ProductImg/original/trftxf25f01-yeni-sensira-9000-btuh-ftxf25f-inverter-klima-r32-638811739716877801.png",
    ["Inverter", "R32"],
  ],
  [
    "DAIKIN",
    "Daikin Shira Eco",
    "Ev kullanımı için verimli ve sakin çalışan seri.",
    "https://st-daikin.mncdn.com/mnresize/700/700/Content/media/ProductImg/original/trftxp25n01-shira-eco-9000-btuh-ftxp25n9-inverter-klima-r32-638574071173286729.png",
    ["Inverter", "Verimli"],
  ],
  [
    "MITSUBISHI ELECTRIC",
    "HareME MSZ-HR",
    "Kompakt iç ünite; konutlar için uygun kapasite seçenekleri.",
    "https://klima.mitsubishielectric.com.tr/Images/MSZ-HR25VF_02.jpg",
    ["Inverter", "R32"],
  ],
  [
    "MITSUBISHI ELECTRIC",
    "EnviroME MSZ-AP",
    "İnce tasarım, yüksek verimlilik odaklı seri.",
    "https://klima.mitsubishielectric.com.tr/Images/1_20190725114235.jpg",
    ["İnce tasarım", "R32"],
  ],
  [
    "BOSCH",
    "Bosch Climate 3000i",
    "Tek oda / küçük alanlar için split klima.",
    "https://www.bosch-homecomfort.com/ocsmedia/optimized/770x99999/o523348v389_Climate_3000i_v4.png",
    ["A++", "Wi‑Fi ops."],
  ],
  [
    "BOSCH",
    "Bosch Climate 4000i",
    "Yaz-kış kullanım için verimli konfor seçeneği.",
    "https://www.bosch-homecomfort.com/ocsmedia/optimized/1180x99999/o554981v389_Climate_4000i_v1.webp",
    ["A++", "Wi‑Fi ops."],
  ],
  [
    "SAMSUNG",
    "Bespoke AI WindFree Pro",
    "Rüzgârsız serinlik ve akıllı kullanım özellikleri.",
    "https://images.samsung.com/is/image/samsung/assets/tr/business/air-conditioners/about-us/2025_hvac-about-us_n01_kv_pc.jpg",
    ["WindFree", "SmartThings"],
  ],
  [
    "SAMSUNG",
    "Bespoke AI WindFree Elite",
    "Üst segment WindFree / AI özellikli seri.",
    "https://images.samsung.com/is/image/samsung/assets/tr/business/air-conditioners/about-us/2025_hvac-about-us_n07_business-area_card-feature1-1_pc.jpg",
    ["WindFree", "AI"],
  ],
  [
    "VESTEL",
    "Vestel Flora Doğa 126",
    "Wi‑Fi’li inverter klima seçeneği.",
    "https://statics.vestel.com.tr/template/46992716-6ef0-4661-9cee-d060c8857809.jpg",
    ["A++", "Wi‑Fi"],
  ],
  [
    "VESTEL",
    "Vestel Flora Doğa Multi",
    "Birden fazla oda için multi split çözüm.",
    "https://statics.vestel.com.tr/productimages/20292603_r1_1000_1000.jpg",
    ["Multi split", "Inverter"],
  ],
];

export const kombiler = [
  [
    "DEMİRDÖKÜM",
    "Demirdöküm Aden",
    "Konut tipi yoğuşmalı kombi. Alanına göre kapasiteyi yerinde netleştiriyoruz.",
    ["Yoğuşmalı", "Konut"],
  ],
  [
    "BAYMAK",
    "Baymak Brötje",
    "Verimli ısıtma için yaygın kullanılan yoğuşmalı seri seçenekleri.",
    ["Yoğuşmalı", "Verimli"],
  ],
  [
    "BOSCH",
    "Bosch Condens",
    "Ev ve küçük iş yerleri için dengeli yoğuşmalı kombi ailesi.",
    ["Yoğuşmalı", "Sessiz"],
  ],
  [
    "VAILLANT",
    "Vaillant ecoTEC",
    "Yüksek verim odaklı yoğuşmalı kombi. Petek ve yerden ısıtma ile uyumlu.",
    ["ecoTEC", "Yerden ısıtma"],
  ],
  [
    "ECA",
    "ECA Proteus Premix",
    "Bütçe dostu premix / yoğuşmalı seçenekler arasından bakıyoruz.",
    ["Premix", "Konut"],
  ],
  [
    "BUDERUS",
    "Buderus Logamax",
    "Dayanıklı kullanım için tercih edilen Logamax ailesi.",
    ["Logamax", "Uzun ömür"],
  ],
];

export function normalizeProductText(value) {
  return value.toLocaleLowerCase("tr").replace(/ı/g, "i").normalize("NFD")
    .replace(/\p{M}/gu, "").replace(/[.'’]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

export function catalogAnchor(category, name) {
  return `${category}-${normalizeProductText(name).replaceAll(" ", "-")}`;
}
