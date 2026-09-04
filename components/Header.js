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
  ArrowLeft,
} from "lucide-react";
import SearchBar from "./SearchBar";
import RandomPicker from "./RandomPicker";

export default function Header() {
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMoviesMenu, setShowMoviesMenu] = useState(false);
  const [showTVMenu, setShowTVMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    if (href === "/movies")
      return pathname === "/movies" || pathname.startsWith("/movie/");
    if (href === "/tv") return pathname === "/tv" || pathname.startsWith("/tv/");
    if (href === "/anime") return pathname === "/anime";
    if (href === "/watchlist") return pathname === "/watchlist";
    return pathname === href;
  };

  return (
    <>
      <div
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
              ? "rgba(0, 0, 0, 0.92)"
              : "rgba(0, 0, 0, 0.6)",
            border: scrolled
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "1px solid rgba(255, 255, 255, 0.06)",
            boxShadow: scrolled
              ? "0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)"
              : "0 4px 16px rgba(0, 0, 0, 0.3)",
            width: "100%",
            maxWidth: 1200,
            zIndex: 1000,
            borderRadius: "var(--radius-full)",
            backdropFilter: "blur(24px) saturate(1.8)",
            WebkitBackdropFilter: "blur(24px) saturate(1.8)",
            transition: "background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
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
              <nav className="header-nav">
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  if (link.dropdown) {
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        ref={link.ref}
                        className={`nav-link${active ? " nav-link--active" : ""}`}
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
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`nav-link${active ? " nav-link--active" : ""}`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

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
          background: linear-gradient(135deg, #d97706, #f59e0b);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
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
        .nav-link {
          position: relative;
        }
        .nav-link--active {
          color: var(--accent) !important;
          background: var(--accent-subtle);
        }
        .nav-link--active::after {
          content: "";
          position: absolute;
          left: 14px;
          right: 14px;
          bottom: 6px;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, #d97706, #fbbf24);
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.6);
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
                    background: "rgba(10, 10, 10, 0.9)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderTop: "2px solid var(--accent)",
                    borderRadius: "var(--radius-xl)",
                    padding: 16,
                    minWidth: 210,
                    maxHeight: 380,
                    overflowY: "auto",
                    boxShadow: "0 24px 64px rgba(0, 0, 0, 0.6), 0 0 24px rgba(245, 158, 11, 0.1)",
                  }}
                >
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: "var(--font-bold)",
                      color: "var(--accent)",
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
                      background: "linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(251, 191, 36, 0.08))",
                      border: "1px solid rgba(245, 158, 11, 0.25)",
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
                    background: "rgba(10, 10, 10, 0.9)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderTop: "2px solid var(--accent)",
                    borderRadius: "var(--radius-xl)",
                    padding: 16,
                    minWidth: 210,
                    maxHeight: 380,
                    overflowY: "auto",
                    boxShadow: "0 24px 64px rgba(0, 0, 0, 0.6), 0 0 24px rgba(245, 158, 11, 0.1)",
                  }}
                >
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: "var(--font-bold)",
                      color: "var(--accent)",
                      marginBottom: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.09em",
                      paddingBottom: 10,
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    TV Genres
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                      marginBottom: 10,
                    }}
                  >
                    <Link
                      href="/tv?sort=vote_average.desc"
                      className="dropdown-item"
                      onClick={() => setShowTVMenu(false)}
                      style={{
                        position: "relative",
                        display: "block",
                        padding: "8px 12px 8px 22px",
                        borderRadius: "var(--radius-lg)",
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-semibold)",
                        color: "var(--text-secondary)",
                        textDecoration: "none",
                      }}
                    >
                      <span style={{ marginRight: 6 }}>⭐</span> Top Rated
                    </Link>
                    <Link
                      href="/tv?sort=popularity.desc"
                      className="dropdown-item"
                      onClick={() => setShowTVMenu(false)}
                      style={{
                        position: "relative",
                        display: "block",
                        padding: "8px 12px 8px 22px",
                        borderRadius: "var(--radius-lg)",
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-semibold)",
                        color: "var(--text-secondary)",
                        textDecoration: "none",
                      }}
                    >
                      <span style={{ marginRight: 6 }}>🔥</span> Trending
                    </Link>
                  </div>
                  <Link
                    href="/tv"
                    className="dropdown-all-link"
                    onClick={() => setShowTVMenu(false)}
                    style={{
                      display: "block",
                      padding: "8px 12px",
                      background: "linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(251, 191, 36, 0.08))",
                      border: "1px solid rgba(245, 158, 11, 0.25)",
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
                  background: "rgba(245, 158, 11, 0.1)",
                  border: "1px solid rgba(245, 158, 11, 0.25)",
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
              style={{
                position: "fixed",
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 99999,
                background: "rgba(0, 0, 0, 0.98)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                borderTopLeftRadius: "var(--radius-2xl)",
                borderTopRightRadius: "var(--radius-2xl)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                boxShadow: "0 -8px 48px rgba(0, 0, 0, 0.8)",
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
                    background: "rgba(245, 158, 11, 0.1)",
                    border: "1px solid rgba(245, 158, 11, 0.2)",
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
                    { href: "/anime", label: "Anime", icon: Sparkles },
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
    </>
  );
}
