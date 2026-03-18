"use client";
import { useState, useEffect, use, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Play,
  X,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
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
    <div role="status" aria-label="Loading movie details…" aria-busy="true">
      {/* Backdrop */}
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
            <div
              className="skeleton"
              style={{
                height: 14,
                width: "40%",
                marginBottom: 28,
                borderRadius: 6,
              }}
              aria-hidden="true"
            />
            {[100, 85, 70].map((w, i) => (
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
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Cast scroll row ─────────────────────────────────────────────────────── */
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
        <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em" }}>
          Top Cast
        </h2>
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

/* ── Recommendations row ─────────────────────────────────────────────────── */
function RecsRow({ recs }) {
  const ref = useRef(null);
  const scroll = (dir) =>
    ref.current?.scrollBy({ left: dir * 600, behavior: "smooth" });
  if (!recs.length) return null;
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
        <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em" }}>
          More Like This
        </h2>
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
        {recs.map((m) => (
          <Link key={m.id} href={`/movie/${m.id}`}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                width: 150,
                flexShrink: 0,
                borderRadius: 8,
                overflow: "hidden",
                background: "#1a1a1a",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <div style={{ aspectRatio: "2/3" }}>
                {m.poster_path ? (
                  <img
                    src={`${IMG}/w185${m.poster_path}`}
                    alt={m.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
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
                      padding: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.3)",
                        textAlign: "center",
                      }}
                    >
                      {m.title}
                    </span>
                  </div>
                )}
              </div>
              <div style={{ padding: "8px 8px 10px" }}>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#fff",
                    margin: "0 0 2px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {m.title}
                </p>
                {m.vote_average > 0 && (
                  <p style={{ fontSize: 10, color: "#f5c518", margin: 0 }}>
                    ★ {m.vote_average.toFixed(1)}
                  </p>
                )}
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ── Main page ───────────────────────────────────────────────────────────── */
export default function MovieDetails({ params }) {
  const resolvedParams = use(params);
  const movieId = resolvedParams?.id;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [imdbRating, setImdbRating] = useState(undefined);
  const [activeServer, setActiveServer] = useState(0);
  const { addToContinueWatching } = useContinueWatching();
  const hasAdded = useRef(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setImdbRating(undefined);
    Promise.all([
      fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos,recommendations,watch%2Fproviders`,
      ),
      fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/external_ids?api_key=${API_KEY}`,
      ),
    ])
      .then((rs) => Promise.all(rs.map((r) => r.json())))
      .then(([movieData, extData]) => {
        if (movieData.success === false || movieData.status_code) {
          throw new Error(
            movieData.status_message || "Failed to fetch movie data",
          );
        }
        setMovie(movieData);
        if (OMDB_KEY && extData?.imdb_id) {
          fetch(
            `https://www.omdbapi.com/?i=${extData.imdb_id}&apikey=${OMDB_KEY}`,
          )
            .then((r) => r.json())
            .then((d) =>
              setImdbRating(
                d.imdbRating && d.imdbRating !== "N/A"
                  ? { rating: d.imdbRating, votes: d.imdbVotes }
                  : null,
              ),
            )
            .catch(() => setImdbRating(null));
        } else setImdbRating(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [movieId]);

  useEffect(() => {
    if (showPlayer && movie && !hasAdded.current) {
      addToContinueWatching({
        id: movie.id,
        type: "movie",
        title: movie.title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        runtime: movie.runtime || 120,
        progress: 15,
      });
      hasAdded.current = true;
    }
    if (!showPlayer) hasAdded.current = false;
  }, [showPlayer, movie, addToContinueWatching]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && showPlayer) setShowPlayer(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showPlayer]);

  // Lock body scroll when player open
  useEffect(() => {
    document.body.style.overflow = showPlayer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showPlayer]);

  if (loading) return <Skeleton />;
  if (error || !movie)
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
          {error ? "Error Loading Movie" : "Movie Not Found"}
        </p>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>
          {error || "The movie you're looking for doesn't exist."}
        </p>
        <Link href="/movies">
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
            ← Back to Movies
          </button>
        </Link>
      </div>
    );

  const backdrop = movie.backdrop_path
    ? `${IMG}/w1280${movie.backdrop_path}`
    : null;
  const poster = movie.poster_path ? `${IMG}/w500${movie.poster_path}` : null;
  const cast = movie.credits?.cast?.slice(0, 16) || [];
  const recs =
    movie.recommendations?.results?.filter((m) => m.poster_path).slice(0, 16) ||
    [];
  const directors =
    movie.credits?.crew?.filter((p) => p.job === "Director") || [];
  const watchProviders = (
    movie["watch/providers"] ?? movie["watch%2Fproviders"]
  )?.results?.IN;

  const formatRuntime = (m) => {
    if (!m) return "N/A";
    const h = Math.floor(m / 60);
    const min = m % 60;
    return h > 0 ? `${h}h ${min}m` : `${min}m`;
  };

  // VidLink as primary (default), VidPlus and others as fallback
  const servers = [
    {
      label: "Server 1",
      url: `https://vidlink.pro/movie/${movieId}?primaryColor=e50914&autoplay=true`,
    },
    {
      label: "Server 2",
      url: `https://player.vidplus.to/embed/Movie/${movieId}`,
    },
    { label: "Server 3", url: `https://vidsrc.me/embed/movie?tmdb=${movieId}` },
    { label: "Server 4", url: `https://vidsrc.net/embed/movie/${movieId}` },
    { label: "Server 5", url: `https://www.2embed.cc/embed/${movieId}` },
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
        .detail-container {
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 20px 80px;
        }
        @media (max-width: 768px) {
          .detail-container {
            padding: 0 16px 80px;
          }
          .detail-grid {
            grid-template-columns: 1fr !important;
          }
          .poster-col {
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
            aria-label={`Watching ${movie.title}`}
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
                  "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 100%)",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                  onClick={() => setShowPlayer(false)}
                  aria-label="Close player"
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
                <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
                  {movie.title}
                </span>
              </div>

              {/* Server tabs */}
              <div style={{ display: "flex", gap: 6 }}>
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
                aria-label="Close player"
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

            {/* Iframe — true fullscreen */}
            <iframe
              key={activeServer}
              src={servers[activeServer].url}
              style={{ width: "100%", height: "100%", border: "none", flex: 1 }}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title={`Watch ${movie.title}`}
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
              "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, #0a0a0a 0%, transparent 50%)",
          }}
        />

        {/* Hero content over backdrop — title + metadata only, no buttons */}
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
              {movie.title}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {movie.release_date && (
                <span
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.65)",
                    fontWeight: 600,
                  }}
                >
                  {new Date(movie.release_date).getFullYear()}
                </span>
              )}
              {movie.runtime && (
                <span
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.65)",
                    fontWeight: 600,
                  }}
                >
                  {formatRuntime(movie.runtime)}
                </span>
              )}
            </div>
          </motion.div>
        </div>

        {/* IMDb badge — pinned far right, vertically centred with the metadata */}
        <div style={{ position: "absolute", bottom: "10%", right: 40 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {imdbRating && (
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
                  {imdbRating.rating}
                </span>
              </div>
            )}
            {imdbRating === undefined && OMDB_KEY && (
              <div
                style={{
                  width: 72,
                  height: 28,
                  borderRadius: 7,
                  animation: "shimmer 1.5s ease-in-out infinite",
                  background: "rgba(255,255,255,0.06)",
                }}
              />
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Detail content ── */}
      <div className="detail-container">
        <div
          className="detail-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "260px 1fr",
            gap: 44,
            marginTop: 32,
            position: "relative",
            zIndex: 1,
            marginBottom: 48,
          }}
        >
          {/* Poster — sticky, aligned flush with info content */}
          <div className="poster-col">
            <div style={{ position: "sticky", top: 90 }}>
              <img
                src={poster}
                alt={`${movie.title} poster`}
                style={{
                  width: "100%",
                  borderRadius: 12,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
                  display: "block",
                }}
                loading="lazy"
              />
            </div>
          </div>

          {/* Info */}
          <div>
            {movie.genres?.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 20,
                }}
              >
                {movie.genres.map((g) => (
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
                aria-label={`Play ${movie.title}`}
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
                  flexShrink: 0,
                }}
              >
                <Play size={16} fill="white" aria-hidden="true" /> Play Movie
              </motion.button>
              {/* width: fit-content prevents WatchlistButton from stretching full row */}
              <div style={{ width: "fit-content", flexShrink: 0 }}>
                <WatchlistButton
                  item={{
                    id: movie.id,
                    type: "movie",
                    title: movie.title,
                    name: movie.title,
                    poster_path: movie.poster_path,
                    vote_average: movie.vote_average,
                    release_date: movie.release_date,
                  }}
                  variant="large"
                />
              </div>
            </div>

            {movie.overview && (
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.85,
                  color: "rgba(255,255,255,0.65)",
                  marginBottom: 28,
                  maxWidth: 700,
                }}
              >
                {movie.overview}
              </p>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 16,
                marginBottom: 28,
              }}
            >
              {directors.length > 0 && (
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
                    Director
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    {directors.map((d) => d.name).join(", ")}
                  </p>
                </div>
              )}
              {movie.production_companies?.length > 0 && (
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
                    Studio
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    {movie.production_companies
                      .slice(0, 2)
                      .map((c) => c.name)
                      .join(", ")}
                  </p>
                </div>
              )}
            </div>

            {/* Where to watch */}
            {watchProviders?.flatrate?.length > 0 && (
              <div>
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

        {/* Recommendations */}
        <RecsRow recs={recs} />
      </div>
    </>
  );
}
