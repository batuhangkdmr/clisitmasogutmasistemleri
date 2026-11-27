import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "../../components/Breadcrumb";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import WhatsAppButton from "../../components/WhatsAppButton";
import { cloudinaryAssetUrl, mediaUrl } from "../../lib/cloudinary-loader";
import { pageMetadata } from "../../lib/seo";
import { servicePath, services } from "../../lib/services";
import { site } from "../../lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map(({ slug }) => ({ hizmet: slug }));
}

async function getService(params) {
  const { hizmet } = await params;
  const service = services.find(({ slug }) => slug === hizmet);
  if (!service) notFound();
  return service;
}

export async function generateMetadata({ params }) {
  const service = await getService(params);
  return pageMetadata({
    path: servicePath(service.slug),
    title: service.seoTitle,
    description: service.description,
    image: { url: mediaUrl(service.photo, { width: 1200, format: "jpg" }), alt: service.alt },
  });
}

export default async function ServicePage({ params }) {
  const service = await getService(params);
  const path = servicePath(service.slug);
  const url = new URL(path, site.url).href;
  const phone = site.phones[0];
  const photo = cloudinaryAssetUrl(service.photo);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#hizmet`,
    url,
    name: service.title,
    description: service.description,
    provider: { "@id": `${site.url}/#isletme` },
    areaServed: [
      { "@type": "AdministrativeArea", name: site.address.city },
      { "@type": "AdministrativeArea", name: `${site.address.district}, ${site.address.city}` },
    ],
  };
  return (
    <>
      <SiteHeader />
      <main className="service-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
        <div className="container">
          <Breadcrumb title={service.title} path={path} parents={[{ name: "Hizmetler", href: "/hizmetler" }]} />
          <section className="service-hero">
            <div className="service-hero-copy">
              <p className="home-kicker">{site.address.city} / {site.address.district}</p>
              <h1>{service.title}</h1>
              <p>{service.summary}</p>
              <div className="service-actions">
                <Link href="/iletisim#iletisim-formu" className="button primary">
                  Ücretsiz keşif iste <span aria-hidden="true">→</span>
                </Link>
                <a href={`tel:${phone.tel}`} className="home-text-link">{phone.display}</a>
              </div>
            </div>
            {photo && (
              <div className="service-hero-photo">
                <Image src={service.photo} alt={service.alt} fill preload
                  sizes="(max-width: 760px) 94vw, (max-width: 1250px) 45vw, 540px"
                  style={{ objectPosition: service.position }} />
              </div>
            )}
          </section>
          <div className="service-details">
            <section>
              <h2>Hizmet kapsamı</h2>
              <p>{service.scope}</p>
              <Link href="/galeri" className="home-text-link">Saha uygulamalarımıza göz at <span aria-hidden="true">→</span></Link>
            </section>
            <section>
              <h2>Keşif öncesi neleri paylaşabilirsiniz?</h2>
              <p>{service.visit}</p>
              <ul>
                {service.links.map(([label, href]) => <li key={href}><Link className="home-text-link" href={href}>{label} <span aria-hidden="true">→</span></Link></li>)}
              </ul>
            </section>
          </div>
          <section className="service-faq" aria-labelledby="service-faq-heading">
            <h2 id="service-faq-heading">Sık sorulan sorular</h2>
            <div>{service.faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}</div>
          </section>
          <nav className="service-more" aria-labelledby="service-more-heading">
            <div className="service-more-heading">
              <h2 id="service-more-heading">Diğer hizmetlerimiz</h2>
              <Link href="/hizmetler" className="home-text-link">Tüm hizmetler <span aria-hidden="true">↗</span></Link>
            </div>
            <ul className="service-more-grid">
              {services.filter(({ slug }) => slug !== service.slug).map(({ slug, title, photo, position }) => (
                <li key={slug}>
                  <Link href={servicePath(slug)} className="service-more-card">
                    {cloudinaryAssetUrl(photo) && (
                      <div className="service-more-photo">
                        <Image src={photo} alt="" fill sizes="(max-width: 640px) 44vw, (max-width: 1000px) 30vw, 365px"
                          style={{ objectPosition: position }} />
                      </div>
                    )}
                    <span className="service-more-card-label">
                      <strong>{title}</strong>
                      <span className="service-more-arrow" aria-hidden="true">↗</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>
      <SiteFooter />
      <WhatsAppButton showPhone />
    </>
  );
}
