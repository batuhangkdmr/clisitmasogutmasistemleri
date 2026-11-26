import { openMySqlConnection } from "../app/lib/mysql.mjs";

let connection;
try {
  connection = await openMySqlConnection();
  const [[result]] = await connection.query("SELECT 1 AS ok, DATABASE() AS databaseName");
  if (result.ok !== 1 || !result.databaseName) throw new Error("Unexpected MySQL response.");
  console.log(`MySQL bağlantısı doğrulandı (${result.databaseName}).`);
} catch (error) {
  console.error(`MySQL bağlantısı doğrulanamadı (${error.code ?? "UNKNOWN_ERROR"}).`);
  process.exitCode = 1;
} finally {
  await connection?.end();
}
