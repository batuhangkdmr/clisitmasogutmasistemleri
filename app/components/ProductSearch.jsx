"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { boilers } from "../lib/boilers";
import { catalogAnchor, klimalar, kombiler, normalizeProductText } from "../lib/catalog";

const categories = [
  { title: "Klimalar", category: "Ürün kategorisi", href: "/urunler#klimalar", keywords: "klima iklimlendirme" },
  { title: "Kombiler", category: "Ürün kategorisi", href: "/urunler#kombiler", keywords: "kombi yoğuşmalı doğalgaz doğal gaz" },
  { title: "Doğalgaz sistemleri", category: "Hizmet", href: "/hizmetler#dogalgaz-kombi", keywords: "doğalgaz doğal gaz tesisat" },
];

const products = [
  ...categories,
  ...klimalar.map(([brand, title, description, , tags]) => ({
    title, brand, category: "Klima",
    href: `/urunler#${catalogAnchor("klima", title)}`,
    keywords: [description, ...tags].join(" "),
  })),
  ...kombiler.map(([brand, title, description, tags]) => ({
    title, brand, category: "Kombi",
    href: `/urunler#${catalogAnchor("kombi", title)}`,
    keywords: [description, "doğalgaz doğal gaz", ...tags].join(" "),
  })),
  ...boilers.map(([brand, model]) => ({
    title: `${brand} ${model}`, brand, category: "Kombi",
    href: `/?urun=${encodeURIComponent(`${brand} ${model}`)}#iletisim`,
    keywords: "doğalgaz doğal gaz kombi",
    action: "Bilgi al",
  })),
].map((item) => ({
  ...item,
  searchText: normalizeProductText([item.title, item.brand, item.category, item.keywords].join(" ")),
}));

export default function ProductSearch({ onOpen }) {
  const dialog = useRef(null);
  const input = useRef(null);
  const [query, setQuery] = useState("");
  const normalizedQuery = normalizeProductText(query);
  const terms = normalizedQuery ? normalizedQuery.split(" ") : [];
  const results = terms.length
    ? products.filter(({ searchText }) => terms.every((term) => searchText.includes(term)))
    : categories;

  function openSearch() {
    onOpen();
    setQuery("");
    dialog.current.showModal();
    input.current.focus();
  }

  return (
    <>
      <button className="dn-ikon-dugme" type="button" aria-label="Ürün ara" aria-haspopup="dialog" onClick={openSearch}>
        <span className="product-search-icon" aria-hidden="true" />
      </button>
      <dialog ref={dialog} className="product-search-dialog" aria-labelledby="product-search-title"
        onKeyDown={(event) => {
          if (event.key !== "Escape") return;
          event.preventDefault();
          event.stopPropagation();
          dialog.current.close();
        }}>
        <div className="product-search-heading">
          <h2 id="product-search-title">Ürün ara</h2>
          <button type="button" aria-label="Aramayı kapat" onClick={() => dialog.current.close()}>×</button>
        </div>
        <label className="product-search-field">
          Marka, model veya ürün türü
          <input ref={input} type="search" value={query} maxLength={100}
            onChange={(event) => setQuery(event.target.value)} placeholder="Örn. Bosch kombi, Daikin klima" />
        </label>
        <p className="product-search-status" role="status">
          {terms.length ? (results.length ? `${results.length} sonuç` : "Sonuç bulunamadı.") : "Ürün kategorileri"}
        </p>
        {results.length > 0 && (
          <ul className="product-search-results">
            {results.map(({ title, brand, category, href, action }) => (
              <li key={href}>
                <Link href={href} prefetch={false} onClick={() => dialog.current.close()}>
                  <span><strong>{title}</strong><small>{brand ? `${category} · ${brand}` : category}</small></span>
                  <span className="product-search-action">{action ?? "İncele"} <span aria-hidden="true">→</span></span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </dialog>
    </>
  );
}
