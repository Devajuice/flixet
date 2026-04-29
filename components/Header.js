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
  ChevronDown,
  Sparkles,
  Bookmark,
  Menu,
  X,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";
import SearchBar from "./SearchBar";

export default function Header() {
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMoviesMenu, setShowMoviesMenu] = useState(false);
  const [showTVMenu, setShowTVMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownPositions, setDropdownPositions] = useState({
    movies: { left: 0, top: 0 },
    tv: { left: 0, top: 0 },
  });

  const moviesButtonRef = useRef(null);
  const tvButtonRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setShowMobileSearch(false);
    setShowMobileMenu(false);
    document.body.classList.remove("menu-open");
  }, [pathname]);

  useEffect(() => {
    const updatePositions = () => {
      if (moviesButtonRef.current) {
        const rect = moviesButtonRef.current.getBoundingClientRect();
        setDropdownPositions((prev) => ({
          ...prev,
          movies: { left: rect.left, top: rect.bottom },
        }));
      }
      if (tvButtonRef.current) {
        const rect = tvButtonRef.current.getBoundingClientRect();
        setDropdownPositions((prev) => ({
          ...prev,
          tv: { left: rect.left, top: rect.bottom },
        }));
      }
    };
    updatePositions();
    window.addEventListener("resize", updatePositions);
    window.addEventListener("scroll", updatePositions);
    return () => {
      window.removeEventListener("resize", updatePositions);
      window.removeEventListener("scroll", updatePositions);
    };
  }, []);

  const movieGenres = [
    "Action",
    "Comedy",
    "Drama",
    "Horror",
    "Sci-Fi",
    "Thriller",
    "Romance",
    "Animation",
  ];
  const tvGenres = [
    "Action & Adventure",
    "Comedy",
    "Drama",
    "Crime",
    "Documentary",
    "Sci-Fi & Fantasy",
    "Reality",
    "Kids",
  ];

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    {
      href: "/movies",
      label: "Movies",
      icon: Film,
      ref: moviesButtonRef,
      dropdown: "movies",
    },
    {
      href: "/tv",
      label: "TV Shows",
      icon: Tv,
      ref: tvButtonRef,
      dropdown: "tv",
    },
    { href: "/anime", label: "Anime", icon: Sparkles },
    { href: "/watchlist", label: "Watchlist", icon: Bookmark },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        style={{
          background: "rgba(10,10,10,0.92)",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="header-inner">
          <Link href="/" className="header-logo">
            <div className="header-logo-icon">
              <Film size={18} fill="white" color="white" strokeWidth={0} />
            </div>
            <span>Flixet</span>
          </Link>

          {!isMobile && (
            <>
              <nav className="header-nav">
                {navLinks.map((link) => {
                  if (link.dropdown) {
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        ref={link.ref}
                        className="nav-link"
                        onMouseEnter={() =>
                          link.dropdown === "movies"
                            ? setShowMoviesMenu(true)
                            : setShowTVMenu(true)
                        }
                        onMouseLeave={() =>
                          link.dropdown === "movies"
                            ? setShowMoviesMenu(false)
                            : setShowTVMenu(false)
                        }
                      >
                        {link.label} <ChevronDown size={13} />
                      </Link>
                    );
                  }
                  return (
                    <Link key={link.href} href={link.href} className="nav-link">
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

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
              >
                <Menu size={20} strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      </motion.header>

      <style jsx global>{`
        .header-inner {
          max-width: 1400px;
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
          background: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .header-logo span {
          font-size: var(--text-xl);
          font-weight: var(--font-extrabold);
          letter-spacing: -0.03em;
          color: var(--text-primary);
        }
        .header-nav {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .header-search {
          position: relative;
          width: 260px;
          flex-shrink: 0;
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
          .header-nav,
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
      `}</style>

      {/* Dropdown portal */}
      {!isMobile && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 9999,
          }}
        >
          <AnimatePresence>
            {showMoviesMenu && (
              <motion.div
                style={{
                  position: "absolute",
                  left: dropdownPositions.movies.left,
                  top: dropdownPositions.movies.top + 12,
                  pointerEvents: "auto",
                }}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                onMouseEnter={() => setShowMoviesMenu(true)}
                onMouseLeave={() => setShowMoviesMenu(false)}
              >
                <div
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    borderTop: "2px solid var(--accent)",
                    borderRadius: "var(--radius-xl)",
                    padding: 16,
                    minWidth: 210,
                    maxHeight: 380,
                    overflowY: "auto",
                    boxShadow: "var(--shadow-xl)",
                  }}
                >
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: "var(--font-bold)",
                      color: "var(--text-tertiary)",
                      marginBottom: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.09em",
                      paddingBottom: 10,
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    Movie Genres
                  </p>
                  <Link
                    href="/movies"
                    className="dropdown-all-link"
                    onClick={() => setShowMoviesMenu(false)}
                    style={{
                      display: "block",
                      padding: "8px 12px",
                      background: "rgba(229,9,20,0.08)",
                      border: "1px solid rgba(229,9,20,0.2)",
                      borderRadius: "var(--radius-lg)",
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-bold)",
                      color: "var(--accent)",
                      textDecoration: "none",
                      marginBottom: 8,
                    }}
                  >
                    All Movies
                  </Link>
                  {movieGenres.map((g) => (
                    <Link
                      key={g}
                      href={`/movies?genre=${g.toLowerCase()}`}
                      className="dropdown-item"
                      onClick={() => setShowMoviesMenu(false)}
                      style={{
                        position: "relative",
                        display: "block",
                        padding: "8px 12px 8px 22px",
                        borderRadius: "var(--radius-lg)",
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-medium)",
                        color: "var(--text-secondary)",
                        textDecoration: "none",
                      }}
                    >
                      {g}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showTVMenu && (
              <motion.div
                style={{
                  position: "absolute",
                  left: dropdownPositions.tv.left,
                  top: dropdownPositions.tv.top + 12,
                  pointerEvents: "auto",
                }}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                onMouseEnter={() => setShowTVMenu(true)}
                onMouseLeave={() => setShowTVMenu(false)}
              >
                <div
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    borderTop: "2px solid var(--accent)",
                    borderRadius: "var(--radius-xl)",
                    padding: 16,
                    minWidth: 210,
                    maxHeight: 380,
                    overflowY: "auto",
                    boxShadow: "var(--shadow-xl)",
                  }}
                >
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: "var(--font-bold)",
                      color: "var(--text-tertiary)",
                      marginBottom: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.09em",
                      paddingBottom: 10,
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    TV Genres
                  </p>
                  <Link
                    href="/tv"
                    className="dropdown-all-link"
                    onClick={() => setShowTVMenu(false)}
                    style={{
                      display: "block",
                      padding: "8px 12px",
                      background: "rgba(229,9,20,0.08)",
                      border: "1px solid rgba(229,9,20,0.2)",
                      borderRadius: "var(--radius-lg)",
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-bold)",
                      color: "var(--accent)",
                      textDecoration: "none",
                      marginBottom: 8,
                    }}
                  >
                    All TV Shows
                  </Link>
                  {tvGenres.map((g) => {
                    const slug = g
                      .toLowerCase()
                      .replace(/ & /g, "-")
                      .replace(/ /g, "-");
                    return (
                      <Link
                        key={g}
                        href={`/tv?genre=${slug}`}
                        className="dropdown-item"
                        onClick={() => setShowTVMenu(false)}
                        style={{
                          position: "relative",
                          display: "block",
                          padding: "8px 12px 8px 22px",
                          borderRadius: "var(--radius-lg)",
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-medium)",
                          color: "var(--text-secondary)",
                          textDecoration: "none",
                        }}
                      >
                        {g}
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Mobile search overlay */}
      <AnimatePresence>
        {showMobileSearch && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.97)",
              zIndex: 99999,
              backdropFilter: "blur(12px)",
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
                  background: "rgba(229,9,20,0.1)",
                  border: "1px solid rgba(229,9,20,0.3)",
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
            <div
              style={{ flex: 1, overflowY: "auto", padding: "24px 16px 30px" }}
            >
              <div style={{ marginBottom: 30 }}>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: "var(--font-bold)",
                    color: "var(--accent)",
                    textTransform: "uppercase",
                    letterSpacing: "0.09em",
                    marginBottom: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <TrendingUp size={13} /> Trending Searches
                </p>
                {[
                  "Deadpool & Wolverine",
                  "Dune 2",
                  "Oppenheimer",
                  "The Last of Us",
                ].map((item) => (
                  <Link
                    key={item}
                    href={`/search?q=${encodeURIComponent(item)}`}
                    onClick={() => {
                      setShowMobileSearch(false);
                      document.body.classList.remove("menu-open");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "13px 14px",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-lg)",
                      marginBottom: 6,
                      cursor: "pointer",
                      textDecoration: "none",
                      color: "var(--text-secondary)",
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-medium)",
                    }}
                  >
                    <SearchIcon size={16} opacity={0.5} />
                    <span>{item}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
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
                background: "rgba(0,0,0,0.75)",
                zIndex: 99998,
                backdropFilter: "blur(4px)",
              }}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                width: "85%",
                maxWidth: 340,
                background: "var(--bg)",
                zIndex: 99999,
                overflowY: "auto",
                boxShadow: "-4px 0 40px rgba(0,0,0,0.8)",
                borderLeft: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 20,
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span
                  style={{
                    fontSize: "var(--text-lg)",
                    fontWeight: "var(--font-bold)",
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
                    background: "rgba(229,9,20,0.1)",
                    border: "1px solid rgba(229,9,20,0.2)",
                    borderRadius: "50%",
                    color: "var(--accent)",
                    cursor: "pointer",
                  }}
                >
                  <X size={20} />
                </button>
              </div>
              <div style={{ padding: 20 }}>
                <div style={{ marginBottom: 28 }}>
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: "var(--font-bold)",
                      color: "var(--text-tertiary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.09em",
                      marginBottom: 10,
                      paddingLeft: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <TrendingUp size={11} /> Quick Access
                  </p>
                  <Link
                    href="/"
                    onClick={() => {
                      setShowMobileMenu(false);
                      document.body.classList.remove("menu-open");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "11px 14px",
                      color: "var(--text-secondary)",
                      textDecoration: "none",
                      borderRadius: "var(--radius-lg)",
                      marginBottom: 2,
                    }}
                  >
                    <Home size={18} /> Home
                  </Link>
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      setShowMobileSearch(true);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "11px 14px",
                      color: "var(--text-secondary)",
                      borderRadius: "var(--radius-lg)",
                      marginBottom: 2,
                      background: "transparent",
                      border: "none",
                      width: "100%",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <SearchIcon size={18} /> Search
                  </button>
                  <Link
                    href="/watchlist"
                    onClick={() => {
                      setShowMobileMenu(false);
                      document.body.classList.remove("menu-open");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "11px 14px",
                      color: "var(--text-secondary)",
                      textDecoration: "none",
                      borderRadius: "var(--radius-lg)",
                      marginBottom: 2,
                    }}
                  >
                    <Bookmark size={18} /> Watchlist
                  </Link>
                </div>
                <div
                  style={{
                    height: 1,
                    background: "var(--border)",
                    margin: "22px 0",
                  }}
                />
                <div style={{ marginBottom: 28 }}>
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: "var(--font-bold)",
                      color: "var(--text-tertiary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.09em",
                      marginBottom: 10,
                      paddingLeft: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Film size={11} /> Movie Genres
                  </p>
                  <Link
                    href="/movies"
                    onClick={() => {
                      setShowMobileMenu(false);
                      document.body.classList.remove("menu-open");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "11px 14px",
                      color: "var(--accent)",
                      textDecoration: "none",
                      borderRadius: "var(--radius-lg)",
                      marginBottom: 2,
                      fontWeight: "var(--font-bold)",
                    }}
                  >
                    <Film size={18} /> All Movies
                  </Link>
                  {movieGenres.slice(0, 6).map((g) => (
                    <Link
                      key={g}
                      href={`/movies?genre=${g.toLowerCase()}`}
                      onClick={() => {
                        setShowMobileMenu(false);
                        document.body.classList.remove("menu-open");
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "11px 14px",
                        color: "var(--text-secondary)",
                        textDecoration: "none",
                        borderRadius: "var(--radius-lg)",
                        marginBottom: 2,
                      }}
                    >
                      {g}
                    </Link>
                  ))}
                </div>
                <div
                  style={{
                    height: 1,
                    background: "var(--border)",
                    margin: "22px 0",
                  }}
                />
                <div style={{ marginBottom: 28 }}>
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: "var(--font-bold)",
                      color: "var(--text-tertiary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.09em",
                      marginBottom: 10,
                      paddingLeft: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Tv size={11} /> TV Shows
                  </p>
                  <Link
                    href="/tv"
                    onClick={() => {
                      setShowMobileMenu(false);
                      document.body.classList.remove("menu-open");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "11px 14px",
                      color: "var(--accent)",
                      textDecoration: "none",
                      borderRadius: "var(--radius-lg)",
                      marginBottom: 2,
                      fontWeight: "var(--font-bold)",
                    }}
                  >
                    <Tv size={18} /> All TV Shows
                  </Link>
                  {tvGenres.slice(0, 6).map((g) => {
                    const slug = g
                      .toLowerCase()
                      .replace(/ & /g, "-")
                      .replace(/ /g, "-");
                    return (
                      <Link
                        key={g}
                        href={`/tv?genre=${slug}`}
                        onClick={() => {
                          setShowMobileMenu(false);
                          document.body.classList.remove("menu-open");
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "11px 14px",
                          color: "var(--text-secondary)",
                          textDecoration: "none",
                          borderRadius: "var(--radius-lg)",
                          marginBottom: 2,
                        }}
                      >
                        {g}
                      </Link>
                    );
                  })}
                </div>
                <div
                  style={{
                    height: 1,
                    background: "var(--border)",
                    margin: "22px 0",
                  }}
                />
                <div>
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: "var(--font-bold)",
                      color: "var(--text-tertiary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.09em",
                      marginBottom: 10,
                      paddingLeft: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Sparkles size={11} /> Anime
                  </p>
                  <Link
                    href="/anime"
                    onClick={() => {
                      setShowMobileMenu(false);
                      document.body.classList.remove("menu-open");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "11px 14px",
                      color: "var(--accent)",
                      textDecoration: "none",
                      borderRadius: "var(--radius-lg)",
                      marginBottom: 2,
                      fontWeight: "var(--font-bold)",
                    }}
                  >
                    <Sparkles size={18} /> Browse Anime
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
