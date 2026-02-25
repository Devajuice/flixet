'use client';
import { motion } from 'framer-motion';
import MovieCard from '@/components/MovieCard';

export default function SearchResults({ movies }) {
  return (
    <>
      <style jsx global>{`
        .search-results-container {
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 20px;
          margin-bottom: 60px;
          width: 100%;
        }

        @media (min-width: 1024px) {
          .results-grid {
            grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
            gap: 24px;
          }
        }

        @media (max-width: 768px) {
          .results-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }
        }

        @media (max-width: 480px) {
          .results-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
      `}</style>

      <div className="search-results-container">
        <motion.div
          className="results-grid"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {movies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.025, duration: 0.35 }}
            >
              <MovieCard movie={movie} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
}
