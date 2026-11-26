import { readFileSync } from "node:fs";
import { env } from "node:process";
import { createConnection } from "mysql2/promise";

export function openMySqlConnection() {
  const { MYSQL_HOST, MYSQL_PORT = "3306", MYSQL_USER, MYSQL_DATABASE, MYSQL_PASSWORD } = env;
  if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE || !MYSQL_PASSWORD) {
    throw Object.assign(new Error("MySQL connection settings are incomplete."), { code: "MYSQL_CONFIG_MISSING" });
  }
  const port = Number(MYSQL_PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw Object.assign(new Error("Invalid MySQL port."), { code: "MYSQL_CONFIG_INVALID" });
  }

  const local = ["localhost", "127.0.0.1", "::1"].includes(MYSQL_HOST);
  const sslMode = env.MYSQL_SSL_MODE ?? (local ? "disabled" : "verify-identity");
  if (!["required", "verify-identity"].includes(sslMode) && !(local && sslMode === "disabled")) {
    throw Object.assign(new Error("Invalid MySQL TLS mode."), { code: "MYSQL_CONFIG_INVALID" });
  }

  return createConnection({
    host: MYSQL_HOST,
    port,
    user: MYSQL_USER,
    database: MYSQL_DATABASE,
    password: MYSQL_PASSWORD,
    connectTimeout: 8000,
    ...(sslMode === "disabled" ? {} : {
      ssl: {
        rejectUnauthorized: sslMode === "verify-identity",
        verifyIdentity: sslMode === "verify-identity",
        ...(sslMode === "verify-identity" && env.MYSQL_SSL_CA_FILE
          ? { ca: readFileSync(env.MYSQL_SSL_CA_FILE) }
          : {}),
      },
    }),
  });
}
