import { env } from "node:process";

const fieldLimits = { name: 80, phone: 24, email: 120, service: 100, product: 120, message: 500 };

export async function POST(request) {
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") {
    return globalThis.Response.json({ error: "Geçersiz istek biçimi." }, { status: 415 });
  }

  const data = await request.json().catch(() => null);
  const fields = {};
  for (const [key, limit] of Object.entries(fieldLimits)) {
    const value = data?.[key] ?? "";
    if (typeof value !== "string" || value.length > limit) {
      return globalThis.Response.json({ error: "Lütfen form alanlarını kontrol edin." }, { status: 400 });
    }
    fields[key] = value.trim();
  }

  const { name, phone, email, service, product, message } = fields;
  const phoneDigits = phone.replace(/\D/g, "");
  if (!name || !service || phoneDigits.length < 7 || phoneDigits.length > 15 ||
      (email && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) || data?.consent !== true) {
    return globalThis.Response.json({ error: "Lütfen zorunlu alanları, iletişim bilgilerinizi ve form onayını kontrol edin." }, { status: 400 });
  }

  const { RESEND_API_KEY: key, RESEND_FROM_EMAIL: sender, RESEND_TO_EMAIL: recipient } = env;
  const unavailable = "E-posta gönderilemedi. Bilgileriniz formda duruyor. Tekrar deneyebilir veya WhatsApp üzerinden ulaşabilirsiniz.";
  if (!key || !sender || !recipient) {
    return globalThis.Response.json({ error: unavailable }, { status: 503 });
  }

  const text = [
    `Ad soyad: ${name}`,
    `Telefon: ${phone}`,
    `Hizmet: ${service}`,
    product && `Ürün: ${product}`,
    email && `E-posta: ${email}`,
    message && `Mesaj: ${message}`,
  ].filter(Boolean).join("\n");

  try {
    const result = await globalThis.fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        subject: "CL Isıtma | Yeni iletişim talebi",
        text,
        ...(email ? { reply_to: email } : {}),
      }),
      signal: globalThis.AbortSignal.timeout(10000),
    });
    if (result.ok) return globalThis.Response.json({ ok: true });
    globalThis.console.error("Resend contact delivery failed", result.status);
  } catch {
    globalThis.console.error("Resend contact request failed");
  }
  return globalThis.Response.json({ error: unavailable }, { status: 502 });
}
