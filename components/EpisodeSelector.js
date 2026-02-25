'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Tv } from 'lucide-react';

// ─────────────────────────────────────────────────────────
// Optional: set your OMDb API key in .env.local as
// NEXT_PUBLIC_OMDB_API_KEY=your_key_here
// Get a free key at https://www.omdbapi.com/apikey.aspx
// If not set, only TMDb ratings are shown.
// ─────────────────────────────────────────────────────────
const OMDB_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

export default function EpisodeSelector({
  seasons,
  selectedSeason,
  selectedEpisode,
  onSeasonChange,
  onEpisodeChange,
  // Pass the show's IMDb ID if you have it (from TMDb external_ids endpoint)
  // e.g. imdbId="tt0944947" for Game of Thrones
  imdbId,
}) {
  const currentSeason = seasons.find((s) => s.season_number === selectedSeason);

  // Cache OMDb ratings: key = "S1E3" → { imdbRating, imdbVotes }
  const [omdbCache, setOmdbCache] = useState({});

  // Fetch OMDb rating for a single episode
  const fetchOmdbRating = async (season, episode) => {
    const key = `S${season}E${episode}`;
    if (omdbCache[key] !== undefined) return; // already fetched
    if (!OMDB_KEY || !imdbId) return;

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?i=${imdbId}&Season=${season}&Episode=${episode}&apikey=${OMDB_KEY}`,
      );
      const data = await res.json();
      setOmdbCache((prev) => ({
        ...prev,
        [key]:
          data.imdbRating && data.imdbRating !== 'N/A'
            ? { rating: data.imdbRating, votes: data.imdbVotes }
            : null,
      }));
    } catch {
      setOmdbCache((prev) => ({ ...prev, [key]: null }));
    }
  };

  // Pre-fetch all episodes of the current season when it changes
  useEffect(() => {
    if (!OMDB_KEY || !imdbId || !currentSeason?.episodes) return;
    currentSeason.episodes.forEach((ep) => {
      fetchOmdbRating(selectedSeason, ep.episode_number);
    });
  }, [selectedSeason, imdbId]);

  return (
    <div style={styles.container}>
      {/* ── Season Selector ─────────────────────────── */}
      <div style={styles.section}>
        <h3 style={styles.label}>Season</h3>
        <div style={styles.seasonGrid}>
          {seasons.map((season) => (
            <SeasonButton
              key={season.season_number}
              season={season}
              isActive={selectedSeason === season.season_number}
              onClick={() => onSeasonChange(season.season_number)}
            />
          ))}
        </div>
      </div>

      {/* ── Episode List ─────────────────────────────── */}
      {currentSeason && (
        <motion.div
          style={styles.section}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 style={styles.label}>
            Episodes
            <span
              style={{
                fontSize: '11px',
                fontWeight: '600',
                color: 'rgba(255,255,255,0.25)',
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                marginLeft: '4px',
              }}
            >
              {currentSeason.episodes?.length || currentSeason.episode_count}{' '}
              eps
            </span>
          </h3>
          <div style={styles.episodeList}>
            {currentSeason.episodes && currentSeason.episodes.length > 0
              ? currentSeason.episodes.map((episode, index) => (
                  <EpisodeCard
                    key={episode.episode_number || index}
                    episode={episode}
                    isActive={selectedEpisode === episode.episode_number}
                    onClick={() => onEpisodeChange(episode.episode_number)}
                    index={index}
                    omdb={
                      omdbCache[`S${selectedSeason}E${episode.episode_number}`]
                    }
                  />
                ))
              : Array.from(
                  { length: currentSeason.episode_count },
                  (_, i) => i + 1,
                ).map((ep, index) => (
                  <EpisodeCard
                    key={ep}
                    episode={{
                      episode_number: ep,
                      name: null,
                      overview: null,
                      air_date: null,
                    }}
                    isActive={selectedEpisode === ep}
                    onClick={() => onEpisodeChange(ep)}
                    index={index}
                    fallback
                    omdb={omdbCache[`S${selectedSeason}E${ep}`]}
                  />
                ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ── Season Button ─────────────────────────────────── */
function SeasonButton({ season, isActive, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.96 }}
      style={{
        padding: '8px 18px',
        background: isActive
          ? 'rgba(255,193,60,0.12)'
          : hovered
            ? 'rgba(255,255,255,0.06)'
            : 'rgba(255,255,255,0.04)',
        border: `1px solid ${
          isActive
            ? 'rgba(255,193,60,0.5)'
            : hovered
              ? 'rgba(255,255,255,0.12)'
              : 'rgba(255,255,255,0.08)'
        }`,
        borderRadius: '8px',
        color: isActive
          ? '#ffc13c'
          : hovered
            ? 'rgba(255,255,255,0.85)'
            : 'rgba(255,255,255,0.5)',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        letterSpacing: '0.02em',
        transition:
          'background 0.2s ease, border-color 0.2s ease, color 0.2s ease',
      }}
    >
      Season {season.season_number}
    </motion.button>
  );
}

/* ── Episode Card ──────────────────────────────────── */
function EpisodeCard({ episode, isActive, onClick, index, fallback, omdb }) {
  const [hovered, setHovered] = useState(false);

  // TMDb rating from episode data
  const tmdbRating = episode.vote_average
    ? parseFloat(episode.vote_average).toFixed(1)
    : null;

  // Show TMDb rating only if meaningful (TMDb shows 0.0 for unrated)
  const showTmdb = tmdbRating && parseFloat(tmdbRating) > 0;

  return (
    <motion.div
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.025 }}
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.998 }}
      style={{
        padding: '16px 18px',
        background: isActive
          ? 'rgba(255,193,60,0.07)'
          : hovered
            ? 'rgba(255,255,255,0.05)'
            : 'rgba(255,255,255,0.03)',
        border: `1px solid ${
          isActive
            ? 'rgba(255,193,60,0.3)'
            : hovered
              ? 'rgba(255,255,255,0.1)'
              : 'rgba(255,255,255,0.06)'
        }`,
        borderRadius: '10px',
        cursor: 'pointer',
        boxShadow: isActive ? '0 0 0 1px rgba(255,193,60,0.1)' : 'none',
        transition:
          'background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      {/* ── Header row ─────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: episode.overview ? '8px' : 0,
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        {/* Ep number + title */}
        <h4
          style={{
            fontSize: '14px',
            fontWeight: '700',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '7px',
            flex: 1,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <span
            style={{
              color: '#ffc13c',
              fontWeight: '800',
              fontSize: '13px',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Ep {episode.episode_number}
          </span>
          {episode.name && (
            <>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
              <span
                style={{
                  color: isActive
                    ? 'rgba(255,255,255,0.95)'
                    : 'rgba(255,255,255,0.8)',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {episode.name}
              </span>
            </>
          )}
        </h4>

        {/* Air date */}
        {episode.air_date && (
          <span
            style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.28)',
              whiteSpace: 'nowrap',
              fontWeight: '500',
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: '0.02em',
            }}
          >
            {new Date(episode.air_date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        )}
      </div>

      {/* ── Ratings row ────────────────────────────── */}
      {(showTmdb || omdb) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: episode.overview ? '8px' : 0,
            flexWrap: 'wrap',
          }}
        >
          {/* TMDb rating */}
          {showTmdb && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(255,193,60,0.08)',
                border: '1px solid rgba(255,193,60,0.18)',
                borderRadius: '6px',
                padding: '3px 8px',
              }}
            >
              <Star size={11} fill="#ffc13c" color="#ffc13c" />
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#ffc13c',
                  letterSpacing: '0.02em',
                }}
              >
                {tmdbRating}
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '10px',
                  fontWeight: '600',
                  color: 'rgba(255,193,60,0.5)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                TMDb
              </span>
            </div>
          )}

          {/* IMDb rating via OMDb */}
          {omdb && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(245,197,24,0.08)',
                border: '1px solid rgba(245,197,24,0.2)',
                borderRadius: '6px',
                padding: '3px 8px',
              }}
            >
              {/* IMDb logo pill */}
              <span
                style={{
                  background: '#f5c518',
                  color: '#000',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '9px',
                  fontWeight: '900',
                  padding: '1px 4px',
                  borderRadius: '3px',
                  letterSpacing: '0.03em',
                }}
              >
                IMDb
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#f5c518',
                  letterSpacing: '0.02em',
                }}
              >
                {omdb.rating}
              </span>
              {omdb.votes && (
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '10px',
                    color: 'rgba(245,197,24,0.4)',
                    letterSpacing: '0.02em',
                  }}
                >
                  ({Number(omdb.votes.replace(/,/g, '')).toLocaleString()})
                </span>
              )}
            </div>
          )}

          {/* Loading state for OMDb */}
          {OMDB_KEY && imdbId && omdb === undefined && (
            <div
              style={{
                width: '60px',
                height: '22px',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '6px',
                animation: 'shimmer 1.5s infinite',
              }}
            />
          )}
        </div>
      )}

      {/* ── Overview ───────────────────────────────── */}
      {episode.overview ? (
        <p
          style={{
            fontSize: '13px',
            lineHeight: '1.65',
            color: 'rgba(255,255,255,0.4)',
            margin: 0,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {episode.overview.length > 160
            ? `${episode.overview.slice(0, 160)}...`
            : episode.overview}
        </p>
      ) : (
        <p
          style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.22)',
            fontStyle: 'italic',
            margin: 0,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {fallback
            ? 'Episode details not available'
            : 'No description available'}
        </p>
      )}
    </motion.div>
  );
}

const styles = {
  container: {
    marginBottom: '30px',
    fontFamily: "'DM Sans', sans-serif",
  },
  section: {
    marginBottom: '32px',
  },
  label: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '15px',
    fontWeight: '700',
    marginBottom: '14px',
    color: 'rgba(255,255,255,0.88)',
    letterSpacing: '0.09em',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  seasonGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  episodeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
};
