"use client";
import { useState, useEffect, use, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Play,
  Lightbulb,
  Check,
  X,
} from "lucide-react";
import Link from "next/link";
import WatchlistButton from "@/components/WatchlistButton";
import { useContinueWatching } from "@/context/ContinueWatchingContext";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const OMDB_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

export default function MovieDetails({ params }) {
  const unwrappedParams = use(params);
  const movieId = unwrappedParams.id;

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  // undefined = loading, null = unavailable, { rating, votes } = loaded
  const [imdbRating, setImdbRating] = useState(undefined);

  const { addToContinueWatching } = useContinueWatching();
  const hasAddedToWatching = useRef(false);
  const [movieServer, setMovieServer] = useState("vidlink");

  useEffect(() => {
    fetchMovieDetails();
  }, [movieId]);

  const fetchMovieDetails = async () => {
    setLoading(true);
    setError(null);
    setImdbRating(undefined);
    try {
      const [movieRes, externalRes] = await Promise.all([
        fetch(
          // Added 'watch/providers' to append_to_response
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos,recommendations,watch/providers`,
        ),
        fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/external_ids?api_key=${API_KEY}`,
        ),
      ]);
      if (!movieRes.ok) throw new Error("Failed to fetch movie details");
      const movieData = await movieRes.json();
      const externalData = await externalRes.json();
      setMovie(movieData);

      // Fetch IMDb rating from OMDb using the IMDb ID
      if (OMDB_KEY && externalData?.imdb_id) {
        fetch(
          `https://www.omdbapi.com/?i=${externalData.imdb_id}&apikey=${OMDB_KEY}`,
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
      } else {
        setImdbRating(null);
      }
    } catch (err) {
      console.error("Error fetching movie details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showPlayer && movie && !hasAddedToWatching.current) {
      addToContinueWatching({
        id: movie.id,
        type: "movie",
        title: movie.title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        runtime: movie.runtime || 120,
        progress: 15,
      });
      hasAddedToWatching.current = true;
    }
    if (!showPlayer) hasAddedToWatching.current = false;
  }, [showPlayer, movie, addToContinueWatching]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showPlayer) setShowPlayer(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [showPlayer]);

  if (loading) {
    return (
      <>
        <style jsx global>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
        <div style={styles.loading}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Loading movie details...</p>
        </div>
      </>
    );
  }

  if (error || !movie) {
    return (
      <div style={styles.error}>
        <h2 style={styles.errorTitle}>
          {error ? "Error Loading Movie" : "Movie Not Found"}
        </h2>
        <p style={styles.errorText}>
          {error || "The movie you are looking for does not exist."}
        </p>
        <Link href="/movies">
          <button style={styles.backButton}>
            <ArrowLeft size={20} />
            Back to Movies
          </button>
        </Link>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder.png";

  const trailer = movie.videos?.results?.find(
    (video) => video.type === "Trailer" && video.site === "YouTube",
  );
  const cast = movie.credits?.cast?.slice(0, 12) || [];
  const directors =
    movie.credits?.crew?.filter((p) => p.job === "Director") || [];
  const writers =
    movie.credits?.crew
      ?.filter((p) => p.job === "Writer" || p.job === "Screenplay")
      .slice(0, 3) || [];

  // Get Watch Providers for a specific region (e.g., US)
  const watchProviders = movie["watch/providers"]?.results?.IN;

  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const servers = [
    {
      id: "vidlink",
      label: "Server 1",
      color: "#ffc13c",
      url: `https://vidlink.pro/movie/${movieId}?primaryColor=ffc13c&autoplay=true`,
    },
    {
      id: "2embed",
      label: "Server 2",
      color: "#60a5fa",
      url: `https://www.2embed.cc/embed/${movieId}`,
    },
    {
      id: "vidsrcme",
      label: "Server 3",
      color: "#a78bfa",
      url: `https://vidsrc.me/embed/movie?tmdb=${movieId}`,
    },
    {
      id: "vidsrcnet",
      label: "Server 4",
      color: "#f472b6",
      url: `https://vidsrc.net/embed/movie/${movieId}`,
    },
    {
      id: "vidplus",
      label: "Server 6",
      color: "#4ade80",
      url: `https://vidplus.site/embed/tv/${showId}/${selectedSeason}/${selectedEpisode}`,
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
            opacity: 0.8;
          }
          100% {
            opacity: 0.4;
          }
        }

        * {
          font-family: "DM Sans", sans-serif;
        }

        .page-container {
          padding: 20px;
          padding-bottom: 100px;
          max-width: 1600px;
          margin: 0 auto;
        }
        .content-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 44px;
          margin-top: 28px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.4);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.02em;
          margin-bottom: 20px;
          transition: color 0.2s;
        }
        .back-link:hover {
          color: #ffc13c;
        }

        .backdrop {
          position: relative;
          width: 100%;
          height: 420px;
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 0;
        }
        .backdrop img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .backdrop::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 30%, #0d0d0f 100%);
        }

        .poster-section {
          position: sticky;
          top: 80px;
          height: fit-content;
        }
        .poster-img {
          width: 100%;
          border-radius: 12px;
          box-shadow:
            0 12px 40px rgba(0, 0, 0, 0.65),
            0 0 0 1px rgba(255, 255, 255, 0.05);
          margin-bottom: 18px;
          display: block;
        }

        .tip-box {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-left: 3px solid #ffc13c;
          border-radius: 10px;
          padding: 14px;
          margin-top: 14px;
        }
        .tip-header {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 9px;
        }
        .tip-title {
          font-size: 12px;
          font-weight: 700;
          color: #ffc13c;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }
        .tip-desc {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.38);
          margin-bottom: 9px;
          line-height: 1.5;
        }
        .tip-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .tip-item {
          display: flex;
          align-items: flex-start;
          gap: 7px;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.4;
        }

        .details {
          padding-bottom: 40px;
        }

        .movie-title {
          font-size: 44px;
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.03em;
          color: rgba(255, 255, 255, 0.96);
          margin: 0 0 8px;
        }
        .movie-title span {
          color: #ffc13c;
        }
        .tagline {
          font-size: 16px;
          font-style: italic;
          color: rgba(255, 255, 255, 0.35);
          margin: 0 0 24px;
          letter-spacing: 0.01em;
        }

        .metadata {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
          margin-bottom: 20px;
          align-items: center;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.55);
          letter-spacing: 0.01em;
        }

        .imdb-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(245, 197, 24, 0.08);
          border: 1px solid rgba(245, 197, 24, 0.22);
          border-radius: 8px;
          padding: 5px 10px;
        }
        .imdb-logo {
          background: #f5c518;
          color: #000;
          font-size: 10px;
          font-weight: 900;
          padding: 1px 5px;
          border-radius: 3px;
          letter-spacing: 0.03em;
          line-height: 1.4;
        }
        .imdb-score {
          font-size: 15px;
          font-weight: 800;
          color: #f5c518;
          letter-spacing: 0.01em;
        }
        .imdb-votes {
          font-size: 11px;
          color: rgba(245, 197, 24, 0.45);
          font-weight: 500;
        }
        .imdb-shimmer {
          width: 110px;
          height: 32px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 8px;
          animation: shimmer 1.5s ease-in-out infinite;
        }

        .genres {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 36px;
        }
        .genre-pill {
          padding: 6px 16px;
          background: rgba(255, 193, 60, 0.08);
          border: 1px solid rgba(255, 193, 60, 0.22);
          border-radius: 50px;
          font-size: 12px;
          font-weight: 600;
          color: #ffc13c;
          letter-spacing: 0.03em;
        }

        .section {
          margin-bottom: 36px;
        }
        .section-title {
          font-size: 15px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.88);
          margin: 0 0 14px;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .section-title::after {
          content: "";
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.06);
        }
        .overview-text {
          font-size: 15px;
          line-height: 1.85;
          color: rgba(255, 255, 255, 0.55);
        }
        .creator-text {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.55);
          font-weight: 500;
        }

        .provider-logo {
          width: 42px;
          height: 42px;
          border-radius: 8px;
          object-fit: cover;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          transition: transform 0.2s;
        }
        .provider-logo:hover {
          transform: scale(1.1);
        }

        @media (max-width: 968px) {
          .content-grid {
            grid-template-columns: 230px 1fr;
            gap: 28px;
          }
          .movie-title {
            font-size: 34px;
          }
        }
        @media (max-width: 768px) {
          .backdrop {
            display: none;
          }
          .content-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .poster-section {
            position: static;
            display: grid;
            grid-template-columns: 130px 1fr;
            gap: 16px;
            align-items: start;
          }
          .poster-img {
            margin-bottom: 0;
          }
          .movie-title {
            font-size: 26px;
          }
        }
        @media (max-width: 480px) {
          .poster-section {
            grid-template-columns: 1fr;
          }
          .movie-title {
            font-size: 24px;
          }
        }
      `}</style>

      <motion.div
        className="page-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45 }}
      >
        <Link href="/movies" className="back-link">
          <ArrowLeft size={16} />
          Back to Movies
        </Link>

        {/* Player modal */}
        <AnimatePresence>
          {showPlayer && (
            <motion.div
              onClick={() => setShowPlayer(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.96)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10000,
                padding: "20px",
              }}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.92 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.92 }}
                transition={{ duration: 0.25 }}
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "1400px",
                  aspectRatio: "16/9",
                  background: "#000",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow:
                    "0 24px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06)",
                }}
              >
                <button
                  onClick={() => setShowPlayer(false)}
                  aria-label="Close player"
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    background: "rgba(0,0,0,0.75)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "white",
                    zIndex: 10,
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <X size={20} />
                </button>

                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    right: 64,
                    display: "flex",
                    gap: 7,
                    zIndex: 10,
                    flexWrap: "wrap",
                  }}
                >
                  {servers.map((server) => (
                    <button
                      key={server.id}
                      onClick={() => setMovieServer(server.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 12px",
                        border: `1px solid ${movieServer === server.id ? server.color : "rgba(255,255,255,0.1)"}`,
                        borderRadius: 6,
                        cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: "0.02em",
                        background:
                          movieServer === server.id
                            ? `${server.color}1a`
                            : "rgba(0,0,0,0.5)",
                        color:
                          movieServer === server.id
                            ? server.color
                            : "rgba(255,255,255,0.5)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: server.color,
                          flexShrink: 0,
                        }}
                      />
                      {server.label}
                      {server.id === "vidlink" && (
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            background: "#ffc13c",
                            color: "#0d0d0f",
                            borderRadius: 4,
                            padding: "2px 5px",
                            letterSpacing: "0.02em",
                          }}
                        >
                          Default
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <iframe
                  key={movieServer}
                  src={servers.find((s) => s.id === movieServer)?.url}
                  style={{ width: "100%", height: "100%", border: "none" }}
                  frameBorder="0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  title={`Watch ${movie.title}`}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {backdropUrl && (
          <div className="backdrop">
            <img src={backdropUrl} alt={`${movie.title} backdrop`} />
          </div>
        )}

        <div className="content-grid">
          {/* Poster sidebar */}
          <div className="poster-section">
            <img
              src={posterUrl}
              alt={`${movie.title} poster`}
              className="poster-img"
              loading="lazy"
            />

            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <motion.button
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "#ffc13c",
                  color: "#0d0d0f",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "9px",
                  letterSpacing: "0.02em",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                whileHover={{ scale: 1.03, opacity: 0.92 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowPlayer(true)}
              >
                <Play size={18} fill="#0d0d0f" color="#0d0d0f" />
                Watch Now
              </motion.button>

              {trailer && (
                <motion.a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: "100%",
                    padding: "13px",
                    background: "transparent",
                    color: "rgba(255,255,255,0.75)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    textDecoration: "none",
                    letterSpacing: "0.02em",
                    fontFamily: "'DM Sans', sans-serif",
                    boxSizing: "border-box",
                  }}
                  whileHover={{
                    scale: 1.03,
                    borderColor: "rgba(255,193,60,0.5)",
                    color: "#ffc13c",
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Play size={16} />
                  Watch Trailer
                </motion.a>
              )}

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

              <div className="tip-box">
                <div className="tip-header">
                  <Lightbulb size={14} color="#ffc13c" />
                  <span className="tip-title">Viewing Tips</span>
                </div>
                <p className="tip-desc">Free streaming may show ads:</p>
                <div className="tip-list">
                  {[
                    "Use ad-blocker (uBlock Origin)",
                    "Try different servers if needed",
                    "Close pop-ups immediately",
                    "Never enter personal info",
                  ].map((tip) => (
                    <div className="tip-item" key={tip}>
                      <Check
                        size={12}
                        style={{
                          color: "#4ade80",
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="details">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="movie-title">
                {movie.title.split(" ").slice(0, -1).join(" ")}{" "}
                <span>{movie.title.split(" ").slice(-1)}</span>
              </h1>
              {movie.tagline && <p className="tagline">"{movie.tagline}"</p>}

              <div className="metadata">
                {imdbRating === undefined && OMDB_KEY ? (
                  <div className="imdb-shimmer" />
                ) : imdbRating ? (
                  <div className="imdb-badge">
                    <span className="imdb-logo">IMDb</span>
                    <span className="imdb-score">{imdbRating.rating}</span>
                    <span className="imdb-votes">
                      / 10 ·{" "}
                      {Number(
                        imdbRating.votes?.replace(/,/g, ""),
                      ).toLocaleString()}{" "}
                      votes
                    </span>
                  </div>
                ) : null}

                <div className="meta-item">
                  <Calendar size={15} />
                  <span>
                    {new Date(movie.release_date).getFullYear() || "N/A"}
                  </span>
                </div>
                {movie.runtime && (
                  <div className="meta-item">
                    <Clock size={15} />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                )}
              </div>

              {movie.genres?.length > 0 && (
                <div className="genres">
                  {movie.genres.map((genre) => (
                    <span key={genre.id} className="genre-pill">
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            <div className="section">
              <h2 className="section-title">Overview</h2>
              <p className="overview-text">
                {movie.overview || "No overview available."}
              </p>
            </div>

            {/* WHERE TO WATCH SECTION */}
            {watchProviders &&
              (watchProviders.flatrate ||
                watchProviders.rent ||
                watchProviders.buy) && (
                <div className="section">
                  <h2 className="section-title">Where to Watch</h2>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "20px",
                      marginTop: "10px",
                    }}
                  >
                    {/* Streaming (Flatrate) */}
                    {watchProviders.flatrate?.map((provider) => (
                      <div
                        key={provider.provider_id}
                        style={{ textAlign: "center" }}
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                          alt={provider.provider_name}
                          title={`${provider.provider_name} (Stream)`}
                          className="provider-logo"
                        />
                        <p
                          style={{
                            fontSize: "10px",
                            color: "rgba(255,255,255,0.4)",
                            marginTop: "5px",
                          }}
                        >
                          Stream
                        </p>
                      </div>
                    ))}

                    {/* Renting (if no streaming is available) */}
                    {!watchProviders.flatrate &&
                      watchProviders.rent?.slice(0, 3).map((provider) => (
                        <div
                          key={provider.provider_id}
                          style={{ textAlign: "center" }}
                        >
                          <img
                            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                            alt={provider.provider_name}
                            title={`${provider.provider_name} (Rent)`}
                            className="provider-logo"
                            style={{ filter: "grayscale(0.3)" }}
                          />
                          <p
                            style={{
                              fontSize: "10px",
                              color: "rgba(255,255,255,0.4)",
                              marginTop: "5px",
                            }}
                          >
                            Rent
                          </p>
                        </div>
                      ))}
                  </div>
                  <p
                    style={{
                      fontSize: "10px",
                      color: "rgba(255,255,255,0.2)",
                      marginTop: "15px",
                    }}
                  >
                    Streaming data provided by JustWatch via TMDB.
                  </p>
                </div>
              )}

            {directors.length > 0 && (
              <div className="section">
                <h2 className="section-title">
                  {directors.length > 1 ? "Directors" : "Director"}
                </h2>
                <p className="creator-text">
                  {directors.map((p) => p.name).join(", ")}
                </p>
              </div>
            )}

            {writers.length > 0 && (
              <div className="section">
                <h2 className="section-title">
                  {writers.length > 1 ? "Writers" : "Writer"}
                </h2>
                <p className="creator-text">
                  {writers.map((p) => p.name).join(", ")}
                </p>
              </div>
            )}

            {cast.length > 0 && (
              <div className="section">
                <h2 className="section-title">Top Cast</h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(130px, 1fr))",
                    gap: "16px",
                    marginTop: "4px",
                  }}
                >
                  {cast.map((actor) => (
                    <CastCard key={actor.id} actor={actor} />
                  ))}
                </div>
              </div>
            )}

            {movie.production_companies?.length > 0 && (
              <div className="section">
                <h2 className="section-title">Production</h2>
                <p className="creator-text">
                  {movie.production_companies
                    .slice(0, 3)
                    .map((c) => c.name)
                    .join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

function CastCard({ actor }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={hovered ? { y: -5, scale: 1.02 } : { y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        background: "#0d0d0f",
        borderRadius: "10px",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: hovered
          ? "0 14px 30px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,193,60,0.22)"
          : "0 2px 8px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
        transition: "box-shadow 0.3s ease",
      }}
    >
      <div
        style={{
          width: "100%",
          paddingBottom: "150%",
          position: "relative",
          overflow: "hidden",
          background: "#111114",
        }}
      >
        <img
          src={
            actor.profile_path
              ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
              : "https://via.placeholder.com/185x278/111114/444?text=No+Image"
          }
          alt={actor.name}
          loading="lazy"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/185x278/111114/444?text=No+Image";
          }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: hovered ? "scale(1.07)" : "scale(1)",
            filter: hovered ? "brightness(0.5)" : "brightness(1)",
            transition: "transform 0.45s ease, filter 0.35s ease",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50%",
            background:
              "linear-gradient(to top, rgba(13,13,15,0.9) 0%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "10px 8px",
            zIndex: 2,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.25s ease",
          }}
        >
          <p
            style={{
              fontSize: "10px",
              color: "#ffc13c",
              fontWeight: "600",
              textAlign: "center",
              margin: 0,
              lineHeight: 1.3,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {actor.character}
          </p>
        </div>
      </div>
      <div
        style={{
          padding: "10px 8px 11px",
          textAlign: "center",
          background: "#0d0d0f",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            fontWeight: "700",
            color: hovered ? "#ffc13c" : "rgba(255,255,255,0.9)",
            margin: "0 0 3px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontFamily: "'DM Sans', sans-serif",
            transition: "color 0.2s",
          }}
        >
          {actor.name}
        </p>
        <p
          style={{
            fontSize: "10px",
            color: "rgba(255,255,255,0.35)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            margin: 0,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {actor.character}
        </p>
      </div>
    </motion.div>
  );
}

const styles = {
  loading: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "70vh",
    gap: "18px",
    fontFamily: "'DM Sans', sans-serif",
  },
  spinner: {
    width: "44px",
    height: "44px",
    border: "4px solid rgba(255,193,60,0.1)",
    borderTopColor: "#ffc13c",
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
  },
  loadingText: {
    color: "rgba(255,255,255,0.38)",
    fontSize: "14px",
    fontFamily: "'DM Sans', sans-serif",
    margin: 0,
    letterSpacing: "0.02em",
  },
  error: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "70vh",
    textAlign: "center",
    padding: "20px",
    fontFamily: "'DM Sans', sans-serif",
  },
  errorTitle: {
    fontSize: "28px",
    fontWeight: "800",
    marginBottom: "12px",
    color: "#ffc13c",
  },
  errorText: {
    fontSize: "16px",
    color: "rgba(255,255,255,0.45)",
    marginBottom: "28px",
  },
  backButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "9px",
    padding: "11px 26px",
    background: "#ffc13c",
    color: "#0d0d0f",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
};
