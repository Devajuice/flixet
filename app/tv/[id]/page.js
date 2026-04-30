"use client";
import { useState, useEffect, use, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Play,
  Star,
  ExternalLink,
  Film,
  Globe,
  Tv,
  ChevronRight,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import WatchlistButton from "@/components/WatchlistButton";
import VideoPlayer from "@/components/VideoPlayer";
import MediaCard from "@/components/MediaCard";
import ScrollRow from "@/components/ScrollRow";
import {
  Skeleton as SkeletonEl,
  SkeletonTitle,
  SkeletonText,
} from "@/components/Skeleton";
import { useContinueWatching } from "@/context/ContinueWatchingContext";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const OMDB_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
const IMG = "https://image.tmdb.org/t/p";

function Skeleton() {
  return (
    <div>
      <Skeleton width="100%" height="70vh" minHeight={400} borderRadius={0} />
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 var(--container-padding)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "260px 1fr",
            gap: 40,
            marginTop: -80,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Skeleton
            width={260}
            height={390}
            borderRadius="var(--radius-xl)"
            style={{ aspectRatio: "2/3" }}
          />
          <div style={{ paddingTop: 80 }}>
            <SkeletonTitle width="60%" height={52} />
            <SkeletonText width="100%" />
            <SkeletonText width="80%" />
            <SkeletonText width="65%" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Score ring ─────────────────────────────────────────────── */
function ScoreRing({ score, size = 56 }) {
  const pct = Math.round((score / 10) * 100);
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = score >= 7 ? "#22c55e" : score >= 5 ? "#f5c518" : "#ef4444";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="3"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div>
        <span
          style={{
            fontSize: "var(--text-lg)",
            fontWeight: "var(--font-bold)",
            color: "var(--text-primary)",
          }}
        >
          {score.toFixed(1)}
        </span>
        <span
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--text-tertiary)",
            display: "block",
          }}
        >
          TMDB
        </span>
      </div>
    </div>
  );
}

/* ── Info card ──────────────────────────────────────────────── */
function InfoCard({ icon, label, value }) {
  return (
    <div
      className="tv-info-card"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 16px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
      }}
    >
      <div style={{ color: "var(--accent)", flexShrink: 0 }}>{icon}</div>
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--text-tertiary)",
            margin: 0,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {label}
        </p>
        <p
          className="tv-info-card-value"
          style={{
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-semibold)",
            color: "var(--text-secondary)",
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/* ── Cast card ──────────────────────────────────────────────── */
function CastCard({ actor }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={`/person/${actor.id}`} style={{ display: "block" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 110,
          cursor: "pointer",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid var(--border)",
          padding: 8,
          textAlign: "center",
          transition: "all var(--transition-base)",
          transform: hovered ? "translateY(-4px)" : "none",
        }}
      >
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: "var(--radius-full)",
            overflow: "hidden",
            background: "var(--bg-tertiary)",
            margin: "0 auto 8px",
          }}
        >
          {actor.profile_path ? (
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                aspectRatio: "1/1",
              }}
            >
              <Image
                src={`${IMG}/w185${actor.profile_path}`}
                alt={actor.name}
                fill
                sizes="84px"
                style={{ objectFit: "cover" }}
              />
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                color: "var(--text-muted)",
              }}
            >
              👤
            </div>
          )}
        </div>
        <p
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: "var(--font-semibold)",
            color: "var(--text-primary)",
            margin: "0 0 2px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {actor.name}
        </p>
        <p
          style={{
            fontSize: 10,
            color: "var(--text-tertiary)",
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {actor.character}
        </p>
      </div>
    </Link>
  );
}

/* ── Episode card ───────────────────────────────────────────── */
function EpisodeCard({ ep, isActive, onClick, omdb, index }) {
  const formatRT = (m) => {
    if (!m) return null;
    const h = Math.floor(m / 60);
    const min = m % 60;
    return h > 0 ? `${h}h ${min}m` : `${min}m`;
  };
  const rt = formatRT(ep.runtime);
  const air = ep.air_date
    ? new Date(ep.air_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;
  const isFuture = ep.air_date && new Date(ep.air_date) > new Date();

  return (
    <motion.div
      onClick={isFuture ? undefined : onClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.4) }}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={`episode-card ${isActive ? "active" : ""} ${isFuture ? "future" : ""}`}
    >
      {/* Episode number */}
      <div className="episode-ep-num">
        <span className="episode-num-text">
          {String(ep.episode_number).padStart(2, "0")}
        </span>
      </div>

      {/* Thumbnail */}
      <div className="episode-thumb">
        {ep.still_path ? (
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Image
              src={`${IMG}/w300${ep.still_path}`}
              alt=""
              fill
              sizes="(max-width: 768px) 200px, 300px"
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : (
          <div className="episode-thumb-placeholder">
            <Play size={20} color="var(--text-muted)" />
          </div>
        )}
        {isActive && !isFuture && (
          <div className="episode-thumb-overlay">
            <div className="episode-play-btn">
              <Play size={16} fill="white" color="white" strokeWidth={0} />
            </div>
          </div>
        )}
        {isFuture && (
          <div className="episode-thumb-overlay future-overlay">
            <Clock size={18} color="var(--text-muted)" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="episode-info">
        <div className="episode-header-row">
          <p className="episode-title">
            {ep.name || `Episode ${ep.episode_number}`}
          </p>
          <div className="episode-ratings">
            {ep.vote_average > 0 && (
              <span
                className={`episode-rating ${ep.vote_average >= 7 ? "high" : ep.vote_average >= 5 ? "mid" : "low"}`}
              >
                <Star size={10} fill="currentColor" />
                {ep.vote_average.toFixed(1)}
              </span>
            )}
            {omdb?.rating && (
              <span className="episode-rating omdb">{omdb.rating}</span>
            )}
          </div>
        </div>

        {ep.overview ? (
          <p className="episode-overview">{ep.overview}</p>
        ) : (
          <p className="episode-overview no-overview">No overview available.</p>
        )}

        <div className="episode-meta-row">
          {air && <span className="episode-meta">{air}</span>}
          {rt && (
            <span className="episode-meta">
              <Clock size={10} />
              {rt}
            </span>
          )}
          {isFuture && <span className="episode-meta upcoming">Upcoming</span>}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
function TVShowDetailsContent({ params }) {
  const searchParams = useSearchParams();
  const seasonParam = searchParams.get("season");
  const episodeParam = searchParams.get("episode");
  const resolvedParams = use(params);
  const showId = resolvedParams?.id;

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [selSeason, setSelSeason] = useState(null);
  const [selEpisode, setSelEpisode] = useState(null);
  const [seasonData, setSeasonData] = useState(null);
  const [loadingSeason, setLoadingSeason] = useState(false);
  const [externalIds, setExternalIds] = useState(null);
  const [showImdb, setShowImdb] = useState(undefined);
  const [omdbCache, setOmdbCache] = useState({});
  const { addToContinueWatching } = useContinueWatching();

  useEffect(() => {
    if (!showId) return;
    setLoading(true);
    setError(null);
    setShowImdb(undefined);
    Promise.all([
      fetch(
        `https://api.themoviedb.org/3/tv/${showId}?api_key=${API_KEY}&append_to_response=credits,videos,recommendations,watch%2Fproviders`,
      ),
      fetch(
        `https://api.themoviedb.org/3/tv/${showId}/external_ids?api_key=${API_KEY}`,
      ),
    ])
      .then((rs) => Promise.all(rs.map((r) => r.json())))
      .then(([showData, extData]) => {
        if (showData.success === false || showData.status_code)
          throw new Error(
            showData.status_message || "Failed to fetch show data",
          );
        setShow(showData);
        setExternalIds(extData);
        const validSeasons =
          showData.seasons?.filter((s) => s.season_number > 0) || [];
        if (validSeasons.length > 0) {
          const paramSeason = seasonParam ? parseInt(seasonParam, 10) : null;
          const paramEpisode = episodeParam ? parseInt(episodeParam, 10) : null;
          const isValidSeason =
            paramSeason &&
            validSeasons.some((s) => s.season_number === paramSeason);
          setSelSeason(
            isValidSeason ? paramSeason : validSeasons[0].season_number,
          );
          setSelEpisode(paramEpisode && paramEpisode > 0 ? paramEpisode : 1);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [showId, seasonParam, episodeParam]);

  useEffect(() => {
    if (!OMDB_KEY || !externalIds?.imdb_id) return;
    fetch(
      `https://www.omdbapi.com/?i=${externalIds.imdb_id}&apikey=${OMDB_KEY}`,
    )
      .then((r) => r.json())
      .then((d) =>
        setShowImdb(
          d.imdbRating && d.imdbRating !== "N/A"
            ? { rating: d.imdbRating, votes: d.imdbVotes }
            : null,
        ),
      )
      .catch(() => setShowImdb(null));
  }, [externalIds]);

  useEffect(() => {
    if (selSeason === null) return;
    setLoadingSeason(true);
    fetch(
      `https://api.themoviedb.org/3/tv/${showId}/season/${selSeason}?api_key=${API_KEY}`,
    )
      .then((r) => r.json())
      .then((d) => setSeasonData(d))
      .catch(console.error)
      .finally(() => setLoadingSeason(false));
  }, [selSeason, showId]);

  useEffect(() => {
    if (!OMDB_KEY || !externalIds?.imdb_id || !seasonData?.episodes) return;
    seasonData.episodes.forEach((ep) => {
      const key = `S${selSeason}E${ep.episode_number}`;
      if (omdbCache[key] !== undefined) return;
      fetch(
        `https://www.omdbapi.com/?i=${externalIds.imdb_id}&Season=${selSeason}&Episode=${ep.episode_number}&apikey=${OMDB_KEY}`,
      )
        .then((r) => r.json())
        .then((d) =>
          setOmdbCache((prev) => ({
            ...prev,
            [key]:
              d.imdbRating && d.imdbRating !== "N/A"
                ? { rating: d.imdbRating }
                : null,
          })),
        )
        .catch(() =>
          setOmdbCache((prev) => ({
            ...prev,
            [`S${selSeason}E${ep.episode_number}`]: null,
          })),
        );
    });
  }, [seasonData, externalIds, selSeason, omdbCache]);

  useEffect(() => {
    if (showPlayer && show) {
      const ep = seasonData?.episodes?.find(
        (e) => e.episode_number === selEpisode,
      );
      addToContinueWatching({
        id: show.id,
        type: "tv",
        name: show.name,
        poster_path: show.poster_path,
        backdrop_path: show.backdrop_path,
        season: selSeason,
        episode: selEpisode,
        runtime: ep?.runtime || show.episode_run_time?.[0] || 45,
        progress: 15,
      });
    }
  }, [
    showPlayer,
    selSeason,
    selEpisode,
    show,
    seasonData,
    addToContinueWatching,
  ]);

  if (loading)
    return (
      <SkeletonEl width="100%" height="70vh" minHeight={400} borderRadius={0} />
    );
  if (error || !show)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
          textAlign: "center",
          padding: 20,
        }}
      >
        <p
          style={{
            fontSize: "var(--text-2xl)",
            fontWeight: "var(--font-bold)",
            color: "var(--accent)",
            marginBottom: 12,
          }}
        >
          {error ? "Error" : "Not Found"}
        </p>
        <p style={{ color: "var(--text-tertiary)", marginBottom: 24 }}>
          {error || "This TV show doesn't exist."}
        </p>
        <Link href="/tv">
          <button className="btn btn-primary">Back to TV Shows</button>
        </Link>
      </div>
    );

  const backdrop = show.backdrop_path
    ? `${IMG}/original${show.backdrop_path}`
    : null;
  const poster = show.poster_path ? `${IMG}/w500${show.poster_path}` : null;
  const cast = show.credits?.cast?.slice(0, 16) || [];
  const validSeasons = show.seasons?.filter((s) => s.season_number > 0) || [];
  const watchProviders = (show["watch/providers"] ?? show["watch%2Fproviders"])
    ?.results?.IN;
  const creators = show.created_by || [];
  const tagline = show.tagline;

  const episodes = seasonData?.episodes || [];
  const currentEpIdx = episodes.findIndex(
    (e) => e.episode_number === selEpisode,
  );
  const hasNext = currentEpIdx < episodes.length - 1;
  const currentSeasonIdx = validSeasons.findIndex(
    (s) => s.season_number === selSeason,
  );
  const hasNextSeason = currentSeasonIdx < validSeasons.length - 1;
  const canGoNext = hasNext || hasNextSeason;

  const handleNextEpisode = () => {
    if (!seasonData?.episodes) return;
    const idx = seasonData.episodes.findIndex(
      (e) => e.episode_number === selEpisode,
    );
    if (idx < seasonData.episodes.length - 1) {
      setSelEpisode(seasonData.episodes[idx + 1].episode_number);
    } else {
      const vs = show.seasons?.filter((s) => s.season_number > 0) || [];
      const sIdx = vs.findIndex((s) => s.season_number === selSeason);
      if (sIdx < vs.length - 1) {
        setSelSeason(vs[sIdx + 1].season_number);
        setSelEpisode(1);
      }
    }
    setShowPlayer(false);
    setTimeout(() => setShowPlayer(true), 300);
  };

  const trailer =
    show.videos?.results?.find(
      (v) => v.type === "Trailer" && v.site === "YouTube",
    ) || show.videos?.results?.find((v) => v.site === "YouTube");
  const status =
    show.status === "Ended"
      ? "Ended"
      : show.status === "Returning Series"
        ? "Returning"
        : show.status === "Canceled"
          ? "Canceled"
          : "Ongoing";
  const statusColor =
    show.status === "Returning Series"
      ? "#22c55e"
      : show.status === "Ended"
        ? "var(--text-tertiary)"
        : show.status === "Canceled"
          ? "#ef4444"
          : "#3b82f6";

  return (
    <>
      <VideoPlayer
        isOpen={showPlayer}
        onClose={() => setShowPlayer(false)}
        type="tv"
        id={showId}
        title={show.name}
        season={selSeason}
        episode={selEpisode}
        onNextEpisode={canGoNext ? handleNextEpisode : null}
        hasNext={canGoNext}
      />

      {/* Trailer modal */}
      <AnimatePresence>
        {showTrailer && trailer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTrailer(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.92)",
              zIndex: 10000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "min(900px, 95vw)",
                aspectRatio: "16/9",
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                background: "#000",
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop hero */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "clamp(280px, 50vh, 500px)",
          overflow: "hidden",
        }}
      >
        {backdrop && (
          <div style={{ position: "absolute", inset: 0 }}>
            <Image
              src={backdrop}
              alt=""
              fill
              sizes="100vw"
              priority
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, var(--bg) 0%, rgba(10,10,10,0.6) 50%, rgba(10,10,10,0.3) 100%)",
          }}
        />
      </div>

      {/* Detail content — poster + info */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 var(--container-padding)",
        }}
      >
        <div className="tv-detail-grid">
          {/* Poster */}
          <div style={{ position: "relative" }}>
            <div
              className="tv-poster-wrapper"
              style={{ position: "relative", aspectRatio: "2/3" }}
            >
              {poster ? (
                <Image
                  src={poster}
                  alt={`${show.name} poster`}
                  fill
                  sizes="(max-width: 768px) 260px, 500px"
                  style={{
                    borderRadius: "var(--radius-xl)",
                    boxShadow: "var(--shadow-xl)",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "2/3",
                    borderRadius: "var(--radius-xl)",
                    background: "var(--bg-tertiary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-muted)",
                    fontSize: 48,
                    boxShadow: "var(--shadow-xl)",
                  }}
                >
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="tv-info-section">
            {/* Status + Genres */}
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 12,
                alignItems: "center",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  background: `${statusColor}18`,
                  border: `1px solid ${statusColor}40`,
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-bold)",
                  color: statusColor,
                }}
              >
                {status}
              </span>
              {show.genres?.slice(0, 3).map((g) => (
                <span key={g.id} className="genre-pill">
                  {g.name}
                </span>
              ))}
            </div>

            <h1
              className="tv-show-title"
              style={{
                fontSize: "clamp(28px, 4vw, 48px)",
                lineHeight: 1.1,
                fontWeight: "var(--font-extrabold)",
                letterSpacing: "-0.025em",
                color: "var(--text-primary)",
                marginBottom: 12,
              }}
            >
              {show.name}
            </h1>

            {tagline && (
              <p
                style={{
                  fontSize: "var(--text-base)",
                  color: "var(--text-tertiary)",
                  fontStyle: "italic",
                  marginBottom: 20,
                }}
              >
                {tagline}
              </p>
            )}

            {/* Scores + Meta */}
            <div
              className="tv-scores-row"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                flexWrap: "wrap",
                marginBottom: 28,
              }}
            >
              <ScoreRing score={show.vote_average || 0} />
              {showImdb && (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      background: "var(--gold)",
                      color: "#000",
                      fontSize: 10,
                      fontWeight: 900,
                      padding: "2px 6px",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    IMDb
                  </span>
                  <span
                    style={{
                      fontSize: "var(--text-base)",
                      fontWeight: "var(--font-bold)",
                      color: "var(--gold)",
                    }}
                  >
                    {showImdb.rating}
                  </span>
                  {showImdb.votes && (
                    <span
                      style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--text-tertiary)",
                      }}
                    >
                      ({showImdb.votes})
                    </span>
                  )}
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                {show.first_air_date && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: "var(--text-secondary)",
                    }}
                  >
                    <Calendar size={14} />
                    <span style={{ fontSize: "var(--text-sm)" }}>
                      {new Date(show.first_air_date).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" },
                      )}
                    </span>
                  </div>
                )}
                {validSeasons.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: "var(--text-secondary)",
                    }}
                  >
                    <Tv size={14} />
                    <span style={{ fontSize: "var(--text-sm)" }}>
                      {validSeasons.length} Season
                      {validSeasons.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
                {show.number_of_episodes && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: "var(--text-secondary)",
                    }}
                  >
                    <Film size={14} />
                    <span style={{ fontSize: "var(--text-sm)" }}>
                      {show.number_of_episodes} Episodes
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div
              className="tv-actions-row"
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: 32,
              }}
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowPlayer(true)}
                disabled={!selSeason || !selEpisode}
                className="btn btn-primary"
                style={{
                  padding: "clamp(10px, 2vw, 14px) clamp(20px, 4vw, 32px)",
                  fontSize: "clamp(var(--text-sm), 2.5vw, var(--text-base))",
                  fontWeight: "var(--font-bold)",
                  opacity: !selSeason || !selEpisode ? 0.5 : 1,
                }}
              >
                <Play size={18} fill="currentColor" /> Play S{selSeason}E
                {selEpisode}
              </motion.button>
              {trailer && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowTrailer(true)}
                  className="btn btn-secondary"
                  style={{
                    padding: "clamp(10px, 2vw, 14px) clamp(16px, 3vw, 24px)",
                  }}
                >
                  <Film size={16} /> Trailer
                </motion.button>
              )}
              <WatchlistButton
                item={{
                  id: show.id,
                  type: "tv",
                  name: show.name,
                  poster_path: show.poster_path,
                  vote_average: show.vote_average,
                  first_air_date: show.first_air_date,
                }}
                variant="large"
              />
            </div>

            {/* Overview */}
            {show.overview && (
              <p
                style={{
                  fontSize: "clamp(var(--text-sm), 2.5vw, var(--text-base))",
                  lineHeight: 1.85,
                  color: "var(--text-secondary)",
                  marginBottom: 32,
                  maxWidth: 720,
                }}
              >
                {show.overview}
              </p>
            )}

            {/* Metadata cards */}
            <div
              className="tv-meta-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 12,
                marginBottom: 32,
              }}
            >
              {creators.length > 0 && (
                <InfoCard
                  icon={<Film size={18} />}
                  label="Creator"
                  value={creators.map((c) => c.name).join(", ")}
                />
              )}
              {show.networks?.length > 0 && (
                <InfoCard
                  icon={<Tv size={18} />}
                  label="Network"
                  value={show.networks
                    .slice(0, 2)
                    .map((n) => n.name)
                    .join(", ")}
                />
              )}
              {show.original_language && (
                <InfoCard
                  icon={<Globe size={18} />}
                  label="Language"
                  value={
                    new Intl.DisplayNames(["en"], { type: "language" }).of(
                      show.original_language,
                    ) || show.original_language
                  }
                />
              )}
              {show.status && (
                <InfoCard
                  icon={<Star size={18} />}
                  label="Status"
                  value={show.status}
                />
              )}
              {show.last_air_date && (
                <InfoCard
                  icon={<Calendar size={18} />}
                  label="Last Aired"
                  value={new Date(show.last_air_date).toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "long", day: "numeric" },
                  )}
                />
              )}
              {show.in_production && (
                <InfoCard
                  icon={<Globe size={18} />}
                  label="Production"
                  value="In Production"
                />
              )}
            </div>

            {/* Watch providers */}
            {watchProviders?.flatrate?.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <p
                  style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: "var(--font-bold)",
                    color: "var(--text-tertiary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: 10,
                  }}
                >
                  Available On
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {watchProviders.flatrate.map((p) => (
                    <div
                      key={p.provider_id}
                      style={{ position: "relative", width: 36, height: 36 }}
                    >
                      <Image
                        src={`${IMG}/w92${p.logo_path}`}
                        alt={p.provider_name}
                        title={p.provider_name}
                        fill
                        sizes="36px"
                        style={{
                          borderRadius: "var(--radius-md)",
                          objectFit: "cover",
                          border: "1px solid var(--border)",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* External links */}
            <div
              className="tv-external-links"
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 40,
              }}
            >
              {externalIds?.imdb_id && (
                <a
                  href={`https://www.imdb.com/title/${externalIds.imdb_id}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    background: "rgba(245,197,24,0.08)",
                    border: "1px solid rgba(245,197,24,0.2)",
                    borderRadius: "var(--radius-lg)",
                    color: "var(--gold)",
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-medium)",
                    textDecoration: "none",
                  }}
                >
                  IMDb <ExternalLink size={13} />
                </a>
              )}
              {externalIds?.tvdb_id && (
                <a
                  href={`https://www.thetvdb.com/series/${externalIds.tvdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    color: "var(--text-secondary)",
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-medium)",
                    textDecoration: "none",
                  }}
                >
                  TVDb <ExternalLink size={13} />
                </a>
              )}
              {show.homepage && (
                <a
                  href={show.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    color: "var(--text-secondary)",
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-medium)",
                    textDecoration: "none",
                  }}
                >
                  Official Site <ExternalLink size={13} />
                </a>
              )}
            </div>

            {/* Season + Episode selector */}
            {validSeasons.length > 0 && (
              <div className="tv-season-section">
                {/* Header */}
                <div
                  className="tv-episode-header"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <div
                    className="score-ring"
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <h3
                      style={{
                        fontSize: "var(--text-lg)",
                        fontWeight: "var(--font-bold)",
                        color: "var(--text-primary)",
                        margin: 0,
                      }}
                    >
                      Episodes
                    </h3>
                    <span
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--text-muted)",
                        fontWeight: "var(--font-medium)",
                      }}
                    >
                      Season {selSeason}
                    </span>
                  </div>
                  {episodes.length > 0 && (
                    <span
                      style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--text-tertiary)",
                      }}
                    >
                      {episodes.length} episodes
                    </span>
                  )}
                </div>

                {/* Season selector with navigation */}
                <div className="tv-season-selector">
                  <button
                    className="season-nav-btn"
                    onClick={() => {
                      const idx = validSeasons.findIndex(
                        (s) => s.season_number === selSeason,
                      );
                      if (idx > 0) {
                        setSelSeason(validSeasons[idx - 1].season_number);
                        setSelEpisode(1);
                      }
                    }}
                    disabled={currentSeasonIdx === 0}
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div className="season-scroll">
                    {validSeasons.map((s) => (
                      <motion.button
                        key={s.id}
                        onClick={() => {
                          setSelSeason(s.season_number);
                          setSelEpisode(1);
                        }}
                        whileTap={{ scale: 0.96 }}
                        className={`season-btn ${selSeason === s.season_number ? "active" : ""}`}
                      >
                        {s.season_number}
                        {s.episode_count && (
                          <span className="season-count">
                            ({s.episode_count})
                          </span>
                        )}
                      </motion.button>
                    ))}
                  </div>

                  <button
                    className="season-nav-btn"
                    onClick={() => {
                      const idx = validSeasons.findIndex(
                        (s) => s.season_number === selSeason,
                      );
                      if (idx < validSeasons.length - 1) {
                        setSelSeason(validSeasons[idx + 1].season_number);
                        setSelEpisode(1);
                      }
                    }}
                    disabled={!hasNextSeason}
                  >
                    <ChevronRightIcon size={16} />
                  </button>
                </div>

                {/* Episodes */}
                {loadingSeason ? (
                  <div className="episodes-list-loading">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="skeleton"
                        style={{
                          height: 110,
                          borderRadius: "var(--radius-lg)",
                        }}
                      />
                    ))}
                  </div>
                ) : episodes.length > 0 ? (
                  <div className="episodes-list">
                    {episodes.map((ep, idx) => (
                      <EpisodeCard
                        key={ep.id}
                        ep={ep}
                        isActive={selEpisode === ep.episode_number}
                        onClick={() => setSelEpisode(ep.episode_number)}
                        omdb={omdbCache[`S${selSeason}E${ep.episode_number}`]}
                        index={idx}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="episodes-empty">
                    <Tv size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
                    <p
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-medium)",
                      }}
                    >
                      No episodes available
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <ScrollRow title="Top Cast">
            {cast.map((actor) => (
              <CastCard key={actor.id} actor={actor} />
            ))}
          </ScrollRow>
        )}

        {/* Recommendations */}
        {show.recommendations?.results
          ?.filter((s) => s.poster_path)
          .slice(0, 16).length > 0 && (
          <ScrollRow
            title="More Like This"
            style={{ marginTop: 40, marginBottom: 60 }}
          >
            {show.recommendations.results
              .filter((s) => s.poster_path)
              .slice(0, 16)
              .map((s) => (
                <MediaCard key={s.id} item={s} type="tv" />
              ))}
          </ScrollRow>
        )}

        {cast.length === 0 && !show.recommendations?.results?.length && (
          <div style={{ height: 60 }} />
        )}
      </div>

      <style jsx global>{`
        .tv-detail-grid {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 44px;
          margin-top: -120px;
          position: relative;
          z-index: 2;
          margin-bottom: 56px;
        }
        .tv-poster-wrapper {
          position: sticky;
          top: 90px;
        }
        .tv-info-section {
          min-width: 0;
          overflow: hidden;
        }
        .tv-show-title {
          overflow-wrap: break-word;
          word-break: break-word;
        }
        .season-scroll::-webkit-scrollbar {
          display: none;
        }
        .tv-meta-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }
        .tv-scores-row {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .tv-actions-row {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }
        .tv-external-links {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .tv-external-links a {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .tv-info-card {
          min-width: 0;
        }
        .tv-episode-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .episodes-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 100%;
          overflow: hidden;
        }
        .episodes-list-loading {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 100%;
          overflow: hidden;
        }
        .episodes-empty {
          text-align: center;
          padding: 48px 20px;
          color: var(--text-tertiary);
        }
        .tv-season-section {
          margin-bottom: 0;
          max-width: 100%;
          overflow: hidden;
        }
        .tv-season-selector {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          overflow: hidden;
          max-width: 100%;
        }
        .season-nav-btn {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 1;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .season-nav-btn:disabled {
          color: var(--text-muted);
          cursor: not-allowed;
          opacity: 0.4;
        }
        .season-scroll {
          flex: 1;
          display: flex;
          gap: 6px;
          overflow-x: auto;
          scrollbar-width: none;
          msoverflowstyle: none;
          -webkit-overflow-scrolling: touch;
          padding: 2px 0;
        }
        .season-btn {
          padding: 8px 14px;
          border-radius: var(--radius-md);
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          cursor: pointer;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--text-secondary);
          transition: all 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
          min-height: 36px;
        }
        .season-btn.active {
          background: var(--accent);
          border-color: var(--accent);
          color: #fff;
        }
        .season-count {
          opacity: 0.5;
          margin-left: 3px;
        }

        /* Episode card */
        .episode-card {
          display: flex;
          gap: 16px;
          padding: 16px;
          border-radius: var(--radius-lg);
          cursor: pointer;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          transition: all 0.2s ease;
          align-items: flex-start;
          opacity: 1;
          max-width: 100%;
          overflow: hidden;
        }
        .episode-card.active {
          background: var(--accent-subtle);
          border-color: var(--accent-border);
        }
        .episode-card.future {
          cursor: default;
          opacity: 0.5;
        }
        .episode-ep-num {
          width: 32px;
          flex-shrink: 0;
          text-align: center;
          padding-top: 2px;
        }
        .episode-num-text {
          font-size: var(--text-lg);
          font-weight: var(--font-extrabold);
          line-height: 1;
          color: var(--text-muted);
        }
        .episode-card.active .episode-num-text {
          color: var(--accent);
        }
        .episode-thumb {
          width: 140px;
          height: 80px;
          flex-shrink: 0;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--bg-tertiary);
          position: relative;
        }
        .episode-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .episode-thumb-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .episode-thumb-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .episode-thumb-overlay.future-overlay {
          background: rgba(0, 0, 0, 0.6);
        }
        .episode-play-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .episode-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
          overflow: hidden;
        }
        .episode-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          min-width: 0;
        }
        .episode-title {
          font-size: var(--text-sm);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          min-width: 0;
          flex: 1;
        }
        .episode-ratings {
          display: flex;
          gap: 6px;
          flex-shrink: 0;
          align-items: center;
        }
        .episode-rating {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 11px;
          font-weight: var(--font-bold);
        }
        .episode-rating.high {
          color: #22c55e;
        }
        .episode-rating.mid {
          color: #f5c518;
        }
        .episode-rating.low {
          color: #ef4444;
        }
        .episode-rating.omdb {
          color: var(--gold);
          background: var(--gold-subtle);
          border: 1px solid var(--gold-border);
          border-radius: var(--radius-sm);
          padding: 2px 6px;
        }
        .episode-overview {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          line-height: 1.6;
          margin: 0;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .episode-overview.no-overview {
          color: var(--text-muted);
          font-style: italic;
        }
        .episode-meta-row {
          display: flex;
          gap: 12px;
          margin-top: 2px;
          flex-wrap: wrap;
        }
        .episode-meta {
          font-size: 11px;
          color: var(--text-muted);
          font-weight: var(--font-medium);
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }
        .episode-meta.upcoming {
          color: var(--accent);
          font-weight: var(--font-semibold);
        }

        @media (max-width: 768px) {
          .tv-detail-grid {
            grid-template-columns: 1fr;
            gap: 24px;
            margin-top: -80px;
            margin-bottom: 32px;
          }
          .tv-poster-wrapper {
            position: relative;
            top: 0;
            max-width: 180px;
            margin: 0 auto;
          }
          .tv-scores-row {
            gap: 16px;
            margin-bottom: 20px;
          }
          .tv-scores-row .score-ring svg {
            width: 44px;
            height: 44px;
          }
          .tv-actions-row {
            margin-bottom: 24px;
          }
          .tv-actions-row .btn {
            padding: 10px 16px;
            font-size: var(--text-sm);
          }
          .tv-meta-grid {
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 24px;
          }
          .tv-info-card {
            padding: 10px 12px;
          }
          .tv-info-card-value {
            font-size: var(--text-xs) !important;
          }
          .tv-external-links {
            margin-bottom: 28px;
          }
          .tv-external-links a {
            padding: 8px 12px;
            font-size: var(--text-sm);
          }
          .tv-episode-header {
            margin-bottom: 16px;
          }
          .tv-episode-header h3 {
            font-size: var(--text-base) !important;
          }
          .tv-season-selector {
            gap: 6px;
            margin-bottom: 16px;
          }
          .season-nav-btn {
            width: 32px;
            height: 32px;
          }
          .season-btn {
            padding: 8px 12px !important;
            min-height: 36px !important;
            font-size: var(--text-sm) !important;
          }
          .episode-card {
            gap: 12px;
            padding: 12px;
          }
          .episode-thumb {
            width: 110px;
            height: 64px;
          }
          .episode-ep-num {
            width: 28px;
          }
          .episode-num-text {
            font-size: var(--text-base);
          }
          .episode-title {
            font-size: var(--text-sm);
          }
          .episode-overview {
            font-size: var(--text-xs);
            -webkit-line-clamp: 1;
          }
          .episode-rating {
            font-size: 10px;
          }
          .episode-meta {
            font-size: 10px;
          }
        }
        @media (max-width: 480px) {
          .tv-poster-wrapper {
            max-width: 140px;
          }
          .tv-meta-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }
          .episode-card {
            flex-direction: column;
            gap: 10px;
            padding: 10px;
          }
          .episode-thumb {
            width: 100%;
            height: auto;
            aspect-ratio: 16/9;
          }
          .episode-ep-num {
            display: none;
          }
          .episodes-list {
            gap: 8px;
          }
          .episodes-list-loading {
            gap: 8px;
          }
          .episode-title {
            font-size: var(--text-sm);
          }
          .episode-overview {
            font-size: 11px;
            line-height: 1.5;
          }
          .episode-meta {
            font-size: 10px;
          }
          .episode-rating {
            font-size: 10px;
          }
          .tv-actions-row {
            gap: 8px;
          }
          .tv-actions-row .btn {
            padding: 10px 14px;
            font-size: var(--text-sm);
            flex: 1;
            justify-content: center;
          }
          .tv-external-links {
            gap: 8px;
            margin-bottom: 24px;
          }
          .tv-external-links a {
            padding: 8px 10px;
            font-size: var(--text-sm);
            flex: 1 1 calc(50% - 8px);
            justify-content: center;
          }
          .season-nav-btn {
            width: 30px;
            height: 30px;
          }
          .season-btn {
            padding: 6px 10px !important;
            min-height: 32px !important;
          }
          .tv-episode-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
            margin-bottom: 14px;
          }
        }
      `}</style>
    </>
  );
}

export default function TVShowDetails({ params }) {
  return (
    <Suspense fallback={<Skeleton />}>
      <TVShowDetailsContent params={params} />
    </Suspense>
  );
}
