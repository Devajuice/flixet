'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Star, Play, Sparkles } from 'lucide-react';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function ComingSoon({ type = 'movie' }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComingSoon();
  }, [type]);

  const fetchComingSoon = async () => {
    setLoading(true);
    try {
      let url;
      if (type === 'movie') {
        url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1&region=US`;
      } else {
        url = `https://api.themoviedb.org/3/tv/on_the_air?api_key=${API_KEY}&language=en-US&page=1`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch coming soon items');
      }

      const data = await response.json();
      setItems(data.results?.slice(0, 12) || []);
    } catch (error) {
      console.error('Error fetching coming soon:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
        </div>
      </>
    );
  }

  if (items.length === 0) return null;

  return (
    <div style={styles.container}>
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .coming-soon-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(185px, 1fr));
          gap: 20px;
        }

        /* ── Card ────────────────────────────────────── */
        .coming-soon-card {
          background: #0d0d0f;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          box-shadow:
            0 2px 8px rgba(0, 0, 0, 0.55),
            0 0 0 1px rgba(255, 255, 255, 0.04);
          transition:
            transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.3s ease;
          isolation: isolate;
        }

        .coming-soon-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow:
            0 18px 40px rgba(0, 0, 0, 0.7),
            0 0 0 1px rgba(255, 193, 60, 0.25),
            0 0 30px rgba(255, 193, 60, 0.08);
        }

        .coming-soon-card:active {
          transform: scale(0.97);
          transition-duration: 0.1s;
        }

        /* ── Poster ──────────────────────────────────── */
        .poster-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition:
            transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            filter 0.4s ease;
        }

        .coming-soon-card:hover .poster-image {
          transform: scale(1.06);
          filter: brightness(0.5) saturate(1.1);
        }

        /* ── Bottom vignette ─────────────────────────── */
        .poster-container::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 55%;
          background: linear-gradient(
            to top,
            rgba(13, 13, 15, 0.92) 0%,
            rgba(13, 13, 15, 0.3) 55%,
            transparent 100%
          );
          pointer-events: none;
          z-index: 1;
        }

        /* ── Badge ───────────────────────────────────── */
        .badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(255, 193, 60, 0.15);
          border: 1px solid rgba(255, 193, 60, 0.4);
          color: #ffc13c;
          padding: 4px 9px;
          border-radius: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 4px;
          backdrop-filter: blur(6px);
          transition:
            background 0.3s ease,
            border-color 0.3s ease;
        }

        .coming-soon-card:hover .badge {
          background: rgba(255, 193, 60, 0.28);
          border-color: rgba(255, 193, 60, 0.7);
        }

        /* ── Play overlay ────────────────────────────── */
        .hover-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 1;
        }

        .coming-soon-card:hover .hover-overlay {
          opacity: 1;
        }

        .play-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 193, 60, 0.92);
          color: #0d0d0f;
          padding: 11px 22px;
          border-radius: 50px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          box-shadow: 0 4px 20px rgba(255, 193, 60, 0.45);
          transform: scale(0.88);
          transition: transform 0.2s ease;
          white-space: nowrap;
        }

        .coming-soon-card:hover .play-btn {
          transform: scale(1);
        }

        .play-icon {
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 5px 0 5px 9px;
          border-color: transparent transparent transparent #0d0d0f;
          flex-shrink: 0;
        }

        /* ── Info panel ──────────────────────────────── */
        .card-info {
          padding: 12px 14px 14px;
          background: #0d0d0f;
          border-top: 1px solid rgba(255, 255, 255, 0.045);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .item-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.35;
          color: rgba(255, 255, 255, 0.92);
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          min-height: 36px;
          letter-spacing: 0.01em;
          transition: color 0.2s;
        }

        .coming-soon-card:hover .item-title {
          color: #ffc13c;
        }

        .meta {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 0.02em;
        }

        .meta-item svg {
          flex-shrink: 0;
          opacity: 0.7;
        }

        .rating-value {
          color: #ffc13c;
          font-weight: 600;
        }

        /* ── Section header ──────────────────────────── */
        .section-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.92);
          display: flex;
          align-items: center;
          gap: 10px;
          letter-spacing: -0.02em;
        }

        .title-accent {
          color: #ffc13c;
        }

        .view-all {
          font-family: 'DM Sans', sans-serif;
          color: #ffc13c;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.02em;
          opacity: 0.85;
          transition: opacity 0.2s ease;
          display: inline-block;
        }

        .view-all:hover {
          opacity: 1;
        }

        /* ── Responsive ──────────────────────────────── */
        @media (max-width: 768px) {
          .coming-soon-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .section-title {
            font-size: 22px;
          }
        }

        @media (max-width: 480px) {
          .coming-soon-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .section-title {
            font-size: 19px;
          }
        }
      `}</style>

      <div style={styles.header}>
        <h2 className="section-title">
          <Sparkles size={22} color="#ffc13c" />
          Coming Soon
          <span className="title-accent">•</span>
          {type === 'movie' ? 'Movies' : 'TV Shows'}
        </h2>
        <Link
          href={type === 'movie' ? '/coming-soon/movies' : '/coming-soon/tv'}
        >
          <motion.span
            className="view-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All →
          </motion.span>
        </Link>
      </div>

      <div className="coming-soon-grid">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.3 }}
          >
            <Link
              href={type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`}
              style={styles.cardLink}
            >
              <div className="coming-soon-card">
                {/* Poster */}
                <div
                  style={styles.posterContainer}
                  className="poster-container"
                >
                  <img
                    src={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : '/placeholder.png'
                    }
                    alt={item.title || item.name}
                    className="poster-image"
                    loading="lazy"
                  />

                  {/* Badge */}
                  <div className="badge">
                    <Sparkles size={9} />
                    Coming Soon
                  </div>

                  {/* Play overlay */}
                  <div className="hover-overlay">
                    <div className="play-btn">
                      <span className="play-icon" />
                      Play
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="card-info">
                  <h3 className="item-title">{item.title || item.name}</h3>
                  <div className="meta">
                    <div className="meta-item">
                      <Calendar size={12} />
                      <span>
                        {formatDate(item.release_date || item.first_air_date)}
                      </span>
                    </div>
                    {item.vote_average > 0 && (
                      <div className="meta-item">
                        <Star size={12} fill="#ffc13c" color="#ffc13c" />
                        <span className="rating-value">
                          {item.vote_average.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginBottom: '60px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(255, 193, 60, 0.1)',
    borderTop: '4px solid #ffc13c',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  cardLink: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
  },
  posterContainer: {
    position: 'relative',
    aspectRatio: '2/3',
    overflow: 'hidden',
    backgroundColor: '#111114',
  },
};
