'use client';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from './SearchBar';

export default function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/movies', label: 'Movies' },
    { href: '/tv', label: 'TV Shows' },
  ];

  return (
    <>
      <style jsx>{`
        .desktop-nav {
          display: none;
          gap: 30px;
          align-items: center;
        }

        .hamburger {
          display: flex;
          flex-direction: column;
          gap: 5px;
          background: transparent;
          padding: 10px;
          cursor: pointer;
        }

        @media (min-width: 768px) {
          .desktop-nav {
            display: flex;
          }

          .hamburger {
            display: none;
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
              animate={{
                textShadow: [
                  '0 0 5px #e50914',
                  '0 0 20px #e50914',
                  '0 0 5px #e50914',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎬 Flickster
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            {navItems.map((item) => (
              <motion.div
                key={item.href}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={item.href} style={styles.navLink}>
                  {item.label}
                </Link>
              </motion.div>
            ))}
            <motion.button
              onClick={() => setShowSearch(!showSearch)}
              style={styles.searchBtn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔍 Search
            </motion.button>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div
              style={{
                ...styles.hamburgerLine,
                transform: mobileMenuOpen
                  ? 'rotate(45deg) translateY(8px)'
                  : 'none',
              }}
            />
            <div
              style={{
                ...styles.hamburgerLine,
                opacity: mobileMenuOpen ? 0 : 1,
              }}
            />
            <div
              style={{
                ...styles.hamburgerLine,
                transform: mobileMenuOpen
                  ? 'rotate(-45deg) translateY(-8px)'
                  : 'none',
              }}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              style={styles.mobileMenu}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={styles.mobileNavLink}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setShowSearch(true);
                  setMobileMenuOpen(false);
                }}
                style={styles.mobileSearchBtn}
              >
                🔍 Search
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              className="container"
              style={styles.searchContainer}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SearchBar onClose={() => setShowSearch(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

const styles = {
  header: {
    backgroundColor: 'var(--secondary-bg)',
    padding: '15px 0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'var(--accent)',
  },
  navLink: {
    fontSize: '16px',
    transition: 'var(--transition)',
  },
  searchBtn: {
    background: 'var(--accent)',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    fontSize: '16px',
    transition: 'var(--transition)',
  },
  hamburgerLine: {
    width: '25px',
    height: '3px',
    backgroundColor: 'white',
    transition: 'all 0.3s ease',
    borderRadius: '2px',
  },
  mobileMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '20px',
    backgroundColor: 'var(--card-bg)',
    overflow: 'hidden',
  },
  mobileNavLink: {
    padding: '12px',
    fontSize: '18px',
    textAlign: 'center',
    borderRadius: '5px',
    transition: 'var(--transition)',
  },
  mobileSearchBtn: {
    background: 'var(--accent)',
    color: 'white',
    padding: '12px',
    borderRadius: '5px',
    fontSize: '18px',
    marginTop: '10px',
  },
  searchContainer: {
    marginTop: '20px',
    overflow: 'hidden',
  },
};
