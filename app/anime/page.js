'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TVCard from '@/components/TVCard'; // Reuse TV card
import Link from 'next/link';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function AnimePage() {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchAnime();
  }, [page]);

  const fetchAnime = async () => {
    setLoading(true);
    try {
      // Fetch anime using TMDB Animation genre (ID: 16) for TV shows
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=16&with_origin_country=JP&sort_by=popularity.desc&page=${page}`
      );
      const data = await response.json();
      setAnimeList(data.results || []);
    } catch (error) {
      console.error('Error fetching anime:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .anime-page {
          padding: 20px;
          padding-bottom: 100px;
        }

        .page-header {
          margin-bottom: 30px;
        }

        .page-title {
          font-size: 42px;
          font-weight: bold;
          margin-bottom: 20px;
          background: linear-gradient(to right, #e50914, #f40612);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .anime-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 20px;
        }

        .pagination {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 40px;
        }

        .page-btn {
          padding: 10px 20px;
          background-color: var(--card-bg);
          border: none;
          border-radius: 8px;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .page-btn:hover:not(:disabled) {
          background-color: var(--accent);
        }

        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
        }

        @media (max-width: 768px) {
          .anime-page {
            padding: 15px;
            padding-bottom: 80px;
          }

          .page-title {
            font-size: 32px;
          }

          .anime-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 15px;
          }
        }
      `}</style>

      <motion.div
        className="anime-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="page-header">
          <h1 className="page-title">Anime</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Popular anime series from Japan
          </p>
        </div>

        {loading ? (
          <div className="loading">
            <p>Loading anime...</p>
          </div>
        ) : (
          <>
            <div className="anime-grid">
              {animeList.map((show) => (
                <TVCard key={show.id} show={show} />
              ))}
            </div>

            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>
              <span
                style={{ padding: '10px 20px', color: 'var(--text-primary)' }}
              >
                Page {page}
              </span>
              <button className="page-btn" onClick={() => setPage(page + 1)}>
                Next
              </button>
            </div>
          </>
        )}
      </motion.div>
    </>
  );
}
