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
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchContent = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(
          searchQuery
        )}&page=1`
      );
      const data = await response.json();

      const filtered = data.results
        .filter(
          (item) => item.media_type === 'movie' || item.media_type === 'tv'
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
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const getImageUrl = (path) => {
    return path
      ? `https://image.tmdb.org/t/p/w92${path}`
      : 'https://via.placeholder.com/92x138/1a1a1a/666?text=No+Image';
  };

  return (
    <div ref={searchRef} style={styles.searchContainer}>
      <div style={styles.searchWrapper}>
        <Search size={18} style={styles.searchIcon} />
        <input
          type="text"
          style={styles.searchInput}
          placeholder="Search movies & TV shows..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
        />
        {query && (
          <button
            style={styles.clearButton}
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            style={styles.dropdown}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            {loading ? (
              <div style={styles.loadingText}>Searching...</div>
            ) : results.length > 0 ? (
              results.map((item) => (
                <div
                  key={`${item.media_type}-${item.id}`}
                  style={styles.resultItem}
                  onClick={() => handleResultClick(item)}
                >
                  <img
                    src={getImageUrl(item.poster_path)}
                    alt={item.title || item.name}
                    style={styles.resultImage}
                  />
                  <div style={styles.resultInfo}>
                    <div style={styles.resultTitle}>
                      {item.title || item.name}
                    </div>
                    <div style={styles.resultMeta}>
                      <span style={styles.mediaBadge}>
                        {item.media_type === 'movie' ? 'MOVIE' : 'TV'}
                      </span>
                      {(item.release_date || item.first_air_date) && (
                        <span>
                          {new Date(
                            item.release_date || item.first_air_date
                          ).getFullYear()}
                        </span>
                      )}
                      {item.vote_average > 0 && (
                        <span>⭐ {item.vote_average.toFixed(1)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.noResults}>No results found</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  searchContainer: {
    position: 'relative',
    width: '100%',
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  searchInput: {
    width: '100%',
    padding: '10px 45px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '25px',
    color: 'white',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  searchIcon: {
    position: 'absolute',
    left: '15px',
    color: 'rgba(255, 255, 255, 0.6)',
    pointerEvents: 'none',
    zIndex: 1,
  },
  clearButton: {
    position: 'absolute',
    right: '15px',
    background: 'none',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.6)',
    cursor: 'pointer',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.3s ease',
    zIndex: 1,
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 12px)',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(26, 26, 26, 0.98)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(229, 9, 20, 0.3)',
    borderRadius: '12px',
    maxHeight: '400px',
    overflowY: 'auto',
    zIndex: 1000,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
  },
  resultItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  resultImage: {
    width: '45px',
    height: '68px',
    objectFit: 'cover',
    borderRadius: '6px',
    flexShrink: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  resultInfo: {
    flex: 1,
    minWidth: 0,
  },
  resultTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'white',
    marginBottom: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  resultMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: 'var(--text-secondary)',
    flexWrap: 'wrap',
  },
  mediaBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    backgroundColor: 'var(--accent)',
    color: 'white',
    borderRadius: '10px',
    fontSize: '10px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  loadingText: {
    padding: '20px',
    textAlign: 'center',
    color: 'var(--text-secondary)',
    fontSize: '14px',
  },
  noResults: {
    padding: '20px',
    textAlign: 'center',
    color: 'var(--text-secondary)',
    fontSize: '14px',
  },
};
