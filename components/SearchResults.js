"use client";
import { motion } from "framer-motion";
import MovieCard from "@/components/MovieCard";
import TVCard from "@/components/TVCard";

export default function SearchResults({ movies }) {
  if (!movies?.length) return null;

  return (
    <>
      <style jsx global>{`
        .search-results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 16px;
          width: 100%;
        }
        @media (min-width: 640px) {
          .search-results-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 18px;
          }
        }
        @media (min-width: 1024px) {
          .search-results-grid {
            grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
            gap: 20px;
          }
        }
        @media (min-width: 1400px) {
          .search-results-grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 22px;
          }
        }
        @media (max-width: 480px) {
          .search-results-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }
        }
      `}</style>

      <motion.div
        className="search-results-grid"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {movies.map((item, index) =>
          item.media_type === "tv" ? (
            <motion.div
              key={`tv-${item.id}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: Math.min(index * 0.025, 0.35),
                duration: 0.3,
              }}
            >
              <TVCard show={item} />
            </motion.div>
          ) : (
            <motion.div
              key={`movie-${item.id}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: Math.min(index * 0.025, 0.35),
                duration: 0.3,
              }}
            >
              <MovieCard movie={item} />
            </motion.div>
          ),
        )}
      </motion.div>
    </>
  );
}
