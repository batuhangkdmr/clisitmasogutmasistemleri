export const metadata = {
  title: "Katalog yönetimi",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <main className="admin-page">{children}</main>;
}
