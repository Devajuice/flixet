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
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 20px;
          margin-bottom: 60px;
          width: 100%;
        }

        @media (max-width: 1200px) {
          .results-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 18px;
          }
        }

        @media (max-width: 768px) {
          .results-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }
        }

        @media (max-width: 480px) {
          .results-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }
        }
      `}</style>

      <div className="search-results-container">
        <motion.div
          className="results-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </motion.div>
      </div>
    </>
  );
}
