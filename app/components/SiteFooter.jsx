import Image from "next/image";
import Link from "next/link";
import { site } from "../lib/site";
import { servicePath, services } from "../lib/services";

const mapLinks = [
  ["/", "Ana Sayfa"],
  ["/hizmetler", "Hizmetler"],
  ["/urunler", "Ürünlerimiz"],
  ["/galeri", "Projelerimiz"],
  ["/#hizmet-bolgelerimiz", "Hizmet Bölgelerimiz"],
];
const solutionLinks = services.map(({ slug, title }) => [servicePath(slug), title]);
const corporateLinks = [
  ["/kurumsal", "Hakkımızda"],
  ["/urunler?q=klima", "Klimalar"],
  ["/urunler?q=kombi", "Kombiler"],
  ["/#sss", "Sık Sorulan Sorular"],
  ["/nasil-calisiyoruz", "Nasıl çalışıyoruz?"],
  ["/iletisim", "İletişim"],
  ["/kvkk-aydinlatma-metni", "KVKK"],
  ["/gizlilik-politikasi", "Gizlilik Politikası"],
  ["/cerez-politikasi", "Çerez Politikası"],
];

const List = ({ title, links }) => (
  <nav className="footer-links" aria-label={title}>
    <b>{title}</b>
    {links.map(([href, label]) => (
      <Link key={label} href={href}>
        {label}
      </Link>
    ))}
  </nav>
);

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <section className="footer-brand">
          <Link className="logo logo-mark logo-footer" href="/" aria-label="CL Isıtma Sistemleri ana sayfa">
            <Image src="/assets/cl-logo-transparent.png" alt="" width={124} height={115} />
            <Image className="logo-footer-lettering" src="/assets/cl-logo-transparent.png" alt="" width={124} height={115} />
          </Link>
          <p>
            Samsun / Tekkeköy’de iklimlendirme, ısıtma ve tesisat. Ücretsiz keşif, ürün satışı, montaj ve petek temizliği.
          </p>
          <p className="footer-address">{site.address.full}</p>
          {site.phones.map((phone) => (
            <a className="footer-phone" key={phone.tel} href={`tel:${phone.tel}`}>
              {phone.display}
            </a>
          ))}
          <a className="footer-phone" href={`mailto:${site.email}`}>{site.email}</a>
          <a className="footer-instagram" href={site.instagram} target="_blank" rel="noopener noreferrer">
            Instagram <b>↗</b>
          </a>
        </section>
        <List title="Sayfalar" links={mapLinks} />
        <List title="Hizmetler" links={solutionLinks} />
        <List title="Kurumsal" links={corporateLinks} />
        <section className="footer-cta">
          <h2>Ücretsiz yerinde keşif</h2>
          <p>Adresinizi ve ihtiyacınızı paylaşın, ürün ve uygulama seçeneklerini birlikte değerlendirelim.</p>
          <a href="/#iletisim">
            Keşif iste <b>→</b>
          </a>
        </section>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 {site.name}</span>
        <a className="bcy-credit" href="https://bariscanyonel.com" target="_blank" rel="noopener noreferrer">
          Media: <strong>BCY DİJİTAL</strong> <i>↗</i>
        </a>
        <span>
          {site.address.district}, {site.address.city}
        </span>
      </div>
    </footer>
  );
}
