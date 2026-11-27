import { servicePath, services } from "../lib/services";
import SiteHeaderNav from "./SiteHeaderNav";

const serviceItems = services.map(({ slug, title, navHint }) => [servicePath(slug), title, navHint]);

export default function SiteHeader() {
  return <SiteHeaderNav serviceItems={serviceItems} />;
}
