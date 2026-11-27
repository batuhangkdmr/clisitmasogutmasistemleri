import Link from "next/link";
import { redirect } from "next/navigation";
import { adminConfigured, isAdmin } from "../../lib/admin-auth";
import { login } from "../actions";

const messages = {
  config: "Admin hesabı henüz yapılandırılmadı.",
  database: "Veritabanına şu anda ulaşılamıyor. Biraz sonra tekrar deneyin.",
  invalid: "Kullanıcı adı veya parola hatalı.",
  limited: "Çok fazla giriş denemesi yapıldı. 15 dakika sonra tekrar deneyin.",
};

export default async function AdminLogin({ searchParams }) {
  if (await isAdmin()) redirect("/admin");
  const { durum } = await searchParams;
  const message = !adminConfigured() ? messages.config : Object.hasOwn(messages, durum) ? messages[durum] : "";
  return (
    <div className="admin-login">
      <section className="admin-panel">
        <p className="home-kicker">CL Isıtma</p>
        <h1>Katalog yönetimi</h1>
        <p className="store-muted">Ürünleri ve kategorileri yönetmek için giriş yapın.</p>
        {message && <p className="admin-notice" role="alert">{message}</p>}
        <form className="admin-form" action={login}>
          <label>Kullanıcı adı<input name="username" autoComplete="username" maxLength={100} required /></label>
          <label>Parola<input type="password" name="password" autoComplete="current-password" maxLength={256} required /></label>
          <button className="button primary" type="submit">Giriş yap</button>
        </form>
        <Link className="home-text-link" href="/urunler">Ürün kataloğuna dön →</Link>
      </section>
    </div>
  );
}
