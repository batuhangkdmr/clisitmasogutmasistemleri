"use client";

import { useEffect } from "react";

export default function HomeScrollReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new window.IntersectionObserver((entries) => {
      for (const { isIntersecting, target } of entries) {
        if (!isIntersecting) continue;
        target.dataset.homeRevealItem = "visible";
        observer.unobserve(target);
      }
    }, { rootMargin: "0px 0px -12px 0px", threshold: 0 });

    for (const section of document.querySelectorAll("[data-home-reveal]")) {
      for (const child of section.children) {
        if (child.matches(".home-rail, .home-solutions-grid, .home-process-steps")) {
          for (const item of child.children) observer.observe(item);
        } else {
          observer.observe(child);
        }
      }
    }
    return () => observer.disconnect();
  }, []);

  return null;
}
