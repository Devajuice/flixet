"use client";
import { useState, useEffect, use, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ArrowLeft,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
} from "lucide-react";
import Link from "next/link";
import WatchlistButton from "@/components/WatchlistButton";
import { useContinueWatching } from "@/context/ContinueWatchingContext";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const OMDB_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
const IMG = "https://image.tmdb.org/t/p";

/* ── Skeleton ────────────────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div role="status" aria-label="Loading TV show details…" aria-busy="true">
      <div
        className="skeleton"
        style={{
          width: "100%",
          height: "70vh",
          minHeight: 400,
          borderRadius: 0,
        }}
        aria-hidden="true"
      />
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 40px" }}>
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
          <div
            className="skeleton"
            style={{ borderRadius: 12, aspectRatio: "2/3" }}
            aria-hidden="true"
          />
          <div style={{ paddingTop: 80 }}>
            <div
              className="skeleton"
              style={{
                height: 52,
                width: "60%",
                marginBottom: 16,
                borderRadius: 8,
              }}
              aria-hidden="true"
            />
            {[100, 80, 65].map((w, i) => (
              <div
                key={i}
                className="skeleton"
                style={{
                  height: 13,
                  width: `${w}%`,
                  marginBottom: 10,
                  borderRadius: 6,
                }}
                aria-hidden="true"
              />
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
              {[80, 70, 75, 65].map((w, i) => (
                <div
                  key={i}
                  className="skeleton"
                  style={{ height: 36, width: w, borderRadius: 8 }}
                  aria-hidden="true"
                />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="skeleton"
                style={{ height: 62, borderRadius: 8, marginTop: 8 }}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Episode card ────────────────────────────────────────────────────────── */
function EpisodeCard({ ep, isActive, onClick, omdb, hasOmdb, index }) {
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

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.3) }}
      whileHover={{ scale: 1.005 }}
      tabIndex={0}
      role="button"
      aria-label={`Episode ${ep.episode_number}: ${ep.name || "Untitled"}${isActive ? " (selected)" : ""}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        display: "flex",
        gap: 14,
        padding: "14px 16px",
        borderRadius: 10,
        cursor: "pointer",
        background: isActive ? "rgba(229,9,20,0.1)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${isActive ? "rgba(229,9,20,0.4)" : "rgba(255,255,255,0.06)"}`,
        transition: "all 0.2s ease",
        alignItems: "flex-start",
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          width: 120,
          height: 68,
          flexShrink: 0,
          borderRadius: 6,
          overflow: "hidden",
          background: "#1a1a1a",
          position: "relative",
        }}
      >
        {ep.still_path ? (
          <img
            src={`${IMG}/w185${ep.still_path}`}
            alt={ep.name || `Episode ${ep.episode_number}`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            loading="lazy"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Play size={20} color="rgba(255,255,255,0.2)" />
          </div>
        )}
        {isActive && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(229,9,20,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#e50914",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Play size={14} fill="white" color="white" />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 8,
            marginBottom: 5,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: isActive ? "#e50914" : "rgba(255,255,255,0.4)",
                marginRight: 8,
              }}
            >
              E{ep.episode_number}
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: isActive ? "#fff" : "rgba(255,255,255,0.85)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {ep.name || "Untitled"}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              flexShrink: 0,
              alignItems: "center",
            }}
          >
            {rt && (
              <span
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.35)",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                {rt}
              </span>
            )}
            {omdb?.rating && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#f5c518",
                  background: "rgba(245,197,24,0.1)",
                  border: "1px solid rgba(245,197,24,0.2)",
                  borderRadius: 4,
                  padding: "2px 6px",
                }}
              >
                ★ {omdb.rating}
              </span>
            )}
          </div>
        </div>
        {ep.overview && (
          <p
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.4)",
              lineHeight: 1.55,
              margin: 0,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {ep.overview}
          </p>
        )}
        {air && (
          <p
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.25)",
              margin: "5px 0 0",
              fontWeight: 500,
            }}
          >
            {air}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ── Cast row ────────────────────────────────────────────────────────────── */
function CastRow({ cast }) {
  const ref = useRef(null);
  const scroll = (dir) =>
    ref.current?.scrollBy({ left: dir * 400, behavior: "smooth" });
  if (!cast.length) return null;
  return (
    <section style={{ marginBottom: 48 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Cast</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {[ChevronLeft, ChevronRight].map((Icon, i) => (
            <button
              key={i}
              onClick={() => scroll(i ? 1 : -1)}
              aria-label={i ? "Scroll right" : "Scroll left"}
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                cursor: "pointer",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
      </div>
      <div ref={ref} className="scroll-row">
        {cast.map((actor) => (
          <div
            key={actor.id}
            style={{ width: 110, flexShrink: 0, textAlign: "center" }}
          >
            <div
              style={{
                width: 110,
                height: 110,
                borderRadius: "50%",
                overflow: "hidden",
                background: "#1a1a1a",
                marginBottom: 8,
                border: "2px solid rgba(255,255,255,0.07)",
              }}
            >
              {actor.profile_path ? (
                <img
                  src={`${IMG}/w185${actor.profile_path}`}
                  alt={actor.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    color: "rgba(255,255,255,0.2)",
                  }}
                >
                  👤
                </div>
              )}
            </div>
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "rgba(255,255,255,0.9)",
                margin: "0 0 3px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {actor.name}
            </p>
            <p
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.4)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                margin: 0,
              }}
            >
              {actor.character}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Main page ───────────────────────────────────────────────────────────── */
export default function TVShowDetails({ params }) {
  const resolvedParams = use(params);
  const showId = resolvedParams?.id;
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [selSeason, setSelSeason] = useState(null);
  const [selEpisode, setSelEpisode] = useState(null);
  const [seasonData, setSeasonData] = useState(null);
  const [loadingSeason, setLoadingSeason] = useState(false);
  const [externalIds, setExternalIds] = useState(null);
  const [showImdb, setShowImdb] = useState(undefined);
  const [omdbCache, setOmdbCache] = useState({});
  const [activeServer, setActiveServer] = useState(0);
  const [showNextBtn, setShowNextBtn] = useState(false);
  const nextTimer = useRef(null);
  const { addToContinueWatching } = useContinueWatching();

  // Fetch show
  useEffect(() => {
    if (!showId) return;
    setLoading(true);
    setError(null);
    setShowImdb(undefined);
    Promise.all([
      fetch(
        `https://api.themoviedb.org/3/tv/${showId}?api_key=${API_KEY}&append_to_response=credits,videos,watch%2Fproviders`,
      ),
      fetch(
        `https://api.themoviedb.org/3/tv/${showId}/external_ids?api_key=${API_KEY}`,
      ),
    ])
      .then((rs) => Promise.all(rs.map((r) => r.json())))
      .then(([showData, extData]) => {
        if (showData.success === false || showData.status_code) {
          throw new Error(
            showData.status_message || "Failed to fetch show data",
          );
        }
        setShow(showData);
        setExternalIds(extData);
        const validSeasons =
          showData.seasons?.filter((s) => s.season_number > 0) || [];
        if (validSeasons.length > 0) {
          setSelSeason(validSeasons[0].season_number);
          setSelEpisode(1);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [showId]);

  // Fetch show IMDb
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

  // Fetch season
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

  // Pre-fetch episode OMDb ratings
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
  }, [seasonData, externalIds]);

  // Continue watching
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

  // Next-episode timer
  useEffect(() => {
    if (nextTimer.current) clearTimeout(nextTimer.current);
    setShowNextBtn(false);
    if (!showPlayer || !seasonData?.episodes) return;
    const ep = seasonData.episodes.find((e) => e.episode_number === selEpisode);
    const mins = ep?.runtime || show?.episode_run_time?.[0] || 40;
    const delay = mins * 60 * 1000 - 90 * 1000;
    if (delay > 0)
      nextTimer.current = setTimeout(() => setShowNextBtn(true), delay);
    return () => {
      if (nextTimer.current) clearTimeout(nextTimer.current);
    };
  }, [showPlayer, selEpisode, selSeason, seasonData]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && showPlayer) setShowPlayer(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showPlayer]);

  useEffect(() => {
    document.body.style.overflow = showPlayer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showPlayer]);

  const handleNextEpisode = () => {
    if (!seasonData?.episodes) return;
    const idx = seasonData.episodes.findIndex(
      (e) => e.episode_number === selEpisode,
    );
    if (idx < seasonData.episodes.length - 1) {
      setSelEpisode(seasonData.episodes[idx + 1].episode_number);
    } else {
      const validSeasons =
        show.seasons?.filter((s) => s.season_number > 0) || [];
      const sIdx = validSeasons.findIndex((s) => s.season_number === selSeason);
      if (sIdx < validSeasons.length - 1) {
        setSelSeason(validSeasons[sIdx + 1].season_number);
        setSelEpisode(1);
      }
    }
    setShowNextBtn(false);
    setShowPlayer(false);
    setTimeout(() => setShowPlayer(true), 300);
  };

  if (loading) return <Skeleton />;
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
        role="alert"
      >
        <p
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#e50914",
            marginBottom: 12,
          }}
        >
          {error ? "Error" : "Not Found"}
        </p>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>
          {error || "This TV show doesn't exist."}
        </p>
        <Link href="/tv">
          <button
            style={{
              padding: "11px 26px",
              background: "#e50914",
              border: "none",
              borderRadius: 8,
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ← Back to TV
          </button>
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
    ?.results?.IN;
  const creators = show.created_by || [];

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

  // VidLink as primary (default), VidPlus and others as fallback
  const servers = [
    {
      label: "Server 1",
      url: `https://vidlink.pro/tv/${showId}/${selSeason}/${selEpisode}?primaryColor=e50914&autoplay=true&nextbutton=true`,
    },
    {
      label: "Server 2",
      url: `https://player.vidplus.to/embed/tv/${showId}/${selSeason}/${selEpisode}`,
    },
    {
      label: "Server 3",
      url: `https://vidsrc.me/embed/tv?tmdb=${showId}&season=${selSeason}&episode=${selEpisode}`,
    },
    {
      label: "Server 4",
      url: `https://vidsrc.net/embed/tv/${showId}/${selSeason}/${selEpisode}`,
    },
    {
      label: "Server 5",
      url: `https://www.2embed.cc/embedtv/${externalIds?.imdb_id || showId}&s=${selSeason}&e=${selEpisode}`,
    },
  ];

  return (
    <>
      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes shimmer {
          0% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.85;
          }
          100% {
            opacity: 0.4;
          }
        }
        .tv-detail-container {
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 20px 80px;
        }
        @media (max-width: 768px) {
          .tv-detail-container {
            padding: 0 16px 80px;
          }
          .tv-detail-grid {
            grid-template-columns: 1fr !important;
          }
          .poster-col-tv {
            display: none !important;
          }
        }
      `}</style>

      {/* ── Fullscreen player ── */}
      <AnimatePresence>
        {showPlayer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Watching ${show.name} S${selSeason}E${selEpisode}`}
            style={{
              position: "fixed",
              inset: 0,
              background: "#000",
              zIndex: 99999,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Top bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 20px",
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, transparent 100%)",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 10,
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  onClick={() => setShowPlayer(false)}
                  aria-label="Back"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    cursor: "pointer",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ArrowLeft size={18} aria-hidden="true" />
                </button>
                <div>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#fff",
                      margin: 0,
                    }}
                  >
                    {show.name}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.5)",
                      margin: 0,
                    }}
                  >
                    Season {selSeason} · Episode {selEpisode}
                  </p>
                </div>
              </div>

              {/* Server tabs */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {servers.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveServer(i)}
                    aria-pressed={activeServer === i}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      background:
                        activeServer === i
                          ? "#e50914"
                          : "rgba(255,255,255,0.1)",
                      border: `1px solid ${activeServer === i ? "#e50914" : "rgba(255,255,255,0.15)"}`,
                      color: "#fff",
                      transition: "all 0.2s",
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowPlayer(false)}
                aria-label="Close"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  cursor: "pointer",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {/* Next episode button */}
            <AnimatePresence>
              {showNextBtn && canGoNext && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onClick={handleNextEpisode}
                  aria-label={
                    hasNext
                      ? `Next Episode S${selSeason}E${episodes[currentEpIdx + 1]?.episode_number}`
                      : "Next Season"
                  }
                  style={{
                    position: "absolute",
                    bottom: 24,
                    right: 24,
                    zIndex: 10,
                    padding: "12px 20px",
                    background: "#e50914",
                    border: "none",
                    borderRadius: 8,
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Play size={16} fill="white" aria-hidden="true" />
                  {hasNext
                    ? `Next: E${episodes[currentEpIdx + 1]?.episode_number}`
                    : "Next Season"}
                </motion.button>
              )}
            </AnimatePresence>

            <iframe
              key={`${activeServer}-${selSeason}-${selEpisode}`}
              src={servers[activeServer].url}
              style={{ width: "100%", height: "100%", border: "none", flex: 1 }}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title={`Watch ${show.name} S${selSeason}E${selEpisode}`}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Backdrop hero ── */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "58vh",
          minHeight: 340,
          overflow: "hidden",
        }}
      >
        {backdrop && (
          <img
            src={backdrop}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, #0a0a0a 0%, transparent 50%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: 0,
            padding: "0 40px",
            width: "55%",
            minWidth: 360,
            maxWidth: 720,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(36px, 5vw, 72px)",
                lineHeight: 1,
                letterSpacing: "0.02em",
                color: "#fff",
                marginBottom: 12,
                textShadow: "0 4px 24px rgba(0,0,0,0.6)",
              }}
            >
              {show.name}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {show.first_air_date && (
                <span
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.65)",
                    fontWeight: 600,
                  }}
                >
                  {new Date(show.first_air_date).getFullYear()}
                </span>
              )}
              <span
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.65)",
                  fontWeight: 600,
                }}
              >
                {validSeasons.length} Season
                {validSeasons.length !== 1 ? "s" : ""}
              </span>
            </div>
          </motion.div>
        </div>

        {/* IMDb badge — pinned far right, vertically aligned with metadata */}
        <div style={{ position: "absolute", bottom: "10%", right: 40 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {showImdb && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(245,197,24,0.12)",
                  border: "1px solid rgba(245,197,24,0.3)",
                  borderRadius: 7,
                  padding: "5px 11px",
                }}
              >
                <span
                  style={{
                    background: "#f5c518",
                    color: "#000",
                    fontSize: 9,
                    fontWeight: 900,
                    padding: "1px 5px",
                    borderRadius: 3,
                    letterSpacing: "0.03em",
                  }}
                >
                  IMDb
                </span>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: "#f5c518",
                    letterSpacing: "0.01em",
                  }}
                >
                  {showImdb.rating}
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Detail content ── */}
      <div className="tv-detail-container">
        <div
          className="tv-detail-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "260px 1fr",
            gap: 44,
            marginTop: 40,
            position: "relative",
            zIndex: 1,
            marginBottom: 48,
          }}
        >
          {/* Poster — sticky so it follows scroll alongside the episode list */}
          <div className="poster-col-tv">
            <div style={{ position: "sticky", top: 90 }}>
              {poster ? (
                <img
                  src={poster}
                  alt={`${show.name} poster`}
                  style={{
                    width: "100%",
                    borderRadius: 12,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
                    display: "block",
                  }}
                  loading="lazy"
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "2/3",
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.2)",
                    fontSize: 48,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
                  }}
                >
                  🎬
                </div>
              )}
            </div>
          </div>

          {/* Info + Episode Selector */}
          <div>
            {/* Genres */}
            {show.genres?.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 20,
                }}
              >
                {show.genres.map((g) => (
                  <span
                    key={g.id}
                    style={{
                      padding: "5px 12px",
                      background: "rgba(229,9,20,0.1)",
                      border: "1px solid rgba(229,9,20,0.3)",
                      borderRadius: 50,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#ff6b73",
                    }}
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* ── Action buttons ── */}
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: 24,
              }}
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowPlayer(true)}
                disabled={!selSeason || !selEpisode}
                aria-label={
                  selSeason && selEpisode
                    ? `Play Season ${selSeason} Episode ${selEpisode}`
                    : "Loading episode"
                }
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  height: 44,
                  padding: "0 24px",
                  background: "#e50914",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.02em",
                  opacity: !selSeason || !selEpisode ? 0.5 : 1,
                  flexShrink: 0,
                }}
              >
                <Play size={16} fill="white" aria-hidden="true" />
                Play S{selSeason}E{selEpisode}
              </motion.button>
              {/* width: fit-content prevents WatchlistButton from stretching full row */}
              <div style={{ width: "fit-content", flexShrink: 0 }}>
                <WatchlistButton
                  item={{
                    id: show.id,
                    type: "tv",
                    name: show.name,
                    title: show.name,
                    poster_path: show.poster_path,
                    vote_average: show.vote_average,
                    first_air_date: show.first_air_date,
                  }}
                  variant="large"
                />
              </div>
            </div>

            {/* Overview */}
            {show.overview && (
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.85,
                  color: "rgba(255,255,255,0.65)",
                  marginBottom: 24,
                  maxWidth: 680,
                }}
              >
                {show.overview}
              </p>
            )}

            {/* Meta */}
            {(creators.length > 0 || show.production_companies?.length > 0) && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: 16,
                  marginBottom: 28,
                }}
              >
                {creators.length > 0 && (
                  <div>
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.3)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 4,
                      }}
                    >
                      Creator
                    </p>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.85)",
                      }}
                    >
                      {creators.map((c) => c.name).join(", ")}
                    </p>
                  </div>
                )}
                {show.production_companies?.length > 0 && (
                  <div>
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.3)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 4,
                      }}
                    >
                      Network
                    </p>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.85)",
                      }}
                    >
                      {show.networks
                        ?.slice(0, 2)
                        .map((n) => n.name)
                        .join(", ") ||
                        show.production_companies
                          .slice(0, 2)
                          .map((c) => c.name)
                          .join(", ")}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── Season + Episode selector ── */}
            {validSeasons.length > 0 && (
              <div style={{ marginBottom: 0 }}>
                {/* Season tabs */}
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    marginBottom: 20,
                  }}
                >
                  {validSeasons.map((s) => (
                    <motion.button
                      key={s.id}
                      onClick={() => {
                        setSelSeason(s.season_number);
                        setSelEpisode(1);
                      }}
                      whileTap={{ scale: 0.96 }}
                      aria-pressed={selSeason === s.season_number}
                      style={{
                        padding: "8px 18px",
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                        background:
                          selSeason === s.season_number
                            ? "#e50914"
                            : "rgba(255,255,255,0.06)",
                        border: `1px solid ${selSeason === s.season_number ? "#e50914" : "rgba(255,255,255,0.1)"}`,
                        color: "#fff",
                        transition: "all 0.2s",
                      }}
                    >
                      S{s.season_number}
                    </motion.button>
                  ))}
                </div>

                {/* Episodes */}
                {loadingSeason ? (
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="skeleton"
                        style={{ height: 96, borderRadius: 10 }}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      maxHeight: 520,
                      overflowY: "auto",
                      scrollbarWidth: "thin",
                      scrollbarColor: "rgba(229,9,20,0.4) transparent",
                    }}
                    role="list"
                    aria-label="Episode list"
                  >
                    {episodes.map((ep, idx) => (
                      <EpisodeCard
                        key={ep.id}
                        ep={ep}
                        isActive={selEpisode === ep.episode_number}
                        onClick={() => setSelEpisode(ep.episode_number)}
                        omdb={omdbCache[`S${selSeason}E${ep.episode_number}`]}
                        hasOmdb={!!OMDB_KEY && !!externalIds?.imdb_id}
                        index={idx}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Where to watch */}
            {watchProviders?.flatrate?.length > 0 && (
              <div style={{ marginTop: 32 }}>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: 10,
                  }}
                >
                  Available On
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {watchProviders.flatrate.map((p) => (
                    <img
                      key={p.provider_id}
                      src={`https://image.tmdb.org/t/p/original${p.logo_path}`}
                      alt={p.provider_name}
                      title={p.provider_name}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        objectFit: "cover",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                      }}
                    />
                  ))}
                </div>
                <p
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.2)",
                    marginTop: 8,
                  }}
                >
                  Data via JustWatch / TMDB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Cast */}
        <CastRow cast={cast} />
      </div>
    </>
  );
}
