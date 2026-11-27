"use client";

import { useRef, useState } from "react";

export default function CatalogCardGallery({ label, count, children }) {
  const track = useRef(null);
  const [active, setActive] = useState(0);

  function move(direction) {
    const element = track.current;
    const next = Math.max(0, Math.min(count - 1, active + direction));
    element.scrollTo({ left: next * element.clientWidth });
  }

  return (
    <div className="store-card-photo store-card-gallery" role="group" aria-label={label}>
      <div ref={track} className="store-card-track" onScroll={(event) => {
        const { scrollLeft, clientWidth } = event.currentTarget;
        if (clientWidth) setActive(Math.max(0, Math.min(count - 1, Math.round(scrollLeft / clientWidth))));
      }}>
        {children}
      </div>
      <button type="button" className="store-card-prev" aria-label="Önceki ürün görseli"
        disabled={active === 0} onClick={() => move(-1)}>‹</button>
      <button type="button" className="store-card-next" aria-label="Sonraki ürün görseli"
        disabled={active === count - 1} onClick={() => move(1)}>›</button>
      <span className="store-card-image-count" aria-live="polite">{active + 1} / {count}</span>
    </div>
  );
}
