'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        searchContent(query);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchContent = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&page=1`,
      );
      const data = await response.json();
      const filtered = data.results
        .filter(
          (item) => item.media_type === 'movie' || item.media_type === 'tv',
        )
        .slice(0, 6);
      setResults(filtered);
      setIsOpen(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (item) => {
    const path =
      item.media_type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`;
    router.push(path);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setFocused(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const getImageUrl = (path) =>
    path
      ? `https://image.tmdb.org/t/p/w92${path}`
      : 'https://via.placeholder.com/92x138/111114/444?text=No+Image';

  return (
    <div ref={searchRef} style={{ position: 'relative', width: '100%' }}>
      {/* ── Input wrapper ────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: 14,
            color: focused ? '#ffc13c' : 'rgba(255,255,255,0.35)',
            pointerEvents: 'none',
            zIndex: 1,
            transition: 'color 0.2s ease',
            flexShrink: 0,
          }}
        />
        <input
          type="text"
          placeholder="Search movies & TV shows..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setFocused(true);
            if (results.length > 0) setIsOpen(true);
          }}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit(e);
          }}
          style={{
            width: '100%',
            padding: '10px 40px 10px 40px',
            background: focused
              ? 'rgba(255,255,255,0.07)'
              : 'rgba(255,255,255,0.04)',
            border: `1px solid ${focused ? 'rgba(255,193,60,0.35)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: '10px',
            color: 'rgba(255,255,255,0.9)',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
            fontWeight: '400',
            outline: 'none',
            transition: 'background 0.2s ease, border-color 0.2s ease',
            letterSpacing: '0.01em',
          }}
        />
        {query && (
          <button
            onClick={clearSearch}
            aria-label="Clear search"
            style={{
              position: 'absolute',
              right: 12,
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.3)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')
            }
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* ── Dropdown ─────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              background: '#0d0d0f',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              maxHeight: '400px',
              overflowY: 'auto',
              zIndex: 1000,
              boxShadow:
                '0 16px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,193,60,0.08)',
            }}
          >
            {loading ? (
              <div
                style={{
                  padding: '20px',
                  textAlign: 'center',
                  color: 'rgba(255,255,255,0.35)',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '13px',
                  letterSpacing: '0.02em',
                }}
              >
                Searching...
              </div>
            ) : results.length > 0 ? (
              results.map((item, index) => (
                <SearchResult
                  key={`${item.media_type}-${item.id}`}
                  item={item}
                  onClick={() => handleResultClick(item)}
                  isLast={index === results.length - 1}
                  getImageUrl={getImageUrl}
                />
              ))
            ) : (
              <div
                style={{
                  padding: '20px',
                  textAlign: 'center',
                  color: 'rgba(255,255,255,0.28)',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '13px',
                }}
              >
                No results found
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Search result row ─────────────────────────────── */
function SearchResult({ item, onClick, isLast, getImageUrl }) {
  const [hovered, setHovered] = useState(false);
  const isTV = item.media_type === 'tv';

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 12px',
        cursor: 'pointer',
        background: hovered ? 'rgba(255,255,255,0.05)' : 'transparent',
        borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.04)',
        transition: 'background 0.15s ease',
      }}
    >
      {/* Poster */}
      <img
        src={getImageUrl(item.poster_path)}
        alt={item.title || item.name}
        style={{
          width: 40,
          height: 60,
          objectFit: 'cover',
          borderRadius: '6px',
          flexShrink: 0,
          background: '#111114',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
          transition: 'transform 0.2s ease',
        }}
      />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
            fontWeight: '600',
            color: hovered
              ? 'rgba(255,255,255,0.98)'
              : 'rgba(255,255,255,0.85)',
            marginBottom: '5px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            transition: 'color 0.15s ease',
          }}
        >
          {item.title || item.name}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            flexWrap: 'wrap',
          }}
        >
          {/* Type badge */}
          <span
            style={{
              display: 'inline-block',
              padding: '2px 7px',
              background: isTV
                ? 'rgba(96,165,250,0.15)'
                : 'rgba(255,193,60,0.12)',
              border: `1px solid ${isTV ? 'rgba(96,165,250,0.3)' : 'rgba(255,193,60,0.25)'}`,
              borderRadius: '4px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '9px',
              fontWeight: '700',
              color: isTV ? '#60a5fa' : '#ffc13c',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {isTV ? 'TV' : 'Movie'}
          </span>

          {/* Year */}
          {(item.release_date || item.first_air_date) && (
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '12px',
                fontWeight: '500',
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.02em',
              }}
            >
              {new Date(item.release_date || item.first_air_date).getFullYear()}
            </span>
          )}

          {/* Rating */}
          {item.vote_average > 0 && (
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '12px',
                fontWeight: '600',
                color: '#ffc13c',
                letterSpacing: '0.02em',
              }}
            >
              ★ {item.vote_average.toFixed(1)}
            </span>
          )}
        </div>
      </div>

      {/* Arrow hint on hover */}
      <div
        style={{
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.15s ease',
          color: 'rgba(255,193,60,0.6)',
          flexShrink: 0,
          fontSize: '16px',
        }}
      >
        →
      </div>
    </div>
  );
}
