import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { Buffer } from "node:buffer";
import { env } from "node:process";
import { cookies } from "next/headers";
import { openMySqlConnection } from "./mysql.mjs";

const cookieName = "cl_admin_session";
const sessionSeconds = 60 * 60 * 8;
const windowMs = 15 * 60 * 1000;

export function adminConfigured() {
  return Boolean(env.ADMIN_USERNAME && /^[a-f0-9]{32}:[a-f0-9]{128}$/.test(env.ADMIN_PASSWORD_HASH ?? "") &&
    (env.ADMIN_SESSION_SECRET?.length ?? 0) >= 32);
}

function signature(value) {
  return createHmac("sha256", env.ADMIN_SESSION_SECRET)
    .update(`${env.ADMIN_USERNAME}:${env.ADMIN_PASSWORD_HASH}:${value}`).digest("hex");
}

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const token = (await cookies()).get(cookieName)?.value;
  if (!token || !/^\d{10,13}\.[a-f0-9]{32}\.[a-f0-9]{64}$/.test(token)) return false;
  const [expiry, nonce, hash] = token.split(".");
  return Number(expiry) > Date.now() && timingSafeEqual(
    Buffer.from(hash, "hex"), Buffer.from(signature(`${expiry}.${nonce}`), "hex"));
}

export async function authenticate(username, password) {
  if (!adminConfigured()) return "config";
  if (username.length > 100 || password.length > 256) return "invalid";
  const connection = await openMySqlConnection();
  try {
    await connection.beginTransaction();
    const [[row]] = await connection.query("SELECT attempts, expires FROM cl_admin_throttle WHERE id = 1 FOR UPDATE");
    if (!row) throw new Error("Admin throttle missing");
    const now = Date.now();
    const active = Number(row.expires) > now;
    if (active && row.attempts >= 8) {
      await connection.rollback();
      return "limited";
    }
    const [salt, hash] = env.ADMIN_PASSWORD_HASH.split(":");
    const match = timingSafeEqual(scryptSync(password, salt, 64), Buffer.from(hash, "hex")) &&
      username === env.ADMIN_USERNAME;
    await connection.execute("UPDATE cl_admin_throttle SET attempts = ?, expires = ? WHERE id = 1",
      match ? [0, 0] : [active ? row.attempts + 1 : 1, active ? row.expires : now + windowMs]);
    await connection.commit();
    if (!match) return "invalid";

    const value = `${now + sessionSeconds * 1000}.${randomBytes(16).toString("hex")}`;
    (await cookies()).set(cookieName, `${value}.${signature(value)}`, {
      httpOnly: true, sameSite: "strict", secure: env.NODE_ENV === "production", maxAge: sessionSeconds, path: "/admin",
    });
    return "ok";
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

export async function clearAdminSession() {
  (await cookies()).set(cookieName, "", {
    httpOnly: true, sameSite: "strict", secure: env.NODE_ENV === "production", maxAge: 0, path: "/admin",
  });
}
