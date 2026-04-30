"use client";
import { useState, useEffect, use, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Play,
  Star,
  ExternalLink,
  Film,
  Globe,
  Heart,
  ChevronRight,
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

function InfoCard({ icon, label, value }) {
  return (
    <div
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
      <div style={{ color: "var(--accent)" }}>{icon}</div>
      <div>
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
          style={{
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-semibold)",
            color: "var(--text-secondary)",
            margin: 0,
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

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

export default function MovieDetails({ params }) {
  const resolvedParams = use(params);
  const movieId = resolvedParams?.id;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [imdbRating, setImdbRating] = useState(undefined);
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
        if (movieData.success === false || movieData.status_code)
          throw new Error(
            movieData.status_message || "Failed to fetch movie data",
          );
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

  if (loading)
    return (
      <SkeletonEl width="100%" height="70vh" minHeight={400} borderRadius={0} />
    );
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
      >
        <p
          style={{
            fontSize: "var(--text-2xl)",
            fontWeight: "var(--font-bold)",
            color: "var(--accent)",
            marginBottom: 12,
          }}
        >
          {error ? "Error Loading Movie" : "Movie Not Found"}
        </p>
        <p style={{ color: "var(--text-tertiary)", marginBottom: 24 }}>
          {error || "The movie you're looking for doesn't exist."}
        </p>
        <Link href="/movies">
          <button className="btn btn-primary">Back to Movies</button>
        </Link>
      </div>
    );

  const backdrop = movie.backdrop_path
    ? `${IMG}/original${movie.backdrop_path}`
    : null;
  const poster = movie.poster_path ? `${IMG}/w500${movie.poster_path}` : null;
  const cast = movie.credits?.cast?.slice(0, 16) || [];
  const recs =
    movie.recommendations?.results?.filter((m) => m.poster_path).slice(0, 16) ||
    [];
  const directors =
    movie.credits?.crew?.filter((p) => p.job === "Director") || [];
  const writers =
    movie.credits?.crew?.filter((p) => p.job === "Screenplay")?.slice(0, 2) ||
    [];
  const watchProviders = (
    movie["watch/providers"] ?? movie["watch%2Fproviders"]
  )?.results?.IN;
  const trailer =
    movie.videos?.results?.find(
      (v) => v.type === "Trailer" && v.site === "YouTube",
    ) || movie.videos?.results?.find((v) => v.site === "YouTube");
  const tagline = movie.tagline;

  const formatRuntime = (m) => {
    if (!m) return "N/A";
    const h = Math.floor(m / 60);
    const min = m % 60;
    return h > 0 ? `${h}h ${min}m` : `${min}m`;
  };

  return (
    <>
      <VideoPlayer
        isOpen={showPlayer}
        onClose={() => setShowPlayer(false)}
        type="movie"
        id={movieId}
        title={movie.title}
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
        <div className="movie-detail-grid">
          {/* Poster */}
          <div style={{ position: "relative" }}>
            <div
              className="movie-poster-wrapper"
              style={{ position: "relative", aspectRatio: "2/3" }}
            >
              <Image
                src={poster}
                alt={`${movie.title} poster`}
                fill
                sizes="(max-width: 768px) 260px, 500px"
                style={{
                  borderRadius: "var(--radius-xl)",
                  boxShadow: "var(--shadow-xl)",
                  display: "block",
                }}
              />
            </div>
          </div>

          {/* Info */}
          <div>
            {/* Title */}
            {movie.genres?.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 12,
                }}
              >
                {movie.genres.map((g) => (
                  <span key={g.id} className="genre-pill">
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <h1
              style={{
                fontSize: "clamp(28px, 4vw, 48px)",
                lineHeight: 1.1,
                fontWeight: "var(--font-extrabold)",
                letterSpacing: "-0.025em",
                color: "var(--text-primary)",
                marginBottom: 12,
              }}
            >
              {movie.title}
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
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                flexWrap: "wrap",
                marginBottom: 28,
              }}
            >
              <ScoreRing score={movie.vote_average || 0} />
              {imdbRating && (
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
                    {imdbRating.rating}
                  </span>
                  {imdbRating.votes && (
                    <span
                      style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--text-tertiary)",
                      }}
                    >
                      ({imdbRating.votes})
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
                {movie.release_date && (
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
                      {new Date(movie.release_date).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" },
                      )}
                    </span>
                  </div>
                )}
                {movie.runtime && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: "var(--text-secondary)",
                    }}
                  >
                    <Clock size={14} />
                    <span style={{ fontSize: "var(--text-sm)" }}>
                      {formatRuntime(movie.runtime)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div
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
                className="btn btn-primary"
                style={{
                  padding: "clamp(10px, 2vw, 14px) clamp(20px, 4vw, 32px)",
                  fontSize: "clamp(var(--text-sm), 2.5vw, var(--text-base))",
                  fontWeight: "var(--font-bold)",
                }}
              >
                <Play size={18} fill="currentColor" /> Watch Now
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
                  id: movie.id,
                  type: "movie",
                  title: movie.title,
                  poster_path: movie.poster_path,
                  vote_average: movie.vote_average,
                  release_date: movie.release_date,
                }}
                variant="large"
              />
            </div>

            {/* Overview */}
            {movie.overview && (
              <p
                style={{
                  fontSize: "clamp(var(--text-sm), 2.5vw, var(--text-base))",
                  lineHeight: 1.85,
                  color: "var(--text-secondary)",
                  marginBottom: 32,
                  maxWidth: 720,
                }}
              >
                {movie.overview}
              </p>
            )}

            {/* Metadata cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 12,
                marginBottom: 32,
              }}
            >
              {directors.length > 0 && (
                <InfoCard
                  icon={<Film size={18} />}
                  label="Director"
                  value={directors.map((d) => d.name).join(", ")}
                />
              )}
              {writers.length > 0 && (
                <InfoCard
                  icon={<Globe size={18} />}
                  label="Writer"
                  value={writers.map((w) => w.name).join(", ")}
                />
              )}
              {movie.original_language && (
                <InfoCard
                  icon={<Globe size={18} />}
                  label="Language"
                  value={
                    new Intl.DisplayNames(["en"], { type: "language" }).of(
                      movie.original_language,
                    ) || movie.original_language
                  }
                />
              )}
              {movie.budget > 0 && (
                <InfoCard
                  icon={<Heart size={18} />}
                  label="Budget"
                  value={`$${(movie.budget / 1000000).toFixed(1)}M`}
                />
              )}
              {movie.revenue > 0 && (
                <InfoCard
                  icon={<Star size={18} />}
                  label="Revenue"
                  value={`$${(movie.revenue / 1000000).toFixed(1)}M`}
                />
              )}
              {movie.production_companies?.length > 0 && (
                <InfoCard
                  icon={<Film size={18} />}
                  label="Studio"
                  value={movie.production_companies
                    .slice(0, 2)
                    .map((c) => c.name)
                    .join(", ")}
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
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {movie.imdb_id && (
                <a
                  href={`https://www.imdb.com/title/${movie.imdb_id}/`}
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
              {movie.homepage && (
                <a
                  href={movie.homepage}
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
        {recs.length > 0 && (
          <ScrollRow
            title="More Like This"
            style={{ marginTop: 40, marginBottom: 60 }}
          >
            {recs.map((m) => (
              <MediaCard key={m.id} item={m} type="movie" />
            ))}
          </ScrollRow>
        )}

        {cast.length === 0 && recs.length === 0 && (
          <div style={{ height: 60 }} />
        )}
      </div>

      <style jsx global>{`
        .movie-detail-grid {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 44px;
          margin-top: -120px;
          position: relative;
          z-index: 2;
          margin-bottom: 56px;
        }
        .movie-poster-wrapper {
          position: sticky;
          top: 90px;
        }
        @media (max-width: 768px) {
          .movie-detail-grid {
            grid-template-columns: 1fr;
            gap: 24px;
            margin-top: -80px;
            margin-bottom: 32px;
          }
          .movie-poster-wrapper {
            position: relative;
            top: 0;
            max-width: 200px;
            margin: 0 auto;
          }
        }
        @media (max-width: 480px) {
          .movie-poster-wrapper {
            max-width: 160px;
          }
        }
      `}</style>
    </>
  );
}
