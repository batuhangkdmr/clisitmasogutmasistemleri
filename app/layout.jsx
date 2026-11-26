import { Plus_Jakarta_Sans } from "next/font/google";
import { site } from "./lib/site";
import "../style.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: "CL Isıtma Sistemleri | Tekkeköy, Samsun", template: "%s | CL Isıtma" },
  description:
    "Tekkeköy / Samsun’da klima, ısı pompası, doğalgaz, kombi, sıhhi tesisat ve petek temizliği. Ücretsiz keşif.",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    title: "CL Isıtma Sistemleri | Tekkeköy, Samsun",
    description: "Klima, doğalgaz, kombi ve tesisat. Yerinde keşif, net fiyat.",
    images: [{ url: "/assets/cl-hero.webp", alt: "Duvar tipi klima üzerinde çalışan teknisyen" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CL Isıtma Sistemleri | Tekkeköy, Samsun",
    description: "Samsun’da klima, kombi, ısı pompası ve tesisat. Ücretsiz yerinde keşif.",
    images: ["/assets/cl-hero.webp"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  const business = {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    "@id": `${site.url}/#isletme`,
    name: site.name,
    url: site.url,
    email: site.email,
    image: [`${site.url}/assets/cl-logo.png`, `${site.url}/assets/cl-hero.webp`],
    telephone: site.phones[0].tel,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.line,
      addressLocality: site.address.district,
      addressRegion: site.address.city,
      addressCountry: "TR",
    },
    areaServed: { "@type": "AdministrativeArea", name: "Samsun" },
    sameAs: [site.instagram],
    description:
      "Klima, ısı pompası, kombi, doğalgaz, sıhhi tesisat ve petek temizliği hizmetleri. Tekkeköy / Samsun.",
  };

  return (
    <html lang="tr" className={sans.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(business).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
