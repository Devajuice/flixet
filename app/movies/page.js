'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MovieCard from '@/components/MovieCard';
import ComingSoon from '@/components/ComingSoon';
import AdvancedFilters from '@/components/AdvancedFilters';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Sparkles, TrendingUp, X } from 'lucide-react';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

function MoviesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const genreParam = searchParams.get('genre');

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeFilters, setActiveFilters] = useState({});
  const [totalResults, setTotalResults] = useState(0);

  const observerTarget = useRef(null);

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    setMovies([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchMovies(1, true, filters);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setMovies([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchMovies(1, true, {});
  };

  useEffect(() => {
    setMovies([]);
    setCurrentPage(1);
    setHasMore(true);
    setActiveFilters({});
    fetchMovies(1, true);
  }, [genreParam]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          fetchMovies(currentPage + 1, false, activeFilters);
        }
      },
      { threshold: 0.1 },
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [hasMore, loading, loadingMore, currentPage, activeFilters]);

  const fetchMovies = async (page, reset = false, filters = {}) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);

    try {
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}`;
      Object.entries(filters).forEach(([key, value]) => {
        if (value) url += `&${key}=${value}`;
      });

      if (genreParam && !filters.with_genres) {
        const GENRE_MAP = {
          action: 28,
          comedy: 35,
          drama: 18,
          horror: 27,
          'sci-fi': 878,
          thriller: 53,
          romance: 10749,
          animation: 16,
        };
        if (GENRE_MAP[genreParam])
          url += `&with_genres=${GENRE_MAP[genreParam]}`;
      }

      if (!filters.sort_by) url += '&sort_by=popularity.desc';

      const response = await fetch(url);
      const data = await response.json();

      if (reset) {
        setMovies(data.results || []);
        setTotalResults(data.total_results || 0);
      } else {
        setMovies((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newMovies = (data.results || []).filter(
            (movie) => !existingIds.has(movie.id),
          );
          return [...prev, ...newMovies];
        });
      }

      setCurrentPage(page);
      setHasMore(page < data.total_pages && page < 500);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const getGenreTitle = () => {
    if (!genreParam) return 'Popular Movies';
    return (
      genreParam
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') + ' Movies'
    );
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  if (loading) {
    return (
      <>
        <style jsx>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
        <div style={styles.loading}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Discovering amazing movies...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ── Page wrapper ──────────────────────────── */
        .page-wrap {
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Header ────────────────────────────────── */
        .page-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .header-icon {
          display: flex;
          justify-content: center;
          margin-bottom: 14px;
          opacity: 0.9;
        }

        .page-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 38px;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin: 0 0 10px;
          color: rgba(255, 255, 255, 0.95);
        }

        .page-title span {
          color: #ffc13c;
        }

        .page-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.45);
          margin: 0;
          letter-spacing: 0.01em;
        }

        /* ── Stats bar ─────────────────────────────── */
        .stats-bar {
          display: flex;
          gap: 6px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .stat-chip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 14px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 50px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 0.02em;
        }

        .stat-chip strong {
          color: #ffc13c;
          font-weight: 700;
        }

        /* ── Filters toolbar ───────────────────────── */
        .filters-section {
          margin-bottom: 32px;
        }

        .filters-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .clear-filters-btn {
          padding: 7px 16px;
          background: transparent;
          border: 1px solid rgba(255, 193, 60, 0.35);
          border-radius: 8px;
          color: #ffc13c;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          letter-spacing: 0.02em;
          transition:
            background 0.2s ease,
            border-color 0.2s ease;
        }

        .clear-filters-btn:hover {
          background: rgba(255, 193, 60, 0.1);
          border-color: rgba(255, 193, 60, 0.6);
        }

        /* ── Filter tags ───────────────────────────── */
        .filter-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .filter-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(255, 193, 60, 0.08);
          border: 1px solid rgba(255, 193, 60, 0.25);
          border-radius: 50px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          color: #ffc13c;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition:
            background 0.2s ease,
            border-color 0.2s ease;
        }

        .filter-tag:hover {
          background: rgba(255, 193, 60, 0.16);
          border-color: rgba(255, 193, 60, 0.5);
        }

        /* ── Movie grid ────────────────────────────── */
        .movie-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
          animation: fadeUp 0.4s ease-out;
        }

        /* ── No results ────────────────────────────── */
        .no-results {
          text-align: center;
          padding: 80px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
        }

        .no-results-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.85);
          margin: 0;
        }

        .no-results-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.38);
          margin: 0;
        }

        .reset-btn {
          margin-top: 6px;
          padding: 10px 22px;
          background: #ffc13c;
          border: none;
          border-radius: 8px;
          color: #0d0d0f;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: opacity 0.2s;
        }

        .reset-btn:hover {
          opacity: 0.88;
        }

        /* ── Load more / end ───────────────────────── */
        .observer-zone {
          min-height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 32px;
        }

        .loading-more {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .spinner-sm {
          width: 30px;
          height: 30px;
          border: 3px solid rgba(255, 193, 60, 0.12);
          border-top-color: #ffc13c;
          border-radius: 50%;
          animation: spin 0.9s linear infinite;
        }

        .loading-more p {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.4);
          margin: 0;
        }

        .end-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .end-message p {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.35);
          margin: 0;
          letter-spacing: 0.02em;
        }

        /* ── Responsive ────────────────────────────── */
        @media (max-width: 768px) {
          .page-title {
            font-size: 28px;
          }
          .movie-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }
          .filters-toolbar {
            flex-direction: column;
            align-items: stretch;
            padding: 14px 16px;
          }
          .stats-bar {
            gap: 6px;
          }
        }

        @media (max-width: 480px) {
          .page-title {
            font-size: 24px;
          }
          .movie-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }

        @media (min-width: 1024px) {
          .movie-grid {
            grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
            gap: 24px;
          }
        }
      `}</style>

      <div className="page-wrap">
        {/* Header */}
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="header-icon">
            <Film size={28} color="#ffc13c" />
          </div>
          <h1 className="page-title">
            {genreParam ? (
              <>
                {genreParam
                  .split('-')
                  .map((w) => w[0].toUpperCase() + w.slice(1))
                  .join(' ')}{' '}
                <span>Movies</span>
              </>
            ) : (
              <>
                Popular <span>Movies</span>
              </>
            )}
          </h1>
          {genreParam && (
            <p className="page-subtitle">
              Explore our curated collection of {genreParam.replace('-', ' ')}{' '}
              movies
            </p>
          )}
        </motion.div>

        {/* Coming Soon */}
        {!genreParam && (
          <motion.div
            style={{ marginBottom: '48px' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <ComingSoon type="movie" />
          </motion.div>
        )}

        {/* Stats */}
        {totalResults > 0 && (
          <motion.div
            className="stats-bar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <div className="stat-chip">
              <TrendingUp size={13} color="#ffc13c" />
              <strong>{totalResults.toLocaleString()}</strong> movies found
            </div>
            <div className="stat-chip">
              <Sparkles size={13} color="#ffc13c" />
              Showing <strong>{movies.length}</strong> results
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          className="filters-section"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="filters-toolbar">
            <AdvancedFilters
              type="movie"
              onFilterChange={handleFilterChange}
              initialFilters={activeFilters}
            />
            {hasActiveFilters && (
              <button className="clear-filters-btn" onClick={clearAllFilters}>
                Clear All
              </button>
            )}
          </div>

          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div
                className="filter-tags"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {Object.entries(activeFilters).map(([key, value]) => {
                  if (!value) return null;
                  return (
                    <motion.div
                      key={key}
                      className="filter-tag"
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.85, opacity: 0 }}
                      onClick={() => {
                        const newFilters = { ...activeFilters };
                        delete newFilters[key];
                        handleFilterChange(newFilters);
                      }}
                    >
                      <span>
                        {key.replace(/_/g, ' ')}: {value}
                      </span>
                      <X size={11} />
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Grid */}
        {!Array.isArray(movies) || movies.length === 0 ? (
          <motion.div
            className="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Film size={44} color="rgba(255,255,255,0.15)" />
            <p className="no-results-title">
              No movies found with these filters.
            </p>
            <p className="no-results-sub">
              Try adjusting your filters or browse all movies
            </p>
            {hasActiveFilters && (
              <button className="reset-btn" onClick={clearAllFilters}>
                Reset Filters
              </button>
            )}
          </motion.div>
        ) : (
          <>
            <div className="movie-grid">
              {movies.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.025, duration: 0.35 }}
                >
                  <MovieCard movie={movie} />
                </motion.div>
              ))}
            </div>

            <div ref={observerTarget} className="observer-zone">
              {loadingMore && (
                <motion.div
                  className="loading-more"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="spinner-sm" />
                  <p>Loading more movies...</p>
                </motion.div>
              )}
              {!hasMore && movies.length > 0 && (
                <motion.div
                  className="end-message"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Sparkles size={18} color="#ffc13c" />
                  <p>You've explored all {movies.length} movies!</p>
                </motion.div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default function MoviesPage() {
  return (
    <Suspense
      fallback={
        <div style={styles.loading}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Loading movies...</p>
        </div>
      }
    >
      <MoviesContent />
    </Suspense>
  );
}

const styles = {
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '18px',
    fontFamily: "'DM Sans', sans-serif",
  },
  spinner: {
    width: '44px',
    height: '44px',
    border: '4px solid rgba(255, 193, 60, 0.1)',
    borderTopColor: '#ffc13c',
    borderRadius: '50%',
    animation: 'spin 0.9s linear infinite',
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '14px',
    fontFamily: "'DM Sans', sans-serif",
    margin: 0,
    letterSpacing: '0.02em',
  },
};
