'use client';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/lib/tmdb';

export default function TVCard({ show }) {
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/tv/${show.id}`);
  };

  return (
    <>
      <style jsx>{`
        .card-wrapper {
          width: 100%;
          aspect-ratio: 2/3;
        }

        .card {
          background-color: var(--card-bg);
          border-radius: 8px;
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

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        @media (hover: hover) {
          .card:hover .overlay {
            opacity: 1;
          }
        }

        .badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background-color: var(--accent);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: bold;
          z-index: 1;
        }

        .play-text {
          background-color: var(--accent);
          color: white;
          padding: 8px 16px;
          border-radius: 25px;
          font-size: 12px;
          font-weight: bold;
        }

        .info {
          padding: 8px;
          min-height: 60px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .title {
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 1.3;
        }

        .meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 10px;
          color: var(--text-secondary);
        }

        .rating {
          color: #ffc107;
        }

        @media (min-width: 640px) {
          .play-text {
            padding: 10px 20px;
            font-size: 14px;
          }

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

          .badge {
            font-size: 11px;
            padding: 5px 10px;
          }
        }

        @media (min-width: 1024px) {
          .play-text {
            padding: 12px 24px;
            font-size: 15px;
          }

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

          .badge {
            font-size: 12px;
          }
        }
      `}</style>

      <div className="card-wrapper">
        <div className="card" onClick={handleClick}>
          <div className="image-container">
            <img
              src={getImageUrl(show.poster_path)}
              alt={show.name}
              className="poster-image"
              loading="lazy"
              draggable="false"
            />
            <div className="badge">TV</div>
            <div className="overlay">
              <div className="play-text">▶ Watch</div>
            </div>
          </div>
          
          <div className="info">
            <h3 className="title">{show.name}</h3>
            <div className="meta">
              <span className="rating">⭐ {show.vote_average?.toFixed(1) || 'N/A'}</span>
              <span>{show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'TBA'}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
