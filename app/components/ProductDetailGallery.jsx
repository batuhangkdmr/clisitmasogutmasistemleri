"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductDetailGallery({ images }) {
  const [selected, setSelected] = useState(0);
  const image = images[selected];

  return (
    <div className="store-gallery">
      <div className="store-detail-image">
        {image ? (
          <Image src={image.url} alt={image.alt} fill sizes="(max-width: 800px) 94vw, (max-width: 1450px) 46vw, 690px"
            loading="eager" unoptimized={image.placeholder} />
        ) : <p>Ürün görseli hazırlanıyor.</p>}
      </div>
      {images.length > 1 && (
        <div className="store-detail-thumbnails" role="group" aria-label="Ürün görselleri">
          {images.map((item, index) => (
            <button key={item.id} type="button" onClick={() => setSelected(index)}
              aria-pressed={index === selected} aria-label={`${index + 1}. ürün görselini göster`}>
              <Image src={item.url} alt="" fill sizes="72px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
