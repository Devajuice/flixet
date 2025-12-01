'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getMovieDetails, getMovieCredits, getImageUrl } from '@/lib/tmdb';
import { formatDate, formatRuntime } from '@/lib/utils';
import VideoPlayer from '@/components/VideoPlayer';
import CastSection from '@/components/CastSection';

export default function MoviePage({ params }) {
  const [movieId, setMovieId] = useState(null);
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function unwrapParams() {
      const resolvedParams = await params;
      setMovieId(resolvedParams.id);
    }
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (!movieId) return;

    async function fetchData() {
      const [movieData, creditsData] = await Promise.all([
        getMovieDetails(movieId),
        getMovieCredits(movieId),
      ]);
      setMovie(movieData);
      setCredits(creditsData);
      setLoading(false);
    }
    fetchData();
  }, [movieId]);

  if (loading || !movie) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ fontSize: '60px' }}
        >
          🎬
        </motion.div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.backdrop}>
        <img
          src={getImageUrl(movie.backdrop_path, 'original')}
          alt={movie.title}
          style={styles.backdropImage}
        />
        <div style={styles.backdropOverlay} />
      </div>

      <div style={styles.content}>
        <motion.h1 
          style={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {movie.title}
        </motion.h1>
        
        <motion.div 
          style={styles.meta}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span style={styles.rating}>⭐ {movie.vote_average.toFixed(1)}</span>
          <span>{formatDate(movie.release_date)}</span>
          <span>{formatRuntime(movie.runtime)}</span>
        </motion.div>

        <motion.p 
          style={styles.overview}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {movie.overview}
        </motion.p>

        <motion.div 
          style={styles.genres}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {movie.genres.map((genre) => (
            <span key={genre.id} style={styles.genre}>
              {genre.name}
            </span>
          ))}
        </motion.div>

        <motion.div 
          style={styles.player}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <VideoPlayer movieId={movieId} />
        </motion.div>

        {credits && <CastSection cast={credits.cast} />}
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
  },
  backdrop: {
    position: 'relative',
    width: '100%',
    height: '500px',
    marginBottom: '40px',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  backdropImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  backdropOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to top, var(--primary-bg) 0%, transparent 100%)',
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  title: {
    fontSize: '48px',
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  meta: {
    display: 'flex',
    gap: '20px',
    fontSize: '18px',
    color: 'var(--text-secondary)',
    marginBottom: '30px',
  },
  rating: {
    color: '#ffc107',
    fontWeight: 'bold',
  },
  overview: {
    fontSize: '18px',
    lineHeight: '1.8',
    marginBottom: '30px',
    color: 'var(--text-secondary)',
  },
  genres: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '40px',
  },
  genre: {
    backgroundColor: 'var(--card-bg)',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
  },
  player: {
    marginTop: '40px',
  },
};
