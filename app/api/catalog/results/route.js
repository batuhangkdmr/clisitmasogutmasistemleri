import { publishedCatalog } from "../../../lib/catalog-store";
import { catalogField, catalogResultPage } from "../../../lib/catalog-results";

const headers = { "Cache-Control": "no-store" };

export async function GET(request) {
  const catalog = await publishedCatalog();
  if (!catalog.available) return globalThis.Response.json({ error: "Kataloğa şu anda ulaşılamıyor." }, { status: 503, headers });
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const filters = Object.fromEntries(["q", "kategori", "marka", "sayfa"].map((key) => [key, catalogField(params, key)]));
  return globalThis.Response.json(catalogResultPage(catalog, filters), { headers });
}
