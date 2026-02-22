'use client';
import { useState, useEffect, use, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Calendar,
  Clock,
  ArrowLeft,
  Play,
  Lightbulb,
  Check,
  X,
} from 'lucide-react';
import Link from 'next/link';
import WatchlistButton from '@/components/WatchlistButton';
import { useContinueWatching } from '@/context/ContinueWatchingContext';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function MovieDetails({ params }) {
  const unwrappedParams = use(params);
  const movieId = unwrappedParams.id;

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);

  const { addToContinueWatching } = useContinueWatching();
  const hasAddedToWatching = useRef(false);

  const [movieServer, setMovieServer] = useState('2embed');

  useEffect(() => {
    fetchMovieDetails();
  }, [movieId]);

  const fetchMovieDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos,recommendations`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch movie details');
      }

      const data = await response.json();
      setMovie(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Track when user starts watching
  useEffect(() => {
    if (showPlayer && movie && !hasAddedToWatching.current) {
      addToContinueWatching({
        id: movie.id,
        type: 'movie',
        title: movie.title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        runtime: movie.runtime || 120,
        progress: 15,
      });
      hasAddedToWatching.current = true;
    }

    if (!showPlayer) {
      hasAddedToWatching.current = false;
    }
  }, [showPlayer, movie, addToContinueWatching]);

  // Handle Escape key to close player
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showPlayer) {
        setShowPlayer(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showPlayer]);

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
          <p>Loading movie details...</p>
        </div>
      </>
    );
  }

  if (error || !movie) {
    return (
      <div style={styles.error}>
        <h2 style={styles.errorTitle}>
          {error ? 'Error Loading Movie' : 'Movie Not Found'}
        </h2>
        <p style={styles.errorText}>
          {error || 'The movie you are looking for does not exist.'}
        </p>
        <Link href="/movies">
          <button style={styles.backButton}>
            <ArrowLeft size={20} />
            Back to Movies
          </button>
        </Link>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder.png';

  // Get trailer
  const trailer = movie.videos?.results?.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube',
  );

  // Get top cast members
  const cast = movie.credits?.cast?.slice(0, 12) || [];

  // Get crew members
  const directors =
    movie.credits?.crew?.filter((person) => person.job === 'Director') || [];
  const writers =
    movie.credits?.crew
      ?.filter(
        (person) => person.job === 'Writer' || person.job === 'Screenplay',
      )
      .slice(0, 3) || [];

  // Format runtime
  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

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

        .page-container {
          padding: 20px;
          padding-bottom: 100px;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 40px;
          margin-top: 30px;
        }

        .cast-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .cast-card {
          background-color: var(--card-bg);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .cast-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(229, 9, 20, 0.4);
        }

        .cast-card:hover :global(.cast-overlay) {
          opacity: 1 !important;
        }

        @media (max-width: 968px) {
          .content-grid {
            grid-template-columns: 250px 1fr;
            gap: 30px;
          }
        }

        @media (max-width: 768px) {
          .page-container {
            padding: 15px;
            padding-bottom: 80px;
          }

          .backdrop {
            display: none !important;
          }

          .content-grid {
            grid-template-columns: 1fr;
            gap: 25px;
          }

          .poster-section {
            position: relative !important;
            top: 0 !important;
            display: grid;
            grid-template-columns: 140px 1fr;
            gap: 15px;
            align-items: start;
          }

          .mobile-actions {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .cast-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
          }
        }

        @media (max-width: 480px) {
          .poster-section {
            grid-template-columns: 1fr !important;
          }

          .cast-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
        }
      `}</style>

      <motion.div
        className="page-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/movies" style={styles.backLink}>
          <ArrowLeft size={20} />
          <span>Back to Movies</span>
        </Link>

        {/* Video Player Modal */}
        {/* Video Player Modal */}
        <AnimatePresence>
          {showPlayer && (
            <motion.div
              style={styles.playerOverlay}
              onClick={() => setShowPlayer(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                style={styles.playerContainer}
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  style={styles.closeButton}
                  onClick={() => setShowPlayer(false)}
                  aria-label="Close player"
                >
                  <X size={24} />
                </button>

                {/* Server Switcher */}
                <div style={styles.serverBar}>
                  {[
                    {
                      id: '2embed',
                      label: 'Server 1',
                      color: '#f59e0b',
                      url: `https://www.2embed.cc/embed/${movieId}`,
                    },
                    {
                      id: 'vidsrcme',
                      label: 'Server 2',
                      color: '#10b981',
                      url: `https://vidsrc.me/embed/movie?tmdb=${movieId}`,
                    },
                    {
                      id: 'vidsrcnet',
                      label: 'Server 3',
                      color: '#3b82f6',
                      url: `https://vidsrc.net/embed/movie/${movieId}`,
                    },
                    {
                      id: 'vidsrcto',
                      label: 'Server 4',
                      color: '#8b5cf6',
                      url: `https://vidsrc.to/embed/movie/${movieId}`,
                    },
                  ].map((server) => (
                    <button
                      key={server.id}
                      onClick={() => setMovieServer(server.id)}
                      style={{
                        ...styles.serverBarBtn,
                        borderColor:
                          movieServer === server.id
                            ? server.color
                            : 'transparent',
                        background:
                          movieServer === server.id
                            ? `${server.color}22`
                            : 'rgba(255,255,255,0.05)',
                        color:
                          movieServer === server.id ? server.color : '#94a3b8',
                      }}
                    >
                      <span
                        style={{
                          ...styles.serverBarDot,
                          backgroundColor: server.color,
                        }}
                      />
                      {server.label}
                      {server.id === '2embed' && (
                        <span style={styles.defaultBadge}>Default</span>
                      )}
                    </button>
                  ))}
                </div>

                <iframe
                  key={movieServer}
                  style={styles.iframe}
                  src={
                    [
                      {
                        id: '2embed',
                        url: `https://www.2embed.cc/embed/${movieId}`,
                      },
                      {
                        id: 'vidsrcme',
                        url: `https://vidsrc.me/embed/movie?tmdb=${movieId}`,
                      },
                      {
                        id: 'vidsrcnet',
                        url: `https://vidsrc.net/embed/movie/${movieId}`,
                      },
                      {
                        id: 'vidsrcto',
                        url: `https://vidsrc.to/embed/movie/${movieId}`,
                      },
                    ].find((s) => s.id === movieServer)?.url
                  }
                  frameBorder="0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  title={`Watch ${movie.title}`}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Backdrop */}
        {backdropUrl && (
          <div style={styles.backdrop} className="backdrop">
            <img
              src={backdropUrl}
              alt={`${movie.title} backdrop`}
              style={styles.backdropImage}
            />
            <div style={styles.backdropOverlay}></div>
          </div>
        )}

        <div className="content-grid">
          {/* Poster Section */}
          <div style={styles.posterSection} className="poster-section">
            <img
              src={posterUrl}
              alt={`${movie.title} poster`}
              style={styles.poster}
              loading="lazy"
            />

            <div className="mobile-actions">
              {/* Watch Now Button */}
              <motion.button
                style={styles.watchButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPlayer(true)}
              >
                <Play size={20} fill="white" />
                Watch Now
              </motion.button>

              {/* Trailer Button */}
              {trailer && (
                <motion.a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.trailerButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play size={18} />
                  Watch Trailer
                </motion.a>
              )}

              {/* Watchlist Button */}
              <WatchlistButton
                item={{
                  id: movie.id,
                  type: 'movie',
                  title: movie.title,
                  name: movie.title,
                  poster_path: movie.poster_path,
                  vote_average: movie.vote_average,
                  release_date: movie.release_date,
                }}
                variant="large"
              />

              {/* Viewing Tips */}
              <div style={styles.tipBox}>
                <div style={styles.tipHeader}>
                  <Lightbulb size={16} style={{ color: 'var(--accent)' }} />
                  <span style={styles.tipTitle}>Viewing Tips</span>
                </div>

                <p style={styles.tipDescription}>
                  Free streaming may show ads:
                </p>

                <div style={styles.tipList}>
                  <div style={styles.tipItem}>
                    <Check size={14} style={styles.checkIcon} />
                    <span>Use ad-blocker (uBlock Origin)</span>
                  </div>
                  <div style={styles.tipItem}>
                    <Check size={14} style={styles.checkIcon} />
                    <span>Try different servers if needed</span>
                  </div>
                  <div style={styles.tipItem}>
                    <Check size={14} style={styles.checkIcon} />
                    <span>Close pop-ups immediately</span>
                  </div>
                  <div style={styles.tipItem}>
                    <Check size={14} style={styles.checkIcon} />
                    <span>Never enter personal info</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div style={styles.details}>
            <h1 style={styles.title}>{movie.title}</h1>
            {movie.tagline && <p style={styles.tagline}>"{movie.tagline}"</p>}

            {/* Metadata */}
            <div style={styles.metadata}>
              <div style={styles.metaItem}>
                <Star size={18} fill="#ffd700" color="#ffd700" />
                <span>{movie.vote_average?.toFixed(1)}/10</span>
              </div>
              <div style={styles.metaItem}>
                <Calendar size={18} />
                <span>
                  {new Date(movie.release_date).getFullYear() || 'N/A'}
                </span>
              </div>
              {movie.runtime && (
                <div style={styles.metaItem}>
                  <Clock size={18} />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div style={styles.genres}>
                {movie.genres.map((genre) => (
                  <span key={genre.id} style={styles.genre}>
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Overview</h2>
              <p style={styles.overview}>
                {movie.overview || 'No overview available.'}
              </p>
            </div>

            {/* Director */}
            {directors.length > 0 && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  {directors.length > 1 ? 'Directors' : 'Director'}
                </h2>
                <p style={styles.creator}>
                  {directors.map((person) => person.name).join(', ')}
                </p>
              </div>
            )}

            {/* Writers */}
            {writers.length > 0 && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  {writers.length > 1 ? 'Writers' : 'Writer'}
                </h2>
                <p style={styles.creator}>
                  {writers.map((person) => person.name).join(', ')}
                </p>
              </div>
            )}

            {/* Cast Section */}
            {cast.length > 0 && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Top Cast</h2>
                <div className="cast-grid">
                  {cast.map((actor) => (
                    <motion.div
                      key={actor.id}
                      className="cast-card"
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div style={styles.castImageContainer}>
                        <img
                          src={
                            actor.profile_path
                              ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                              : 'https://via.placeholder.com/185x278/1a1a1a/666?text=No+Image'
                          }
                          alt={actor.name}
                          style={styles.castImage}
                          loading="lazy"
                          onError={(e) => {
                            e.target.src =
                              'https://via.placeholder.com/185x278/1a1a1a/666?text=No+Image';
                          }}
                        />
                        <div
                          style={styles.castOverlay}
                          className="cast-overlay"
                        >
                          <p style={styles.castOverlayText}>
                            {actor.character}
                          </p>
                        </div>
                      </div>
                      <div style={styles.castInfo}>
                        <p style={styles.castName}>{actor.name}</p>
                        <p style={styles.castCharacter}>{actor.character}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Production Info */}
            {movie.production_companies &&
              movie.production_companies.length > 0 && (
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>Production</h2>
                  <p style={styles.creator}>
                    {movie.production_companies
                      .slice(0, 3)
                      .map((company) => company.name)
                      .join(', ')}
                  </p>
                </div>
              )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

const styles = {
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '70vh',
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
  error: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '70vh',
    textAlign: 'center',
    padding: '20px',
  },
  errorTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: 'var(--accent)',
  },
  errorText: {
    fontSize: '18px',
    color: 'var(--text-secondary)',
    marginBottom: '30px',
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 30px',
    backgroundColor: 'var(--accent)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'color 0.3s ease',
    marginBottom: '20px',
  },
  playerOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    padding: '20px',
  },
  playerContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: '1400px',
    aspectRatio: '16/9',
    backgroundColor: '#000',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
  },
  closeButton: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '45px',
    height: '45px',
    fontSize: '24px',
    cursor: 'pointer',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  backdrop: {
    position: 'relative',
    width: '100%',
    height: '450px',
    borderRadius: '15px',
    overflow: 'hidden',
    marginBottom: '0px',
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
    background:
      'linear-gradient(to bottom, transparent 0%, var(--primary-bg) 100%)',
  },
  posterSection: {
    position: 'sticky',
    top: '80px',
    height: 'fit-content',
  },
  poster: {
    width: '100%',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
    marginBottom: '20px',
  },
  watchButton: {
    width: '100%',
    padding: '15px',
    backgroundColor: 'var(--accent)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '17px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'all 0.3s ease',
  },
  trailerButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: 'transparent',
    color: 'white',
    border: '2px solid var(--accent)',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  },
  tipBox: {
    background: 'rgba(26, 26, 26, 0.8)',
    border: '2px solid rgba(229, 9, 20, 0.3)',
    borderLeft: '4px solid var(--accent)',
    borderRadius: '10px',
    padding: '14px',
    marginTop: '15px',
  },
  tipHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
  },
  tipTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--accent)',
  },
  tipDescription: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    marginBottom: '10px',
    lineHeight: '1.4',
  },
  tipList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px',
  },
  tipItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '7px',
    fontSize: '11px',
    color: 'var(--text-secondary)',
    lineHeight: '1.3',
  },
  checkIcon: {
    color: '#4ade80',
    flexShrink: 0,
    marginTop: '1px',
  },
  details: {
    paddingBottom: '40px',
  },
  title: {
    fontSize: '48px',
    fontWeight: '800',
    marginBottom: '10px',
    background: 'linear-gradient(135deg, #e50914 0%, #f40612 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: '1.2',
  },
  tagline: {
    fontSize: '18px',
    fontStyle: 'italic',
    color: 'var(--text-secondary)',
    marginBottom: '25px',
  },
  metadata: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px',
    fontWeight: '500',
    color: 'var(--text-secondary)',
  },
  genres: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '35px',
  },
  genre: {
    padding: '8px 18px',
    backgroundColor: 'rgba(229, 9, 20, 0.15)',
    border: '1px solid rgba(229, 9, 20, 0.4)',
    borderRadius: '25px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--accent)',
  },
  section: {
    marginBottom: '35px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '15px',
    color: 'var(--text-primary)',
  },
  overview: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: 'var(--text-secondary)',
  },
  creator: {
    fontSize: '16px',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  castImageContainer: {
    width: '100%',
    paddingBottom: '150%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    borderRadius: '10px', // ✅ ADDED THIS
  },
  castImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '10px', // ✅ ADDED THIS
  },
  castOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background:
      'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)',
    padding: '35px 10px 10px',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    borderRadius: '0 0 10px 10px', // ✅ ADDED THIS (only bottom corners)
  },
  castOverlayText: {
    fontSize: '11px',
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    margin: 0,
    lineHeight: '1.3',
  },
  castInfo: {
    padding: '12px 10px',
    textAlign: 'center',
  },
  castName: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  castCharacter: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  serverBar: {
    position: 'absolute',
    top: '15px',
    left: '15px',
    right: '65px',
    display: 'flex',
    gap: '8px',
    zIndex: 10,
    flexWrap: 'wrap',
  },
  serverBarBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    border: '1px solid',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  serverBarDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  defaultBadge: {
    fontSize: '9px',
    fontWeight: '700',
    background: '#f59e0b',
    color: '#000',
    borderRadius: '4px',
    padding: '2px 5px',
  },
};
