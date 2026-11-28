"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export default function HomeOrderFields({ choices, initialIds, label, reorderOnly = false }) {
  const [selected, setIds] = useState(initialIds);
  const [query, setQuery] = useState("");
  const [addedLabel, setAddedLabel] = useState("");
  const search = useRef(null);
  const byId = new Map(choices.map((item) => [item.id, item]));
  const ids = selected.filter((id) => byId.has(id));
  const available = choices.filter(({ id }) => !ids.includes(id));
  const term = query.trim().toLocaleLowerCase("tr");
  const matches = available.filter(({ label }) => label.toLocaleLowerCase("tr").includes(term));

  function move(index, offset) {
    setIds((current) => {
      const next = current.filter((id) => byId.has(id));
      const target = index + offset;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function thumbnail(item) {
    return item.src && (
      <span className="admin-record-thumbnail">
        <Image src={item.src} fill sizes="84px" alt="" unoptimized={item.placeholder} />
      </span>
    );
  }

  return (
    <div className="admin-home-order">
      {!reorderOnly && <details className="admin-home-picker">
        <summary>{label}</summary>
        <label>Listede ara
          <input ref={search} type="search" value={query} onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter" && !event.nativeEvent.isComposing) event.preventDefault(); }} />
        </label>
        <span className="admin-home-picker-status" role="status">{addedLabel && `${addedLabel} seçkiye eklendi.`}</span>
        {matches.length ? <ul className="admin-home-picker-grid">
          {matches.map((item) => (
            <li key={item.id}>
              <button type="button" aria-label={`${item.label} seçkiye ekle`} onClick={() => {
                setIds((current) => current.includes(item.id) ? current : [...current, item.id]);
                setAddedLabel(item.label);
                search.current?.focus({ preventScroll: true });
              }}>
                <span className="admin-home-picker-image">
                  {item.src ? <Image src={item.src} fill sizes="(max-width: 480px) 40vw, 180px"
                    alt="" unoptimized={item.placeholder} /> : <span>Görsel yok</span>}
                </span>
                <strong>{item.label}</strong>
                <span className="admin-home-picker-add" aria-hidden="true">+ Ekle</span>
              </button>
            </li>
          ))}
        </ul> : <p className="store-muted">{available.length ? "Aramanıza uygun kayıt bulunamadı." : "Eklenebilecek kayıt yok."}</p>}
      </details>}
      {ids.length > 0 ? <ol>
        {ids.map((id, index) => {
          const item = byId.get(id);
          return (
            <li key={id}>
              <input type="hidden" name="itemId" value={id} />
              {thumbnail(item)}
              <strong>{item.label}</strong>
              <div className="admin-inline">
                <button className="admin-secondary" type="button" aria-label={`${item.label} yukarı`}
                  disabled={index === 0} onClick={() => move(index, -1)}>↑</button>
                <button className="admin-secondary" type="button" aria-label={`${item.label} aşağı`}
                  disabled={index === ids.length - 1} onClick={() => move(index, 1)}>↓</button>
                {!reorderOnly && <button className="admin-secondary" type="button" aria-label={`${item.label} seçkiden çıkar`}
                  onClick={() => setIds((current) => current.filter((entry) => entry !== id))}>Çıkar</button>}
              </div>
            </li>
          );
        })}
      </ol> : <p className="store-muted">Anasayfada gösterilecek kart seçilmedi.</p>}
    </div>
  );
}
