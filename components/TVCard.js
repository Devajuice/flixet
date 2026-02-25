'use client';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/lib/tmdb';
import WatchlistButton from './WatchlistButton';

export default function TVCard({ show }) {
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/tv/${show.id}`);
  };

  const title = show.name || show.title;
  const releaseDate = show.first_air_date || show.release_date;

  return (
    <>
      <style jsx>{`
        .card-wrapper {
          width: 100%;
          aspect-ratio: 2/3;
        }

        /* ── Card shell ──────────────────────────────── */
        .card {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          background: #0d0d0f;
          box-shadow:
            0 2px 8px rgba(0, 0, 0, 0.55),
            0 0 0 1px rgba(255, 255, 255, 0.04);
          transition:
            transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.3s ease;
          isolation: isolate;
        }

        @media (hover: hover) {
          .card:hover {
            transform: translateY(-6px) scale(1.02);
            box-shadow:
              0 18px 40px rgba(0, 0, 0, 0.7),
              0 0 0 1px rgba(255, 193, 60, 0.25),
              0 0 30px rgba(255, 193, 60, 0.08);
          }
        }

        .card:active {
          transform: scale(0.97);
          transition-duration: 0.1s;
        }

        /* ── Poster image area ───────────────────────── */
        .image-container {
          position: relative;
          width: 100%;
          flex: 1;
          background: #111114;
          overflow: hidden;
        }

        .poster-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          user-select: none;
          -webkit-user-drag: none;
          transition:
            transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            filter 0.4s ease;
        }

        @media (hover: hover) {
          .card:hover .poster-image {
            transform: scale(1.06);
            filter: brightness(0.55) saturate(1.1);
          }
        }

        /* ── Bottom gradient vignette ────────────────── */
        .image-container::before {
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

        /* ── Watchlist button ────────────────────────── */
        .watchlist-overlay {
          position: absolute;
          top: 9px;
          right: 9px;
          z-index: 3;
          opacity: 0;
          transform: translateY(-4px);
          transition:
            opacity 0.25s ease,
            transform 0.25s ease;
        }

        .card:hover .watchlist-overlay {
          opacity: 1;
          transform: translateY(0);
        }

        @media (hover: none) {
          .watchlist-overlay {
            opacity: 1;
            transform: none;
          }
        }

        /* ── Play overlay ────────────────────────────── */
        .overlay {
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
          .card:hover .overlay {
            opacity: 1;
            pointer-events: auto;
          }
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

        .card:hover .play-btn {
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
        .info {
          padding: 8px 10px 9px;
          min-height: 48px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 3px;
          background: #0d0d0f;
          border-top: 1px solid rgba(255, 255, 255, 0.045);
        }

        .title {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          line-height: 1.3;
          color: rgba(255, 255, 255, 0.92);
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
          .card:hover .title {
            color: #ffc13c;
          }
        }

        .meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 4px;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 3px;
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          font-weight: 600;
          color: #ffc13c;
          letter-spacing: 0.02em;
        }

        .star {
          font-size: 8px;
          line-height: 1;
        }

        .year {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.38);
          letter-spacing: 0.04em;
        }

        /* ── Responsive scaling ──────────────────────── */
        @media (min-width: 480px) {
          .card {
            border-radius: 11px;
          }
          .info {
            padding: 9px 11px 10px;
            min-height: 52px;
          }
          .title {
            font-size: 12px;
          }
          .rating,
          .year {
            font-size: 10px;
          }
          .star {
            font-size: 9px;
          }
        }

        @media (min-width: 640px) {
          .card {
            border-radius: 12px;
          }
          .info {
            padding: 10px 12px 11px;
            min-height: 58px;
          }
          .title {
            font-size: 13px;
          }
          .rating,
          .year {
            font-size: 11px;
          }
          .play-btn {
            font-size: 14px;
            padding: 12px 24px;
          }
        }

        @media (min-width: 768px) {
          .info {
            padding: 11px 13px 12px;
            min-height: 62px;
          }
          .title {
            font-size: 13.5px;
          }
        }

        @media (min-width: 1024px) {
          .card {
            border-radius: 13px;
          }
          .info {
            padding: 12px 14px 13px;
            min-height: 68px;
          }
          .title {
            font-size: 14px;
          }
          .rating,
          .year {
            font-size: 12px;
          }
          .star {
            font-size: 11px;
          }
          .watchlist-overlay {
            top: 10px;
            right: 10px;
          }
        }
      `}</style>

      <div className="card-wrapper">
        <div className="card" onClick={handleClick}>
          <div className="image-container">
            <img
              src={getImageUrl(show.poster_path)}
              alt={title}
              className="poster-image"
              loading="lazy"
              draggable="false"
            />

            <div className="watchlist-overlay">
              <WatchlistButton
                item={{
                  id: show.id,
                  type: 'tv',
                  name: title,
                  title: title,
                  poster_path: show.poster_path,
                  vote_average: show.vote_average,
                  first_air_date: releaseDate,
                }}
                variant="default"
              />
            </div>

            <div className="overlay">
              <div className="play-btn">
                <span className="play-icon" />
                Play
              </div>
            </div>
          </div>

          <div className="info">
            <h3 className="title">{title}</h3>
            <div className="meta">
              <span className="rating">
                <span className="star">★</span>
                {show.vote_average?.toFixed(1) || 'N/A'}
              </span>
              <span className="year">
                {releaseDate ? new Date(releaseDate).getFullYear() : 'TBA'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
