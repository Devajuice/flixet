'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trash2, Film, Tv, Star } from 'lucide-react';

export default function WatchlistCard({ item, onRemove }) {
  const href = `/${item.type === 'movie' ? 'movie' : 'tv'}/${item.id}`;

  return (
    <>
      <style jsx global>{`
        .wlc-wrap {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          position: relative;
          transition: border-color 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }

        .wlc-wrap:hover {
          border-color: rgba(255, 193, 60, 0.2);
        }

        .wlc-img {
          width: 100%;
          aspect-ratio: 2 / 3;
          object-fit: cover;
          display: block;
        }

        /* ── Type badge ────────────────────────────────── */
        .wlc-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          padding: 4px 9px;
          background: rgba(13, 13, 15, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.6);
          display: flex;
          align-items: center;
          gap: 5px;
          backdrop-filter: blur(6px);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          z-index: 2;
        }

        /* ── Remove button ─────────────────────────────── */
        .wlc-remove {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 32px;
          height: 32px;
          background: rgba(13, 13, 15, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 50%;
          color: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(6px);
          transition: all 0.2s ease;
          z-index: 3;
        }

        .wlc-remove:hover {
          background: rgba(255, 193, 60, 0.12);
          border-color: rgba(255, 193, 60, 0.3);
          color: #ffc13c;
        }

        /* ── Info ──────────────────────────────────────── */
        .wlc-info {
          padding: 12px;
        }

        .wlc-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.88);
          margin: 0 0 7px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          letter-spacing: 0.01em;
          line-height: 1.4;
        }

        .wlc-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.3);
          letter-spacing: 0.03em;
        }

        .wlc-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #ffc13c;
          font-weight: 700;
        }
      `}</style>

      <Link href={href} prefetch={false}>
        <motion.div
          className="wlc-wrap"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
        >
          <img
            src={
              item.poster_path
                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                : '/placeholder.png'
            }
            alt={item.title || item.name}
            className="wlc-img"
          />

          {/* Type badge */}
          <div className="wlc-badge">
            {item.type === 'movie' ? <Film size={11} /> : <Tv size={11} />}
            {item.type === 'movie' ? 'Movie' : 'TV'}
          </div>

          {/* Remove button */}
          <button
            className="wlc-remove"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove(item.id, item.type);
            }}
            aria-label="Remove from watchlist"
          >
            <Trash2 size={14} />
          </button>

          {/* Info */}
          <div className="wlc-info">
            <h3 className="wlc-name">{item.title || item.name}</h3>
            <div className="wlc-meta">
              <span className="wlc-rating">
                <Star size={11} fill="#ffc13c" />
                {item.vote_average?.toFixed(1) || 'N/A'}
              </span>
              <span>
                {item.release_date?.split('-')[0] ||
                  item.first_air_date?.split('-')[0] ||
                  'N/A'}
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </>
  );
}
