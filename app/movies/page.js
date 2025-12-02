'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MovieCard from '@/components/MovieCard';
import { motion } from 'framer-motion';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

// Genre mapping
const GENRE_MAP = {
  action: 28,
  comedy: 35,
  drama: 18,
  horror: 27,
  'sci-fi': 878,
  thriller: 53,
  romance: 10749,
  animation: 16,
};

// Separate component that uses useSearchParams
function MoviesContent() {
  const searchParams = useSearchParams();
  const genreParam = searchParams.get('genre');

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMovies(1);
  }, [genreParam]);

  const fetchMovies = async (page) => {
    setLoading(true);
    try {
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=popularity.desc`;

      if (genreParam && GENRE_MAP[genreParam]) {
        url += `&with_genres=${GENRE_MAP[genreParam]}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      setMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchMovies(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getGenreTitle = () => {
    if (!genreParam) return 'Popular Movies';
    const genreName = genreParam
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return `${genreName} Movies`;
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
          <p>Loading movies...</p>
        </div>
      </>
    );
  }

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

        .movie-grid {
          display: grid !important;
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 10px !important;
          margin-bottom: 40px !important;
          padding: 0 10px !important;
        }

        @media (min-width: 480px) {
          .movie-grid {
            gap: 12px !important;
          }
        }

        @media (min-width: 640px) {
          .movie-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 15px !important;
          }
        }

        @media (min-width: 1024px) {
          .movie-grid {
            grid-template-columns: repeat(
              auto-fill,
              minmax(200px, 1fr)
            ) !important;
            gap: 25px !important;
            padding: 0 !important;
          }
        }

        @media (min-width: 1200px) {
          .movie-grid {
            grid-template-columns: repeat(
              auto-fill,
              minmax(220px, 1fr)
            ) !important;
            gap: 30px !important;
          }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={styles.container}
      >
        <div style={styles.header}>
          <h1 style={styles.title}>{getGenreTitle()}</h1>
          {genreParam && (
            <p style={styles.subtitle}>
              Browse our collection of {genreParam.replace('-', ' ')} movies
            </p>
          )}
        </div>

        {!Array.isArray(movies) || movies.length === 0 ? (
          <div style={styles.noResults}>
            <p>No movies found.</p>
          </div>
        ) : (
          <>
            <div className="movie-grid">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Pagination */}
            <div style={styles.pagination}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  ...styles.paginationButton,
                  ...(currentPage === 1 ? styles.disabledButton : {}),
                }}
              >
                Previous
              </button>

              <span style={styles.pageInfo}>
                Page {currentPage} of {totalPages > 500 ? 500 : totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || currentPage >= 500}
                style={{
                  ...styles.paginationButton,
                  ...(currentPage >= totalPages || currentPage >= 500
                    ? styles.disabledButton
                    : {}),
                }}
              >
                Next
              </button>
            </div>
          </>
        )}
      </motion.div>
    </>
  );
}

// Main page component with Suspense wrapper
export default function MoviesPage() {
  return (
    <Suspense
      fallback={
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Loading movies...</p>
        </div>
      }
    >
      <MoviesContent />
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
