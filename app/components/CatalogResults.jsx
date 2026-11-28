"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { catalogField, catalogPath, catalogResultsUrl, catalogUrl } from "../lib/catalog-results";
import { quoteUrl } from "../lib/catalog-view";
import CatalogCard from "./CatalogCard";
import CatalogCategoryPicker from "./CatalogCategoryPicker";
import CatalogPicker from "./CatalogPicker";

export default function CatalogResults({
  initialQuery, initialResults, available, kategori, marka, categoryName, emptyCategory, categoryOptions, brandOptions,
}) {
  const [view, setView] = useState({ ...initialResults, q: initialQuery, available });
  const [input, setInput] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const activeRequest = useRef(null);
  const { q, products, page, pages, hasProducts } = view;

  const load = useCallback(async (query, sayfa, updateHistory) => {
    activeRequest.current?.abort();
    const controller = new window.AbortController();
    activeRequest.current = controller;
    const values = { q: query, kategori, marka, sayfa };
    setLoading(true);
    setError("");
    try {
      const url = catalogUrl(values);
      const response = await window.fetch(`/api/catalog/results${url.slice(catalogPath.length)}`, { signal: controller.signal });
      if (!response.ok) throw new Error("Katalog isteği başarısız.");
      const result = await response.json();
      if (controller.signal.aborted) return;
      setView({ ...result, q: query, available: true });
      if (updateHistory) {
        const target = catalogResultsUrl({ ...values, sayfa: result.page > 1 ? result.page : "" });
        if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== target) {
          window.history.pushState(null, "", target);
        }
      }
    } catch {
      if (!controller.signal.aborted) setError("Arama sonuçları yüklenemedi. Tekrar deneyin.");
    } finally {
      if (activeRequest.current === controller) {
        activeRequest.current = null;
        setLoading(false);
      }
    }
  }, [kategori, marka]);

  useEffect(() => {
    function restore() {
      if (window.location.pathname !== catalogPath) return;
      const params = Object.fromEntries(new window.URLSearchParams(window.location.search));
      if (catalogField(params, "kategori") !== kategori || catalogField(params, "marka") !== marka) return;
      const query = catalogField(params, "q");
      setInput(query);
      load(query, catalogField(params, "sayfa"), false);
    }
    window.addEventListener("popstate", restore);
    return () => {
      window.removeEventListener("popstate", restore);
      activeRequest.current?.abort();
    };
  }, [kategori, marka, load]);

  function followResultLink(event, query, nextPage) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setInput(query);
    load(query, nextPage, true);
  }

  const filters = [
    [q, catalogResultsUrl({ kategori, marka }), (event) => followResultLink(event, "", "")],
    [categoryName, catalogResultsUrl({ q, marka })],
    [marka, catalogResultsUrl({ q, kategori })],
  ].filter(([label]) => Boolean(label));

  return (
    <section className="catalog-results" aria-labelledby="catalog-heading">
      <div className="store-result-heading">
        <h2 id="catalog-heading">{q ? "Arama sonuçları" : categoryName || "Tüm ürünler"}</h2>
      </div>
      <div className="catalog-discovery">
        <form className="catalog-search" action={`${catalogPath}#catalog-heading`} role="search" aria-label="Ürün kataloğunda ara"
          onSubmit={(event) => {
            event.preventDefault();
            load(input.trim(), "", true);
          }}>
          <span className="catalog-search-icon" aria-hidden="true" />
          <label><span>Ürün ara</span>
            <input type="search" name="q" placeholder="Örn. Vaillant kombi veya 12.000 BTU" maxLength={100}
              value={input} onChange={(event) => setInput(event.target.value)} />
          </label>
          {kategori && <input type="hidden" name="kategori" value={kategori} />}
          {marka && <input type="hidden" name="marka" value={marka} />}
          <button className="catalog-search-submit" type="submit">Ara <span aria-hidden="true">↗</span></button>
        </form>
        <div className="catalog-pickers" aria-label="Kategori ve marka filtreleri">
          <CatalogCategoryPicker key={kategori} selected={kategori} options={categoryOptions.map((option) => ({
            ...option, href: catalogResultsUrl({ q, kategori: option.value, marka }),
          }))} />
          <CatalogPicker selected={marka} options={brandOptions.map((option) => ({
            ...option, href: catalogResultsUrl({ q, kategori, marka: option.value }),
          }))} />
        </div>
      </div>
      {!!filters.length && <div className="catalog-active-filters" aria-label="Seçili filtreler">
        {filters.map(([label, href, onClick]) => <Link key={href} href={href} prefetch={false} onClick={onClick}
          aria-label={`${label} filtresini kaldır`}>{label} <span aria-hidden="true">×</span></Link>)}
        <Link className="home-text-link" href={catalogResultsUrl({})}
          onClick={!kategori && !marka ? (event) => followResultLink(event, "", "") : undefined}>Filtreleri temizle</Link>
      </div>}
      <p className="catalog-search-status" data-visible={Boolean(loading || error)} role="status">
        {loading ? "Ürünler aranıyor…" : error || (q ? "Arama sonuçları güncellendi." : "")}
      </p>
      <div aria-busy={loading}>
        {products.length ? <>
          <div className="store-grid">{products.map((product) => <CatalogCard key={product.id} product={product} />)}</div>
          {pages > 1 && <nav className="store-pagination" aria-label="Ürün liste sayfaları">
            {page > 1 && <Link href={catalogResultsUrl({ q, kategori, marka, sayfa: page > 2 ? page - 1 : "" })} prefetch={false}
              onClick={(event) => followResultLink(event, q, page - 1)}>← Önceki</Link>}
            <span>{page} / {pages}</span>
            {page < pages && <Link href={catalogResultsUrl({ q, kategori, marka, sayfa: page + 1 })} prefetch={false}
              onClick={(event) => followResultLink(event, q, page + 1)}>Sonraki →</Link>}
          </nav>}
        </> : <div className="store-empty">
          <h3>{!view.available ? "Kataloğa şu anda ulaşılamıyor" : emptyCategory ? "Bu kategoriye henüz ürün eklenmedi" : hasProducts ? "Filtrelere uygun ürün bulunamadı" : "Kataloğumuz hazırlanıyor"}</h3>
          <p>İlgilendiğiniz marka, model veya ürün grubu hakkında ekibimizden bilgi alabilirsiniz.</p>
          <a className="home-text-link" href={quoteUrl()}>WhatsApp’tan sorun →</a>
        </div>}
      </div>
    </section>
  );
}
