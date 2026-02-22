'use client';
import { useState, useEffect, use, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Calendar,
  Clock,
  ArrowLeft,
  Play,
  Lightbulb,
  Check,
  Tv,
  X,
} from 'lucide-react';
import Link from 'next/link';
import WatchlistButton from '@/components/WatchlistButton';
import { useContinueWatching } from '@/context/ContinueWatchingContext';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function TVShowDetails({ params }) {
  const unwrappedParams = use(params);
  const showId = unwrappedParams.id;
  const searchParams = useSearchParams();

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [seasonData, setSeasonData] = useState(null);
  const [loadingSeason, setLoadingSeason] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const { addToContinueWatching } = useContinueWatching();
  const hasAddedToWatching = useRef(false);

  const [tvServer, setTvServer] = useState('2embed');

  // Fetch show details
  useEffect(() => {
    fetchShowDetails();
  }, [showId]);

  // Set initial season/episode from URL or defaults
  useEffect(() => {
    if (show && !initialLoadDone) {
      const urlSeason = searchParams.get('season');
      const urlEpisode = searchParams.get('episode');

      if (urlSeason && urlEpisode) {
        const seasonNum = parseInt(urlSeason);
        const episodeNum = parseInt(urlEpisode);

        const seasonExists = show.seasons?.some(
          (s) => s.season_number === seasonNum,
        );

        if (seasonExists) {
          setSelectedSeason(seasonNum);
          setSelectedEpisode(episodeNum);
        } else {
          setDefaultSeason();
        }
      } else {
        setDefaultSeason();
      }

      setInitialLoadDone(true);
    }
  }, [show, searchParams, initialLoadDone]);

  // Fetch season details when season changes
  useEffect(() => {
    if (selectedSeason !== null) {
      fetchSeasonDetails(selectedSeason);
    }
  }, [selectedSeason]);

  // Continue Watching Logic
  useEffect(() => {
    if (showPlayer && show && !hasAddedToWatching.current) {
      const currentEpisode = seasonData?.episodes?.find(
        (ep) => ep.episode_number === selectedEpisode,
      );
      const episodeRuntime =
        currentEpisode?.runtime || show.episode_run_time?.[0] || 45;

      addToContinueWatching({
        id: show.id,
        type: 'tv',
        name: show.name,
        poster_path: show.poster_path,
        backdrop_path: show.backdrop_path,
        season: selectedSeason,
        episode: selectedEpisode,
        runtime: episodeRuntime,
        progress: 15,
      });
      hasAddedToWatching.current = true;
    }

    if (!showPlayer) {
      hasAddedToWatching.current = false;
    }
  }, [
    showPlayer,
    show,
    selectedSeason,
    selectedEpisode,
    seasonData,
    addToContinueWatching,
  ]);

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

  const setDefaultSeason = () => {
    if (show?.seasons && show.seasons.length > 0) {
      const firstSeason =
        show.seasons.find((s) => s.season_number > 0) || show.seasons[0];
      setSelectedSeason(firstSeason.season_number);
      setSelectedEpisode(1);
    }
  };

  const fetchShowDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${showId}?api_key=${API_KEY}&append_to_response=credits,videos`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch TV show details');
      }

      const data = await response.json();
      setShow(data);
    } catch (error) {
      console.error('Error fetching TV show details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeasonDetails = async (seasonNumber) => {
    setLoadingSeason(true);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${showId}/season/${seasonNumber}?api_key=${API_KEY}`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch season details');
      }

      const data = await response.json();
      setSeasonData(data);

      // Only reset episode if it's not already set
      if (selectedEpisode === null) {
        setSelectedEpisode(1);
      }
    } catch (error) {
      console.error('Error fetching season details:', error);
    } finally {
      setLoadingSeason(false);
    }
  };

  const handleSeasonChange = (seasonNumber) => {
    setSelectedSeason(seasonNumber);
    setSelectedEpisode(1);
  };

  const handleNextEpisode = () => {
    if (!seasonData?.episodes) return;

    const currentEpisodeIndex = seasonData.episodes.findIndex(
      (ep) => ep.episode_number === selectedEpisode,
    );

    if (currentEpisodeIndex < seasonData.episodes.length - 1) {
      // Next episode in current season
      setSelectedEpisode(
        seasonData.episodes[currentEpisodeIndex + 1].episode_number,
      );
    } else {
      // Move to next season
      const validSeasons =
        show.seasons?.filter((s) => s.season_number > 0) || [];
      const currentSeasonIndex = validSeasons.findIndex(
        (s) => s.season_number === selectedSeason,
      );

      if (currentSeasonIndex < validSeasons.length - 1) {
        const nextSeason = validSeasons[currentSeasonIndex + 1];
        setSelectedSeason(nextSeason.season_number);
        setSelectedEpisode(1);
      }
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

  if (error || !show) {
    return (
      <div style={styles.error}>
        <h2 style={styles.errorTitle}>
          {error ? 'Error Loading TV Show' : 'TV Show Not Found'}
        </h2>
        <p style={styles.errorText}>
          {error || 'The TV show you are looking for does not exist.'}
        </p>
        <Link href="/tv">
          <button style={styles.backButton}>
            <ArrowLeft size={20} />
            Back to TV Shows
          </button>
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
    (video) => video.type === 'Trailer' && video.site === 'YouTube',
  );

  const cast = show.credits?.cast?.slice(0, 12) || [];
  const validSeasons = show.seasons?.filter((s) => s.season_number > 0) || [];
  const creators = show.created_by || [];

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

        .season-selector {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
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

          .season-selector {
            gap: 8px;
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
        <Link href="/tv" style={styles.backLink}>
          <ArrowLeft size={20} />
          <span>Back to TV Shows</span>
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
                      url: `https://www.2embed.cc/embedtv/${showId}&s=${selectedSeason}&e=${selectedEpisode}`,
                    },
                    {
                      id: 'vidsrcme',
                      label: 'Server 2',
                      color: '#10b981',
                      url: `https://vidsrc.me/embed/tv?tmdb=${showId}&season=${selectedSeason}&episode=${selectedEpisode}`,
                    },
                    {
                      id: 'vidsrcnet',
                      label: 'Server 3',
                      color: '#3b82f6',
                      url: `https://vidsrc.net/embed/tv/${showId}/${selectedSeason}/${selectedEpisode}`,
                    },
                    {
                      id: 'vidsrcto',
                      label: 'Server 4',
                      color: '#8b5cf6',
                      url: `https://vidsrc.to/embed/tv/${showId}/${selectedSeason}/${selectedEpisode}`,
                    },
                  ].map((server) => (
                    <button
                      key={server.id}
                      onClick={() => setTvServer(server.id)}
                      style={{
                        ...styles.serverBarBtn,
                        borderColor:
                          tvServer === server.id ? server.color : 'transparent',
                        background:
                          tvServer === server.id
                            ? `${server.color}22`
                            : 'rgba(255,255,255,0.05)',
                        color:
                          tvServer === server.id ? server.color : '#94a3b8',
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
                  key={`${tvServer}-${selectedSeason}-${selectedEpisode}`}
                  style={styles.iframe}
                  src={
                    [
                      {
                        id: '2embed',
                        url: `https://www.2embed.cc/embedtv/${showId}&s=${selectedSeason}&e=${selectedEpisode}`,
                      },
                      {
                        id: 'vidsrcme',
                        url: `https://vidsrc.me/embed/tv?tmdb=${showId}&season=${selectedSeason}&episode=${selectedEpisode}`,
                      },
                      {
                        id: 'vidsrcnet',
                        url: `https://vidsrc.net/embed/tv/${showId}/${selectedSeason}/${selectedEpisode}`,
                      },
                      {
                        id: 'vidsrcto',
                        url: `https://vidsrc.to/embed/tv/${showId}/${selectedSeason}/${selectedEpisode}`,
                      },
                    ].find((s) => s.id === tvServer)?.url
                  }
                  frameBorder="0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  title={`Watch ${show.name} S${selectedSeason}E${selectedEpisode}`}
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
              alt={`${show.name} backdrop`}
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
              alt={`${show.name} poster`}
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
                disabled={!selectedSeason || !selectedEpisode}
              >
                <Play size={20} fill="white" />
                Watch S{selectedSeason}E{selectedEpisode}
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
                  id: show.id,
                  type: 'tv',
                  name: show.name,
                  title: show.name,
                  poster_path: show.poster_path,
                  vote_average: show.vote_average,
                  first_air_date: show.first_air_date,
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
            <h1 style={styles.title}>{show.name}</h1>
            {show.tagline && <p style={styles.tagline}>"{show.tagline}"</p>}

            {/* Metadata */}
            <div style={styles.metadata}>
              <div style={styles.metaItem}>
                <Star size={18} fill="#ffd700" color="#ffd700" />
                <span>{show.vote_average?.toFixed(1)}/10</span>
              </div>
              <div style={styles.metaItem}>
                <Calendar size={18} />
                <span>
                  {new Date(show.first_air_date).getFullYear() || 'N/A'}
                </span>
              </div>
              <div style={styles.metaItem}>
                <Tv size={18} />
                <span>
                  {show.number_of_seasons} Season
                  {show.number_of_seasons !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Genres */}
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
                      onClick={() => handleSeasonChange(season.season_number)}
                    >
                      Season {season.season_number}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Episode List */}
            {loadingSeason ? (
              <div style={styles.loadingEpisodes}>
                <div style={styles.spinnerSmall}></div>
                <p>Loading episodes...</p>
              </div>
            ) : seasonData && seasonData.episodes ? (
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
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div style={styles.episodeHeader}>
                        <h4 style={styles.episodeTitle}>
                          <span style={styles.episodeNumber}>
                            Ep {episode.episode_number}
                          </span>
                          <span style={styles.episodeSeparator}>·</span>
                          <span style={styles.episodeName}>
                            {episode.name || 'Untitled'}
                          </span>
                        </h4>
                        {episode.air_date && (
                          <span style={styles.episodeAirDate}>
                            {new Date(episode.air_date).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              },
                            )}
                          </span>
                        )}
                      </div>
                      {episode.overview && (
                        <p style={styles.episodeOverview}>
                          {episode.overview.length > 150
                            ? `${episode.overview.slice(0, 150)}...`
                            : episode.overview}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Overview */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Overview</h2>
              <p style={styles.overview}>
                {show.overview || 'No overview available.'}
              </p>
            </div>

            {/* Creators */}
            {creators.length > 0 && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  {creators.length > 1 ? 'Creators' : 'Creator'}
                </h2>
                <p style={styles.creator}>
                  {creators.map((person) => person.name).join(', ')}
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

            {/* Production */}
            {show.production_companies &&
              show.production_companies.length > 0 && (
                <div style={styles.section}>
                  <h2 style={styles.sectionTitle}>Production</h2>
                  <p style={styles.creator}>
                    {show.production_companies
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
  spinnerSmall: {
    width: '35px',
    height: '35px',
    border: '3px solid rgba(229, 9, 20, 0.1)',
    borderTop: '3px solid var(--accent)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingEpisodes: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
    padding: '40px 20px',
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
  seasonButton: {
    padding: '10px 20px',
    backgroundColor: 'var(--card-bg)',
    borderWidth: '2px', // ✅ CHANGED: Split border
    borderStyle: 'solid', // ✅ CHANGED
    borderColor: 'transparent', // ✅ CHANGED
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  seasonButtonActive: {
    backgroundColor: 'var(--accent)',
    borderWidth: '2px', // ✅ ADDED
    borderStyle: 'solid', // ✅ ADDED
    borderColor: 'var(--accent)', // ✅ CHANGED
    color: 'white',
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
  episodeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  episodeCard: {
    padding: '18px',
    backgroundColor: 'var(--card-bg)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderWidth: '2px', // ✅ CHANGED: Split border into separate properties
    borderStyle: 'solid', // ✅ CHANGED
    borderColor: 'transparent', // ✅ CHANGED
  },
  episodeCardActive: {
    backgroundColor: 'rgba(229, 9, 20, 0.15)',
    borderWidth: '2px', // ✅ ADDED: Explicit borderWidth
    borderStyle: 'solid', // ✅ ADDED: Explicit borderStyle
    borderColor: 'var(--accent)', // ✅ CHANGED: Now matches base property structure
    boxShadow: '0 4px 12px rgba(229, 9, 20, 0.3)',
  },
  episodeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
    gap: '15px',
    flexWrap: 'wrap',
  },
  episodeTitle: {
    fontSize: '16px',
    fontWeight: '700',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
    flex: 1,
  },
  episodeNumber: {
    color: 'var(--accent)',
    fontWeight: '800',
  },
  episodeSeparator: {
    color: 'var(--text-secondary)',
    opacity: 0.5,
  },
  episodeName: {
    color: 'var(--text-primary)',
  },
  episodeAirDate: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    whiteSpace: 'nowrap',
    fontWeight: '500',
  },
  episodeOverview: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: 'var(--text-secondary)',
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
    fontWeight: '500',
  },
  castImageContainer: {
    width: '100%',
    paddingBottom: '150%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    borderRadius: '10px',
  },
  castImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '10px',
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
    borderRadius: '0 0 10px 10px',
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
