import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "../components/Breadcrumb";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { readCatalog } from "../lib/catalog-store";
import { galleryImageUrl, galleryIntroPhotos, galleryPageSize, galleryPageUrl, galleryPhotos } from "../lib/gallery";
import { pageMetadata } from "../lib/seo";
import { site } from "../lib/site";
import GalleryViewer from "./GalleryViewer";

const path = "/galeri";

async function galleryPage(searchParams) {
  const [{ sayfa }, catalog] = await Promise.all([searchParams, readCatalog()]);
  const photos = catalog.available ? galleryPhotos(catalog) : [];
  const pages = Math.max(1, Math.ceil(photos.length / galleryPageSize));
  if (sayfa !== undefined && (typeof sayfa !== "string" || !/^[1-9]\d*$/.test(sayfa) || Number(sayfa) > pages)) notFound();
  const page = sayfa === undefined ? 1 : Number(sayfa);
  const visible = photos.slice((page - 1) * galleryPageSize, page * galleryPageSize);
  return { page, pages, visible, photos, introIds: catalog.galleryIntroIds, available: catalog.available };
}

export async function generateMetadata({ searchParams }) {
  const { page, visible: [photo] } = await galleryPage(searchParams);
  return pageMetadata({
    path: galleryPageUrl(page),
    title: page === 1 ? "Samsun Isıtma ve Tesisat Projeleri" : `Samsun Isıtma ve Tesisat Projeleri – Sayfa ${page}`,
    description: page === 1
      ? "CL Isıtma’nın Samsun ve Tekkeköy’deki ısıtma, montaj ve tesisat çalışmalarından saha fotoğraflarını inceleyin."
      : `CL Isıtma’nın Samsun ve çevresindeki saha uygulamalarını proje galerisinin ${page}. sayfasında inceleyin.`,
    ...(photo && { image: { url: galleryImageUrl(photo.src, { width: 1200, format: "jpg" }), alt: photo.alt || photo.title } }),
  });
}

export default async function ProjectsPage({ searchParams }) {
  const { page, pages, visible, photos, introIds, available } = await galleryPage(searchParams);
  const introPhotos = galleryIntroPhotos(photos, introIds);
  return (
    <>
      <SiteHeader />
      <main className="projects-page">
        <div className="container">
          <Breadcrumb title={page === 1 ? "Projelerimiz" : `Sayfa ${page}`} path={galleryPageUrl(page)}
            parents={page > 1 ? [{ name: "Projelerimiz", href: path }] : []} />
          <header className={`projects-intro${introPhotos.length ? " has-collage" : ""}`}>
            <div className="projects-intro-copy">
              <p className="home-kicker">Samsun / Tekkeköy</p>
              <h1>Projelerimiz</h1>
              <p>Isıtma, montaj ve tesisat çalışmalarımızdan saha fotoğrafları.</p>
              <Link className="button light" href="/iletisim#iletisim-formu">Ücretsiz keşif iste <span aria-hidden="true">→</span></Link>
            </div>
            {introPhotos.length > 0 && <div className="projects-intro-collage" data-count={introPhotos.length}>
              {introPhotos.map(({ id, src, alt, title }, index) => (
                <div key={id} className="projects-intro-tile">
                  <Image src={src} alt={alt || title} fill loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : undefined}
                    sizes={index === 0
                      ? "(max-width: 700px) 58vw, (max-width: 1208px) 31vw, 344px"
                      : "(max-width: 700px) 28vw, (max-width: 1208px) 15vw, 172px"} />
                </div>
              ))}
            </div>}
          </header>
          <section className="projects-collection" aria-labelledby="project-photos-heading">
            <div className="projects-collection-heading">
              <div>
                <h2 id="project-photos-heading">Saha uygulamalarımız</h2>
                {visible.length > 0 && <p>Yakından bakmak için bir fotoğraf seçin.</p>}
              </div>
              <a className="home-text-link" href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram’da daha fazlası ↗</a>
            </div>
            {visible.length > 0 ? <GalleryViewer photos={visible}>
              {visible.map(({ src, title, alt, description, id }, index) => (
                <figure key={id} id={`ornek-${id}`}>
                  <a href={galleryImageUrl(src, { width: 1600 })} data-photo={index} aria-label={`${title} fotoğrafını büyüt`}>
                    <Image src={src} alt={alt || title} fill
                      sizes="(max-width: 480px) calc(50vw - 24px), (max-width: 760px) calc(50vw - 26px), (max-width: 1050px) 31vw, (max-width: 1208px) 23vw, 278px" />
                    <span className="project-photo-overlay" aria-hidden="true">
                      <span>Fotoğrafı aç <span>↗</span></span>
                    </span>
                  </a>
                  <figcaption>
                    <strong>{title}</strong>
                    {description && <p>{description}</p>}
                  </figcaption>
                </figure>
              ))}
            </GalleryViewer> : <p>{available ? "Galeride henüz fotoğraf yok." : "Galeri fotoğrafları şu anda görüntülenemiyor."}</p>}
            {pages > 1 && <nav className="store-pagination projects-pagination" aria-label="Galeri sayfaları">
              {page > 1 && <Link href={galleryPageUrl(page - 1)} prefetch={false}>← Önceki</Link>}
              {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
                <Link key={number} href={galleryPageUrl(number)} aria-label={`Sayfa ${number}`} prefetch={false}
                  aria-current={number === page ? "page" : undefined}>{number}</Link>
              ))}
              {page < pages && <Link href={galleryPageUrl(page + 1)} prefetch={false}>Sonraki →</Link>}
            </nav>}
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
