"use client";

import { Children, useRef, useState, useSyncExternalStore } from "react";
import { useHomeScrollReveal } from "./HomeScrollReveal";

const mobileQuery = "(max-width: 700px)";

function subscribe(callback) {
  const media = window.matchMedia(mobileQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getCardsPerPage() {
  return window.matchMedia(mobileQuery).matches ? 2 : 4;
}

function getServerCardsPerPage() {
  return 4;
}

export default function CardRail({ id, title, intro, children, action }) {
  const railRef = useRef(null);
  const touchStart = useRef(null);
  useHomeScrollReveal(railRef);
  const cards = Children.toArray(children);
  const cardsPerPage = useSyncExternalStore(subscribe, getCardsPerPage, getServerCardsPerPage);
  const [firstCard, setFirstCard] = useState(0);
  const pageCount = Math.ceil(cards.length / cardsPerPage);
  const currentPage = Math.min(Math.floor(firstCard / cardsPerPage), Math.max(0, pageCount - 1));
  const firstVisibleCard = currentPage * cardsPerPage;
  const isMobile = cardsPerPage === 2;

  function move(offset) {
    const next = currentPage + offset;
    if (next >= 0 && next < pageCount) setFirstCard(next * cardsPerPage);
  }

  return (
    <section id={id} className={`home-section home-rail-section home-${id}`} aria-labelledby={`${id}-title`}>
      <div ref={railRef} className="container" data-home-reveal="rail">
        <div className="home-section-head">
          <div>
            <h2 id={`${id}-title`}>{title}</h2>
            <p>{intro}</p>
          </div>
        </div>
        <ul id={`${id}-kartlar`} className="home-rail"
          onTouchStart={(event) => {
            const touch = event.touches[0];
            touchStart.current = isMobile && event.touches.length === 1 && pageCount > 1
              ? { x: touch.clientX, y: touch.clientY } : null;
          }}
          onTouchCancel={() => { touchStart.current = null; }}
          onTouchEnd={(event) => {
            const start = touchStart.current;
            touchStart.current = null;
            if (!start || event.touches.length) return;
            const touch = event.changedTouches[0];
            const dx = touch.clientX - start.x;
            const dy = touch.clientY - start.y;
            if (Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(dy) * 1.4) move(dx < 0 ? 1 : -1);
          }}>
          {cards.slice(firstVisibleCard, firstVisibleCard + cardsPerPage)}
        </ul>
        {pageCount > 1 && (isMobile ? (
          <div className="home-rail-mobile-pagination" role="group" aria-label={`${title} sayfaları`}>
            <button type="button" aria-controls={`${id}-kartlar`} disabled={currentPage === 0}
              onClick={() => move(-1)}><span aria-hidden="true">‹</span> Önceki</button>
            <span className="home-rail-page-count" role="status" aria-label={`${pageCount} sayfadan ${currentPage + 1}. sayfa`}>
              {currentPage + 1} / {pageCount}
            </span>
            <button type="button" aria-controls={`${id}-kartlar`} disabled={currentPage === pageCount - 1}
              onClick={() => move(1)}>Sonraki <span aria-hidden="true">›</span></button>
          </div>
        ) : (
          <div className="home-rail-pagination" role="group" aria-label={`${title} sayfaları`}>
            {Array.from({ length: pageCount }, (_, page) => (
              <button key={page} type="button" aria-label={`${title}, sayfa ${page + 1}`}
                aria-current={page === currentPage ? "page" : undefined}
                aria-controls={`${id}-kartlar`}
                onClick={() => setFirstCard(page * cardsPerPage)} />
            ))}
          </div>
        ))}
        {action}
      </div>
    </section>
  );
}
