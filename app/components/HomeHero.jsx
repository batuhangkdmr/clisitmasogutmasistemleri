"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useState } from "react";

const { props: { srcSet: desktopBoilerSrcSet } } = getImageProps({
  src: "/assets/hero-kombi-desktop.webp",
  alt: "",
  fill: true,
  sizes: "100vw",
});

export default function HomeHero({ slides, eyebrow }) {
  const [carousel, setCarousel] = useState({ index: 0, direction: 0, pending: null, ready: [], failed: [] });
  const { index, direction, pending, ready, failed } = carousel;
  const firstSettled = ready.includes(0) || failed.includes(0);
  const next = nextSlide(index, 1, failed, slides.length);

  useEffect(() => {
    if (!firstSettled || pending || next === index) return;
    const timer = window.setTimeout(() => setCarousel((current) => requestSlide(current, next, 1)), 3000);
    return () => window.clearTimeout(timer);
  }, [firstSettled, index, next, pending]);

  function move(offset) {
    setCarousel((current) => {
      const from = current.pending?.index ?? current.index;
      return requestSlide(current, nextSlide(from, offset, current.failed, slides.length), offset);
    });
  }

  function settle(position, loaded) {
    setCarousel((current) => {
      if (current.ready.includes(position) || current.failed.includes(position)) return current;
      const field = loaded ? "ready" : "failed";
      const updated = { ...current, [field]: [...current[field], position] };
      if (current.pending?.index !== position) return updated;
      return loaded ? { ...updated, ...current.pending, pending: null } : { ...updated, pending: null };
    });
  }

  function handleKey(event) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const offset = event.key === "ArrowRight" ? 1 : -1;
    const target = nextSlide(pending?.index ?? index, offset, failed, slides.length);
    move(offset);
    event.currentTarget.querySelectorAll(".home-slider-line")[target]?.focus();
  }

  return (
    <section className="home-hero" id="ana-sayfa" aria-labelledby="home-hero-title">
      <div className="home-hero-visual">
        {slides.map(({ id, image, alt, objectPosition }, position) => {
          const shouldLoad = position === 0 || position === index || ready.includes(position) ||
            position === pending?.index || (firstSettled && !pending && position === next);
          if (!shouldLoad) return null;
          const imageProps = {
            src: image,
            alt: position === index ? alt : "",
            fill: true,
            sizes: "100vw",
            loading: "eager",
            fetchPriority: position === 0 ? "high" : pending?.index === position ? "auto" : "low",
            className: "home-hero-photo",
            style: { objectPosition },
            "data-active": position === index,
            "data-direction": position === index ? direction : 0,
          };
          if (id === "kombi" && image === "/assets/hero-kombi.webp") {
            return (
              <picture key={id} className="home-hero-boiler">
                <source media="(min-width: 801px)" srcSet={desktopBoilerSrcSet} sizes="100vw" />
                <img {...getImageProps(imageProps).props} onLoad={() => settle(position, true)} onError={() => settle(position, false)} />
              </picture>
            );
          }
          return (
            <Image key={id} {...imageProps}
              onLoad={() => settle(position, true)} onError={() => settle(position, false)} />
          );
        })}
      </div>
      <div className="container home-hero-inner">
        <p className="home-kicker">{eyebrow}</p>
        <h1 id="home-hero-title" className="home-hero-copy-stack">
          {slides.map(({ id, title }, position) => (
            <span key={id} data-active={position === index}>{title}</span>
          ))}
        </h1>
        <p className="home-hero-summary home-hero-copy-stack">
          {slides.map(({ id, description }, position) => (
            <span key={id} data-active={position === index}>{description}</span>
          ))}
        </p>
        <div className="home-actions">
          <a className="button primary" href="#iletisim">Ücretsiz keşif iste <span aria-hidden="true">→</span></a>
          <a className="home-hero-link" href="#hizmetler">Çözümleri incele</a>
        </div>
      </div>
      <button className="home-hero-arrow home-hero-prev" type="button" aria-label="Önceki slayt" onClick={() => move(-1)}>&lt;</button>
      <button className="home-hero-arrow home-hero-next" type="button" aria-label="Sonraki slayt" onClick={() => move(1)}>&gt;</button>
      <div className="home-slider-controls" role="group" aria-label="Slayt görselleri" onKeyDown={handleKey}>
        {slides.map(({ id, title }, position) => (
          <button key={id} type="button" className="home-slider-line" aria-label={title}
            aria-current={index === position ? "true" : undefined}
            onClick={() => setCarousel((current) => requestSlide(current, position, Math.sign(position - current.index)))} />
        ))}
      </div>
    </section>
  );
}

function nextSlide(index, direction, failed, count) {
  for (let step = 1; step < count; step++) {
    const position = (index + direction * step + count) % count;
    if (!failed.includes(position)) return position;
  }
  return index;
}

function requestSlide(current, index, direction) {
  if (current.failed.includes(index)) return current;
  if (index === current.index || current.ready.includes(index)) {
    return { ...current, index, direction, pending: null };
  }
  return { ...current, pending: { index, direction } };
}
