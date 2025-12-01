'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getTVShowDetails, getTVCredits, getImageUrl } from '@/lib/tmdb';
import { formatDate } from '@/lib/utils';
import EpisodeSelector from '@/components/EpisodeSelector';
import CastSection from '@/components/CastSection';

export default function TVShowPage({ params }) {
  const [showId, setShowId] = useState(null);
  const [show, setShow] = useState(null);
  const [credits, setCredits] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [selectedServer, setSelectedServer] = useState('vidsrc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function unwrapParams() {
      const resolvedParams = await params;
      setShowId(resolvedParams.id);
    }
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (!showId) return;

    async function fetchShow() {
      const [showData, creditsData] = await Promise.all([
        getTVShowDetails(showId),
        getTVCredits(showId),
      ]);
      setShow(showData);
      setCredits(creditsData);
      setSelectedSeason(
        showData.seasons.find((s) => s.season_number > 0)?.season_number || 1
      );
      setLoading(false);
    }
    fetchShow();
  }, [showId]);

  if (loading || !show || !showId) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <motion.div
          style={styles.player}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 style={styles.playerTitle}>
            Season {selectedSeason} - Episode {selectedEpisode}
          </h2>

          <div className="server-buttons">
            <button
              onClick={() => setSelectedServer('server1')}
              className={`server-btn ${
                selectedServer === 'server1' ? 'active' : ''
              }`}
            >
              Server 1
            </button>
            <button
              onClick={() => setSelectedServer('server2')}
              className={`server-btn ${
                selectedServer === 'server2' ? 'active' : ''
              }`}
            >
              Server 2
            </button>
            <button
              onClick={() => setSelectedServer('server3')}
              className={`server-btn ${
                selectedServer === 'server3' ? 'active' : ''
              }`}
            >
              Server 3
            </button>
            <button
              onClick={() => setSelectedServer('server4')}
              className={`server-btn ${
                selectedServer === 'server4' ? 'active' : ''
              }`}
            >
              Server 4
            </button>
          </div>

          <div style={styles.videoContainer}>
            <iframe
              key={`${selectedServer}-${selectedSeason}-${selectedEpisode}`}
              style={styles.iframe}
              src={(() => {
                const servers = {
                  server1: `https://www.2embed.cc/embedtv/${showId}&s=${selectedSeason}&e=${selectedEpisode}`,
                  server2: `https://multiembed.mov/?video_id=${showId}&tmdb=1&s=${selectedSeason}&e=${selectedEpisode}`,
                  server3: `https://vidsrc.me/embed/tv?tmdb=${showId}&season=${selectedSeason}&episode=${selectedEpisode}`,
                  server4: `https://vidsrc.xyz/embed/tv/${showId}/${selectedSeason}-${selectedEpisode}`,
                };
                return servers[selectedServer];
              })()}
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture"
              referrerPolicy="origin"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  const validSeasons = show.seasons.filter((s) => s.season_number > 0);

  const servers = {
    vidsrc: `https://vidsrc.xyz/embed/tv/${showId}/${selectedSeason}-${selectedEpisode}`,
    vidsrc2: `https://vidsrc.to/embed/tv/${showId}/${selectedSeason}/${selectedEpisode}`,
    vidsrcpro: `https://vidsrc.pro/embed/tv/${showId}/${selectedSeason}-${selectedEpisode}`,
    embedsu: `https://embed.su/embed/tv/${showId}/${selectedSeason}/${selectedEpisode}`,
  };

  return (
    <>
      <style jsx>{`
        .server-buttons {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }

        .server-btn {
          padding: 10px 20px;
          background-color: var(--card-bg);
          color: var(--text-primary);
          border: 2px solid transparent;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .server-btn:hover {
          background-color: var(--secondary-bg);
        }

        .server-btn.active {
          background-color: var(--accent);
          border-color: var(--accent);
        }

        @media (max-width: 640px) {
          .server-btn {
            padding: 8px 15px;
            font-size: 12px;
          }
        }
      `}</style>

      <div style={styles.container}>
        <div style={styles.backdrop}>
          <img
            src={getImageUrl(show.backdrop_path, 'original')}
            alt={show.name}
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
            {show.name}
          </motion.h1>

          <motion.div
            style={styles.meta}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span style={styles.rating}>⭐ {show.vote_average.toFixed(1)}</span>
            <span>{formatDate(show.first_air_date)}</span>
            <span>{show.number_of_seasons} Seasons</span>
            <span>{show.number_of_episodes} Episodes</span>
          </motion.div>

          <motion.p
            style={styles.overview}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {show.overview}
          </motion.p>

          <motion.div
            style={styles.genres}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {show.genres.map((genre) => (
              <span key={genre.id} style={styles.genre}>
                {genre.name}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <EpisodeSelector
              seasons={validSeasons}
              selectedSeason={selectedSeason}
              selectedEpisode={selectedEpisode}
              onSeasonChange={(season) => {
                setSelectedSeason(season);
                setSelectedEpisode(1);
              }}
              onEpisodeChange={setSelectedEpisode}
            />
          </motion.div>

          <motion.div
            style={styles.player}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 style={styles.playerTitle}>
              Season {selectedSeason} - Episode {selectedEpisode}
            </h2>

            <div className="server-buttons">
              <button
                onClick={() => setSelectedServer('vidsrc')}
                className={`server-btn ${
                  selectedServer === 'vidsrc' ? 'active' : ''
                }`}
              >
                Server 1
              </button>
              <button
                onClick={() => setSelectedServer('vidsrc2')}
                className={`server-btn ${
                  selectedServer === 'vidsrc2' ? 'active' : ''
                }`}
              >
                Server 2
              </button>
              <button
                onClick={() => setSelectedServer('vidsrcpro')}
                className={`server-btn ${
                  selectedServer === 'vidsrcpro' ? 'active' : ''
                }`}
              >
                Server 3
              </button>
              <button
                onClick={() => setSelectedServer('embedsu')}
                className={`server-btn ${
                  selectedServer === 'embedsu' ? 'active' : ''
                }`}
              >
                Server 4
              </button>
            </div>

            <div style={styles.videoContainer}>
              <iframe
                key={`${selectedServer}-${selectedSeason}-${selectedEpisode}`}
                src={servers[selectedServer]}
                style={styles.iframe}
                allowFullScreen
                allow="autoplay; encrypted-media; picture-in-picture"
                frameBorder="0"
                scrolling="no"
              />
            </div>
          </motion.div>

          {credits && <CastSection cast={credits.cast} />}
        </div>
      </div>
    </>
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
    background:
      'linear-gradient(to top, var(--primary-bg) 0%, transparent 100%)',
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
    flexWrap: 'wrap',
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
  playerTitle: {
    fontSize: '24px',
    marginBottom: '20px',
    color: 'var(--accent)',
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    paddingBottom: '56.25%',
    backgroundColor: '#000',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
  },
};
