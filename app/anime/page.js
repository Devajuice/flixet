'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import TVCard from '@/components/TVCard';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function AnimePage() {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);

  useEffect(() => {
    fetchAnime(1, true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          fetchAnime(currentPage + 1, false);
        }
      },
      { threshold: 0.1 },
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [hasMore, loading, loadingMore, currentPage]);

  const fetchAnime = async (page, reset = false) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=16&with_origin_country=JP&sort_by=popularity.desc&page=${page}`,
      );
      const data = await response.json();
      if (reset) {
        setAnimeList(data.results || []);
      } else {
        setAnimeList((prev) => {
          const existingIds = new Set(prev.map((a) => a.id));
          const newAnime = (data.results || []).filter(
            (a) => !existingIds.has(a.id),
          );
          return [...prev, ...newAnime];
        });
      }
      setCurrentPage(page);
      setHasMore(page < data.total_pages && page < 500);
    } catch (error) {
      console.error('Error fetching anime:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: '18px',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              border: '3px solid rgba(255,193,60,0.12)',
              borderTopColor: '#ffc13c',
              borderRadius: '50%',
              animation: 'spin 0.9s linear infinite',
            }}
          />
          <p
            style={{
              color: 'rgba(255,255,255,0.35)',
              fontSize: '14px',
              margin: 0,
              letterSpacing: '0.02em',
            }}
          >
            Loading anime...
          </p>
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

        .anime-page {
          padding: 20px;
          padding-bottom: 100px;
          max-width: 1600px;
          margin: 0 auto;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Header ──────────────────────────────── */
        .page-header {
          margin-bottom: 32px;
        }
        .page-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 42px;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: rgba(255, 255, 255, 0.95);
          margin: 0 0 6px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .page-title span {
          color: #ffc13c;
        }
        .page-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.35);
          margin: 0;
          letter-spacing: 0.01em;
        }

        /* ── Grid ────────────────────────────────── */
        .anime-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 20px;
          margin-bottom: 60px;
        }

        @media (min-width: 1024px) {
          .anime-grid {
            grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
            gap: 24px;
          }
        }

        @media (max-width: 768px) {
          .anime-page {
            padding: 15px;
            padding-bottom: 80px;
          }
          .page-title {
            font-size: 28px;
          }
          .anime-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }

        @media (max-width: 480px) {
          .anime-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
        }

        /* ── Load more / end ─────────────────────── */
        .observer-target {
          min-height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 20px;
        }
        .loading-more {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .loading-more p {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.3);
          margin: 0;
          letter-spacing: 0.02em;
        }
        .end-message {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.25);
          letter-spacing: 0.02em;
        }

        /* ── No results ──────────────────────────── */
        .no-results {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 40vh;
          gap: 12px;
        }
        .no-results p {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: rgba(255, 255, 255, 0.3);
          margin: 0;
        }
      `}</style>

      <motion.div
        className="anime-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="page-header">
          <h1 className="page-title">
            <Sparkles size={30} color="#ffc13c" />
            Anime <span>Series</span>
          </h1>
          <p className="page-subtitle">Popular anime series from Japan</p>
        </div>

        {!animeList.length ? (
          <div className="no-results">
            <Sparkles size={40} color="rgba(255,193,60,0.2)" />
            <p>No anime found.</p>
          </div>
        ) : (
          <>
            <div className="anime-grid">
              {animeList.map((show, index) => (
                <motion.div
                  key={show.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.02, 0.4) }}
                >
                  <TVCard show={show} />
                </motion.div>
              ))}
            </div>

            <div ref={observerTarget} className="observer-target">
              {loadingMore && (
                <div className="loading-more">
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      border: '3px solid rgba(255,193,60,0.12)',
                      borderTopColor: '#ffc13c',
                      borderRadius: '50%',
                      animation: 'spin 0.9s linear infinite',
                    }}
                  />
                  <p>Loading more anime...</p>
                </div>
              )}
              {!hasMore && animeList.length > 0 && (
                <div className="end-message">
                  <Sparkles size={14} color="#ffc13c" />
                  {animeList.length} series loaded
                </div>
              )}
            </div>
          </>
        )}
      </motion.div>
    </>
  );
}
