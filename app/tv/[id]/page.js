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
  Tv,
} from 'lucide-react';
import Link from 'next/link';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function TVShowDetails({ params }) {
  const unwrappedParams = use(params);
  const showId = unwrappedParams.id;

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [seasonData, setSeasonData] = useState(null);

  useEffect(() => {
    fetchShowDetails();
  }, [showId]);

  useEffect(() => {
    if (show && selectedSeason) {
      fetchSeasonDetails(selectedSeason);
    }
  }, [selectedSeason, show]);

  const fetchShowDetails = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${showId}?api_key=${API_KEY}&append_to_response=credits,videos`
      );
      const data = await response.json();
      setShow(data);
      if (data.seasons && data.seasons.length > 0) {
        const firstSeason =
          data.seasons.find((s) => s.season_number > 0) || data.seasons[0];
        setSelectedSeason(firstSeason.season_number);
      }
    } catch (error) {
      console.error('Error fetching TV show details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeasonDetails = async (seasonNumber) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${showId}/season/${seasonNumber}?api_key=${API_KEY}`
      );
      const data = await response.json();
      setSeasonData(data);
      setSelectedEpisode(1);
    } catch (error) {
      console.error('Error fetching season details:', error);
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
          <p>Loading TV show details...</p>
        </div>
      </>
    );
  }

  if (!show) {
    return (
      <div style={styles.error}>
        <p>TV show not found</p>
        <Link href="/tv">
          <button style={styles.backButton}>Back to TV Shows</button>
        </Link>
      </div>
    );
  }

  const backdropUrl = show.backdrop_path
    ? `https://image.tmdb.org/t/p/original${show.backdrop_path}`
    : null;

  const posterUrl = show.poster_path
    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
    : '/placeholder.png';

  const trailer = show.videos?.results?.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );

  const cast = show.credits?.cast?.slice(0, 10) || [];

  const validSeasons = show.seasons?.filter((s) => s.season_number > 0) || [];

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

        .season-selector {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
          flex-wrap: wrap;
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

          .season-selector {
            gap: 8px;
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
        <Link href="/tv" style={styles.backLink}>
          <ArrowLeft size={20} /> Back to TV Shows
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
                src={`https://vidsrc.xyz/embed/tv/${showId}/${selectedSeason}/${selectedEpisode}`}
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
              alt={show.name}
              style={styles.backdropImage}
            />
            <div style={styles.backdropOverlay}></div>
          </div>
        )}

        <div className="content-grid">
          <div style={styles.posterSection} className="poster-section">
            <img src={posterUrl} alt={show.name} style={styles.poster} />

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
            </div>

            {/* Tip Box */}
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
            <h1 style={styles.title}>{show.name}</h1>

            {show.tagline && <p style={styles.tagline}>"{show.tagline}"</p>}

            <div style={styles.metadata}>
              <div style={styles.metaItem}>
                <Star size={18} fill="#ffd700" color="#ffd700" />
                <span>{show.vote_average?.toFixed(1)} / 10</span>
              </div>
              <div style={styles.metaItem}>
                <Calendar size={18} />
                <span>{show.first_air_date || 'N/A'}</span>
              </div>
              <div style={styles.metaItem}>
                <Tv size={18} />
                <span>{show.number_of_seasons} Seasons</span>
              </div>
            </div>

            {show.genres && show.genres.length > 0 && (
              <div style={styles.genres}>
                {show.genres.map((genre) => (
                  <span key={genre.id} style={styles.genre}>
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Season Selector */}
            {validSeasons.length > 0 && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Select Season</h2>
                <div className="season-selector">
                  {validSeasons.map((season) => (
                    <motion.button
                      key={season.id}
                      style={{
                        ...styles.seasonButton,
                        ...(selectedSeason === season.season_number
                          ? styles.seasonButtonActive
                          : {}),
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSeason(season.season_number)}
                    >
                      Season {season.season_number}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Episode List */}
            {seasonData && seasonData.episodes && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  Episodes ({seasonData.episodes.length})
                </h2>
                <div style={styles.episodeList}>
                  {seasonData.episodes.map((episode, index) => (
                    <motion.div
                      key={episode.id}
                      onClick={() => setSelectedEpisode(episode.episode_number)}
                      style={{
                        ...styles.episodeCard,
                        ...(selectedEpisode === episode.episode_number
                          ? styles.episodeCardActive
                          : {}),
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{
                        scale: 1.02,
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div style={styles.episodeHeader}>
                        <h4 style={styles.episodeTitle}>
                          <span style={styles.episodeNumber}>
                            Episode {episode.episode_number}
                          </span>
                          <span style={styles.episodeSeparator}>·</span>
                          <span style={styles.episodeName}>
                            {episode.name || 'Untitled'}
                          </span>
                        </h4>
                        {episode.air_date && (
                          <span style={styles.episodeAirDate}>
                            {episode.air_date}
                          </span>
                        )}
                      </div>
                      {episode.overview && (
                        <p style={styles.episodeOverview}>{episode.overview}</p>
                      )}
                      {!episode.overview && (
                        <p style={styles.episodeNoOverview}>
                          No description available
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Overview</h2>
              <p style={styles.overview}>
                {show.overview || 'No overview available.'}
              </p>
            </div>

            {/* Creator */}
            {show.created_by && show.created_by.length > 0 && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Created By</h2>
                <p style={styles.creator}>
                  {show.created_by.map((person) => person.name).join(', ')}
                </p>
              </div>
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
            {show.production_companies &&
              show.production_companies.length > 0 && (
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>Production Companies</h2>
                  <p style={styles.creator}>
                    {show.production_companies
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
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'var(--accent)',
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
    background: '#1a1a1a',
    border: '2px solid var(--accent)',
    borderLeft: '4px solid var(--accent)',
    borderRadius: '10px',
    padding: '15px',
    marginTop: '15px',
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
  seasonButton: {
    padding: '10px 20px',
    backgroundColor: 'var(--card-bg)',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  seasonButtonActive: {
    backgroundColor: 'var(--accent)',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'var(--accent)',
    color: 'white',
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
  // Episode List Styles - FIXED
  episodeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  episodeCard: {
    padding: '20px',
    backgroundColor: 'var(--card-bg)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'transparent',
  },
  episodeCardActive: {
    backgroundColor: 'var(--accent)',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'var(--accent)',
    boxShadow: '0 4px 12px rgba(229, 9, 20, 0.4)',
  },
  episodeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
    gap: '15px',
    flexWrap: 'wrap',
  },
  episodeTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
    flex: 1,
  },
  episodeNumber: {
    color: 'var(--text-primary)',
  },
  episodeSeparator: {
    color: 'var(--text-secondary)',
    opacity: 0.5,
  },
  episodeName: {
    color: 'var(--text-primary)',
  },
  episodeAirDate: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    whiteSpace: 'nowrap',
  },
  episodeOverview: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: 'var(--text-secondary)',
    margin: 0,
  },
  episodeNoOverview: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    fontStyle: 'italic',
    opacity: 0.6,
    margin: 0,
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
