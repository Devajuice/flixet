'use client';
import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  Calendar,
  Clock,
  ArrowLeft,
  Play,
  Lightbulb,
  Check,
} from 'lucide-react';
import Link from 'next/link';
import WatchlistButton from '@/components/WatchlistButton';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function MovieDetails({ params }) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const movieId = unwrappedParams.id;

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    fetchMovieDetails();
  }, [movieId]);

  const fetchMovieDetails = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos`
      );
      const data = await response.json();
      setMovie(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
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
          <p>Loading movie details...</p>
        </div>
      </>
    );
  }

  if (!movie) {
    return (
      <div style={styles.error}>
        <p>Movie not found</p>
        <Link href="/movies">
          <button style={styles.backButton}>Back to Movies</button>
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
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );

  // Get top 10 cast members
  const cast = movie.credits?.cast?.slice(0, 10) || [];

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

        .tip-box {
          background: #1a1a1a !important;
          border: 2px solid var(--accent) !important;
          border-left: 4px solid var(--accent) !important;
          border-radius: 10px !important;
          padding: 15px !important;
          margin-top: 15px !important;
          position: relative !important;
          z-index: 1 !important;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 40px;
        }

        .cast-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 20px;
          margin-top: 15px;
        }

        .cast-card {
          background-color: var(--card-bg);
          border-radius: 10px;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .cast-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(229, 9, 20, 0.4);
        }

        .cast-card:hover :global(.cast-overlay) {
          opacity: 1 !important;
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
            gap: 20px;
          }

          .cast-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .poster-section {
            position: relative !important;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .mobile-button-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 100%;
          }
        }

        @media (max-width: 480px) {
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
          <ArrowLeft size={20} /> Back to Movies
        </Link>

        {/* Video Player Modal */}
        {showPlayer && (
          <div
            style={styles.playerOverlay}
            onClick={() => setShowPlayer(false)}
          >
            <div
              style={styles.playerContainer}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                style={styles.closeButton}
                onClick={() => setShowPlayer(false)}
              >
                ✕
              </button>
              <iframe
                style={styles.iframe}
                src={`https://vidsrc.xyz/embed/movie/${movieId}`}
                frameBorder="0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>
        )}

        {/* Backdrop */}
        {backdropUrl && (
          <div style={styles.backdrop} className="backdrop">
            <img
              src={backdropUrl}
              alt={movie.title}
              style={styles.backdropImage}
            />
            <div style={styles.backdropOverlay}></div>
          </div>
        )}

        <div className="content-grid">
          <div style={styles.posterSection} className="poster-section">
            <img src={posterUrl} alt={movie.title} style={styles.poster} />

            <div className="mobile-button-group">
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
                  <Play size={20} />
                  Watch Trailer
                </motion.a>
              )}
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
            </div>

            {/* Detailed Viewing Tips */}
            <div style={styles.tipBox} className="tip-box">
              <div style={styles.tipHeader}>
                <Lightbulb size={18} style={{ color: 'var(--accent)' }} />
                <span style={styles.tipTitle}>Tips for Better Viewing</span>
              </div>

              <p style={styles.tipDescription}>
                We use free streaming services which may show ads. For the best
                experience:
              </p>

              <div style={styles.tipList}>
                <div style={styles.tipItem}>
                  <Check size={16} style={styles.checkIcon} />
                  <span>Use an ad-blocker (uBlock Origin recommended)</span>
                </div>

                <div style={styles.tipItem}>
                  <Check size={16} style={styles.checkIcon} />
                  <span>Try different servers if one has too many ads</span>
                </div>

                <div style={styles.tipItem}>
                  <Check size={16} style={styles.checkIcon} />
                  <span>Close any pop-ups that may appear</span>
                </div>

                <div style={styles.tipItem}>
                  <Check size={16} style={styles.checkIcon} />
                  <span>Never enter personal information</span>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.details}>
            <h1 style={styles.title}>{movie.title}</h1>

            {movie.tagline && <p style={styles.tagline}>"{movie.tagline}"</p>}

            <div style={styles.metadata}>
              <div style={styles.metaItem}>
                <Star size={18} fill="#ffd700" color="#ffd700" />
                <span>{movie.vote_average?.toFixed(1)} / 10</span>
              </div>
              <div style={styles.metaItem}>
                <Calendar size={18} />
                <span>{movie.release_date || 'N/A'}</span>
              </div>
              {movie.runtime && (
                <div style={styles.metaItem}>
                  <Clock size={18} />
                  <span>{movie.runtime} min</span>
                </div>
              )}
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div style={styles.genres}>
                {movie.genres.map((genre) => (
                  <span key={genre.id} style={styles.genre}>
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Overview</h2>
              <p style={styles.overview}>
                {movie.overview || 'No overview available.'}
              </p>
            </div>

            {/* Director & Writer */}
            {movie.credits?.crew && (
              <>
                {movie.credits.crew.find(
                  (person) => person.job === 'Director'
                ) && (
                  <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Director</h2>
                    <p style={styles.creator}>
                      {movie.credits.crew
                        .filter((person) => person.job === 'Director')
                        .map((person) => person.name)
                        .join(', ')}
                    </p>
                  </div>
                )}

                {movie.credits.crew.find(
                  (person) =>
                    person.job === 'Writer' || person.job === 'Screenplay'
                ) && (
                  <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Writer</h2>
                    <p style={styles.creator}>
                      {movie.credits.crew
                        .filter(
                          (person) =>
                            person.job === 'Writer' ||
                            person.job === 'Screenplay'
                        )
                        .slice(0, 3)
                        .map((person) => person.name)
                        .join(', ')}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Cast Section */}
            {cast.length > 0 && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Cast</h2>
                <div className="cast-grid">
                  {cast.map((actor) => (
                    <motion.div
                      key={actor.id}
                      className="cast-card"
                      whileHover={{ scale: 1.05, y: -5 }}
                      transition={{ duration: 0.3 }}
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

            {/* Production Companies */}
            {movie.production_companies &&
              movie.production_companies.length > 0 && (
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>Production Companies</h2>
                  <p style={styles.creator}>
                    {movie.production_companies
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
  error: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  backButton: {
    marginTop: '20px',
    padding: '12px 30px',
    backgroundColor: 'var(--accent)',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '30px',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
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
    zIndex: 9999,
    padding: '20px',
  },
  playerContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: '1400px',
    aspectRatio: '16/9',
    backgroundColor: '#000',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    fontSize: '24px',
    cursor: 'pointer',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s ease',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  backdrop: {
    position: 'relative',
    width: '100%',
    height: '500px',
    marginBottom: '30px',
    borderRadius: '15px',
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
    background:
      'linear-gradient(to bottom, transparent 0%, var(--primary-bg) 100%)',
  },
  posterSection: {
    position: 'sticky',
    top: '100px',
    height: 'fit-content',
  },
  poster: {
    width: '100%',
    borderRadius: '15px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    marginBottom: '20px',
  },
  watchButton: {
    width: '100%',
    padding: '15px',
    backgroundColor: 'var(--accent)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'all 0.3s ease',
  },
  trailerButton: {
    width: '100%',
    padding: '15px',
    backgroundColor: 'transparent',
    color: 'white',
    border: '2px solid var(--accent)',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  },
  tipBox: {
    background: 'rgba(26, 26, 26, 1)',
    border: '2px solid var(--accent)',
    borderLeft: '4px solid var(--accent)',
    borderRadius: '10px',
    padding: '15px',
    marginTop: '15px',
    position: 'relative',
    zIndex: 1,
  },
  tipHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
  },
  tipTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: 'var(--accent)',
  },
  tipDescription: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginBottom: '12px',
    lineHeight: '1.5',
  },
  tipList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  tipItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    fontSize: '11px',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
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
    fontWeight: 'bold',
    marginBottom: '10px',
    background: 'linear-gradient(to right, #e50914, #f40612)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  tagline: {
    fontSize: '18px',
    fontStyle: 'italic',
    color: 'var(--text-secondary)',
    marginBottom: '20px',
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
    color: 'var(--text-secondary)',
  },
  genres: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '30px',
  },
  genre: {
    padding: '8px 16px',
    backgroundColor: 'rgba(229, 9, 20, 0.2)',
    border: '1px solid var(--accent)',
    borderRadius: '20px',
    fontSize: '14px',
    color: 'var(--accent)',
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
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
  },
  castImageContainer: {
    width: '100%',
    paddingBottom: '150%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
  },
  castImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  castOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background:
      'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)',
    padding: '40px 10px 10px',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  castOverlayText: {
    fontSize: '12px',
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    margin: 0,
    lineHeight: '1.3',
  },
  castInfo: {
    padding: '12px 8px',
    textAlign: 'center',
  },
  castName: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    marginBottom: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  castCharacter: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};
