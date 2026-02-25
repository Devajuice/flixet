'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TVGrid from '@/components/TVGrid';
import ComingSoon from '@/components/ComingSoon';
import AdvancedFilters from '@/components/AdvancedFilters';
import { motion } from 'framer-motion';
import { Tv, Sparkles } from 'lucide-react';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const TV_GENRE_MAP = {
  'action-adventure': 10759,
  comedy: 35,
  drama: 18,
  crime: 80,
  documentary: 99,
  'sci-fi-fantasy': 10765,
  reality: 10764,
  kids: 10762,
};

function TVContent() {
  const searchParams = useSearchParams();
  const genreParam = searchParams.get('genre');

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeFilters, setActiveFilters] = useState({});

  const observerTarget = useRef(null);

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    setShows([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchShows(1, true, filters);
  };

  useEffect(() => {
    setShows([]);
    setCurrentPage(1);
    setHasMore(true);
    setActiveFilters({});
    fetchShows(1, true);
  }, [genreParam]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          fetchShows(currentPage + 1, false, activeFilters);
        }
      },
      { threshold: 0.1 },
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [hasMore, loading, loadingMore, currentPage, activeFilters]);

  const fetchShows = async (page, reset = false, filters = {}) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);

    try {
      let url = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&page=${page}`;

      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          if (key === 'primary_release_date.gte')
            url += `&first_air_date.gte=${value}`;
          else if (key === 'primary_release_date.lte')
            url += `&first_air_date.lte=${value}`;
          else if (key === 'with_runtime_gte')
            url += `&with_runtime.gte=${value}`;
          else if (key === 'with_runtime_lte')
            url += `&with_runtime.lte=${value}`;
          else url += `&${key}=${value}`;
        }
      });

      if (genreParam && TV_GENRE_MAP[genreParam] && !filters.with_genres) {
        url += `&with_genres=${TV_GENRE_MAP[genreParam]}`;
      }
      if (!filters.sort_by) url += '&sort_by=popularity.desc';

      const response = await fetch(url);
      const data = await response.json();

      if (reset) {
        setShows(data.results || []);
      } else {
        setShows((prev) => {
          const existingIds = new Set(prev.map((s) => s.id));
          const newShows = (data.results || []).filter(
            (show) => !existingIds.has(show.id),
          );
          return [...prev, ...newShows];
        });
      }

      setCurrentPage(page);
      setHasMore(page < data.total_pages && page < 500);
    } catch (error) {
      console.error('Error fetching TV shows:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const getGenreTitle = () => {
    if (!genreParam) return null;
    return genreParam
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const genreTitle = getGenreTitle();

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
          <p style={styles.loadingText}>Loading TV shows...</p>
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

        .page-wrap {
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Header ──────────────────────────────────── */
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
          color: rgba(255, 255, 255, 0.38);
          margin: 0;
          letter-spacing: 0.01em;
        }

        /* ── Filters toolbar ─────────────────────────── */
        .filters-toolbar {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 32px;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          min-height: 58px;
        }

        /* ── No results ──────────────────────────────── */
        .no-results {
          text-align: center;
          padding: 80px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
        }
        .no-results p {
          font-family: 'DM Sans', sans-serif;
          font-size: 17px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
        }

        /* ── Observer / end zone ─────────────────────── */
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
          color: rgba(255, 255, 255, 0.35);
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
          color: rgba(255, 255, 255, 0.3);
          margin: 0;
          letter-spacing: 0.02em;
        }

        /* ── Responsive ──────────────────────────────── */
        @media (max-width: 768px) {
          .page-title {
            font-size: 28px;
          }
          .filters-toolbar {
            padding: 14px 16px;
          }
        }
        @media (max-width: 480px) {
          .page-title {
            font-size: 24px;
          }
          .filters-toolbar {
            padding: 12px 14px;
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
            <Tv size={28} color="#ffc13c" />
          </div>
          <h1 className="page-title">
            {genreTitle ? (
              <>
                {genreTitle} <span>TV Shows</span>
              </>
            ) : (
              <>
                Popular <span>TV Shows</span>
              </>
            )}
          </h1>
          {genreParam && (
            <p className="page-subtitle">
              Discover {genreParam.replace(/-/g, ' ')} TV shows
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
            <ComingSoon type="tv" />
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          className="filters-toolbar"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <AdvancedFilters
            type="tv"
            onFilterChange={handleFilterChange}
            initialFilters={activeFilters}
          />
        </motion.div>

        {/* Grid */}
        {!Array.isArray(shows) || shows.length === 0 ? (
          <motion.div
            className="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Tv size={44} color="rgba(255,255,255,0.12)" />
            <p>No TV shows found with these filters.</p>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <TVGrid shows={shows} />
            </motion.div>

            <div ref={observerTarget} className="observer-zone">
              {loadingMore && (
                <motion.div
                  className="loading-more"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="spinner-sm" />
                  <p>Loading more shows...</p>
                </motion.div>
              )}
              {!hasMore && shows.length > 0 && (
                <motion.div
                  className="end-message"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Sparkles size={18} color="#ffc13c" />
                  <p>You've explored all {shows.length} shows!</p>
                </motion.div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default function TVPage() {
  return (
    <Suspense
      fallback={
        <div style={styles.loading}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Loading TV shows...</p>
        </div>
      }
    >
      <TVContent />
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
    border: '4px solid rgba(255,193,60,0.1)',
    borderTopColor: '#ffc13c',
    borderRadius: '50%',
    animation: 'spin 0.9s linear infinite',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: '14px',
    fontFamily: "'DM Sans', sans-serif",
    margin: 0,
    letterSpacing: '0.02em',
  },
};
