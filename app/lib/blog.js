const initialPosts = [
  {
    slug: "petekler-esit-isinmiyorsa", title: "Petekler eşit ısınmıyorsa neye bakılır?",
    dateLabel: "Mart 2026", serviceSlug: "petek-temizligi",
    summary: "Bazı petekler soğuk kalıyorsa temizlik kararından önce vana, dolaşım ve tıkanıklık olasılıkları değerlendirilir.",
    body: "## Belirtileri ayırt edin\n\nHangi odalarda sorun olduğunu, peteğin tamamının mı yoksa bir kısmının mı soğuk kaldığını not edin. Sorunun bütün tesisatı mı yoksa birkaç peteği mi etkilediği, keşif sırasında neye bakılacağını belirlemeye yardımcı olur.\n\n## Temizlik ne zaman değerlendirilir?\n\nDüzensiz ısınma, hava veya vana sorunundan da kaynaklanabilir. Yerinde kontrolde şikâyetin kaynağı değerlendirilir ve temizlik gerekip gerekmediği konuşulur.",
    cover: { src: "/assets/hizmet-petek-temizligi.webp", alt: "Petek temizliğinde kullanılan hortum ve ekipman" },
  },
  {
    slug: "klima-kapasitesi-nasil-secilir", title: "Klima kapasitesi nasıl seçilir?",
    dateLabel: "Şubat 2026", serviceSlug: "klima-isi-pompasi",
    summary: "Klima kapasitesi için metrekarenin yanı sıra odanın güneş alması, yalıtımı ve kullanım biçimi de değerlendirilir.",
    body: "## Odanın özelliklerini paylaşın\n\nKlimanın kullanılacağı odanın alanı, tavan yüksekliği, pencereler ve güneş alış biçimi kapasite değerlendirmesine yardımcı olur. Özellikle büyük cam yüzeyler veya yoğun kullanım, aynı büyüklükteki iki odanın ihtiyacını farklılaştırabilir.\n\n## Montaj yerini de planlayın\n\nİç ve dış ünitenin konumu ile bağlantı güzergâhı keşifte değerlendirilir. Ürün seçimi yapılırken kapasite ve montaj koşullarını birlikte ele almak daha doğru bir karşılaştırma sağlar.",
    cover: { src: "/assets/hero-klima-hd.webp", alt: "Duvar tipi klima ünitesinin montajı" },
  },
  {
    slug: "kombi-degisiminde-nelere-dikkat-edilir", title: "Kombi değişiminde nelere dikkat edilir?",
    dateLabel: "Ocak 2026", serviceSlug: "dogalgaz-kombi",
    summary: "Kombi değişiminde mevcut tesisat, sıcak su ihtiyacı ve yeni cihazın bağlantı koşulları birlikte değerlendirilir.",
    body: "## Yeni modeli seçmeden önce\n\nMevcut cihazın modelini ve sıcak su kullanım alışkanlıklarınızı paylaşın. Yeni kombinin kapasitesi ısıtılan alan, petekler ve sıcak su ihtiyacıyla birlikte değerlendirilir.\n\n## Montaj kapsamını netleştirin\n\nCihaz konumu, baca ve yoğuşma gideri koşulları keşifte kontrol edilir. Yetkili servis veya dağıtım şirketi işlemleri gerekiyorsa bunların kapsamını teklif aşamasında sorun.",
    cover: { src: "/assets/hero-kombi-desktop.webp", alt: "Mutfakta duvara monte edilmiş kombi" },
  },
  {
    slug: "kis-oncesi-isitma-kontrol-listesi", title: "Kış öncesi ısıtma kontrol listesi",
    dateLabel: "Aralık 2025", serviceSlug: "petek-temizligi",
    summary: "Isıtma sezonundan önce peteklerin durumunu gözden geçirin ve profesyonel kontrol gerektiren belirtileri not edin.",
    body: "## Isınma farklarını not edin\n\nIsıtma çalışırken odalar arasındaki belirgin farklara, soğuk kalan peteklere ve görünür sızıntılara dikkat edin. Yaşadığınız sorunu ve ne zamandır sürdüğünü paylaşmanız değerlendirmeyi kolaylaştırır.\n\n## Hangi hizmete ihtiyacınız var?\n\nCL Isıtma’nın bakım hizmeti petek temizliğidir. Kombi bakımına veya cihaz arızasına ilişkin işlemler için üreticinin yetkili servis kanallarını kontrol edin.",
    cover: { src: "/galeri/WhatsApp%20Image%202026-11-25%20at%2019.23.03%20(2).jpeg", alt: "Isıtma tesisatında sirkülasyon pompası, göstergeler ve bağlantı boruları" },
  },
].map((post) => ({ ...post, id: post.slug, status: "published" }));

export const blogPath = (slug) => `/blog/${slug}`;

export function blogPosts(catalog) {
  return catalog.blogPosts ?? initialPosts;
}

export function orderedBlogPosts(catalog) {
  const positions = new Map((catalog.blogOrder ?? []).map((id, index) => [id, index]));
  return [...blogPosts(catalog)].sort((a, b) =>
    (positions.get(a.id) ?? -1) - (positions.get(b.id) ?? -1) ||
    (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}

export function publishedBlogPosts(catalog) {
  return orderedBlogPosts(catalog).filter(({ status }) => status === "published");
}

export function blogDate(post) {
  if (!post.publishedAt) return post.dateLabel ?? "";
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "long", timeZone: "Europe/Istanbul" })
    .format(new Date(post.publishedAt));
}
