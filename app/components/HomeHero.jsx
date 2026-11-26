"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useState } from "react";

const slides = [
  ["klima-hd", "Klima satışı ve montajı", "Evinize veya iş yerinize uygun kapasiteyi ve marka seçeneklerini ücretsiz keşifte belirleyelim.", "Duvar tipi klima iç ünitesini monte eden teknisyen", "63% 30%"],
  ["kombi", "Kombi ve doğalgaz", "Isınma ve sıcak su ihtiyacınıza uygun kombiyi seçelim, doğalgaz tesisatını ve montajı planlayalım.", "Mutfakta duvara monte edilmiş kombi"],
  ["isi-pompasi-hd", "Isı pompası sistemleri", "Yazın soğutma, kışın ısıtma için mekânınıza uygun ısı pompasını birlikte seçelim.", "Evin dış cephesine kurulmuş hava kaynaklı ısı pompası", "54% 58%"],
  ["yerden-isitma-hd", "Yerden ısıtma", "Yeni yapınız ya da tadilatınız için zeminden ısıtma sistemini yerinde değerlendirelim.", "Döşeme kapatılmadan önce zemine serilmiş kırmızı ısıtma boruları", "62% 62%"],
  ["gunes-enerjisi-hd", "Güneş enerjisi", "Sıcak su ihtiyacınız için binanıza uygun güneş enerjisi sistemi seçeneklerini değerlendirelim.", "Kiremit çatıda sıcak su için kullanılan güneş kolektörleri", "68% 58%"],
];

const { props: { srcSet: desktopBoilerSrcSet } } = getImageProps({
  src: "/assets/hero-kombi-desktop.webp",
  alt: "",
  fill: true,
  sizes: "100vw",
});

export default function HomeHero() {
  const [{ index, direction }, setSlide] = useState({ index: 0, direction: 0 });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSlide((current) => ({ index: (current.index + 1) % slides.length, direction: 1 }));
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [index]);

  function move(offset) {
    setSlide((current) => ({
      index: (current.index + offset + slides.length) % slides.length,
      direction: offset,
    }));
  }

  function handleKey(event) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const offset = event.key === "ArrowRight" ? 1 : -1;
    const next = (index + offset + slides.length) % slides.length;
    move(offset);
    event.currentTarget.querySelectorAll(".home-slider-line")[next]?.focus();
  }

  return (
    <section className="home-hero" id="ana-sayfa" aria-labelledby="home-hero-title">
      <div className="home-hero-visual">
        {slides.map(([id, , , alt, objectPosition], position) => {
          const imageProps = {
            src: `/assets/hero-${id}.webp`,
            alt: position === index ? alt : "",
            fill: true,
            sizes: "100vw",
            loading: "eager",
            fetchPriority: position === 0 ? "high" : "low",
            className: "home-hero-photo",
            style: { objectPosition },
            "data-active": position === index,
            "data-direction": position === index ? direction : 0,
          };
          if (id === "kombi") {
            return (
              <picture key={id} className="home-hero-boiler">
                <source media="(min-width: 801px)" srcSet={desktopBoilerSrcSet} sizes="100vw" />
                <img {...getImageProps(imageProps).props} />
              </picture>
            );
          }
          return <Image key={id} {...imageProps} />;
        })}
      </div>
      <div className="container home-hero-inner">
        <p className="home-kicker">CL Isıtma ve Soğutma Sistemleri</p>
        <h1 id="home-hero-title" className="home-hero-copy-stack">
          {slides.map(([id, title], position) => (
            <span key={id} data-active={position === index}>{title}</span>
          ))}
        </h1>
        <p className="home-hero-summary home-hero-copy-stack">
          {slides.map(([id, , description], position) => (
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
        {slides.map(([id, title], position) => (
          <button key={id} type="button" className="home-slider-line" aria-label={title}
            aria-current={index === position ? "true" : undefined}
            onClick={() => setSlide({ index: position, direction: Math.sign(position - index) })} />
        ))}
      </div>
    </section>
  );
}
