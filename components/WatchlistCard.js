"use client";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function WatchlistCard({ item, onRemove }) {
  const router = useRouter();

  const handleClick = () => {
    const path = item.type === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`;
    router.push(path);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove(item.id, item.type);
  };

  const title = item.title || item.name;
  const year =
    item.release_date || item.first_air_date
      ? new Date(item.release_date || item.first_air_date).getFullYear()
      : null;

  return (
    <>
      <style>{`
        .wc-wrapper {
          width: 100%;
          aspect-ratio: 2 / 3;
        }

        .wc-card {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          background: #0d0d0f;
          box-shadow:
            0 2px 8px rgba(0,0,0,0.55),
            0 0 0 1px rgba(255,255,255,0.04);
          transition:
            transform 0.3s cubic-bezier(0.34,1.56,0.64,1),
            box-shadow 0.3s ease;
          isolation: isolate;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        @media (hover: hover) {
          .wc-card:hover {
            transform: translateY(-6px) scale(1.02);
            box-shadow:
              0 18px 40px rgba(0,0,0,0.7),
              0 0 0 1px rgba(255,193,60,0.25),
              0 0 30px rgba(255,193,60,0.08);
          }
        }

        .wc-card:active {
          transform: scale(0.97);
          transition-duration: 0.1s;
        }

        /* Poster area */
        .wc-poster {
          position: relative;
          width: 100%;
          flex: 1;
          background: #111114;
          overflow: hidden;
        }

        .wc-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition:
            transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94),
            filter 0.4s ease;
        }

        @media (hover: hover) {
          .wc-card:hover .wc-img {
            transform: scale(1.06);
            filter: brightness(0.5) saturate(1.1);
          }
        }

        /* Bottom vignette */
        .wc-poster::before {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 55%;
          background: linear-gradient(
            to top,
            rgba(13,13,15,0.92) 0%,
            rgba(13,13,15,0.3) 55%,
            transparent 100%
          );
          pointer-events: none;
          z-index: 1;
        }

        /* Type badge */
        .wc-type-badge {
          position: absolute;
          top: 9px;
          left: 9px;
          z-index: 3;
          padding: 3px 8px;
          border-radius: 5px;
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          backdrop-filter: blur(6px);
        }

        .wc-type-badge.movie {
          background: rgba(255,193,60,0.15);
          border: 1px solid rgba(255,193,60,0.4);
          color: #ffc13c;
        }

        .wc-type-badge.tv {
          background: rgba(99,179,237,0.15);
          border: 1px solid rgba(99,179,237,0.4);
          color: #63b3ed;
        }

        /* Remove button — appears on hover */
        .wc-remove-btn {
          position: absolute;
          top: 9px;
          right: 9px;
          z-index: 4;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(13,13,15,0.85);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transform: translateY(-4px);
          transition:
            opacity 0.25s ease,
            transform 0.25s ease,
            background 0.2s ease,
            color 0.2s ease,
            border-color 0.2s ease;
          backdrop-filter: blur(6px);
        }

        .wc-card:hover .wc-remove-btn {
          opacity: 1;
          transform: translateY(0);
        }

        .wc-remove-btn:hover {
          background: rgba(239,68,68,0.2) !important;
          border-color: rgba(239,68,68,0.45) !important;
          color: #f87171 !important;
        }

        /* Touch: always show remove */
        @media (hover: none) {
          .wc-remove-btn {
            opacity: 1;
            transform: none;
          }
        }

        /* Play overlay */
        .wc-play-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        @media (hover: hover) and (min-width: 1024px) {
          .wc-card:hover .wc-play-overlay {
            opacity: 1;
            pointer-events: auto;
          }
        }

        .wc-play-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,193,60,0.92);
          color: #0d0d0f;
          padding: 11px 22px;
          border-radius: 50px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          box-shadow: 0 4px 20px rgba(255,193,60,0.45);
          transform: scale(0.88);
          transition: transform 0.2s ease;
          white-space: nowrap;
        }

        .wc-card:hover .wc-play-btn {
          transform: scale(1);
        }

        .wc-play-icon {
          width: 0; height: 0;
          border-style: solid;
          border-width: 5px 0 5px 9px;
          border-color: transparent transparent transparent #0d0d0f;
          flex-shrink: 0;
        }

        /* Info panel */
        .wc-info {
          padding: 10px 12px 11px;
          background: #0d0d0f;
          border-top: 1px solid rgba(255,255,255,0.045);
          display: flex;
          flex-direction: column;
          gap: 3px;
          flex-shrink: 0;
        }

        .wc-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          line-height: 1.3;
          color: rgba(255,255,255,0.92);
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          letter-spacing: 0.01em;
          transition: color 0.2s;
        }

        @media (hover: hover) {
          .wc-card:hover .wc-title { color: #ffc13c; }
        }

        .wc-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .wc-rating {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 600;
          color: #ffc13c;
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .wc-year {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.03em;
        }

        /* No poster fallback */
        .wc-no-poster {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #111114;
          color: rgba(255,255,255,0.15);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
        }
      `}</style>

      <div className="wc-wrapper">
        <div className="wc-card" onClick={handleClick}>
          {/* Poster */}
          <div className="wc-poster">
            {item.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={title}
                className="wc-img"
                loading="lazy"
                draggable="false"
              />
            ) : (
              <div className="wc-no-poster">
                <span style={{ fontSize: 32, opacity: 0.3 }}>🎬</span>
                <span>No poster</span>
              </div>
            )}

            {/* Type badge */}
            <div
              className={`wc-type-badge ${item.type === "tv" ? "tv" : "movie"}`}
            >
              {item.type === "tv" ? "TV" : "Movie"}
            </div>

            {/* Remove button */}
            <button
              className="wc-remove-btn"
              onClick={handleRemove}
              title="Remove from watchlist"
            >
              <Trash2 size={14} />
            </button>

            {/* Play overlay */}
            <div className="wc-play-overlay">
              <div className="wc-play-btn">
                <span className="wc-play-icon" />
                Play
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="wc-info">
            <h3 className="wc-title">{title}</h3>
            <div className="wc-meta">
              {item.vote_average > 0 && (
                <span className="wc-rating">
                  ★ {item.vote_average?.toFixed(1)}
                </span>
              )}
              {year && <span className="wc-year">{year}</span>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
