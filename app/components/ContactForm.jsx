"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { boilers } from "../lib/boilers";

const services = [
  "Klima satışı / montaj",
  "Petek temizliği",
  "Isı pompası",
  "Doğalgaz / kombi",
  "Yerden ısıtma",
  "Sıhhi tesisat / yangın tesisatı",
  "Katı yakıtlı kazan / soba",
  "Güneş enerjisi",
  "Diğer",
];

function ServicePicker({ productName, picker }) {
  const [selected, setSelected] = useState(productName ? "Doğalgaz / kombi" : "");

  return (
    <fieldset className="home-form-services">
      <legend>Hangi hizmetle ilgileniyorsunuz?</legend>
      <input type="hidden" name="service" value={selected} />
      <details ref={picker} className="home-service-picker"
        onKeyDown={(event) => {
          if (event.key === "Escape" && event.currentTarget.open) {
            event.currentTarget.open = false;
            event.currentTarget.querySelector("summary").focus();
          }
        }}>
        <summary data-selected={Boolean(selected)}>{selected || "Hizmet seçin"}</summary>
        <div className="home-service-options">
          {services.map((service) => (
            <button type="button" className="home-service-option" key={service}
              aria-pressed={selected === service}
              onClick={() => {
                setSelected(service);
                picker.current.open = false;
                picker.current.querySelector("summary").focus();
              }}>
              {service}
            </button>
          ))}
        </div>
      </details>
    </fieldset>
  );
}

export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const servicePicker = useRef(null);
  const requestedProduct = useSearchParams().get("urun");
  const model = boilers.find(([brand, name]) => `${brand} ${name}` === requestedProduct);
  const productName = model ? requestedProduct : "";

  async function submit(event) {
    event.preventDefault();
    if (sending) return;
    const form = new FormData(event.currentTarget);
    if (!form.get("service")) {
      setError("Lütfen bir hizmet seçin.");
      servicePicker.current.open = true;
      servicePicker.current.querySelector("summary").focus();
      return;
    }
    setError("");
    setSending(true);
    try {
      const response = await window.fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(form), product: productName, consent: form.has("consent") }),
      });
      const result = await response.json();
      if (response.ok && result.ok) {
        window.location.assign("/tesekkurler");
        return;
      }
      setError(result.error || "Talebiniz gönderilemedi. Lütfen tekrar deneyin.");
    } catch {
      setError("Talebiniz gönderilemedi. Bağlantınızı kontrol edip tekrar deneyin.");
    }
    setSending(false);
  }

  return (
    <form className="home-request-form" onSubmit={submit}>
      {productName && <p className="home-form-product">Seçilen kombi <strong>{productName}</strong> <Link href="/#iletisim">Kaldır</Link></p>}
      <label>
        Ad soyad
        <input type="text" name="name" autoComplete="name" maxLength={80} required />
      </label>
      <label>
        Telefon
        <input type="tel" name="phone" placeholder="05xx xxx xx xx" autoComplete="tel" maxLength={24} required />
      </label>
      <label>
        E-posta (isteğe bağlı)
        <input type="email" name="email" autoComplete="email" maxLength={120} />
      </label>
      <ServicePicker productName={productName} picker={servicePicker} key={productName} />
      <label className="home-form-message">
        Mesajınız (isteğe bağlı)
        <textarea name="message" rows={4} maxLength={500} placeholder="İhtiyacınızı kısaca anlatın" />
      </label>
      <label className="consent">
        <input type="checkbox" name="consent" required />
        <span>
          <Link href="/gizlilik-politikasi">Gizlilik</Link> ve{" "}
          <Link href="/kvkk-aydinlatma-metni">KVKK</Link> metinlerini okudum; iletişim için bilgilerimin
          kullanılmasını kabul ediyorum.
        </span>
      </label>
      {error && <p className="home-form-error" role="alert">{error}</p>}
      <button className="button primary" type="submit" disabled={sending}>
        {sending ? "Gönderiliyor…" : "Talebi gönder"} <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
