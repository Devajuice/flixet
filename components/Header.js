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
  Clock,
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

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile search on route change
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
      <style jsx global>{`
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
          background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
          border: 1px solid rgba(229, 9, 20, 0.3);
          border-radius: 10px;
          padding: 15px;
          min-width: 220px;
          max-height: 400px;
          overflow-y: auto;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
        }

        .dropdown-menu::-webkit-scrollbar {
          width: 6px;
        }

        .dropdown-menu::-webkit-scrollbar-track {
          background: rgba(37, 37, 37, 0.5);
          border-radius: 3px;
        }

        .dropdown-menu::-webkit-scrollbar-thumb {
          background: #e50914;
          border-radius: 3px;
        }

        .dropdown-title {
          font-size: 12px;
          font-weight: bold;
          color: #e50914;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(229, 9, 20, 0.2);
        }

        .dropdown-items {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .dropdown-all-link {
          padding: 10px 15px;
          background-color: rgba(229, 9, 20, 0.2);
          border-radius: 5px;
          font-size: 14px;
          font-weight: bold;
          transition: all 0.3s ease;
          cursor: pointer;
          display: block;
          text-decoration: none;
          color: #e50914;
          white-space: nowrap;
          margin-bottom: 8px;
          border: 1px solid rgba(229, 9, 20, 0.3);
        }

        .dropdown-all-link:hover {
          background-color: #e50914;
          color: white;
          transform: translateX(5px);
        }

        .dropdown-item {
          padding: 10px 15px;
          background-color: rgba(37, 37, 37, 0.5);
          border-radius: 5px;
          font-size: 14px;
          transition: all 0.3s ease;
          cursor: pointer;
          display: block;
          text-decoration: none;
          color: #ffffff;
          white-space: nowrap;
        }

        .dropdown-item:hover {
          background-color: #e50914;
          transform: translateX(5px);
          color: white;
        }

        /* ========== MOBILE SEARCH OVERLAY ========== */
        .mobile-search-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          z-index: 99999;
          backdrop-filter: blur(8px);
          display: flex;
          flex-direction: column;
        }

        .mobile-search-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: linear-gradient(
            180deg,
            rgba(26, 26, 26, 0.98) 0%,
            rgba(18, 18, 18, 0.95) 100%
          );
          border-bottom: 1px solid rgba(229, 9, 20, 0.3);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        .mobile-search-back-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(229, 9, 20, 0.1);
          border: 1px solid rgba(229, 9, 20, 0.3);
          border-radius: 50%;
          color: #e50914;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .mobile-search-back-btn:active {
          transform: scale(0.9);
          background: rgba(229, 9, 20, 0.2);
        }

        .mobile-search-input-wrapper {
          flex: 1;
        }

        .mobile-search-content {
          flex: 1;
          overflow-y: auto;
          padding: 20px 16px;
          padding-bottom: 30px;
        }

        .mobile-search-suggestions {
          margin-bottom: 30px;
        }

        .mobile-search-section-title {
          font-size: 12px;
          font-weight: 700;
          color: #e50914;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .mobile-search-suggestion-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          background: rgba(26, 26, 26, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          margin-bottom: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.85);
        }

        .mobile-search-suggestion-item:active {
          background: rgba(229, 9, 20, 0.15);
          border-color: rgba(229, 9, 20, 0.3);
          transform: scale(0.98);
        }

        /* Mobile Menu Overlay */
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          z-index: 99998;
          backdrop-filter: blur(4px);
        }

        /* Mobile Menu Drawer */
        .mobile-menu-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 85%;
          max-width: 340px;
          background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
          z-index: 99999;
          overflow-y: auto;
          box-shadow: -4px 0 30px rgba(0, 0, 0, 0.7);
          border-left: 1px solid rgba(229, 9, 20, 0.3);
        }

        .mobile-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(229, 9, 20, 0.05);
        }

        .mobile-menu-title {
          font-size: 20px;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff 0%, #e50914 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .mobile-menu-close {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(229, 9, 20, 0.15);
          border: none;
          border-radius: 50%;
          color: #e50914;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mobile-menu-close:active {
          transform: scale(0.9);
          background: rgba(229, 9, 20, 0.25);
        }

        .mobile-menu-content {
          padding: 20px;
        }

        .mobile-menu-section {
          margin-bottom: 30px;
        }

        .mobile-menu-section-title {
          font-size: 11px;
          font-weight: 700;
          color: #e50914;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          margin-bottom: 12px;
          padding-left: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .mobile-menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 12px;
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          border-radius: 10px;
          transition: all 0.3s ease;
          font-size: 15px;
          font-weight: 500;
          margin-bottom: 4px;
          background: rgba(255, 255, 255, 0.02);
        }

        .mobile-menu-item:active {
          background: rgba(229, 9, 20, 0.15);
          color: #e50914;
          transform: translateX(4px);
        }

        .mobile-menu-item svg {
          flex-shrink: 0;
          opacity: 0.8;
        }

        .mobile-menu-divider {
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(229, 9, 20, 0.3) 50%,
            transparent 100%
          );
          margin: 25px 0;
        }

        body.menu-open {
          overflow: hidden;
        }
      `}</style>

      <style jsx>{`
        .logo-icon {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .logo-text {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.5px;
          line-height: 1;
          display: inline-flex;
          align-items: center;
          position: relative;
          top: -5.5px;
        }

        .search-btn-content {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .dropdown-trigger {
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          padding: 10px 15px;
          border-radius: 5px;
          transition: all 0.3s ease;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 16px;
          font-family: inherit;
          text-decoration: none;
        }

        .dropdown-trigger:hover {
          background-color: rgba(229, 9, 20, 0.1);
        }

        .search-bar-wrapper {
          max-width: 600px;
          width: 100%;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .logo-text {
            font-size: 18px;
          }

          .search-bar-wrapper {
            max-width: 100%;
            padding: 0 15px;
          }
        }
      `}</style>

      <motion.header
        style={styles.header}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="container" style={styles.container}>
          <Link href="/" style={styles.logo}>
            <motion.span
              className="logo-icon"
              animate={{
                textShadow: [
                  '0 0 5px #e50914',
                  '0 0 20px #e50914',
                  '0 0 5px #e50914',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Film size={28} strokeWidth={2.5} style={{ flexShrink: 0 }} />
              <span className="logo-text">Flixet</span>
            </motion.span>
          </Link>

          {/* Mobile Hamburger Menu Button - ONLY SHOW ON MOBILE */}
          {isMobile && (
            <motion.button
              style={{
                display: 'flex',
                width: '44px',
                height: '44px',
                background: 'transparent',
                border: '1px solid rgba(229, 9, 20, 0.3)',
                borderRadius: '8px',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#e50914',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                flexShrink: 0,
              }}
              onClick={() => {
                setShowMobileMenu(true);
                document.body.classList.add('menu-open');
              }}
              whileHover={{ scale: 1.05, background: 'rgba(229, 9, 20, 0.1)' }}
              whileTap={{ scale: 0.95 }}
              aria-label="Open menu"
            >
              <Menu size={24} strokeWidth={2.5} />
            </motion.button>
          )}

          {/* Desktop Navigation - ONLY SHOW ON DESKTOP */}
          {!isMobile && (
            <nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
              <Link href="/" style={styles.navLink}>
                Home
              </Link>

              <div>
                <Link
                  href="/movies"
                  ref={moviesButtonRef}
                  className="dropdown-trigger"
                  onMouseEnter={() => setShowMoviesMenu(true)}
                  onMouseLeave={() => setShowMoviesMenu(false)}
                >
                  <span>Movies</span>
                  <ChevronDown size={16} />
                </Link>
              </div>

              <div>
                <Link
                  href="/tv"
                  ref={tvButtonRef}
                  className="dropdown-trigger"
                  onMouseEnter={() => setShowTVMenu(true)}
                  onMouseLeave={() => setShowTVMenu(false)}
                >
                  <span>TV Shows</span>
                  <ChevronDown size={16} />
                </Link>
              </div>

              <Link href="/anime" style={styles.navLink}>
                Anime
              </Link>

              <Link href="/watchlist" style={styles.navLink}>
                Watchlist
              </Link>

              <motion.button
                onClick={() => setShowSearch(!showSearch)}
                style={styles.searchBtn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="search-btn-content">
                  <SearchIcon size={18} /> Search
                </span>
              </motion.button>
            </nav>
          )}
        </div>

        {/* Desktop Search */}
        <AnimatePresence>
          {showSearch && !isMobile && (
            <motion.div
              style={styles.searchContainer}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="search-bar-wrapper">
                <SearchBar />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Dropdown Portal - DESKTOP ONLY */}
      {!isMobile && (
        <div className="dropdown-portal">
          <AnimatePresence>
            {showMoviesMenu && (
              <motion.div
                className="dropdown-menu-container"
                style={{
                  left: `${dropdownPositions.movies.left}px`,
                  top: `${dropdownPositions.movies.top + 15}px`,
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
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
                  top: `${dropdownPositions.tv.top + 15}px`,
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
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

      {/* ========== MOBILE SEARCH OVERLAY ========== */}
      <AnimatePresence>
        {showMobileSearch && isMobile && (
          <motion.div
            className="mobile-search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
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
              {/* Trending Searches */}
              <div className="mobile-search-suggestions">
                <div className="mobile-search-section-title">
                  <TrendingUp size={14} />
                  Trending Searches
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
                    <SearchIcon size={18} opacity={0.6} />
                    <span>{item}</span>
                  </Link>
                ))}
              </div>

              {/* Quick Categories */}
              <div className="mobile-search-suggestions">
                <div className="mobile-search-section-title">
                  <Sparkles size={14} />
                  Browse by Genre
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
                    <Film size={18} opacity={0.6} />
                    <span>{genre} Movies</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Slide-out Menu */}
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
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="mobile-menu-header">
                <div className="mobile-menu-title">Explore</div>
                <button
                  className="mobile-menu-close"
                  onClick={() => {
                    setShowMobileMenu(false);
                    document.body.classList.remove('menu-open');
                  }}
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="mobile-menu-content">
                {/* Quick Links */}
                <div className="mobile-menu-section">
                  <div className="mobile-menu-section-title">
                    <TrendingUp size={12} />
                    Quick Access
                  </div>
                  <Link
                    href="/"
                    className="mobile-menu-item"
                    onClick={() => {
                      setShowMobileMenu(false);
                      document.body.classList.remove('menu-open');
                    }}
                  >
                    <Home size={20} />
                    <span>Home</span>
                  </Link>
                  <button
                    className="mobile-menu-item"
                    onClick={() => {
                      setShowMobileMenu(false);
                      setShowMobileSearch(true);
                    }}
                  >
                    <SearchIcon size={20} />
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
                    <Bookmark size={20} />
                    <span>My Watchlist</span>
                  </Link>
                </div>

                <div className="mobile-menu-divider" />

                {/* Movie Genres */}
                <div className="mobile-menu-section">
                  <div className="mobile-menu-section-title">
                    <Film size={12} />
                    Movie Genres
                  </div>
                  <Link
                    href="/movies"
                    className="mobile-menu-item"
                    onClick={() => {
                      setShowMobileMenu(false);
                      document.body.classList.remove('menu-open');
                    }}
                    style={{ fontWeight: '700', color: '#e50914' }}
                  >
                    <Film size={20} />
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

                {/* TV Genres */}
                <div className="mobile-menu-section">
                  <div className="mobile-menu-section-title">
                    <Tv size={12} />
                    TV Shows
                  </div>
                  <Link
                    href="/tv"
                    className="mobile-menu-item"
                    onClick={() => {
                      setShowMobileMenu(false);
                      document.body.classList.remove('menu-open');
                    }}
                    style={{ fontWeight: '700', color: '#e50914' }}
                  >
                    <Tv size={20} />
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
                    <Sparkles size={12} />
                    Anime
                  </div>
                  <Link
                    href="/anime"
                    className="mobile-menu-item"
                    onClick={() => {
                      setShowMobileMenu(false);
                      document.body.classList.remove('menu-open');
                    }}
                    style={{ fontWeight: '700', color: '#e50914' }}
                  >
                    <Sparkles size={20} />
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

const styles = {
  header: {
    backgroundColor: 'var(--secondary-bg)',
    padding: '15px 0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
  },
  logo: {
    color: 'var(--accent)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  navLink: {
    fontSize: '16px',
    transition: 'var(--transition)',
    textDecoration: 'none',
    color: 'var(--text-primary)',
  },
  searchBtn: {
    background: 'var(--accent)',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    fontSize: '16px',
    transition: 'var(--transition)',
    cursor: 'pointer',
    border: 'none',
    touchAction: 'none',
  },
  searchContainer: {
    marginTop: '20px',
    overflow: 'visible',
    paddingBottom: '15px',
  },
};
