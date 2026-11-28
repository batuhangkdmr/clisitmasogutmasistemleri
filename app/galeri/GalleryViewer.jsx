"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export default function GalleryViewer({ photos, children }) {
  const dialog = useRef(null);
  const touchStart = useRef(null);
  const [active, setActive] = useState(null);

  function openPhoto(event) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest("a[data-photo]");
    if (!link || !dialog.current?.showModal) return;
    event.preventDefault();
    setActive(Number(link.dataset.photo));
    dialog.current.showModal();
  }

  function move(offset) {
    setActive((index) => (index + offset + photos.length) % photos.length);
  }

  const photo = active === null ? null : photos[active];
  const thumbCount = Math.min(5, photos.length);
  const thumbStart = Math.max(0, Math.min((active ?? 0) - 2, photos.length - thumbCount));
  return (
    <>
      <div className="project-gallery-grid" onClick={openPhoto}>{children}</div>
      <dialog ref={dialog} className="project-photo-dialog" aria-label="Saha fotoğrafı"
        onClose={() => setActive(null)} onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current.close();
        }}
        onKeyDown={(event) => {
          if (active === null || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
          event.preventDefault();
          move(event.key === "ArrowLeft" ? -1 : 1);
        }}>
        <div className="project-dialog-content">
          <div className="project-dialog-toolbar">
            <div className="project-dialog-caption">
              <strong>{photo?.title}</strong>
              {photo?.description && <p>{photo.description}</p>}
            </div>
            <div className="project-dialog-toolbar-actions">
              {photo && <span className="project-dialog-count" aria-live="polite"
                aria-label={`${photos.length} fotoğraftan ${active + 1}. fotoğraf`}>
                {active + 1} <span>/ {photos.length}</span>
              </span>}
              <button type="button" className="project-dialog-close" aria-label="Fotoğrafı kapat" onClick={() => dialog.current.close()} autoFocus>×</button>
            </div>
          </div>
          {photo && <div className="project-dialog-photo"
            onTouchStart={(event) => {
              touchStart.current = event.touches.length === 1 ? event.touches[0] : null;
            }}
            onTouchCancel={() => { touchStart.current = null; }}
            onTouchEnd={(event) => {
              const start = touchStart.current;
              touchStart.current = null;
              if (!start || photos.length < 2 || event.touches.length) return;
              const end = event.changedTouches[0];
              const distance = end.clientX - start.clientX;
              if (Math.abs(distance) > 45 && Math.abs(distance) > Math.abs(end.clientY - start.clientY)) {
                move(distance < 0 ? 1 : -1);
              }
            }}>
            <Image key={photo.src} src={photo.src} alt={photo.alt || photo.title} width={940} height={705} loading="eager"
              sizes="(max-width: 820px) min(620px, calc(100vw - 32px)), (max-width: 1012px) calc(100vw - 72px), 940px" />
          </div>}
          {photo && photos.length > 1 && <div className="project-dialog-footer">
            <button type="button" className="project-dialog-arrow" aria-label="Önceki fotoğraf" onClick={() => move(-1)}>‹</button>
            <div className="project-dialog-thumbs" role="group" aria-label="Yakındaki fotoğraflar">
              {photos.slice(thumbStart, thumbStart + thumbCount).map((item, index) => {
                const position = thumbStart + index;
                return <button key={item.id} type="button" className="project-dialog-thumb"
                  aria-label={`${position + 1}. fotoğrafı göster`} aria-current={position === active ? "true" : undefined}
                  onClick={() => setActive(position)}>
                  <Image src={item.src} alt="" fill sizes="56px" />
                </button>;
              })}
            </div>
            <button type="button" className="project-dialog-arrow" aria-label="Sonraki fotoğraf" onClick={() => move(1)}>›</button>
            <div className="project-dialog-mobile-previews" role="group" aria-label="Yakındaki fotoğraflar">
              {(photos.length === 2 ? [1] : [-1, 1]).map((offset) => {
                const item = photos[(active + offset + photos.length) % photos.length];
                const direction = offset === -1 ? "Önceki" : "Sonraki";
                return <button key={offset} type="button" className="project-dialog-thumb"
                  aria-label={`${direction} fotoğraf: ${item.title}`} onClick={() => move(offset)}>
                  <Image src={item.src} alt="" fill sizes="88px" />
                </button>;
              })}
            </div>
          </div>}
        </div>
      </dialog>
    </>
  );
}
