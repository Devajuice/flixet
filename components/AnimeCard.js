'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AnimeCard({ anime }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/anime/${anime.mal_id}`);
  };

  return (
    <>
      <style jsx>{`
        .anime-card {
          background-color: var(--card-bg);
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .anime-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(229, 9, 20, 0.4);
        }

        .image-container {
          position: relative;
          width: 100%;
          padding-bottom: 140%;
          background-color: var(--secondary-bg);
          overflow: hidden;
        }

        .anime-image {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(0, 0, 0, 0.9) 100%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: flex-end;
          padding: 15px;
        }

        .anime-card:hover .overlay {
          opacity: 1;
        }

        .play-text {
          color: var(--accent);
          font-weight: bold;
          font-size: 14px;
        }

        .info {
          padding: 12px;
        }

        .title {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 8px;
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
          font-size: 12px;
          color: var(--text-secondary);
          gap: 8px;
        }

        .rating {
          color: #ffc107;
        }

        .episodes {
          font-size: 11px;
        }
      `}</style>

      <motion.div
        className="anime-card"
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="image-container">
          <img
            src={
              anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url
            }
            alt={anime.title}
            className="anime-image"
            loading="lazy"
          />
          <div className="overlay">
            <span className="play-text">► Watch Now</span>
          </div>
        </div>
        <div className="info">
          <h3 className="title">{anime.title}</h3>
          <div className="meta">
            <span className="rating">⭐ {anime.score || 'N/A'}</span>
            <span className="episodes">
              {anime.episodes ? `${anime.episodes} eps` : 'Ongoing'}
            </span>
          </div>
        </div>
      </motion.div>
    </>
  );
}
