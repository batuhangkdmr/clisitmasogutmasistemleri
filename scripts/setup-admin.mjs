import { randomBytes, scryptSync } from "node:crypto";
import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";

const envPath = ".env.local";
const credentialsPath = ".env.admin-credentials";
const existing = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
if (existsSync(credentialsPath) || /^\s*(?:export\s+)?ADMIN_(?:USERNAME|PASSWORD_HASH|SESSION_SECRET)\s*=/m.test(existing)) {
  console.error("Yerel admin ayarı bulundu. Kurulum mevcut hesabı değiştirmedi.");
  process.exitCode = 1;
} else {
  const username = "admin";
  const password = randomBytes(24).toString("base64url");
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  const secret = randomBytes(32).toString("hex");
  writeFileSync(credentialsPath, `Kullanıcı adı: ${username}\nParola: ${password}\n`, { flag: "wx", mode: 0o600 });
  appendFileSync(envPath, `\nADMIN_USERNAME=${username}\nADMIN_PASSWORD_HASH=${salt}:${hash}\nADMIN_SESSION_SECRET=${secret}\n`, { mode: 0o600 });
  console.log("Admin ayarları .env.local dosyasına, giriş bilgileri .env.admin-credentials dosyasına yazıldı.");
}
