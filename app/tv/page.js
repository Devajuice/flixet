'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TVGrid from '@/components/TVGrid';
import { motion } from 'framer-motion';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

// Map TV genre slugs (from Header links) to TMDB genre IDs
const TV_GENRE_MAP = {
  'action-adventure': 10759,
  comedy: 35,
  drama: 18,
  crime: 80,
  documentary: 99,
  'sci-fi-fantasy': 10765,
  reality: 10764,
  kids: 10762,
};

function TVContent() {
  const searchParams = useSearchParams();
  const genreParam = searchParams.get('genre');

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchShows(1);
  }, [genreParam]);

  const fetchShows = async (page) => {
    setLoading(true);
    try {
      let url = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}`;

      if (genreParam && TV_GENRE_MAP[genreParam]) {
        url += `&with_genres=${TV_GENRE_MAP[genreParam]}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setShows(data.results || []);
      setTotalPages(data.total_pages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching TV shows:', error);
      setShows([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchShows(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getGenreTitle = () => {
    if (!genreParam) return 'Popular TV Shows';
    const name = genreParam
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return `${name} TV Shows`;
  };

  if (loading && currentPage === 1) {
    return (
      <>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Loading TV shows...</p>
        </div>
      </>
    );
  }

  if (!shows.length) {
    return (
      <div style={styles.loading}>
        <p>No TV shows found.</p>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .tv-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 30px;
          margin-bottom: 60px;
        }

        @media (max-width: 768px) {
          .tv-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-bottom: 40px;
          }
        }

        @media (max-width: 400px) {
          .tv-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            margin-bottom: 30px;
          }
        }

        @media (min-width: 1200px) {
          .tv-grid {
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 35px;
          }
        }

        .page-button {
          padding: 12px 24px;
          border-radius: 8px;
          border: none;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 120px;
        }

        .page-button:not(:disabled) {
          background: #e50914;
          color: white;
        }

        .page-button:not(:disabled):hover {
          background: #f40612;
          transform: scale(1.05);
        }

        .page-button:disabled {
          background: rgba(50, 50, 50, 0.8);
          color: rgba(150, 150, 150, 0.7);
          cursor: not-allowed;
        }
      `}</style>

      <motion.div
        style={styles.container}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 style={styles.title}>{getGenreTitle()}</h1>
        <TVGrid shows={shows} />

        {/* Pagination controls */}
        <div style={styles.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="page-button"
          >
            Previous
          </button>

          <span style={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="page-button"
          >
            Next
          </button>
        </div>
      </motion.div>
    </>
  );
}

export default function TVPage() {
  return (
    <Suspense
      fallback={
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Loading TV shows...</p>
        </div>
      }
    >
      <TVContent />
    </Suspense>
  );
}

const styles = {
  container: {
    padding: '20px',
    paddingBottom: '100px',
  },
  header: {
    marginBottom: '30px',
    textAlign: 'center',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '10px',
    background: 'linear-gradient(to right, #e50914, #f40612)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--text-secondary)',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '20px',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(229, 9, 20, 0.1)',
    borderTop: '4px solid var(--accent)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  noResults: {
    textAlign: 'center',
    padding: '60px 20px',
    fontSize: '18px',
    color: 'var(--text-secondary)',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    marginTop: '40px',
    marginBottom: '40px',
    padding: '0 10px',
  },
  paginationButton: {
    padding: '12px 30px',
    backgroundColor: 'var(--accent)',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  disabledButton: {
    backgroundColor: 'var(--card-bg)',
    color: 'var(--text-secondary)',
    cursor: 'not-allowed',
    opacity: 0.5,
  },
  pageInfo: {
    fontSize: '16px',
    color: 'var(--text-secondary)',
  },
};
