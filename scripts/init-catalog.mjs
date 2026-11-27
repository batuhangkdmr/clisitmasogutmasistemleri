import { openMySqlConnection } from "../app/lib/mysql.mjs";

let connection;
try {
  connection = await openMySqlConnection();
  await connection.query(`CREATE TABLE IF NOT EXISTS cl_catalog (
    id TINYINT UNSIGNED PRIMARY KEY, content LONGTEXT NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
  await connection.execute("INSERT IGNORE INTO cl_catalog (id, content) VALUES (1, ?)",
    [JSON.stringify({ categories: [], products: [] })]);
  await connection.query(`CREATE TABLE IF NOT EXISTS cl_admin_throttle (
    id TINYINT UNSIGNED PRIMARY KEY, attempts INT UNSIGNED NOT NULL, expires BIGINT UNSIGNED NOT NULL
  ) ENGINE=InnoDB`);
  await connection.query("INSERT IGNORE INTO cl_admin_throttle (id, attempts, expires) VALUES (1, 0, 0)");
  console.log("Katalog ve admin tabloları hazır.");
} catch (error) {
  console.error(`Katalog kurulamadı (${error.code ?? "UNKNOWN_ERROR"}).`);
  process.exitCode = 1;
} finally {
  await connection?.end();
}
