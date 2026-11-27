import Image from "next/image";
import Link from "next/link";
import { productPath } from "../lib/catalog-view";
import { productImages } from "../lib/product-images";
import CatalogCardGallery from "./CatalogCardGallery";

const imageSizes = "(max-width: 600px) 46vw, (max-width: 850px) 31vw, (max-width: 1170px) 24vw, (max-width: 1460px) 18vw, 260px";

export default function CatalogCard({ product }) {
  const images = productImages(product);
  const [cover] = images;
  const href = productPath(product);
  return (
    <article className="store-card">
      {images.length > 1 && (
        <CatalogCardGallery label={`${product.name} görselleri`} count={images.length}>
          {images.map((image) => (
            <Link key={image.id} href={href} className="store-card-slide" tabIndex={-1} prefetch={false}>
              <Image src={image.url} alt={image.alt} fill sizes={imageSizes} />
            </Link>
          ))}
        </CatalogCardGallery>
      )}
      <Link href={href} className="store-card-link" prefetch={false}>
        {images.length < 2 && (
          <div className="store-card-photo">
            {cover ? <Image src={cover.url} alt={cover.alt} fill unoptimized={cover.placeholder} sizes={imageSizes} />
              : <span>Ürün görseli hazırlanıyor</span>}
          </div>
        )}
        <div className="store-card-body">
          <p className="home-kicker">{product.brand}</p>
          <h3>{product.name}</h3>
          <p className="store-muted">{product.model}</p>
          {!!product.specs.length && <p className="store-card-spec">{product.specs[0].value}</p>}
          <span className="catalog-card-action">Ürünü incele <span aria-hidden="true">↗</span></span>
        </div>
      </Link>
    </article>
  );
}
