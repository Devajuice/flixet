"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  Film,
  Search as SearchIcon,
  Home,
  Tv,
  Bookmark,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";
import SearchBar from "./SearchBar";
import RandomPicker from "./RandomPicker";
import PillNav from "./PillNav";

export default function Header() {
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const mobileSearchTriggerRef = useRef(null);
  const mobileMenuTriggerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 12);
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setShowMobileSearch(false);
    setShowMobileMenu(false);
  }

  useEffect(() => {
    document.body.classList.remove("menu-open");
  }, [pathname]);

  // Escape closes whichever overlay is open and returns focus to its trigger.
  useEffect(() => {
    if (!showMobileSearch && !showMobileMenu) return;

    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (showMobileSearch) {
        setShowMobileSearch(false);
        document.body.classList.remove("menu-open");
        mobileSearchTriggerRef.current?.focus();
      } else if (showMobileMenu) {
        setShowMobileMenu(false);
        document.body.classList.remove("menu-open");
        mobileMenuTriggerRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showMobileSearch, showMobileMenu]);



  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/movies", label: "Movies", icon: Film },
    { href: "/tv", label: "TV Shows", icon: Tv },
    { href: "/watchlist", label: "Watchlist", icon: Bookmark },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    if (href === "/movies")
      return pathname === "/movies" || pathname.startsWith("/movie/");
    if (href === "/tv") return pathname === "/tv" || pathname.startsWith("/tv/");
    if (href === "/watchlist") return pathname === "/watchlist";
    return pathname === href;
  };

  return (
    <>
      <div
        className="header-floating-wrap"
        style={{
          position: "fixed",
          top: 16,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          padding: "0 24px",
          pointerEvents: "none",
        }}
      >
        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          style={{
            background: scrolled
              ? "rgba(11, 18, 32, 0.72)"
              : "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: scrolled
              ? "0 12px 40px rgba(0, 0, 0, 0.45)"
              : "0 8px 24px rgba(0, 0, 0, 0.25)",
            width: "100%",
            maxWidth: 1200,
            zIndex: 1000,
            borderRadius: "var(--radius-full)",
            backdropFilter: "blur(20px) saturate(1.4)",
            WebkitBackdropFilter: "blur(20px) saturate(1.4)",
            transition: "background 200ms ease, box-shadow 200ms ease, border-color 200ms ease",
            pointerEvents: "auto",
          }}
        >
        <div
          className="header-inner"
        >
          <Link href="/" className="header-logo">
            <div className="header-logo-icon">
              <Film size={18} fill="white" color="white" strokeWidth={0} />
            </div>
            <span>Flixet</span>
          </Link>

          {!isMobile && (
            <>
              <PillNav
                className="header-pill-nav"
                ariaLabel="Primary"
                activeIndex={navLinks.findIndex((l) => isActive(l.href))}
                items={navLinks.map((l) => ({ label: l.label, href: l.href }))}
              />

              <div className="header-random">
                <RandomPicker variant="header" />
              </div>

              <div className="header-search">
                <SearchBar />
              </div>
            </>
          )}

          {isMobile && (
            <div className="mobile-actions">
              <button
                onClick={() => {
                  setShowMobileSearch(true);
                  document.body.classList.add("menu-open");
                }}
                aria-label="Search"
                className="mobile-search-btn"
                ref={mobileSearchTriggerRef}
              >
                <SearchIcon size={18} />
              </button>
              <button
                onClick={() => {
                  setShowMobileMenu(true);
                  document.body.classList.add("menu-open");
                }}
                aria-label="Open menu"
                className="mobile-menu-btn"
                ref={mobileMenuTriggerRef}
              >
                <Menu size={20} strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      </motion.header>
      </div>

      <style jsx global>{`
        .header-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--container-padding);
          height: var(--header-height);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }
        .header-logo {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .header-logo-icon {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-lg);
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(12px);
        }
        .header-logo span {
          font-size: var(--text-xl);
          font-weight: var(--font-extrabold);
          letter-spacing: -0.03em;
          color: var(--text-primary);
        }
        .header-pill-nav .pill-nav-track {
          background: transparent;
          border-color: transparent;
          box-shadow: none;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          padding: 0;
        }
        .header-pill-nav .pill-nav-glide { top: 0; bottom: 0; }
        .header-pill-nav .pill-nav-item {
          height: 38px;
          padding: 0 16px;
          font-size: 14px;
        }
        .header-search {
          position: relative;
          width: 260px;
          flex-shrink: 0;
        }
        .header-random {
          flex-shrink: 0;
        }
        @media (max-width: 1200px) {
          .header-random {
            display: none;
          }
        }
        .mobile-menu-btn {
          display: flex;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          cursor: pointer;
          flex-shrink: 0;
        }
        .mobile-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .mobile-search-btn {
          display: flex;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          cursor: pointer;
          flex-shrink: 0;
        }
        @media (max-width: 1024px) {
          .header-search {
            width: 200px;
          }
        }
        @media (max-width: 768px) {
          .header-floating-wrap {
            display: none !important;
          }
          .header-pill-nav,
          .header-search {
            display: none;
          }
          .header-logo span {
            font-size: var(--text-lg);
          }
          .header-logo-icon {
            width: 30px;
            height: 30px;
          }
          .header-logo-icon svg {
            width: 16px;
            height: 16px;
          }
        }

        .mobile-tabbar {
          position: fixed;
          left: 12px;
          right: 12px;
          bottom: calc(12px + env(safe-area-inset-bottom, 0px));
          z-index: 1200;
          padding: 6px;
          border-radius: 28px;
          background: rgba(20, 20, 20, 0.72);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 20px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08);
          backdrop-filter: blur(24px) saturate(1.4);
          -webkit-backdrop-filter: blur(24px) saturate(1.4);
        }
        .mobile-tabbar-inner {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 4px;
          align-items: center;
        }
        .mobile-tab {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          min-height: 56px;
          padding: 8px 4px;
          border-radius: 20px;
          color: rgba(255,255,255,0.58);
          text-decoration: none;
          transition: color .2s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .mobile-tab.active { color: #fff; }
        .mobile-tab-icon {
          position: relative;
          width: 44px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          isolation: isolate;
        }
        .mobile-tab-pill {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          z-index: -1;
          background: linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.1) 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(255,255,255,0.06);
          backdrop-filter: blur(12px) saturate(1.2);
          -webkit-backdrop-filter: blur(12px) saturate(1.2);
        }
        .mobile-tab-label {
          font-size: 10px;
          font-weight: 600;
          line-height: 1;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }
        @media (min-width: 769px) {
          .mobile-tabbar { display: none !important; }
        }
      `}</style>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {showMobileSearch && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.97)",
              zIndex: 99999,
              backdropFilter: "blur(16px)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: 16,
                background: "var(--bg)",
                borderBottom: "1px solid var(--border)",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <button
                onClick={() => {
                  setShowMobileSearch(false);
                  document.body.classList.remove("menu-open");
                }}
                aria-label="Close search"
                style={{
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "50%",
                  color: "var(--accent)",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <ArrowLeft size={20} />
              </button>
              <div style={{ flex: 1 }}>
                <SearchBar autoFocus />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile bottom sheet menu */}
      <AnimatePresence>
        {showMobileMenu && isMobile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowMobileMenu(false);
                document.body.classList.remove("menu-open");
              }}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.7)",
                zIndex: 99998,
                backdropFilter: "blur(4px)",
              }}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              style={{
                position: "fixed",
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 99999,
                background: "rgba(12, 14, 20, 0.6)",
                backdropFilter: "blur(24px) saturate(1.6)",
                WebkitBackdropFilter: "blur(24px) saturate(1.6)",
                borderTopLeftRadius: "var(--radius-2xl)",
                borderTopRightRadius: "var(--radius-2xl)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 -8px 48px rgba(0, 0, 0, 0.8)",
                maxHeight: "82vh",
                overflowY: "auto",
                paddingBottom: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "10px 0 4px",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 5,
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.2)",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 20px 12px",
                }}
              >
                <span
                  style={{
                    fontSize: "var(--text-lg)",
                    fontWeight: "var(--font-extrabold)",
                  }}
                >
                  Explore
                </span>
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    document.body.classList.remove("menu-open");
                  }}
                  aria-label="Close menu"
                  style={{
                    width: 38,
                    height: 38,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "50%",
                    color: "var(--accent)",
                    cursor: "pointer",
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ padding: "0 20px" }}>
                {/* Main quick-access grid — big thumb-friendly tiles */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 10,
                    marginBottom: 20,
                  }}
                >
                  {[
                    { href: "/", label: "Home", icon: Home },
                    { href: "/movies", label: "Movies", icon: Film },
                    { href: "/tv", label: "TV", icon: Tv },
                    { href: "/watchlist", label: "Watchlist", icon: Bookmark },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        setShowMobileMenu(false);
                        document.body.classList.remove("menu-open");
                      }}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 6,
                        padding: "14px 4px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-xl)",
                        color: item.href === "/" ? "var(--accent)" : "var(--text-secondary)",
                        textDecoration: "none",
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-semibold)",
                      }}
                    >
                      <item.icon size={22} strokeWidth={2} />
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* Watchlist, Search, Random */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 10,
                    marginBottom: 20,
                  }}
                >
                  <Link
                    href="/watchlist"
                    onClick={() => {
                      setShowMobileMenu(false);
                      document.body.classList.remove("menu-open");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      padding: "14px 12px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-xl)",
                      color: "var(--text-secondary)",
                      textDecoration: "none",
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-semibold)",
                    }}
                  >
                    <Bookmark size={18} /> Watchlist
                  </Link>
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      setShowMobileSearch(true);
                      document.body.classList.add("menu-open");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      padding: "14px 12px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-xl)",
                      color: "var(--text-secondary)",
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-semibold)",
                      cursor: "pointer",
                    }}
                  >
                    <SearchIcon size={18} /> Search
                  </button>
                </div>

                <RandomPicker variant="mobile" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {isMobile && (
          <nav className="mobile-tabbar" aria-label="Mobile navigation">
          <div className="mobile-tabbar-inner">
            {[
              { href: "/", label: "Home", icon: Home, active: isActive("/") },
              { href: "/movies", label: "Movies", icon: Film, active: isActive("/movies") },
              { href: "/tv", label: "TV Shows", icon: Tv, active: isActive("/tv") },
              { href: "/watchlist", label: "Watchlist", icon: Bookmark, active: isActive("/watchlist") },
              { href: "/search", label: "Search", icon: SearchIcon, active: pathname === "/search" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mobile-tab${item.active ? " active" : ""}`}
                  aria-current={item.active ? "page" : undefined}
                >
                  <span className="mobile-tab-icon">
                    {item.active && <motion.span layoutId="mobile-tab-pill" className="mobile-tab-pill" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
                    <Icon size={20} strokeWidth={2.1} />
                  </span>
                  <span className="mobile-tab-label">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
