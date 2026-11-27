"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { normalizeProductText } from "../lib/catalog";

const catalogLink = { title: "Tüm ürünler", category: "Katalog", href: "/urunler" };

export default function ProductSearch({ onOpen }) {
  const dialog = useRef(null);
  const input = useRef(null);
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState([]);
  const [state, setState] = useState("loading");
  const normalizedQuery = normalizeProductText(query);
  const terms = normalizedQuery ? normalizedQuery.split(" ") : [];
  const results = terms.length
    ? entries.filter(({ searchText }) => terms.every((term) => searchText.includes(term))).slice(0, 8)
    : [catalogLink, ...entries.filter((item) => item.category === "Ürün kategorisi").slice(0, 6)];

  async function openSearch() {
    onOpen();
    setQuery("");
    setEntries([]);
    dialog.current.showModal();
    input.current.focus();
    setState("loading");
    try {
      const response = await window.fetch("/api/catalog/search");
      if (!response.ok) throw new Error("Catalog unavailable");
      const { items } = await response.json();
      setEntries(items.map((item) => ({
        ...item, searchText: normalizeProductText([item.title, item.brand, item.category, item.keywords].join(" ")),
      })));
      setState("ready");
    } catch {
      setEntries([]);
      setState("error");
    }
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
          {!terms.length ? "Ürün kategorileri" : state === "loading" ? "Arama hazırlanıyor…" :
            state === "error" ? "Kataloğa şu anda ulaşılamıyor." : results.length ? "Eşleşen ürünler" : "Sonuç bulunamadı."}
        </p>
        {results.length > 0 && (
          <ul className="product-search-results">
            {results.map(({ title, brand, category, href }) => (
              <li key={href}>
                <Link href={href} prefetch={false} onClick={() => dialog.current.close()}>
                  <span><strong>{title}</strong><small>{brand ? `${category} · ${brand}` : category}</small></span>
                  <span className="product-search-action">İncele <span aria-hidden="true">→</span></span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {!!terms.length && <Link className="home-text-link" href={`/urunler?q=${encodeURIComponent(query)}`}
          onClick={() => dialog.current.close()}>Katalogda ara →</Link>}
      </dialog>
    </>
  );
}
