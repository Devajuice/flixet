'use client';
import { motion } from 'framer-motion';
import { useWatchlist } from '@/context/WatchlistContext';
import { Trash2, Bookmark, Film } from 'lucide-react';
import Link from 'next/link';
import WatchlistCard from '@/components/WatchlistCard';

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist, clearWatchlist, loading } =
    useWatchlist();

  if (loading) {
    return (
      <div style={styles.loading}>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
          }}
        >
          Loading watchlist…
        </p>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        /* ── Page ──────────────────────────────────────── */
        .wl-page {
          padding: 20px;
          padding-bottom: 100px;
          min-height: 80vh;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Header ────────────────────────────────────── */
        .wl-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .wl-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 38px;
          font-weight: 900;
          color: rgba(255, 255, 255, 0.88);
          margin: 0 0 6px;
          letter-spacing: -0.03em;
        }

        .wl-count {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.25);
          text-transform: uppercase;
          letter-spacing: 0.09em;
        }

        /* ── Clear button ──────────────────────────────── */
        .wl-clear-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          background: transparent;
          color: rgba(255, 255, 255, 0.38) !important;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.01em;
        }

        .wl-clear-btn:hover {
          border-color: rgba(255, 193, 60, 0.3);
          color: #ffc13c !important;
          background: rgba(255, 193, 60, 0.05);
        }

        /* ── Grid ──────────────────────────────────────── */
        .wl-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 20px;
        }

        /* ── Empty state ───────────────────────────────── */
        .wl-empty {
          text-align: center;
          padding: 80px 20px;
        }

        .wl-empty-icon {
          width: 72px;
          height: 72px;
          background: rgba(255, 193, 60, 0.06);
          border: 1px solid rgba(255, 193, 60, 0.15);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: #ffc13c;
        }

        .wl-empty h2 {
          font-family: 'DM Sans', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.88);
          margin: 0 0 10px;
          letter-spacing: -0.02em;
        }

        .wl-empty p {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.35);
          margin: 0 0 28px;
          line-height: 1.85;
        }

        .wl-browse-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 11px 24px;
          background: #ffc13c;
          color: #0d0d0f !important;
          border: none;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: opacity 0.2s ease;
        }

        .wl-browse-btn:hover {
          opacity: 0.88;
          color: #0d0d0f !important;
        }

        /* ── Responsive ────────────────────────────────── */
        @media (max-width: 768px) {
          .wl-page {
            padding: 15px;
            padding-bottom: 80px;
          }
          .wl-title {
            font-size: 28px;
          }
          .wl-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 15px;
          }
        }
      `}</style>

      <motion.div
        className="wl-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="wl-header">
          <div>
            <h1 className="wl-title">My Watchlist</h1>
            <p className="wl-count">
              {watchlist.length} {watchlist.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {watchlist.length > 0 && (
            <motion.button
              className="wl-clear-btn"
              onClick={clearWatchlist}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 size={15} />
              Clear All
            </motion.button>
          )}
        </div>

        {watchlist.length === 0 ? (
          <div className="wl-empty">
            <div className="wl-empty-icon">
              <Bookmark size={32} />
            </div>
            <h2>Your watchlist is empty</h2>
            <p>Start adding Movies and TV Shows to watch later!</p>
            <Link href="/movies">
              <motion.button
                className="wl-browse-btn"
                whileTap={{ scale: 0.95 }}
              >
                <Film size={15} />
                Browse Movies
              </motion.button>
            </Link>
          </div>
        ) : (
          <div className="wl-grid">
            {watchlist.map((item, index) => (
              <WatchlistCard
                key={`${item.type}-${item.id}-${index}`}
                item={item}
                onRemove={removeFromWatchlist}
              />
            ))}
          </div>
        )}
      </motion.div>
    </>
  );
}

const styles = {
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
  },
};
