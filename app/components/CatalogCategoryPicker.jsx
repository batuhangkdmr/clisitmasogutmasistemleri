"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { normalizeProductText } from "../lib/catalog";

export default function CatalogCategoryPicker({ selected, options }) {
  const dialog = useRef(null);
  const heading = useRef(null);
  const [parent, setParent] = useState(null);
  const [query, setQuery] = useState("");
  const titleId = useId();
  const byValue = new Map(options.map((option) => [option.value, option]));
  const parents = new Set(options.map((option) => option.parent).filter(Boolean));
  const current = byValue.get(selected);
  const group = byValue.get(parent);
  const search = normalizeProductText(query);
  const rows = search
    ? options.filter(({ value, label }) => value && normalizeProductText(label).includes(search))
    : options.filter((option) => option.value && (option.parent ?? null) === parent);

  function open() {
    setParent(parents.has(selected) ? selected : current?.parent ?? null);
    setQuery("");
    dialog.current.showModal();
    heading.current.focus();
  }

  function move(next) {
    setParent(next);
    heading.current.focus();
  }

  function rowContent(option, nextLevel) {
    const owner = search ? byValue.get(option.parent)?.label : null;
    return <>
      <span className="category-sheet-row-title">
        <strong>{option.label}</strong>
        {owner && <small>{owner}</small>}
      </span>
      <span className="category-sheet-row-icon" aria-hidden="true">{nextLevel ? "›" : selected === option.value ? "✓" : "↗"}</span>
    </>;
  }

  const scope = group ?? options[0];

  return (
    <div className="catalog-category-mobile">
      <button type="button" className="catalog-picker-trigger category-sheet-trigger" onClick={open} aria-haspopup="dialog">
        <span className="catalog-picker-symbol catalog-picker-symbol-category" aria-hidden="true" />
        <span className="catalog-picker-selection"><small>Kategori</small><strong>{current?.label ?? scope.label}</strong></span>
        <span className="catalog-picker-chevron" aria-hidden="true" />
      </button>
      <dialog ref={dialog} className="category-sheet" aria-labelledby={titleId}
        onClick={(event) => { if (event.target === event.currentTarget) dialog.current.close(); }}>
        <div className="category-sheet-inner">
          <header className="category-sheet-header">
            <div>
              {group && !search && <button type="button" className="category-sheet-back" onClick={() => move(group.parent ?? null)}>
                <span aria-hidden="true">←</span> Üst kategori
              </button>}
              <h2 id={titleId} ref={heading} tabIndex={-1}>{search ? "Arama sonuçları" : group?.label ?? "Kategoriler"}</h2>
            </div>
            <button type="button" className="category-sheet-close" onClick={() => dialog.current.close()} aria-label="Kategori menüsünü kapat">×</button>
          </header>
          <input className="category-sheet-search" type="search" aria-label="Kategorilerde ara"
            placeholder="Kategori ara" maxLength={100} value={query} onChange={(event) => setQuery(event.target.value)} />
          <div className="category-sheet-body" key={parent}>
            {!search && <Link href={scope.href} prefetch={false} className="category-sheet-all" onClick={() => dialog.current.close()}>
              {group ? "Bu kategorideki tüm ürünler" : "Tüm ürünleri göster"} <span aria-hidden="true">→</span>
            </Link>}
            {rows.length ? <ul className="category-sheet-list">
              {rows.map((option) => <li key={option.value}>
                {!search && parents.has(option.value) ? (
                  <button type="button" className="category-sheet-row" onClick={() => move(option.value)}>{rowContent(option, true)}</button>
                ) : (
                  <Link href={option.href} prefetch={false} className="category-sheet-row"
                    aria-current={option.value === selected ? "true" : undefined} onClick={() => dialog.current.close()}>
                    {rowContent(option, false)}
                  </Link>
                )}
              </li>)}
            </ul> : <p className="category-sheet-empty">Aramana uygun kategori bulunamadı.</p>}
          </div>
        </div>
      </dialog>
    </div>
  );
}
