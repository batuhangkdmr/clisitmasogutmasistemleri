import { cache } from "react";
import { openMySqlConnection } from "./mysql.mjs";

const emptyCatalog = { categories: [], products: [] };

export const readCatalog = cache(async () => {
  let connection;
  try {
    connection = await openMySqlConnection();
    const [[row]] = await connection.query("SELECT content FROM cl_catalog WHERE id = 1");
    if (!row) throw new Error("Catalog row missing");
    return { ...JSON.parse(row.content), available: true };
  } catch {
    return { ...emptyCatalog, available: false };
  } finally {
    await connection?.end();
  }
});

export async function changeCatalog(change) {
  const connection = await openMySqlConnection();
  try {
    await connection.beginTransaction();
    const [[row]] = await connection.query("SELECT content FROM cl_catalog WHERE id = 1 FOR UPDATE");
    if (!row) throw new Error("Catalog row missing");
    const catalog = JSON.parse(row.content);
    await change(catalog);
    await connection.execute("UPDATE cl_catalog SET content = ? WHERE id = 1", [JSON.stringify(catalog)]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

export async function publishedCatalog() {
  const catalog = await readCatalog();
  return { ...catalog, products: catalog.products.filter((product) => product.status === "published") };
}
