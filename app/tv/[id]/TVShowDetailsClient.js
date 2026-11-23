"use client";
import { useState, useEffect, use, useRef, useCallback, Suspense } from "react";
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
import dynamic from "next/dynamic";
import MediaCard from "@/components/MediaCard";
import ScrollRow from "@/components/ScrollRow";
import ShareButton from "@/components/ShareButton";
import {
  Skeleton as SkeletonEl,
  SkeletonTitle,
  SkeletonText,
} from "@/components/Skeleton";
import { useContinueWatching } from "@/context/ContinueWatchingContext";
import { useHistory } from "@/context/HistoryContext";
import { formatDate } from "@/lib/utils";
import {
  getTVShowDetails,
  getTVExternalIds,
  getSeasonDetails,
} from "@/lib/tmdbClient";

const VideoPlayer = dynamic(() => import("@/components/VideoPlayer"), {
  ssr: false,
});

const OMDB_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
const IMG = "https://image.tmdb.org/t/p";

// Fixed reference date so "upcoming episode" checks stay deterministic across
// renders and hydration.
const TODAY = new Date().toISOString().slice(0, 10);
const formatAirDateLocal = (dateString) => {
  if (!dateString) return "";
  const d = new Date(`${String(dateString).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(d.getTime())) return formatDate(dateString);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
};

function SkeletonPage() {
  return (
    <div>
      <SkeletonEl width="100%" height="70vh" minHeight={400} borderRadius={0} />
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
          <SkeletonEl
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
        background: "rgba(10, 10, 10, 0.6)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        borderRadius: "var(--radius-lg)",
        transition: "all var(--transition-base)",
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
    <Link
      href={`/person/${actor.id}`}
      style={{ display: "block", textDecoration: "none" }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 110,
          cursor: "pointer",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          background: "rgba(10, 10, 10, 0.5)",
          border: hovered ? "1px solid var(--accent-border)" : "1px solid rgba(255, 255, 255, 0.06)",
          padding: 8,
          textAlign: "center",
          transition: "all var(--transition-base)",
          transform: hovered ? "translateY(-4px)" : "none",
          boxShadow: hovered ? "0 8px 24px rgba(0, 0, 0, 0.4), 0 0 16px rgba(212, 175, 55, 0.2)" : "none",
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
  const air = ep.air_date ? formatDate(ep.air_date) : null;
  const isFuture = ep.air_date ? ep.air_date > TODAY : false;

  return (
    <motion.div
      onClick={isFuture ? undefined : onClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.4) }}
      tabIndex={isFuture ? -1 : 0}
      role="button"
      aria-disabled={isFuture}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!isFuture) onClick();
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
              <Play
                size={16}
                fill="#0b1220"
                color="#0b1220"
                strokeWidth={0}
                style={{ marginLeft: 2 }}
              />
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
  const omdbCacheRef = useRef({});
  const { addToContinueWatching } = useContinueWatching();
  const { addToHistory } = useHistory();

  const [prevShowId, setPrevShowId] = useState(showId);
  if (showId !== prevShowId) {
    setPrevShowId(showId);
    setLoading(true);
    setError(null);
    setShowImdb(undefined);
    setSeasonData(null);
    setSelSeason(null);
    setSelEpisode(null);
  }

  useEffect(() => {
    if (!showId) return;

    const controller = new AbortController();
    const { signal } = controller;

    Promise.all([
      getTVShowDetails(showId, { signal }),
      getTVExternalIds(showId, { signal }),
    ])
      .then(([showData, extData]) => {
        setShow(showData);
        addToHistory({
          id: showData.id,
          type: "tv",
          title: showData.name,
          name: showData.name,
          poster_path: showData.poster_path,
          backdrop_path: showData.backdrop_path,
          vote_average: showData.vote_average,
          first_air_date: showData.first_air_date,
        });
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
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Failed to fetch show data");
      })
      .finally(() => {
        if (!signal.aborted) setLoading(false);
      });

    return () => controller.abort();
    // seasonParam/episodeParam are read here but shouldn't retrigger the
    // show fetch — they're handled by the season/episode effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showId, addToHistory]);

  useEffect(() => {
    if (!OMDB_KEY || !externalIds?.imdb_id) return;
    fetch(
      `https://www.omdbapi.com/?i=${externalIds.imdb_id}&apikey=${OMDB_KEY}`,
    )
      .then((r) => r.json())
      .then((d) => {
        const ratings = Array.isArray(d.Ratings) ? d.Ratings : [];
        const rt = ratings.find((r) => r.Source === "Rotten Tomatoes")?.Value;
        const meta = ratings.find((r) => r.Source === "Metacritic")?.Value || (d.Metascore && d.Metascore !== "N/A" ? `${d.Metascore}/100` : null);
        const hasImdb = d.imdbRating && d.imdbRating !== "N/A";
        if (hasImdb || rt || meta) {
          setShowImdb({
            rating: hasImdb ? d.imdbRating : null,
            votes: d.imdbVotes && d.imdbVotes !== "N/A" ? d.imdbVotes : null,
            rottenTomatoes: rt || null,
            metacritic: meta || null,
          });
        } else {
          setShowImdb(null);
        }
      })
      .catch(() => setShowImdb(null));
  }, [externalIds]);

  const [prevSeasonKey, setPrevSeasonKey] = useState(`${showId}-${selSeason}`);
  const seasonKey = `${showId}-${selSeason}`;
  if (seasonKey !== prevSeasonKey) {
    setPrevSeasonKey(seasonKey);
    setLoadingSeason(true);
  }

  useEffect(() => {
    if (selSeason === null) return;

    const controller = new AbortController();
    const { signal } = controller;

    getSeasonDetails(showId, selSeason, { signal })
      .then((d) => setSeasonData(d))
      .catch((e) => {
        if (e.name !== "AbortError") console.error(e);
      })
      .finally(() => {
        if (!signal.aborted) setLoadingSeason(false);
      });

    return () => controller.abort();
  }, [selSeason, showId]);

  // `omdbCacheRef` mirrors omdbCache so this effect doesn't re-run (and re-fire
// every in-flight request) on each cache write. Fetch in parallel and commit
// once, rather than one setState per episode.
  useEffect(() => {
    if (!OMDB_KEY || !externalIds?.imdb_id || !seasonData?.episodes) return;

    const controller = new AbortController();
    const { signal } = controller;

    const pending = seasonData.episodes
      .filter((ep) => omdbCacheRef.current[`S${selSeason}E${ep.episode_number}`] === undefined)
      .map((ep) => ({
        key: `S${selSeason}E${ep.episode_number}`,
        request: fetch(
          `https://www.omdbapi.com/?i=${externalIds.imdb_id}&Season=${selSeason}&Episode=${ep.episode_number}&apikey=${OMDB_KEY}`,
          { signal },
        )
          .then((r) => r.json())
          .then((d) =>
            d.imdbRating && d.imdbRating !== "N/A"
              ? { rating: d.imdbRating }
              : null,
          )
          .catch(() => null),
      }));

    if (pending.length === 0) return;

    Promise.all(pending.map((p) => p.request)).then((results) => {
      if (signal.aborted) return;

      setOmdbCache((prev) => {
        const next = { ...prev };
        pending.forEach((p, i) => {
          next[p.key] = results[i];
        });
        omdbCacheRef.current = next;
        return next;
      });
    });

    return () => controller.abort();
  }, [seasonData, externalIds, selSeason]);

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
        progress: 0,
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

  const handleWatchedSeconds = useCallback(
    (seconds) => {
      if (!show) return;
      const ep = seasonData?.episodes?.find(
        (e) => e.episode_number === selEpisode,
      );
      const runtime = ep?.runtime || show.episode_run_time?.[0] || 45;
      const runtimeSecs = runtime * 60;
      const progress = Math.min(
        99,
        Math.max(1, Math.round((seconds / runtimeSecs) * 100)),
      );
      addToContinueWatching({
        id: show.id,
        type: "tv",
        name: show.name,
        poster_path: show.poster_path,
        backdrop_path: show.backdrop_path,
        season: selSeason,
        episode: selEpisode,
        runtime,
        progress,
      });
    },
    [show, seasonData, selSeason, selEpisode, addToContinueWatching],
  );

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
    ? `${IMG}/w1280${show.backdrop_path}`
    : null;
  const poster = show.poster_path ? `${IMG}/w500${show.poster_path}` : null;
  const cast = show.credits?.cast?.slice(0, 16) || [];
  const validSeasons = show.seasons?.filter((s) => s.season_number > 0) || [];
  const watchProviders = (show["watch/providers"] ?? show["watch%2Fproviders"])
    ?.results?.[process.env.NEXT_PUBLIC_TMDB_REGION || "IN"];
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
          : "#f59e0b";

  return (
    <div style={{ marginTop: "calc(-1 * (var(--header-height) + 32px))" }}>
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
        onWatchedSeconds={handleWatchedSeconds}
      />

      {/* Trailer modal */}
      <AnimatePresence>
        {showTrailer && trailer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTrailer(false)}
            role="dialog"
            aria-modal="true"
            aria-label={`${show.name} trailer`}
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
                title={`${show.name} trailer`}
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
              quality={75}
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, var(--bg) 0%, rgba(0, 0, 0, 0.7) 40%, rgba(0, 0, 0, 0.4) 100%)",
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
                    boxShadow: "0 16px 48px rgba(0, 0, 0, 0.6), 0 0 32px rgba(212, 175, 55, 0.2)",
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
              {showImdb?.rating && (
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
              {showImdb?.rottenTomatoes && (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      background: "#fa320a",
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 900,
                      padding: "2px 6px",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    RT
                  </span>
                  <span
                    style={{
                      fontSize: "var(--text-base)",
                      fontWeight: "var(--font-bold)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {showImdb.rottenTomatoes}
                  </span>
                </div>
              )}
              {showImdb?.metacritic && (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      background: "#66cc33",
                      color: "#000",
                      fontSize: 10,
                      fontWeight: 900,
                      padding: "2px 6px",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    MC
                  </span>
                  <span
                    style={{
                      fontSize: "var(--text-base)",
                      fontWeight: "var(--font-bold)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {showImdb.metacritic}
                  </span>
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
                      {formatDate(show.first_air_date)}
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
              <ShareButton title={show.name} href={`/tv/${show.id}`} />
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
                  value={formatDate(show.last_air_date)}
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

            {/* Season + Episode selector (redesigned) */}
            {validSeasons.length > 0 && (
              <div className="tv-season-section">
                <div className="tv-episode-header">
                  <div className="tv-episode-heading">
                    <p className="tv-episode-eyebrow">Episodes</p>
                    <h3 className="tv-episode-title">
                      {validSeasons.find((s) => s.season_number === selSeason)?.name || `Season ${selSeason}`}
                    </h3>
                    <p className="tv-episode-subtitle">
                      {episodes.length > 0 ? `${episodes.length} episodes` : "Browse episodes"}
                    </p>
                  </div>
                </div>

                {/* Season selector */}
                <div className="season-pills-wrap" aria-label="Season selector">
                  <div className="season-mobile-select-wrap">
                    <label className="season-mobile-label" htmlFor="tv-season-select">Season</label>
                    <select
                      id="tv-season-select"
                      className="season-mobile-select"
                      value={selSeason}
                      onChange={(e) => { setSelSeason(Number(e.target.value)); setSelEpisode(1); }}
                    >
                      {validSeasons.map((s) => (
                        <option key={s.id} value={s.season_number}>
                          {s.name || `Season ${s.season_number}`}{s.episode_count ? ` (${s.episode_count} eps)` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="season-pills-scroll">
                    {validSeasons.map((s) => {
                      const active = selSeason === s.season_number;
                      return (
                        <button
                          key={s.id}
                          onClick={() => { setSelSeason(s.season_number); setSelEpisode(1); }}
                          className={`season-pill ${active ? "active" : ""}`}
                          aria-pressed={active}
                        >
                          {s.name || `Season ${s.season_number}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="tv-episodes-wrap">
                  {loadingSeason ? (
                    <div className="episodes-list-loading">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="skeleton" style={{ height: 140, borderRadius: "var(--radius-xl)" }} />
                      ))}
                    </div>
                  ) : episodes.length > 0 ? (() => {
                    const selectedEp = episodes.find((e) => e.episode_number === selEpisode) || episodes[0];
                    const isFutureEp = selectedEp?.air_date ? selectedEp.air_date > TODAY : false;
                    return (
                      <div className="ep-redesign">
                        {/* Featured episode */}
                        <div className="ep-featured">
                          <div className="ep-featured-media">
                            {selectedEp?.still_path ? (
                              <Image src={`${IMG}/w1280${selectedEp.still_path}`} alt={selectedEp?.name || `Episode ${selectedEp?.episode_number}`} fill sizes="(max-width: 900px) 100vw, 60vw" style={{ objectFit: "cover" }} />
                            ) : (
                              <div className="ep-featured-fallback"><Play size={48} color="rgba(255,255,255,0.4)" /></div>
                            )}
                            <div className="ep-featured-gradient" />
                            <div className="ep-featured-badge">E{String(selectedEp?.episode_number || 0).padStart(2, "0")}</div>
                          </div>
                          <div className="ep-featured-info">
                            <p className="ep-featured-kicker">{isFutureEp ? "Upcoming episode" : "Now selected"}</p>
                            <h4 className="ep-featured-title">{selectedEp?.name || `Episode ${selectedEp?.episode_number}`}</h4>
                            <div className="ep-featured-meta">
                              {selectedEp?.air_date && <span>{isFutureEp ? `Airs ${formatAirDateLocal(selectedEp.air_date)}` : formatAirDateLocal(selectedEp.air_date)}</span>}
                              {selectedEp?.runtime ? <span>{selectedEp.runtime >= 60 ? `${Math.floor(selectedEp.runtime/60)}h ${selectedEp.runtime%60}m` : `${selectedEp.runtime}m`}</span> : null}
                              {selectedEp?.vote_average > 0 && <span className="ep-featured-rating">★ {selectedEp.vote_average.toFixed(1)}</span>}
                              {isFutureEp && !selectedEp?.air_date && <span className="ep-featured-upcoming">Release date TBA</span>}
                            </div>
                            <p className="ep-featured-overview">{selectedEp?.overview || "No overview available for this episode yet."}</p>
                            <button
                              className="btn btn-primary ep-featured-play"
                              disabled={isFutureEp}
                              onClick={() => { setSelEpisode(selectedEp.episode_number); setShowPlayer(true); }}
                            >
                              <Play size={18} fill="currentColor" /> {isFutureEp ? "Upcoming" : "Play Episode"}
                            </button>
                          </div>
                        </div>

                        {/* Episode grid */}
                        <div className="ep-grid-wrap">
                          <p className="ep-rail-label">Episodes</p>
                          <div className="ep-grid" role="listbox" aria-label="Episodes">
                            {episodes.map((ep) => {
                              const active = selEpisode === ep.episode_number;
                              const future = ep.air_date ? ep.air_date > TODAY : false;
                              return (
                                <button
                                  key={ep.id}
                                  role="option"
                                  aria-selected={active}
                                  className={`ep-grid-btn ${active ? "active" : ""} ${future ? "future" : ""}`}
                                  onClick={() => setSelEpisode(ep.episode_number)}
                                  title={future ? (ep.air_date ? `Upcoming · Airs ${formatAirDateLocal(ep.air_date)}` : "Upcoming · Release date TBA") : (ep.name || `Episode ${ep.episode_number}`)}
                                >
                                  EP{ep.episode_number}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })() : (
                    <div className="episodes-empty">
                      <Tv size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
                      <p style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-medium)" }}>No episodes available</p>
                    </div>
                  )}
                </div>
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
        .tv-season-section { margin-bottom: 0; max-width: 100%; }
        .tv-episode-header {
          display: flex; justify-content: space-between; align-items: flex-end;
          gap: 16px; margin-bottom: 18px; flex-wrap: wrap;
        }
        .tv-episode-title {
          font-size: clamp(20px, 2.5vw, 28px); font-weight: var(--font-extrabold);
          color: var(--text-primary); margin: 0; letter-spacing: -0.02em;
        }
        .tv-episode-subtitle {
          margin: 6px 0 0; font-size: var(--text-sm); color: var(--text-tertiary);
        }
        .tv-season-jump { display: flex; align-items: center; gap: 10px; }
        .tv-season-jump-label {
          font-size: 11px; font-weight: var(--font-bold); color: var(--text-muted);
          text-transform: uppercase; letter-spacing: 0.08em;
        }
        .tv-season-select {
          appearance: none; background: rgba(255,255,255,0.04); color: var(--text-primary);
          border: 1px solid var(--border); border-radius: var(--radius-lg);
          padding: 10px 36px 10px 14px; font-size: var(--text-sm); font-weight: var(--font-semibold);
          cursor: pointer; min-width: 170px;
          background-image: linear-gradient(45deg, transparent 50%, var(--text-secondary) 50%), linear-gradient(135deg, var(--text-secondary) 50%, transparent 50%);
          background-position: calc(100% - 18px) calc(50% - 2px), calc(100% - 12px) calc(50% - 2px);
          background-size: 6px 6px, 6px 6px; background-repeat: no-repeat;
        }
        .tv-season-select:focus { outline: 2px solid var(--accent-border); outline-offset: 2px; }
        .tv-season-selector {
          display: flex; align-items: center; gap: 10px; margin-bottom: 20px;
          padding: 10px; border-radius: var(--radius-xl);
          background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
          border: 1px solid rgba(255,255,255,0.06);
        }
        .tv-episodes-wrap { min-width: 0; }
        .episodes-list-loading { display: grid; grid-template-columns: 1fr; gap: 12px; }
        .episodes-empty { text-align: center; padding: 48px 20px; color: var(--text-tertiary); }
        /* Redesigned season pills */
        .season-pills-wrap { margin-bottom: 20px; }
        .season-mobile-select-wrap { display: none; }
        .season-mobile-label { font-size: 11px; font-weight: 700; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; display: block; }
        .season-mobile-select {
          width: 100%; appearance: none; padding: 12px 42px 12px 14px;
          border-radius: 12px; border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05); color: var(--text-primary);
          font-size: 14px; font-weight: 600;
          background-image: linear-gradient(45deg, transparent 50%, rgba(255,255,255,0.7) 50%), linear-gradient(135deg, rgba(255,255,255,0.7) 50%, transparent 50%);
          background-position: calc(100% - 18px) calc(50% - 2px), calc(100% - 12px) calc(50% - 2px);
          background-size: 6px 6px, 6px 6px; background-repeat: no-repeat;
        }
        .season-mobile-select:focus { outline: 2px solid rgba(229,9,20,0.45); outline-offset: 2px; }
        .season-pills-scroll { display: flex; gap: 10px; overflow-x: auto; padding: 4px 0 10px; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.28) transparent; -webkit-overflow-scrolling: touch; }
        .season-pills-scroll::-webkit-scrollbar { height: 6px; }
        .season-pills-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.28); border-radius: 3px; }
        .season-pills-scroll::-webkit-scrollbar-track { background: transparent; }
        .season-pill {
          padding: 10px 20px;
          border-radius: 999px;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .season-pill:hover { color: var(--text-primary); background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); }
        .season-pill.active { background: #e50914; border-color: #e50914; color: #fff; }
        /* Redesigned episode layout */
        .ep-redesign { display: flex; flex-direction: column; gap: 28px; }
        .ep-featured { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: 24px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; }
        .ep-featured-media { position: relative; aspect-ratio: 16/9; min-height: 240px; background: var(--bg-tertiary); }
        .ep-featured-media img { object-fit: cover; }
        .ep-featured-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
        .ep-featured-gradient { position: absolute; inset: 0; background: linear-gradient(to top, rgba(10,10,10,0.6) 0%, transparent 40%); pointer-events: none; }
        .ep-featured-badge { position: absolute; top: 12px; left: 12px; padding: 4px 10px; border-radius: 4px; background: rgba(0,0,0,0.7); font-size: 0.75rem; font-weight: 700; color: #fff; letter-spacing: 0.05em; }
        .ep-featured-info { padding: 28px 24px 28px 0; display: flex; flex-direction: column; justify-content: center; }
        .ep-featured-kicker { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #e50914; margin: 0 0 10px; }
        .ep-featured-title { font-size: clamp(1.5rem, 3vw, 2.25rem); font-weight: 700; color: #fff; margin: 0 0 12px; line-height: 1.2; letter-spacing: -0.02em; }
        .ep-featured-meta { display: flex; flex-wrap: wrap; gap: 16px; font-size: 0.875rem; color: var(--text-tertiary); margin-bottom: 16px; }
        .ep-featured-rating { color: var(--gold); font-weight: 600; }
        .ep-featured-upcoming { color: var(--accent); font-weight: 600; }
        .ep-featured-overview { font-size: 0.95rem; line-height: 1.7; color: var(--text-secondary); margin: 0 0 24px; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
        .ep-featured-play { align-self: flex-start; padding: 12px 28px; font-size: 1rem; font-weight: 600; border-radius: 4px; }
        .ep-featured-play:disabled { opacity: 0.5; cursor: not-allowed; }
        .ep-grid-wrap { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; }
        .ep-rail-label { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-tertiary); margin-bottom: 16px; }
        .ep-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(72px, 1fr)); gap: 10px; }
        .ep-grid-btn {
          position: relative;
          padding: 12px 10px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04); color: var(--text-secondary);
          font-size: 0.85rem; font-weight: 700; letter-spacing: 0.02em; cursor: pointer;
          transition: all 0.2s ease; text-align: center;
        }
        .ep-grid-btn:hover:not(:disabled) { color: #fff; background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); transform: translateY(-1px); }
        .ep-grid-btn.active { background: #e50914; border-color: #e50914; color: #fff; box-shadow: 0 8px 24px rgba(229,9,20,0.25); }
        .ep-grid-btn.future { color: rgba(255,255,255,0.72); border-style: dashed; border-color: rgba(255,255,255,0.18); background: rgba(255,255,255,0.02); }
        .ep-grid-btn.future::after {
          content: ""; position: absolute; top: 6px; right: 6px; width: 6px; height: 6px;
          border-radius: 50%; background: var(--gold, #f5c518); box-shadow: 0 0 0 2px rgba(0,0,0,0.15);
        }
        .ep-grid-btn.future:hover:not(:disabled) { color: #fff; border-color: rgba(229,9,20,0.45); background: rgba(229,9,20,0.08); }
        .ep-grid-btn.future.active {
          background: rgba(229,9,20,0.22); border-style: dashed; border-color: rgba(229,9,20,0.75);
          color: #fff; box-shadow: 0 8px 24px rgba(229,9,20,0.18);
        }
        .ep-grid-btn.future.active::after { background: #fff; }
        .ep-grid-btn:disabled { opacity: 0.35; cursor: not-allowed; }
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
          .tv-scores-row { gap: 16px; margin-bottom: 20px; }
          .tv-scores-row .score-ring svg { width: 44px; height: 44px; }
          .tv-actions-row { margin-bottom: 24px; }
          .tv-actions-row .btn { padding: 10px 16px; font-size: var(--text-sm); }
          .tv-meta-grid { grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 24px; }
          .tv-info-card { padding: 10px 12px; }
          .tv-info-card-value { font-size: var(--text-xs) !important; }
          .tv-external-links { margin-bottom: 28px; }
          .tv-external-links a { padding: 8px 12px; font-size: var(--text-sm); }
          .tv-episode-header { margin-bottom: 14px; align-items: stretch; }
          .season-mobile-select-wrap { display: block; margin-bottom: 12px; }
          .season-pills-scroll { display: none; }
          .ep-redesign { gap: 20px; }
          .ep-featured { grid-template-columns: 1fr; border-radius: 14px; }
          .ep-featured-media { min-height: 180px; aspect-ratio: 16/9; }
          .ep-featured-info { padding: 16px; }
          .ep-featured-kicker { margin-bottom: 6px; }
          .ep-featured-title { font-size: 1.35rem; margin-bottom: 8px; }
          .ep-featured-meta { gap: 10px; font-size: 12px; margin-bottom: 10px; }
          .ep-featured-overview { font-size: 13px; line-height: 1.6; -webkit-line-clamp: 3; margin-bottom: 14px; }
          .ep-featured-play { width: 100%; justify-content: center; }
          .ep-rail-label { margin-bottom: 12px; }
          .ep-grid-wrap { padding: 14px; border-radius: 14px; }
          .ep-grid { grid-template-columns: repeat(auto-fill, minmax(64px, 1fr)); gap: 8px; }
          .ep-grid-btn { padding: 10px 8px; font-size: 0.8rem; border-radius: 8px; }
        }
        @media (max-width: 480px) {
          .tv-poster-wrapper { max-width: 140px; }
          .tv-meta-grid { grid-template-columns: 1fr; gap: 8px; }
          .tv-actions-row { gap: 8px; }
          .tv-actions-row .btn { padding: 10px 14px; font-size: var(--text-sm); flex: 1; justify-content: center; }
          .tv-external-links { gap: 8px; margin-bottom: 24px; }
          .tv-external-links a { padding: 8px 10px; font-size: var(--text-sm); flex: 1 1 calc(50% - 8px); justify-content: center; }
          .ep-featured-media { min-height: 160px; }
          .ep-featured-title { font-size: 1.2rem; }
          .ep-featured-overview { -webkit-line-clamp: 2; }
          .ep-grid-wrap { padding: 12px; }
          .ep-grid { grid-template-columns: repeat(auto-fill, minmax(58px, 1fr)); gap: 8px; }
          .ep-grid-btn { padding: 10px 6px; font-size: 0.78rem; }
        }
      `}</style>
    </div>
  );
}

export default function TVShowDetails({ params }) {
  return (
    <Suspense fallback={<SkeletonPage />}>
      <TVShowDetailsContent params={params} />
    </Suspense>
  );
}
