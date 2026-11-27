"use client";

import { useEffect, useState } from "react";
import { site } from "../lib/site";

export default function WhatsAppButton({ showPhone = false }) {
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(max-width: 700px)").matches) return;
    const timer = window.setTimeout(() => setShowHint(true), 5000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="home-whatsapp">
      {showPhone && (
        <a className="service-sticky-phone" href={`tel:${site.phones[0].tel}`} aria-label={`Telefonla arayın: ${site.phones[0].display}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 3H4.5A1.5 1.5 0 0 0 3 4.5 16.5 16.5 0 0 0 19.5 21a1.5 1.5 0 0 0 1.5-1.5V17l-5-2-1.5 2a12 12 0 0 1-7.5-7.5L9 8 7 3Z" />
          </svg>
        </a>
      )}
      {showHint && (
        <div className="home-whatsapp-hint">
          <span role="status">WhatsApp ile iletişime geçin</span>
          <button type="button" aria-label="WhatsApp ipucunu kapat" onClick={() => setShowHint(false)}>×</button>
        </div>
      )}
      <a className="home-whatsapp-link" href={`https://wa.me/${site.whatsapp}`} target="_blank"
        rel="noopener noreferrer" aria-label="WhatsApp ile iletişime geçin">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20.5 12a8.5 8.5 0 0 1-12.4 7.6L4 21l1.2-4.2A8.5 8.5 0 1 1 20.5 12Z" />
          <path d="M9.4 8.2c-.4-.5-1-.4-1.3.1-.7 1 .1 2.8 1.7 4.4 1.6 1.7 3.6 2.6 4.7 1.9.5-.3.5-.9 0-1.3l-1.3-.9-.8.8a6 6 0 0 1-2.6-2.6l.6-.8-.9-1.6Z" />
        </svg>
      </a>
    </div>
  );
}
