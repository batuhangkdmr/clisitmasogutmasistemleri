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
  useHomeScrollReveal(railRef);
  const cards = Children.toArray(children);
  const cardsPerPage = useSyncExternalStore(subscribe, getCardsPerPage, getServerCardsPerPage);
  const [firstCard, setFirstCard] = useState(0);
  const pageCount = Math.ceil(cards.length / cardsPerPage);
  const currentPage = Math.floor(firstCard / cardsPerPage);
  const firstVisibleCard = currentPage * cardsPerPage;

  return (
    <section id={id} className={`home-section home-rail-section home-${id}`} aria-labelledby={`${id}-title`}>
      <div ref={railRef} className="container" data-home-reveal="rail">
        <div className="home-section-head">
          <div>
            <h2 id={`${id}-title`}>{title}</h2>
            <p>{intro}</p>
          </div>
        </div>
        <ul id={`${id}-kartlar`} className="home-rail">
          {cards.slice(firstVisibleCard, firstVisibleCard + cardsPerPage)}
        </ul>
        {pageCount > 1 && (
          <div className="home-rail-pagination" role="group" aria-label={`${title} sayfaları`}>
            {Array.from({ length: pageCount }, (_, page) => (
              <button key={page} type="button" aria-label={`${title}, sayfa ${page + 1}`}
                aria-current={page === currentPage ? "page" : undefined}
                aria-controls={`${id}-kartlar`}
                onClick={() => setFirstCard(page * cardsPerPage)} />
            ))}
          </div>
        )}
        {action}
      </div>
    </section>
  );
}
