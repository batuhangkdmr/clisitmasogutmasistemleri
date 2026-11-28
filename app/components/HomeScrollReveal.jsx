"use client";

import { useEffect } from "react";

export function useHomeScrollReveal(railRef) {
  useEffect(() => {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rail = railRef?.current;
    if (railRef && !rail) return;

    const observer = new window.IntersectionObserver((entries) => {
      for (const { isIntersecting, target } of entries) {
        if (!isIntersecting) continue;
        target.dataset.homeRevealItem = "visible";
        observer.unobserve(target);
      }
    }, { rootMargin: "0px 0px -12px 0px", threshold: 0 });

    const observed = new WeakSet();
    function watchSections() {
      const sections = rail ? [rail] : document.querySelectorAll('[data-home-reveal="pending"]');
      for (const section of sections) {
        for (const child of section.children) {
          const elements = child.matches(".home-rail, .home-solutions-grid, .home-process-steps")
            ? child.children : [child];
          for (const element of elements) {
            if (observed.has(element)) continue;
            observed.add(element);
            observer.observe(element);
          }
        }
      }
    }
    watchSections();
    // Streamed rails must register only after their own hydration.
    const updates = rail ? new window.MutationObserver(watchSections) : null;
    updates?.observe(rail, { childList: true, subtree: true });
    return () => {
      updates?.disconnect();
      observer.disconnect();
    };
  }, [railRef]);
}

export default function HomeScrollReveal() {
  useHomeScrollReveal();
  return null;
}
