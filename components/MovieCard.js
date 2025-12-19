'use client';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/lib/tmdb';
import WatchlistButton from './WatchlistButton';

export default function MovieCard({ movie }) {
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Handle both movie and TV show routing from search results
    const mediaType = movie.media_type || 'movie';
    const path = mediaType === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`;

    router.push(path);
  };

  // Get title - could be 'title' (movie) or 'name' (TV)
  const title = movie.title || movie.name;

  // Get release date - could be 'release_date' (movie) or 'first_air_date' (TV)
  const releaseDate = movie.release_date || movie.first_air_date;

  return (
    <>
      <style jsx>{`
        .card-wrapper {
          width: 100%;
          aspect-ratio: 2/3;
        }

        .card {
          background-color: var(--card-bg);
          border-radius: 6px;
          overflow: hidden;
          transition: transform 0.2s ease;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        .card:active {
          transform: scale(0.98);
        }

        @media (hover: hover) {
          .card:hover {
            transform: scale(1.05);
          }
        }

        .image-container {
          position: relative;
          width: 100%;
          flex: 1;
          background-color: var(--secondary-bg);
          overflow: hidden;
        }

        .poster-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          user-select: none;
          -webkit-user-drag: none;
        }

        .watchlist-overlay {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 2;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .card:hover .watchlist-overlay {
          opacity: 1;
        }

        @media (hover: none) {
          .watchlist-overlay {
            opacity: 1;
          }
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: none;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        @media (hover: hover) and (min-width: 1024px) {
          .overlay {
            display: flex;
          }

          .card:hover .overlay {
            opacity: 1;
          }
        }

        .play-text {
          background-color: var(--accent);
          color: white;
          padding: 12px 24px;
          border-radius: 25px;
          font-size: 14px;
          font-weight: bold;
        }

        .info {
          padding: 5px;
          min-height: 45px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background-color: var(--card-bg);
        }

        .title {
          font-size: 10px;
          font-weight: 600;
          margin-bottom: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 1.2;
        }

        .meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 8px;
          color: var(--text-secondary);
          gap: 4px;
        }

        .rating {
          color: #ffc107;
          white-space: nowrap;
        }

        .year {
          white-space: nowrap;
        }

        @media (min-width: 480px) {
          .card {
            border-radius: 7px;
          }

          .info {
            padding: 6px;
            min-height: 50px;
          }

          .title {
            font-size: 11px;
            margin-bottom: 3px;
          }

          .meta {
            font-size: 9px;
          }

          .watchlist-overlay {
            top: 10px;
            right: 10px;
          }
        }

        @media (min-width: 640px) {
          .card {
            border-radius: 8px;
          }

          .title {
            font-size: 12px;
            margin-bottom: 4px;
            line-height: 1.3;
          }

          .meta {
            font-size: 10px;
          }

          .info {
            padding: 8px;
            min-height: 60px;
          }
        }

        @media (min-width: 768px) {
          .title {
            font-size: 13px;
          }

          .meta {
            font-size: 11px;
          }

          .info {
            padding: 10px;
            min-height: 65px;
          }
        }

        @media (min-width: 1024px) {
          .title {
            font-size: 14px;
          }

          .meta {
            font-size: 12px;
          }

          .info {
            padding: 12px;
            min-height: 70px;
          }
        }
      `}</style>

      <div className="card-wrapper">
        <div className="card" onClick={handleClick}>
          <div className="image-container">
            <img
              src={getImageUrl(movie.poster_path)}
              alt={title}
              className="poster-image"
              loading="lazy"
              draggable="false"
            />

            <div className="watchlist-overlay">
              <WatchlistButton
                item={{
                  id: movie.id,
                  type: movie.media_type || 'movie',
                  title: title,
                  name: title,
                  poster_path: movie.poster_path,
                  vote_average: movie.vote_average,
                  release_date: releaseDate,
                  first_air_date: releaseDate,
                }}
                variant="default"
              />
            </div>

            <div className="overlay">
              <div className="play-text">▶ Play</div>
            </div>
          </div>

          <div className="info">
            <h3 className="title">{title}</h3>
            <div className="meta">
              <span className="rating">
                ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}
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
