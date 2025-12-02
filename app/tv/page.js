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
  const genreParam = searchParams.get('genre'); // e.g. "crime"

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShows();
  }, [genreParam]); // refetch whenever genre changes

  const fetchShows = async () => {
    setLoading(true);
    try {
      let url = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=1`;

      // If a genre is selected and mapped, filter by that genre
      if (genreParam && TV_GENRE_MAP[genreParam]) {
        url += `&with_genres=${TV_GENRE_MAP[genreParam]}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setShows(data.results || []);
    } catch (error) {
      console.error('Error fetching TV shows:', error);
      setShows([]);
    } finally {
      setLoading(false);
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

  if (loading) {
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
      `}</style>

      <motion.div
        style={styles.container}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 style={styles.title}>{getGenreTitle()}</h1>
        <TVGrid shows={shows} />
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
    minHeight: '100vh',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
    background: 'linear-gradient(to right, #e50914, #f40612)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
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
};
