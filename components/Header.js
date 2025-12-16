'use client';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Film,
  Search as SearchIcon,
  Home,
  Tv,
  ChevronDown,
  Sparkles, // For Anime icon
} from 'lucide-react';
import SearchBar from './SearchBar';

export default function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const [showMoviesMenu, setShowMoviesMenu] = useState(false);
  const [showTVMenu, setShowTVMenu] = useState(false);
  const [dropdownPositions, setDropdownPositions] = useState({
    movies: { left: 0, top: 0 },
    tv: { left: 0, top: 0 },
  });

  const moviesButtonRef = useRef(null);
  const tvButtonRef = useRef(null);

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

        .desktop-nav {
          display: flex;
          gap: 30px;
          align-items: center;
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

        .bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          background: linear-gradient(
            180deg,
            rgba(26, 26, 26, 0.98) 0%,
            rgba(18, 18, 18, 1) 100%
          );
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border-top: 1px solid rgba(229, 9, 20, 0.3);
          padding: 12px 0;
          padding-bottom: max(12px, env(safe-area-inset-bottom));
          justify-content: space-evenly;
          align-items: center;
          z-index: 9999;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.8);
        }

        .bottom-nav-item {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 40px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.8);
          background: transparent;
          border: none;
          border-radius: 8px;
        }

        .bottom-nav-item:hover,
        .bottom-nav-item:active {
          color: #e50914;
          background-color: rgba(229, 9, 20, 0.1);
          transform: scale(1.1);
        }

        .bottom-nav-item svg {
          flex-shrink: 0;
          stroke-width: 2;
          color: #ffffff;
        }
        .bottom-nav-search-icon {
          position: relative;
          top: -2px;
        }

        .search-bar-wrapper {
          max-width: 600px;
          width: 100%;
          margin: 0 auto;
        }

        /* Desktop only */
        @media (min-width: 769px) {
          .desktop-nav {
            display: flex;
          }

          .bottom-nav {
            display: none !important; /* hide bottom bar on desktop */
          }
        }

        /* Mobile only */
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important; /* hide top nav on mobile */
          }

          .bottom-nav {
            display: flex !important; /* show bottom bar on mobile */
          }

          .logo-text {
            font-size: 18px;
          }

          .search-bar-wrapper {
            max-width: 100%;
            padding: 0 15px;
          }
        }

        @media (max-width: 400px) {
          .bottom-nav {
            padding: 8px 0;
            padding-bottom: max(8px, env(safe-area-inset-bottom));
          }

          .bottom-nav-item {
            padding: 8px 12px;
            min-width: 44px;
          }

          .bottom-nav-item svg {
            width: 22px;
            height: 22px;
          }
        }

        /* Fix for specific Android devices */
        @media (max-width: 768px) and (orientation: portrait) {
          .bottom-nav {
            display: flex !important;
          }
        }

        @media (max-width: 768px) and (orientation: landscape) {
          .bottom-nav {
            display: flex !important;
            padding: 8px 0;
          }

          .bottom-nav-item {
            padding: 6px 12px;
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
              <span className="logo-text">Flixet </span>
            </motion.span>
          </Link>

          <nav className="desktop-nav">
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

            {/* NEW: Anime Link */}
            <Link href="/anime" style={styles.navLink}>
              Anime
            </Link>

            <motion.button
              onClick={() => setShowSearch(!showSearch)}
              style={styles.searchBtn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onPointerDown={(e) => e.preventDefault()}
            >
              <span className="search-btn-content">
                <SearchIcon size={18} /> Search
              </span>
            </motion.button>
          </nav>
        </div>

        <AnimatePresence>
          {showSearch && (
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

      {/* Dropdown Portal - Renders outside header */}
      <div className="dropdown-portal">
        {/* Movies Dropdown */}
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

        {/* TV Shows Dropdown */}
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

      {/* Mobile Bottom Navigation */}
      <nav className="bottom-nav">
        <Link href="/" className="bottom-nav-item" aria-label="Home">
          <Home size={24} color="#ffffff" />
        </Link>

        <Link href="/movies" className="bottom-nav-item" aria-label="Movies">
          <Film size={24} color="#ffffff" />
        </Link>

        {/* NEW: Anime Icon for Mobile */}
        <Link href="/anime" className="bottom-nav-item" aria-label="Anime">
          <Sparkles size={24} color="#ffffff" />
        </Link>

        <Link href="/tv" className="bottom-nav-item" aria-label="TV Shows">
          <Tv size={24} color="#ffffff" />
        </Link>

        <button
          onClick={() => setShowSearch(!showSearch)}
          className="bottom-nav-item"
          aria-label="Search"
        >
          <span className="bottom-nav-search-icon">
            <SearchIcon size={22} color="#ffffff" strokeWidth={2.2} />
          </span>
        </button>
      </nav>
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
  },
  searchContainer: {
    marginTop: '20px',
    overflow: 'visible',
    paddingBottom: '15px',
  },
};
