"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { normalizeProductText } from "../lib/catalog";

export default function CatalogPicker({ selected, options }) {
  const details = useRef(null);
  const trigger = useRef(null);
  const field = useRef(null);
  const [query, setQuery] = useState("");
  const search = normalizeProductText(query);
  const visibleOptions = options.filter(({ label }) => normalizeProductText(label).includes(search));
  const current = options.find(({ value }) => value === selected);

  function renderOption({ value, label, href, image }) {
    return (
      <Link href={href} prefetch={false} aria-current={value === selected ? "true" : undefined} onClick={() => {
        details.current.open = false;
        trigger.current.focus();
      }}>
        {image && <span className="catalog-picker-logo"><Image src={image.url} alt="" width={40} height={24} /></span>}
        <span className="catalog-picker-option-label">{label}</span>
        {value === selected && <span className="catalog-picker-check" aria-hidden="true">✓</span>}
      </Link>
    );
  }


  useEffect(() => {
    const element = details.current;
    function dismiss(event) {
      if (element.open && !element.contains(event.target)) element.open = false;
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);

  return (
    <details className="catalog-picker catalog-picker-brand" ref={details}
      onToggle={(event) => {
        if (!event.currentTarget.open) setQuery("");
        else if (window.matchMedia("(pointer: fine)").matches) field.current.focus();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !details.current.open) return;
        event.preventDefault();
        details.current.open = false;
        trigger.current.focus();
      }}>
      <summary ref={trigger} className="catalog-picker-trigger">
        {current?.image ? (
          <span className="catalog-picker-selected-logo" aria-hidden="true">
            <Image src={current.image.url} alt="" width={44} height={24} />
          </span>
        ) : <span className="catalog-picker-symbol catalog-picker-symbol-brand" aria-hidden="true" />}
        <span className="catalog-picker-selection"><small>Marka</small><strong>{current?.label ?? selected ?? options[0].label}</strong></span>
        <span className="catalog-picker-chevron" aria-hidden="true" />
      </summary>
      <div className="catalog-picker-panel">
        <label className="catalog-picker-search">Markalarda ara
          <input ref={field} type="search" value={query} maxLength={100}
          placeholder="Marka adı yazın"
          onChange={(event) => setQuery(event.target.value)} /></label>
        {visibleOptions.length ? <ul className="catalog-picker-options">
          {visibleOptions.map((option) => <li key={option.value}>{renderOption(option)}</li>)}
        </ul> : <p className="catalog-picker-empty">Aramana uygun seçenek bulunamadı.</p>}
      </div>
    </details>
  );
}
