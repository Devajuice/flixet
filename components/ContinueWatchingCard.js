'use client';
import Link from 'next/link';
import { X, Play } from 'lucide-react';
import { useContinueWatching } from '@/context/ContinueWatchingContext';

export default function ContinueWatchingCard({ item }) {
  const { removeFromContinueWatching } = useContinueWatching();

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromContinueWatching(item.id, item.type);
  };

  const getEpisodeInfo = () => {
    if (item.type === 'tv' && item.season && item.episode) {
      return `S${item.season} E${item.episode}`;
    }
    return null;
  };

  const imageUrl = item.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}`
    : item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : '/placeholder.jpg';

  const linkUrl =
    item.type === 'tv'
      ? `/tv/${item.id}?season=${item.season}&episode=${item.episode}`
      : `/movie/${item.id}`;

  return (
    <Link href={linkUrl} className="continue-watching-card">
      <div className="card-container">
        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="remove-btn"
          aria-label="Remove from continue watching"
        >
          <X size={12} />
        </button>

        {/* Thumbnail */}
        <div className="thumbnail">
          <img src={imageUrl} alt={item.title || item.name} loading="lazy" />

          {/* Play Overlay */}
          <div className="play-overlay">
            <div className="play-btn">
              <span className="play-icon" />
              Play
            </div>
          </div>
        </div>

        {/* Content Info */}
        <div className="card-info">
          <h3 className="title">{item.title || item.name}</h3>
          {getEpisodeInfo() && (
            <p className="episode-info">{getEpisodeInfo()}</p>
          )}
        </div>
      </div>

      <style jsx>{`
        .continue-watching-card {
          display: block;
          text-decoration: none;
          color: inherit;
          width: 100%;
        }

        /* ── Card shell ────────────────────────── */
        .card-container {
          position: relative;
          background: #0d0d0f;
          border-radius: 9px;
          overflow: hidden;
          box-shadow:
            0 2px 8px rgba(0, 0, 0, 0.55),
            0 0 0 1px rgba(255, 255, 255, 0.04);
          transition:
            transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.3s ease;
          isolation: isolate;
        }

        .card-container:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow:
            0 14px 32px rgba(0, 0, 0, 0.7),
            0 0 0 1px rgba(255, 193, 60, 0.25),
            0 0 24px rgba(255, 193, 60, 0.08);
        }

        .card-container:active {
          transform: scale(0.97);
          transition-duration: 0.1s;
        }

        /* ── Remove button ─────────────────────── */
        .remove-btn {
          position: absolute;
          top: 7px;
          right: 7px;
          z-index: 10;
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.8);
          opacity: 0;
          transform: translateY(-3px);
          transition:
            opacity 0.2s ease,
            transform 0.2s ease,
            background 0.2s ease;
          backdrop-filter: blur(4px);
        }

        .card-container:hover .remove-btn {
          opacity: 1;
          transform: translateY(0);
        }

        .remove-btn:hover {
          background: rgba(220, 50, 50, 0.85);
          border-color: transparent;
          color: white;
        }

        /* ── Thumbnail ─────────────────────────── */
        .thumbnail {
          position: relative;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #111114;
        }

        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition:
            transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            filter 0.4s ease;
        }

        .card-container:hover .thumbnail img {
          transform: scale(1.06);
          filter: brightness(0.5) saturate(1.1);
        }

        /* ── Bottom vignette ───────────────────── */
        .thumbnail::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: linear-gradient(
            to top,
            rgba(13, 13, 15, 0.88) 0%,
            transparent 100%
          );
          pointer-events: none;
          z-index: 1;
        }

        /* ── Play overlay ──────────────────────── */
        .play-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .card-container:hover .play-overlay {
          opacity: 1;
        }

        .play-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 193, 60, 0.92);
          color: #0d0d0f;
          padding: 7px 14px;
          border-radius: 50px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          box-shadow: 0 4px 16px rgba(255, 193, 60, 0.4);
          transform: scale(0.88);
          transition: transform 0.2s ease;
          white-space: nowrap;
        }

        .card-container:hover .play-btn {
          transform: scale(1);
        }

        .play-icon {
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 4px 0 4px 7px;
          border-color: transparent transparent transparent #0d0d0f;
          flex-shrink: 0;
        }

        /* ── Info panel ────────────────────────── */
        .card-info {
          padding: 8px 10px 9px;
          background: #0d0d0f;
          border-top: 1px solid rgba(255, 255, 255, 0.045);
        }

        .title {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          margin: 0 0 3px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: 0.01em;
          transition: color 0.2s;
        }

        .card-container:hover .title {
          color: #ffc13c;
        }

        .episode-info {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.38);
          margin: 0;
          letter-spacing: 0.04em;
        }
      `}</style>
    </Link>
  );
}
