'use client';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Link from 'next/link';

export default function TVShowCard({ show }) {
  const imageUrl = show.poster_path
    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
    : '/placeholder.png';

  return (
    <>
      <style jsx global>{`
        .tvc-link {
          text-decoration: none;
          display: block;
        }

        .tvc-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s ease;
        }

        .tvc-card:hover {
          border-color: rgba(255, 193, 60, 0.2);
        }

        /* ── Image ─────────────────────────────────────── */
        .tvc-img-wrap {
          position: relative;
          width: 100%;
          padding-bottom: 150%;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.03);
        }

        .tvc-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .tvc-card:hover .tvc-img {
          transform: scale(1.05);
        }

        /* ── Overlay ───────────────────────────────────── */
        .tvc-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            transparent 55%,
            rgba(13, 13, 15, 0.95) 100%
          );
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 12px;
          opacity: 0;
          transition: opacity 0.25s ease;
        }

        .tvc-card:hover .tvc-overlay {
          opacity: 1;
        }

        .tvc-rating {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #ffc13c;
        }

        /* ── Info ──────────────────────────────────────── */
        .tvc-info {
          padding: 12px 14px 14px;
        }

        .tvc-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.88);
          margin: 0 0 5px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          letter-spacing: 0.01em;
          line-height: 1.4;
        }

        .tvc-date {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.3);
          letter-spacing: 0.04em;
          margin: 0;
        }
      `}</style>

      <Link href={`/tv/${show.id}`} className="tvc-link">
        <motion.div
          className="tvc-card"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="tvc-img-wrap">
            <img
              src={imageUrl}
              alt={show.name}
              className="tvc-img"
              loading="lazy"
            />
            <div className="tvc-overlay">
              <div className="tvc-rating">
                <Star size={13} fill="#ffc13c" color="#ffc13c" />
                {show.vote_average?.toFixed(1) || 'N/A'}
              </div>
            </div>
          </div>

          <div className="tvc-info">
            <h3 className="tvc-title">{show.name}</h3>
            <p className="tvc-date">
              {show.first_air_date
                ? new Date(show.first_air_date).getFullYear()
                : 'N/A'}
            </p>
          </div>
        </motion.div>
      </Link>
    </>
  );
}
