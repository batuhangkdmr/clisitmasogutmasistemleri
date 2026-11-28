"use client";

import { useId, useRef, useState } from "react";
import { articleBlocks, serviceSummaryLimit } from "../lib/blog-content";

const bodyLimit = 30000;

export default function BlogContentFields({ initialBody, initialService, initialServiceSummary, services }) {
  const [body, setBody] = useState(initialBody);
  const [serviceSlug, setServiceSlug] = useState(initialService);
  const [serviceSummary, setServiceSummary] = useState(initialServiceSummary);
  const [heading, setHeading] = useState("");
  const editor = useRef(null);
  const editorId = useId();
  const headings = articleBlocks(body).filter((block) => block.heading);
  const service = services.find(({ slug }) => slug === serviceSlug);
  const existingBody = body.trimEnd();
  const newBody = `${existingBody ? `${existingBody}\n\n` : ""}## ${heading.trim()}\n\n`;
  const canAdd = heading.trim() && newBody.length <= bodyLimit;

  function addHeading() {
    if (!canAdd) return;
    setBody(newBody);
    setHeading("");
    window.requestAnimationFrame(() => {
      const field = editor.current;
      if (!field) return;
      field.focus();
      field.setSelectionRange(newBody.length, newBody.length);
    });
  }

  return (
    <fieldset className="admin-blog-content">
      <legend>Yazı içeriği ve yan alan</legend>
      <div className="admin-blog-content-grid">
        <div className="admin-blog-writing">
          <div className="admin-blog-heading-tools">
            <label>Yeni alt başlık
              <input value={heading} maxLength={120} onChange={(event) => setHeading(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key !== "Enter") return;
                  event.preventDefault();
                  addHeading();
                }} />
            </label>
            <button type="button" className="admin-secondary" disabled={!canAdd} onClick={addHeading}>Alt başlığı ekle</button>
          </div>
          <label htmlFor={editorId}>Yazı içeriği
            <textarea id={editorId} ref={editor} name="body" value={body} onChange={(event) => setBody(event.target.value)}
              maxLength={bodyLimit} rows={13} required />
            <small>Alt başlıktan sonra metni yazın. Mevcut bir başlığı düzenlemek için “## ” ile başlayan satırı değiştirin. Liste maddeleri “- ” ile başlar.</small>
          </label>
        </div>
        <div className="admin-blog-preview">
          <section className="blog-toc">
            <h3>Bu yazıda</h3>
            {headings.length ? <ul>{headings.map(({ id, heading: title }) => <li key={id}>{title}</li>)}</ul> :
              <p>Eklediğiniz alt başlıklar burada görünür.</p>}
          </section>
          <div className="blog-service-note">
            <label>İlgili hizmet
              <select name="serviceSlug" value={serviceSlug} onChange={(event) => {
                setServiceSlug(event.target.value);
                setServiceSummary(null);
              }}>
                <option value="">Hizmet kartı gösterme</option>
                {services.map(({ slug, title }) => <option value={slug} key={slug}>{title}</option>)}
              </select>
            </label>
            {service && <div className="admin-blog-service-preview">
              <strong>{service.title}</strong>
              <label>Hizmet kartı açıklaması
                <textarea name="serviceSummary" rows={3} maxLength={serviceSummaryLimit}
                  value={serviceSummary ?? service.summary} onChange={(event) => setServiceSummary(event.target.value)} />
                <small>Bu değişiklik yalnızca bu blog yazısında görünür. Alan boşsa hizmetin varsayılan açıklaması kullanılır.</small>
              </label>
              {serviceSummary !== null && serviceSummary !== service.summary &&
                <button type="button" className="admin-secondary" onClick={() => setServiceSummary(null)}>Varsayılana dön</button>}
              <span className="home-text-link">Hizmeti incele →</span>
            </div>}
          </div>
        </div>
      </div>
    </fieldset>
  );
}
