'use client';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';
import SearchBar from './SearchBar';

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
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setShowMobileSearch(false);
    setShowMobileMenu(false);
    document.body.classList.remove('menu-open');
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
    window.addEventListener('resize', updatePositions);
    window.addEventListener('scroll', updatePositions);
    return () => {
      window.removeEventListener('resize', updatePositions);
      window.removeEventListener('scroll', updatePositions);
    };
  }, []);

  const movieGenres = [
    'Action',
    'Comedy',
    'Drama',
    'Horror',
    'Sci-Fi',
    'Thriller',
    'Romance',
    'Animation',
  ];

  const tvGenres = [
    'Action & Adventure',
    'Comedy',
    'Drama',
    'Crime',
    'Documentary',
    'Sci-Fi & Fantasy',
    'Reality',
    'Kids',
  ];

  return (
    <>
      {/* ── Global styles ─────────────────────────────────── */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        /* ── Dropdown portal ──────────────────────────────── */
        .dropdown-portal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
        }

        .dropdown-menu-container {
          position: absolute;
          pointer-events: auto;
        }

        .dropdown-menu {
          background: rgba(13, 13, 15, 0.98);
          border: 1px solid rgba(255, 193, 60, 0.18);
          border-top: 2px solid #ffc13c;
          border-radius: 12px;
          padding: 18px;
          min-width: 220px;
          max-height: 400px;
          overflow-y: auto;
          box-shadow:
            0 16px 48px rgba(0, 0, 0, 0.7),
            0 0 0 1px rgba(255, 193, 60, 0.06);
          backdrop-filter: blur(16px);
          font-family: 'DM Sans', sans-serif;
        }

        .dropdown-menu::-webkit-scrollbar {
          width: 4px;
        }
        .dropdown-menu::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 2px;
        }
        .dropdown-menu::-webkit-scrollbar-thumb {
          background: rgba(255, 193, 60, 0.4);
          border-radius: 2px;
        }

        .dropdown-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 700;
          color: #ffc13c;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(255, 193, 60, 0.12);
        }

        .dropdown-items {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .dropdown-all-link {
          padding: 9px 14px;
          background: rgba(255, 193, 60, 0.08);
          border: 1px solid rgba(255, 193, 60, 0.2);
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #ffc13c;
          display: block;
          text-decoration: none;
          margin-bottom: 8px;
          transition:
            background 0.2s ease,
            padding-left 0.2s ease;
        }

        .dropdown-all-link:hover {
          background: rgba(255, 193, 60, 0.18);
          padding-left: 18px;
        }

        .dropdown-item {
          position: relative;
          padding: 9px 14px 9px 24px;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.5);
          display: block;
          text-decoration: none;
          transition:
            color 0.2s ease,
            padding-left 0.2s ease;
        }

        .dropdown-item::before {
          content: '';
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255, 193, 60, 0.3);
          transition: background 0.2s ease;
        }

        .dropdown-item:hover {
          color: #ffc13c;
          padding-left: 28px;
        }

        .dropdown-item:hover::before {
          background: #ffc13c;
        }

        /* ── Mobile search overlay ─────────────────────────── */
        .mobile-search-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.97);
          z-index: 99999;
          backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          font-family: 'DM Sans', sans-serif;
        }

        .mobile-search-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(13, 13, 15, 0.98);
          border-bottom: 1px solid rgba(255, 193, 60, 0.12);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        .mobile-search-back-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 193, 60, 0.08);
          border: 1px solid rgba(255, 193, 60, 0.2);
          border-radius: 50%;
          color: #ffc13c;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .mobile-search-back-btn:active {
          transform: scale(0.9);
          background: rgba(255, 193, 60, 0.15);
        }

        .mobile-search-input-wrapper {
          flex: 1;
        }

        .mobile-search-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px 16px 30px;
        }

        .mobile-search-suggestions {
          margin-bottom: 30px;
        }

        .mobile-search-section-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 700;
          color: #ffc13c;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .mobile-search-suggestion-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 14px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          margin-bottom: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.5);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
        }

        .mobile-search-suggestion-item:active {
          background: rgba(255, 193, 60, 0.08);
          border-color: rgba(255, 193, 60, 0.2);
          color: #ffc13c;
        }

        /* ── Mobile menu ───────────────────────────────────── */
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          z-index: 99998;
          backdrop-filter: blur(4px);
        }

        .mobile-menu-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 85%;
          max-width: 340px;
          background: linear-gradient(
            180deg,
            rgba(18, 18, 20, 0.99) 0%,
            rgba(13, 13, 15, 0.98) 100%
          );
          z-index: 99999;
          overflow-y: auto;
          box-shadow: -4px 0 40px rgba(0, 0, 0, 0.8);
          border-left: 1px solid rgba(255, 193, 60, 0.1);
          font-family: 'DM Sans', sans-serif;
        }

        .mobile-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(255, 193, 60, 0.03);
        }

        .mobile-menu-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.88);
          letter-spacing: -0.01em;
        }

        .mobile-menu-close {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 193, 60, 0.06);
          border: 1px solid rgba(255, 193, 60, 0.15);
          border-radius: 50%;
          color: #ffc13c;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mobile-menu-close:active {
          transform: scale(0.9);
          background: rgba(255, 193, 60, 0.12);
        }

        .mobile-menu-content {
          padding: 20px;
        }

        .mobile-menu-section {
          margin-bottom: 28px;
        }

        .mobile-menu-section-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 700;
          color: #ffc13c;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          margin-bottom: 10px;
          padding-left: 2px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .mobile-menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          color: rgba(255, 255, 255, 0.5);
          text-decoration: none;
          border-radius: 10px;
          transition:
            color 0.2s ease,
            padding-left 0.2s ease,
            background 0.2s ease;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 2px;
          background: transparent;
          border: none;
          width: 100%;
          cursor: pointer;
          text-align: left;
        }

        .mobile-menu-item:active,
        .mobile-menu-item:hover {
          color: #ffc13c;
          padding-left: 18px;
          background: rgba(255, 193, 60, 0.05);
        }

        .mobile-menu-item svg {
          flex-shrink: 0;
          opacity: 0.7;
        }

        .mobile-menu-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.06);
          margin: 22px 0;
        }

        body.menu-open {
          overflow: hidden;
        }
      `}</style>

      {/* ── Header styles (global required for App Router) ── */}
      <style jsx global>{`
        .header {
          background: linear-gradient(
            180deg,
            rgba(13, 13, 15, 0.99) 0%,
            rgba(13, 13, 15, 0.96) 100%
          );
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding: 0;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
          font-family: 'DM Sans', sans-serif;
          backdrop-filter: blur(16px);
        }

        .header-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        /* ── Logo ─── */
        .logo-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #ffc13c;
          flex-shrink: 0;
        }

        .logo-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: rgba(255, 255, 255, 0.92);
        }

        /* ── Desktop nav ─── */
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .nav-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.5) !important;
          text-decoration: none;
          padding: 8px 14px;
          border-radius: 8px;
          letter-spacing: 0.01em;
          transition:
            color 0.2s ease,
            background 0.2s ease;
        }

        .nav-link:hover {
          color: #ffc13c !important;
          background: rgba(255, 193, 60, 0.06);
        }

        .dropdown-trigger {
          display: flex;
          align-items: center;
          gap: 5px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.5) !important;
          text-decoration: none;
          padding: 8px 14px;
          border-radius: 8px;
          letter-spacing: 0.01em;
          transition:
            color 0.2s ease,
            background 0.2s ease;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .dropdown-trigger:hover {
          color: #ffc13c !important;
          background: rgba(255, 193, 60, 0.06);
        }

        /* ── Search button ─── */
        .search-btn {
          display: inline-flex !important;
          align-items: center;
          gap: 7px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #0d0d0f !important;
          background: #ffc13c !important;
          border: none;
          padding: 9px 18px;
          border-radius: 8px;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition:
            opacity 0.2s ease,
            transform 0.15s ease;
          margin-left: 8px;
        }

        .search-btn:hover {
          opacity: 0.88;
          color: #0d0d0f !important;
        }

        /* ── Mobile hamburger ─── */
        .hamburger-btn {
          display: flex;
          width: 42px;
          height: 42px;
          background: rgba(255, 193, 60, 0.06);
          border: 1px solid rgba(255, 193, 60, 0.18);
          border-radius: 10px;
          align-items: center;
          justify-content: center;
          color: #ffc13c;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .hamburger-btn:hover {
          background: rgba(255, 193, 60, 0.12);
        }

        /* ── Expandable search bar ─── */
        .search-expand {
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          overflow: visible;
          background: rgba(13, 13, 15, 0.98);
        }

        .search-expand-inner {
          max-width: 640px;
          margin: 0 auto;
          padding: 14px 24px 18px;
        }

        @media (max-width: 768px) {
          .header-inner {
            padding: 0 16px;
            height: 60px;
          }
          .logo-text {
            font-size: 18px;
          }
        }
      `}</style>

      {/* ── Header shell ──────────────────────────────────── */}
      <motion.header
        className="header"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className="header-inner">
          {/* Logo */}
          <Link href="/" className="logo-link">
            <Film size={26} strokeWidth={2.5} />
            <span className="logo-text">Flixet</span>
          </Link>

          {/* Mobile hamburger */}
          {isMobile && (
            <button
              className="hamburger-btn"
              onClick={() => {
                setShowMobileMenu(true);
                document.body.classList.add('menu-open');
              }}
              aria-label="Open menu"
            >
              <Menu size={22} strokeWidth={2.5} />
            </button>
          )}

          {/* Desktop nav */}
          {!isMobile && (
            <nav className="desktop-nav">
              <Link href="/" className="nav-link">
                Home
              </Link>

              <Link
                href="/movies"
                ref={moviesButtonRef}
                className="dropdown-trigger"
                onMouseEnter={() => setShowMoviesMenu(true)}
                onMouseLeave={() => setShowMoviesMenu(false)}
              >
                Movies <ChevronDown size={14} />
              </Link>

              <Link
                href="/tv"
                ref={tvButtonRef}
                className="dropdown-trigger"
                onMouseEnter={() => setShowTVMenu(true)}
                onMouseLeave={() => setShowTVMenu(false)}
              >
                TV Shows <ChevronDown size={14} />
              </Link>

              <Link href="/anime" className="nav-link">
                Anime
              </Link>
              <Link href="/watchlist" className="nav-link">
                Watchlist
              </Link>

              <motion.button
                className="search-btn"
                onClick={() => setShowSearch(!showSearch)}
                whileTap={{ scale: 0.95 }}
              >
                <SearchIcon size={15} />
                Search
              </motion.button>
            </nav>
          )}
        </div>

        {/* Desktop expandable search */}
        <AnimatePresence>
          {showSearch && !isMobile && (
            <motion.div
              className="search-expand"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="search-expand-inner">
                <SearchBar />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ── Dropdown portal (desktop) ──────────────────────── */}
      {!isMobile && (
        <div className="dropdown-portal">
          <AnimatePresence>
            {showMoviesMenu && (
              <motion.div
                className="dropdown-menu-container"
                style={{
                  left: `${dropdownPositions.movies.left}px`,
                  top: `${dropdownPositions.movies.top + 12}px`,
                }}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                onMouseEnter={() => setShowMoviesMenu(true)}
                onMouseLeave={() => setShowMoviesMenu(false)}
              >
                <div className="dropdown-menu">
                  <div className="dropdown-title">Movie Genres</div>
                  <div className="dropdown-items">
                    <Link
                      href="/movies"
                      className="dropdown-all-link"
                      onClick={() => setShowMoviesMenu(false)}
                    >
                      All Movies
                    </Link>
                    {movieGenres.map((genre) => (
                      <Link
                        key={genre}
                        href={`/movies?genre=${genre.toLowerCase()}`}
                        className="dropdown-item"
                        onClick={() => setShowMoviesMenu(false)}
                      >
                        {genre}
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showTVMenu && (
              <motion.div
                className="dropdown-menu-container"
                style={{
                  left: `${dropdownPositions.tv.left}px`,
                  top: `${dropdownPositions.tv.top + 12}px`,
                }}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                onMouseEnter={() => setShowTVMenu(true)}
                onMouseLeave={() => setShowTVMenu(false)}
              >
                <div className="dropdown-menu">
                  <div className="dropdown-title">TV Genres</div>
                  <div className="dropdown-items">
                    <Link
                      href="/tv"
                      className="dropdown-all-link"
                      onClick={() => setShowTVMenu(false)}
                    >
                      All TV Shows
                    </Link>
                    {tvGenres.map((genre) => {
                      const slug = genre
                        .toLowerCase()
                        .replace(/ & /g, '-')
                        .replace(/ /g, '-');
                      return (
                        <Link
                          key={genre}
                          href={`/tv?genre=${slug}`}
                          className="dropdown-item"
                          onClick={() => setShowTVMenu(false)}
                        >
                          {genre}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── Mobile search overlay ──────────────────────────── */}
      <AnimatePresence>
        {showMobileSearch && isMobile && (
          <motion.div
            className="mobile-search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mobile-search-header">
              <button
                className="mobile-search-back-btn"
                onClick={() => {
                  setShowMobileSearch(false);
                  document.body.classList.remove('menu-open');
                }}
                aria-label="Close search"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="mobile-search-input-wrapper">
                <SearchBar autoFocus />
              </div>
            </div>

            <div className="mobile-search-content">
              <div className="mobile-search-suggestions">
                <div className="mobile-search-section-title">
                  <TrendingUp size={13} /> Trending Searches
                </div>
                {[
                  'Deadpool & Wolverine',
                  'Dune 2',
                  'Oppenheimer',
                  'The Last of Us',
                ].map((item) => (
                  <Link
                    key={item}
                    href={`/search?q=${encodeURIComponent(item)}`}
                    className="mobile-search-suggestion-item"
                    onClick={() => {
                      setShowMobileSearch(false);
                      document.body.classList.remove('menu-open');
                    }}
                  >
                    <SearchIcon size={16} opacity={0.5} />
                    <span>{item}</span>
                  </Link>
                ))}
              </div>

              <div className="mobile-search-suggestions">
                <div className="mobile-search-section-title">
                  <Sparkles size={13} /> Browse by Genre
                </div>
                {['Action', 'Comedy', 'Horror', 'Sci-Fi'].map((genre) => (
                  <Link
                    key={genre}
                    href={`/movies?genre=${genre.toLowerCase()}`}
                    className="mobile-search-suggestion-item"
                    onClick={() => {
                      setShowMobileSearch(false);
                      document.body.classList.remove('menu-open');
                    }}
                  >
                    <Film size={16} opacity={0.5} />
                    <span>{genre} Movies</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile drawer menu ─────────────────────────────── */}
      <AnimatePresence>
        {showMobileMenu && isMobile && (
          <>
            <motion.div
              className="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowMobileMenu(false);
                document.body.classList.remove('menu-open');
              }}
            />
            <motion.div
              className="mobile-menu-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            >
              <div className="mobile-menu-header">
                <span className="mobile-menu-title">Explore</span>
                <button
                  className="mobile-menu-close"
                  onClick={() => {
                    setShowMobileMenu(false);
                    document.body.classList.remove('menu-open');
                  }}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mobile-menu-content">
                {/* Quick access */}
                <div className="mobile-menu-section">
                  <div className="mobile-menu-section-title">
                    <TrendingUp size={11} /> Quick Access
                  </div>
                  <Link
                    href="/"
                    className="mobile-menu-item"
                    onClick={() => {
                      setShowMobileMenu(false);
                      document.body.classList.remove('menu-open');
                    }}
                  >
                    <Home size={18} />
                    <span>Home</span>
                  </Link>
                  <button
                    className="mobile-menu-item"
                    onClick={() => {
                      setShowMobileMenu(false);
                      setShowMobileSearch(true);
                    }}
                  >
                    <SearchIcon size={18} />
                    <span>Search Movies & TV</span>
                  </button>
                  <Link
                    href="/watchlist"
                    className="mobile-menu-item"
                    onClick={() => {
                      setShowMobileMenu(false);
                      document.body.classList.remove('menu-open');
                    }}
                  >
                    <Bookmark size={18} />
                    <span>My Watchlist</span>
                  </Link>
                </div>

                <div className="mobile-menu-divider" />

                {/* Movies */}
                <div className="mobile-menu-section">
                  <div className="mobile-menu-section-title">
                    <Film size={11} /> Movie Genres
                  </div>
                  <Link
                    href="/movies"
                    className="mobile-menu-item"
                    onClick={() => {
                      setShowMobileMenu(false);
                      document.body.classList.remove('menu-open');
                    }}
                    style={{ color: '#ffc13c', fontWeight: 700 }}
                  >
                    <Film size={18} />
                    <span>All Movies</span>
                  </Link>
                  {movieGenres.slice(0, 6).map((genre) => (
                    <Link
                      key={genre}
                      href={`/movies?genre=${genre.toLowerCase()}`}
                      className="mobile-menu-item"
                      onClick={() => {
                        setShowMobileMenu(false);
                        document.body.classList.remove('menu-open');
                      }}
                    >
                      {genre}
                    </Link>
                  ))}
                </div>

                <div className="mobile-menu-divider" />

                {/* TV */}
                <div className="mobile-menu-section">
                  <div className="mobile-menu-section-title">
                    <Tv size={11} /> TV Shows
                  </div>
                  <Link
                    href="/tv"
                    className="mobile-menu-item"
                    onClick={() => {
                      setShowMobileMenu(false);
                      document.body.classList.remove('menu-open');
                    }}
                    style={{ color: '#ffc13c', fontWeight: 700 }}
                  >
                    <Tv size={18} />
                    <span>All TV Shows</span>
                  </Link>
                  {tvGenres.slice(0, 6).map((genre) => {
                    const slug = genre
                      .toLowerCase()
                      .replace(/ & /g, '-')
                      .replace(/ /g, '-');
                    return (
                      <Link
                        key={genre}
                        href={`/tv?genre=${slug}`}
                        className="mobile-menu-item"
                        onClick={() => {
                          setShowMobileMenu(false);
                          document.body.classList.remove('menu-open');
                        }}
                      >
                        {genre}
                      </Link>
                    );
                  })}
                </div>

                <div className="mobile-menu-divider" />

                {/* Anime */}
                <div className="mobile-menu-section">
                  <div className="mobile-menu-section-title">
                    <Sparkles size={11} /> Anime
                  </div>
                  <Link
                    href="/anime"
                    className="mobile-menu-item"
                    onClick={() => {
                      setShowMobileMenu(false);
                      document.body.classList.remove('menu-open');
                    }}
                    style={{ color: '#ffc13c', fontWeight: 700 }}
                  >
                    <Sparkles size={18} />
                    <span>Browse Anime</span>
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
