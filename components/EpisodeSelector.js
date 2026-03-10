"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Star, Tv } from "lucide-react";

const OMDB_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

export default function EpisodeSelector({
  seasons,
  selectedSeason,
  selectedEpisode,
  onSeasonChange,
  onEpisodeChange,
  imdbId,
}) {
  const currentSeason = seasons.find((s) => s.season_number === selectedSeason);
  const [omdbCache, setOmdbCache] = useState({});

  // Memoized so it can be a stable dep in useEffect below.
  // Uses functional setState to read latest cache without closing over it.
  const fetchOmdbRating = useCallback(
    (season, episode) => {
      const key = `S${season}E${episode}`;
      if (!OMDB_KEY || !imdbId) return;
      setOmdbCache((prev) => {
        // Already fetched or in-flight
        if (Object.prototype.hasOwnProperty.call(prev, key)) return prev;
        // Fire the request
        fetch(
          `https://www.omdbapi.com/?i=${imdbId}&Season=${season}&Episode=${episode}&apikey=${OMDB_KEY}`,
        )
          .then((r) => r.json())
          .then((data) =>
            setOmdbCache((p) => ({
              ...p,
              [key]:
                data.imdbRating && data.imdbRating !== "N/A"
                  ? { rating: data.imdbRating, votes: data.imdbVotes }
                  : null,
            })),
          )
          .catch(() => setOmdbCache((p) => ({ ...p, [key]: null })));
        // Mark as in-flight immediately to prevent duplicate fetches
        return { ...prev, [key]: undefined };
      });
    },
    [imdbId],
  );

  useEffect(() => {
    if (!OMDB_KEY || !imdbId || !currentSeason?.episodes) return;
    currentSeason.episodes.forEach((ep) => {
      fetchOmdbRating(selectedSeason, ep.episode_number);
    });
  }, [selectedSeason, imdbId, currentSeason, fetchOmdbRating]);

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
                fontSize: "11px",
                fontWeight: "600",
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                marginLeft: "4px",
              }}
            >
              {currentSeason.episodes?.length || currentSeason.episode_count}{" "}
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
                      runtime: null,
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
        padding: "8px 18px",
        background: isActive
          ? "rgba(255,193,60,0.12)"
          : hovered
            ? "rgba(255,255,255,0.06)"
            : "rgba(255,255,255,0.04)",
        border: `1px solid ${
          isActive
            ? "rgba(255,193,60,0.5)"
            : hovered
              ? "rgba(255,255,255,0.12)"
              : "rgba(255,255,255,0.08)"
        }`,
        borderRadius: "8px",
        color: isActive
          ? "#ffc13c"
          : hovered
            ? "rgba(255,255,255,0.85)"
            : "rgba(255,255,255,0.5)",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer",
        letterSpacing: "0.02em",
        transition:
          "background 0.2s ease, border-color 0.2s ease, color 0.2s ease",
      }}
    >
      Season {season.season_number}
    </motion.button>
  );
}

/* ── Episode Card ──────────────────────────────────── */
function EpisodeCard({ episode, isActive, onClick, index, fallback, omdb }) {
  const [hovered, setHovered] = useState(false);

  const F = { fontFamily: "'DM Sans', sans-serif" };

  // ── Runtime formatter ──
  const formatRuntime = (mins) => {
    if (!mins) return null;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };
  const runtime = formatRuntime(episode.runtime);

  // ── Air date ──
  const airDate = episode.air_date
    ? new Date(episode.air_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  // ── TMDb rating ──
  const tmdbRating = episode.vote_average
    ? parseFloat(episode.vote_average).toFixed(1)
    : null;
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
        padding: "14px 18px",
        background: isActive
          ? "rgba(255,193,60,0.07)"
          : hovered
            ? "rgba(255,255,255,0.05)"
            : "rgba(255,255,255,0.03)",
        border: `1px solid ${
          isActive
            ? "rgba(255,193,60,0.3)"
            : hovered
              ? "rgba(255,255,255,0.1)"
              : "rgba(255,255,255,0.06)"
        }`,
        borderRadius: "10px",
        cursor: "pointer",
        boxShadow: isActive ? "0 0 0 1px rgba(255,193,60,0.1)" : "none",
        transition:
          "background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      {/* ── Row 1: title · runtime chip · date ─────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "8px",
        }}
      >
        {/* Ep number + title */}
        <h4
          style={{
            ...F,
            fontSize: "14px",
            fontWeight: "700",
            margin: 0,
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "7px",
            flex: 1,
            minWidth: 0,
          }}
        >
          <span
            style={{
              ...F,
              color: "#ffc13c",
              fontWeight: "800",
              fontSize: "13px",
              flexShrink: 0,
            }}
          >
            Ep {episode.episode_number}
          </span>
          {episode.name && (
            <>
              <span style={{ color: "rgba(255,255,255,0.18)" }}>·</span>
              <span
                style={{
                  ...F,
                  color: isActive
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(255,255,255,0.82)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {episode.name}
              </span>
            </>
          )}
        </h4>

        {/* Right side: runtime + date */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          {/* ⏱ Runtime chip */}
          {runtime && (
            <span
              style={{
                ...F,
                fontSize: "11px",
                fontWeight: "600",
                color: "rgba(255,193,60,0.85)",
                background: "rgba(255,193,60,0.1)",
                border: "1px solid rgba(255,193,60,0.22)",
                borderRadius: "4px",
                padding: "2px 8px",
                letterSpacing: "0.02em",
                whiteSpace: "nowrap",
              }}
            >
              ⏱ {runtime}
            </span>
          )}

          {/* Air date — brighter */}
          {airDate && (
            <span
              style={{
                ...F,
                fontSize: "11px",
                fontWeight: "600",
                color: "rgba(255,255,255,0.65)",
                whiteSpace: "nowrap",
                letterSpacing: "0.02em",
              }}
            >
              {airDate}
            </span>
          )}
        </div>
      </div>

      {/* ── Row 2: TMDb + OMDb ratings ─────────────── */}
      {(showTmdb || omdb) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: episode.overview ? "8px" : 0,
            flexWrap: "wrap",
          }}
        >
          {/* TMDb badge */}
          {showTmdb && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                background: "rgba(255,193,60,0.08)",
                border: "1px solid rgba(255,193,60,0.18)",
                borderRadius: "6px",
                padding: "3px 8px",
              }}
            >
              <Star size={11} fill="#ffc13c" color="#ffc13c" />
              <span
                style={{
                  ...F,
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "#ffc13c",
                  letterSpacing: "0.02em",
                }}
              >
                {tmdbRating}
              </span>
              <span
                style={{
                  ...F,
                  fontSize: "10px",
                  fontWeight: "600",
                  color: "rgba(255,193,60,0.5)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                TMDb
              </span>
            </div>
          )}

          {/* IMDb badge via OMDb */}
          {omdb && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                background: "rgba(245,197,24,0.08)",
                border: "1px solid rgba(245,197,24,0.2)",
                borderRadius: "6px",
                padding: "3px 8px",
              }}
            >
              <span
                style={{
                  background: "#f5c518",
                  color: "#000",
                  ...F,
                  fontSize: "9px",
                  fontWeight: "900",
                  padding: "1px 4px",
                  borderRadius: "3px",
                  letterSpacing: "0.03em",
                }}
              >
                IMDb
              </span>
              <span
                style={{
                  ...F,
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "#f5c518",
                  letterSpacing: "0.02em",
                }}
              >
                {omdb.rating}
              </span>
              {omdb.votes && (
                <span
                  style={{
                    ...F,
                    fontSize: "10px",
                    color: "rgba(245,197,24,0.4)",
                    letterSpacing: "0.02em",
                  }}
                >
                  ({Number(omdb.votes.replace(/,/g, "")).toLocaleString()})
                </span>
              )}
            </div>
          )}

          {/* OMDb loading shimmer */}
          {OMDB_KEY && imdbId && omdb === undefined && (
            <div
              style={{
                width: "60px",
                height: "22px",
                background: "rgba(255,255,255,0.04)",
                borderRadius: "6px",
              }}
            />
          )}
        </div>
      )}

      {/* ── Row 3: overview ────────────────────────── */}
      {episode.overview ? (
        <p
          style={{
            ...F,
            fontSize: "13px",
            lineHeight: "1.65",
            color: "rgba(255,255,255,0.4)",
            margin: 0,
          }}
        >
          {episode.overview.length > 160
            ? `${episode.overview.slice(0, 160)}...`
            : episode.overview}
        </p>
      ) : (
        <p
          style={{
            ...F,
            fontSize: "12px",
            color: "rgba(255,255,255,0.22)",
            fontStyle: "italic",
            margin: 0,
          }}
        >
          {fallback
            ? "Episode details not available"
            : "No description available"}
        </p>
      )}
    </motion.div>
  );
}

const styles = {
  container: {
    marginBottom: "30px",
    fontFamily: "'DM Sans', sans-serif",
  },
  section: {
    marginBottom: "32px",
  },
  label: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "15px",
    fontWeight: "700",
    marginBottom: "14px",
    color: "rgba(255,255,255,0.88)",
    letterSpacing: "0.09em",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  seasonGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  episodeList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
};
