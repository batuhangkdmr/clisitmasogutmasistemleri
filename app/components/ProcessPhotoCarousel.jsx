"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProcessPhotoCarousel({ photos }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (photos.length < 2) return;
    const timer = window.setTimeout(() => setActive((index) => (index + 1) % photos.length), 3000);
    return () => window.clearTimeout(timer);
  }, [active, photos.length]);

  return (
    <figure className="service-hero-photo process-hero-photo" aria-label="Saha uygulamalarımızdan fotoğraflar">
      {photos.map(({ src, alt }, index) => (
        <Image key={src} src={src} alt={index === active ? alt : ""} aria-hidden={index !== active}
          data-active={index === active} className="process-carousel-image" fill
          sizes="(max-width: 760px) 94vw, (max-width: 1250px) 45vw, 550px"
          preload={index === 0} fetchPriority={index === 0 ? undefined : "low"} />
      ))}
      <figcaption>Saha uygulamalarımızdan</figcaption>
      {photos.length > 1 && (
        <div className="process-carousel-controls" role="group" aria-label="Fotoğraf seçimi">
          {photos.map(({ src, alt }, index) => (
            <button key={src} type="button" className="process-carousel-indicator" aria-label={alt}
              aria-current={index === active ? "true" : undefined} onClick={() => setActive(index)} />
          ))}
        </div>
      )}
    </figure>
  );
}
