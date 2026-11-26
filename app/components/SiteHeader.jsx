"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import ProductSearch from "./ProductSearch";
import { site } from "../lib/site";

const productItems = [
  ["/urunler#klimalar", "Klimalar"],
  ["/urunler#kombiler", "Kombiler"],
  ["/hizmetler", "Doğalgaz sistemleri"],
  ["/urunler", "Tüm ürünler"],
];

const corporateItems = [
  ["/kurumsal", "Hakkımızda", "Kim olduğumuz"],
  ["/blog", "Blog", "Saha notları"],
  ["/#surec", "Nasıl çalışıyoruz?", "Keşiften montaja"],
  ["/kvkk-aydinlatma-metni", "KVKK Aydınlatma", "Kişisel veri metni"],
  ["/gizlilik-politikasi", "Gizlilik Politikası", "Bilgi kullanımı"],
  ["/cerez-politikasi", "Çerez Politikası", "Çerez bilgilendirmesi"],
];

const corpActivePaths = [
  "/kurumsal",
  "/blog",
  "/kvkk-aydinlatma-metni",
  "/gizlilik-politikasi",
  "/cerez-politikasi",
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(null);
  const navRef = useRef(null);
  const closeTimerRef = useRef(null);
  const baseId = useId();
  const urunActive = pathname.startsWith("/urunler");
  const corpActive = corpActivePaths.includes(pathname);

  const openDropdown = (id) => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenMenu(id);
  };

  const scheduleCloseDropdown = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setOpenMenu(null);
      closeTimerRef.current = null;
    }, 180);
  };

  useEffect(() => {
    document.body.classList.toggle("menu-is-open", menuOpen);
    return () => document.body.classList.remove("menu-is-open");
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setOpenMenu(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setOpenMenu(null);
    setMobileOpen(null);
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, [pathname]);

  useEffect(() => {
    if (!openMenu) return undefined;
    const onPointer = (event) => {
      if (!navRef.current?.contains(event.target)) setOpenMenu(null);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [openMenu]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  const closeAll = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenMenu(null);
    setMenuOpen(false);
  };

  const renderDropdown = ({ id, label, active, items, wide = false }) => {
    const isOpen = openMenu === id;
    const panelId = `${baseId}-${id}`;
    return (
      <div
        className={`nav-dropdown${isOpen ? " is-open" : ""}${active ? " is-active" : ""}`}
        onMouseEnter={() => openDropdown(id)}
        onMouseLeave={scheduleCloseDropdown}
      >
        <button
          type="button"
          className={`nav-link nav-dropdown-trigger${active ? " is-active" : ""}`}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setOpenMenu((current) => (current === id ? null : id))}
        >
          {label}
          <span className="nav-chevron" aria-hidden="true" />
        </button>
        <div className={`nav-dropdown-panel${wide ? " is-wide" : " is-compact"}`} id={panelId}>
          {wide ? (
            <div className="nav-dropdown-grid">
              {items.map(([href, title, hint]) => (
                <Link key={`${id}-${href}-${title}`} href={href} className="nav-dropdown-item" onClick={closeAll}>
                  <strong>{title}</strong>
                  {hint ? <span>{hint}</span> : null}
                </Link>
              ))}
            </div>
          ) : (
            <div className="nav-dropdown-list">
              {items.map(([href, title]) => (
                <Link key={`${id}-${href}-${title}`} href={href} className="nav-dropdown-link" onClick={closeAll}>
                  {title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAccordion = ({ id, label, active, items }) => {
    const isOpen = mobileOpen === id;
    return (
      <div className={`nav-mobile-acc${isOpen ? " is-open" : ""}`}>
        <button
          type="button"
          className={`nav-link nav-mobile-acc-trigger${active ? " is-active" : ""}`}
          aria-expanded={isOpen}
          onClick={() => setMobileOpen((current) => (current === id ? null : id))}
        >
          {label}
          <span className="nav-chevron" aria-hidden="true" />
        </button>
        <div className="nav-mobile-acc-list">
          {items.map(([href, title]) => (
            <Link key={`m-${id}-${href}-${title}`} href={href} onClick={closeAll}>
              {title}
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="topbar">
        <div className="container">
          <span className="topbar-address">
            <span className="topbar-address-short">{site.address.line}</span>
            <span className="topbar-address-full">{site.address.full}</span>
          </span>
          <div className="topbar-phones">
            <a href={`mailto:${site.email}`}>{site.email}</a>
            {site.phones.map((phone) => (
              <a key={phone.tel} href={`tel:${phone.tel}`}>
                {phone.display}
              </a>
            ))}
          </div>
        </div>
      </div>

      <header className={`header${scrolled ? " is-scrolled" : ""}`}>
        <div className="container nav">
          <Link className="logo logo-mark" href="/" aria-label="CL Isıtma Sistemleri ana sayfa">
            <Image
              src="/assets/cl-logo-transparent.png"
              alt="CL Isıtma Sistemleri & Tesisat"
              width={90}
              height={84}
            />
          </Link>

          <button
            className="menu-btn"
            onClick={() => setMenuOpen((current) => !current)}
            type="button"
            aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={menuOpen}
            aria-controls={`${baseId}-navigation`}
          >
            <i></i>
            <i></i>
            <i></i>
          </button>

          <nav ref={navRef} id={`${baseId}-navigation`} className={`primary-nav ${menuOpen ? "open" : ""}`} aria-label="Ana menü">
            <div className="nav-cluster">
              <Link href="/" className={`nav-link${pathname === "/" ? " is-active" : ""}`} onClick={closeAll}>
                Ana Sayfa
              </Link>

              {renderDropdown({ id: "kurumsal", label: "Kurumsal", active: corpActive, items: corporateItems, wide: true })}
              {renderAccordion({ id: "kurumsal", label: "Kurumsal", active: corpActive, items: corporateItems })}

              {renderDropdown({ id: "urunler", label: "Ürünlerimiz", active: urunActive, items: productItems })}
              {renderAccordion({ id: "urunler", label: "Ürünlerimiz", active: urunActive, items: productItems })}

              <Link
                href="/galeri"
                className={`nav-link${pathname.startsWith("/galeri") ? " is-active" : ""}`}
                onClick={closeAll}
              >
                Projelerimiz
              </Link>

              <Link href="/#hizmet-bolgelerimiz" className="nav-link" onClick={closeAll}>
                Hizmet Bölgelerimiz
              </Link>
              <Link href="/iletisim" className={`nav-link${pathname === "/iletisim" ? " is-active" : ""}`} aria-current={pathname === "/iletisim" ? "page" : undefined} onClick={closeAll}>
                İletişim
              </Link>
            </div>

            <div className="mobile-menu-contact">
              <span>
                {site.address.district} · {site.address.city}
              </span>
              <p>{site.address.full}</p>
              {site.phones.map((phone) => (
                <a key={phone.tel} href={`tel:${phone.tel}`}>
                  {phone.display}
                </a>
              ))}
              <a className="mobile-menu-cta" href="/#iletisim" onClick={closeAll}>
                Ücretsiz keşif iste <b>→</b>
              </a>
            </div>
            <a className="bcy-nav" href="https://bariscanyonel.com" target="_blank" rel="noopener noreferrer">
              Media: <strong>BCY DİJİTAL</strong> ↗
            </a>
          </nav>

          <div className="nav-actions">
            <ProductSearch onOpen={closeAll} />
            <a className="nav-cta" href="/#iletisim">
              Ücretsiz keşif iste
            </a>
          </div>

        </div>
      </header>
    </>
  );
}
