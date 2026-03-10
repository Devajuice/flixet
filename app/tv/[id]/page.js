"use client";
import { useState, useEffect, use, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ArrowLeft,
  Play,
  Lightbulb,
  Check,
  Tv,
  X,
} from "lucide-react";
import Link from "next/link";
import WatchlistButton from "@/components/WatchlistButton";
import { useContinueWatching } from "@/context/ContinueWatchingContext";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const OMDB_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

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

  const [tvServer, setTvServer] = useState("vidlink");
  const [externalIds, setExternalIds] = useState(null);

  // Show-level IMDb: undefined = loading, null = unavailable, { rating, votes } = loaded
  const [showImdbRating, setShowImdbRating] = useState(undefined);
  // Episode-level IMDb cache: "S1E3" → { rating, votes } | null
  const [omdbCache, setOmdbCache] = useState({});

  // Next episode button: only shown 90s before episode end
  const [showNextBtn, setShowNextBtn] = useState(false);
  const nextBtnTimerRef = useRef(null);
  const SHOW_BEFORE_END_SECS = 90;

  useEffect(() => {
    fetchShowDetails();
  }, [showId]);

  useEffect(() => {
    if (show && !initialLoadDone) {
      const urlSeason = searchParams.get("season");
      const urlEpisode = searchParams.get("episode");
      if (urlSeason && urlEpisode) {
        const seasonNum = parseInt(urlSeason);
        const episodeNum = parseInt(urlEpisode);
        const seasonExists = show.seasons?.some(
          (s) => s.season_number === seasonNum,
        );
        if (seasonExists) {
          setSelectedSeason(seasonNum);
          setSelectedEpisode(episodeNum);
        } else setDefaultSeason();
      } else setDefaultSeason();
      setInitialLoadDone(true);
    }
  }, [show, searchParams, initialLoadDone]);

  useEffect(() => {
    if (selectedSeason !== null) fetchSeasonDetails(selectedSeason);
  }, [selectedSeason]);

  // Fetch show-level IMDb rating
  useEffect(() => {
    if (!OMDB_KEY || !externalIds?.imdb_id) return;
    fetch(
      `https://www.omdbapi.com/?i=${externalIds.imdb_id}&apikey=${OMDB_KEY}`,
    )
      .then((r) => r.json())
      .then((d) =>
        setShowImdbRating(
          d.imdbRating && d.imdbRating !== "N/A"
            ? { rating: d.imdbRating, votes: d.imdbVotes }
            : null,
        ),
      )
      .catch(() => setShowImdbRating(null));
  }, [externalIds]);

  // Pre-fetch episode IMDb ratings when season loads
  useEffect(() => {
    if (!OMDB_KEY || !externalIds?.imdb_id || !seasonData?.episodes) return;
    seasonData.episodes.forEach((ep) => {
      const key = `S${selectedSeason}E${ep.episode_number}`;
      if (omdbCache[key] !== undefined) return;
      fetchOmdbRating(selectedSeason, ep.episode_number);
    });
  }, [seasonData, externalIds]);

  useEffect(() => {
    if (showPlayer && show) {
      const currentEpisode = seasonData?.episodes?.find(
        (ep) => ep.episode_number === selectedEpisode,
      );
      const episodeRuntime =
        currentEpisode?.runtime || show.episode_run_time?.[0] || 45;
      addToContinueWatching({
        id: show.id,
        type: "tv",
        name: show.name,
        poster_path: show.poster_path,
        backdrop_path: show.backdrop_path,
        season: selectedSeason,
        episode: selectedEpisode,
        runtime: episodeRuntime,
        progress: 15,
      });
    }
    if (!showPlayer) hasAddedToWatching.current = false;
  }, [
    showPlayer,
    show,
    selectedSeason,
    selectedEpisode,
    seasonData,
    addToContinueWatching,
  ]);

  // Update continue watching whenever episode/season changes
  useEffect(() => {
    if (!show || !showPlayer) return;
    const currentEpisode = seasonData?.episodes?.find(
      (ep) => ep.episode_number === selectedEpisode,
    );
    const episodeRuntime =
      currentEpisode?.runtime || show.episode_run_time?.[0] || 45;
    addToContinueWatching({
      id: show.id,
      type: "tv",
      name: show.name,
      poster_path: show.poster_path,
      backdrop_path: show.backdrop_path,
      season: selectedSeason,
      episode: selectedEpisode,
      runtime: episodeRuntime,
      progress: 15,
    });
  }, [selectedEpisode, selectedSeason]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showPlayer) setShowPlayer(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [showPlayer]);

  // Timer: show Next Episode button 90s before episode ends
  useEffect(() => {
    if (nextBtnTimerRef.current) clearTimeout(nextBtnTimerRef.current);
    setShowNextBtn(false);

    if (!showPlayer || !seasonData?.episodes) return;

    const currentEpisode = seasonData.episodes.find(
      (ep) => ep.episode_number === selectedEpisode,
    );
    const runtimeMins =
      currentEpisode?.runtime || show?.episode_run_time?.[0] || 40;
    const runtimeMs = runtimeMins * 60 * 1000;
    const delay = runtimeMs - SHOW_BEFORE_END_SECS * 1000;

    if (delay > 0) {
      nextBtnTimerRef.current = setTimeout(() => setShowNextBtn(true), delay);
    }

    return () => {
      if (nextBtnTimerRef.current) clearTimeout(nextBtnTimerRef.current);
    };
  }, [showPlayer, selectedEpisode, selectedSeason, seasonData]);

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
    setShowImdbRating(undefined);
    try {
      const [showRes, externalRes] = await Promise.all([
        fetch(
          `https://api.themoviedb.org/3/tv/${showId}?api_key=${API_KEY}&append_to_response=credits,videos,watch/providers`,
        ),
        fetch(
          `https://api.themoviedb.org/3/tv/${showId}/external_ids?api_key=${API_KEY}`,
        ),
      ]);
      if (!showRes.ok) throw new Error("Failed to fetch TV show details");
      const [showData, externalData] = await Promise.all([
        showRes.json(),
        externalRes.json(),
      ]);
      setShow(showData);
      setExternalIds(externalData);
    } catch (err) {
      console.error("Error fetching TV show details:", err);
      setError(err.message);
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
      if (!response.ok) throw new Error("Failed to fetch season details");
      const data = await response.json();
      setSeasonData(data);
      if (selectedEpisode === null) setSelectedEpisode(1);
    } catch (err) {
      console.error("Error fetching season details:", err);
    } finally {
      setLoadingSeason(false);
    }
  };

  const fetchOmdbRating = async (season, episode) => {
    const key = `S${season}E${episode}`;
    if (!OMDB_KEY || !externalIds?.imdb_id) return;
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?i=${externalIds.imdb_id}&Season=${season}&Episode=${episode}&apikey=${OMDB_KEY}`,
      );
      const data = await res.json();
      setOmdbCache((prev) => ({
        ...prev,
        [key]:
          data.imdbRating && data.imdbRating !== "N/A"
            ? { rating: data.imdbRating, votes: data.imdbVotes }
            : null,
      }));
    } catch {
      setOmdbCache((prev) => ({ ...prev, [key]: null }));
    }
  };

  const handleSeasonChange = (seasonNumber) => {
    setSelectedSeason(seasonNumber);
    setSelectedEpisode(1);
  };

  const handleNextEpisode = () => {
    if (!seasonData?.episodes) return;
    const idx = seasonData.episodes.findIndex(
      (ep) => ep.episode_number === selectedEpisode,
    );

    if (idx < seasonData.episodes.length - 1) {
      const nextEp = seasonData.episodes[idx + 1].episode_number;
      const nextRuntime =
        seasonData.episodes[idx + 1]?.runtime ||
        show?.episode_run_time?.[0] ||
        45;

      setShowNextBtn(false);
      setSelectedEpisode(nextEp);

      addToContinueWatching({
        id: show.id,
        type: "tv",
        name: show.name,
        poster_path: show.poster_path,
        backdrop_path: show.backdrop_path,
        season: selectedSeason,
        episode: nextEp,
        runtime: nextRuntime,
        progress: 15,
      });

      setShowPlayer(false);
      setTimeout(() => setShowPlayer(true), 300);
    } else {
      const validSeasons =
        show.seasons?.filter((s) => s.season_number > 0) || [];
      const sIdx = validSeasons.findIndex(
        (s) => s.season_number === selectedSeason,
      );

      if (sIdx < validSeasons.length - 1) {
        const nextSeason = validSeasons[sIdx + 1].season_number;

        setShowNextBtn(false);
        setSelectedSeason(nextSeason);
        setSelectedEpisode(1);

        addToContinueWatching({
          id: show.id,
          type: "tv",
          name: show.name,
          poster_path: show.poster_path,
          backdrop_path: show.backdrop_path,
          season: nextSeason,
          episode: 1,
          runtime: show?.episode_run_time?.[0] || 45,
          progress: 15,
        });

        setShowPlayer(false);
        setTimeout(() => setShowPlayer(true), 300);
      }
    }
  };

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
          <p style={styles.loadingText}>Loading TV show details...</p>
        </div>
      </>
    );
  }

  if (error || !show) {
    return (
      <div style={styles.error}>
        <h2 style={styles.errorTitle}>
          {error ? "Error Loading TV Show" : "TV Show Not Found"}
        </h2>
        <p style={styles.errorText}>
          {error || "The TV show you are looking for does not exist."}
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
    : "/placeholder.png";
  const trailer = show.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube",
  );
  const cast = show.credits?.cast?.slice(0, 12) || [];
  const validSeasons = show.seasons?.filter((s) => s.season_number > 0) || [];
  const creators = show.created_by || [];

  const watchProviders = show["watch/providers"]?.results?.IN;

  const servers = [
    {
      id: "vidlink",
      label: "Server 1",
      color: "#ffc13c",
      url: `https://vidlink.pro/tv/${showId}/${selectedSeason}/${selectedEpisode}?primaryColor=ffc13c&secondaryColor=0d0d0f&iconColor=ffc13c&autoplay=true&nextbutton=true`,
    },
    {
      id: "2embed",
      label: "Server 2",
      color: "#34d399",
      url: `https://www.2embed.cc/embedtv/${externalIds?.imdb_id || showId}&s=${selectedSeason}&e=${selectedEpisode}`,
    },
    {
      id: "vidsrcme",
      label: "Server 3",
      color: "#60a5fa",
      url: `https://vidsrc.me/embed/tv?tmdb=${showId}&season=${selectedSeason}&episode=${selectedEpisode}`,
    },
    {
      id: "vidsrcnet",
      label: "Server 4",
      color: "#a78bfa",
      url: `https://vidsrc.net/embed/tv/${showId}/${selectedSeason}/${selectedEpisode}`,
    },
    {
      id: "vidplus",
      label: "Server 6",
      color: "#4ade80",
      url: `https://player.vidplus.to/embed/tv/${showId}/${selectedSeason}/${selectedEpisode}`,
    },
  ];

  // Compute next episode info for the button label
  const episodes = seasonData?.episodes || [];
  const currentIdx = episodes.findIndex(
    (ep) => ep.episode_number === selectedEpisode,
  );
  const hasNext = currentIdx < episodes.length - 1;
  const currentSeasonIdx = validSeasons.findIndex(
    (s) => s.season_number === selectedSeason,
  );
  const hasNextSeason = currentSeasonIdx < validSeasons.length - 1;
  const showNextEpisodeBtn = showNextBtn && (hasNext || hasNextSeason);

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
        .show-title {
          font-size: 44px;
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.03em;
          color: rgba(255, 255, 255, 0.96);
          margin: 0 0 8px;
        }
        .show-title span {
          color: #ffc13c;
        }
        .tagline {
          font-size: 16px;
          font-style: italic;
          color: rgba(255, 255, 255, 0.35);
          margin: 0 0 24px;
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
          color: rgba(255, 255, 255, 0.5);
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
          transition: transform 0.2s ease;
        }
        .provider-logo:hover {
          transform: scale(1.1);
        }

        .ep-ratings {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .ep-imdb-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(245, 197, 24, 0.08);
          border: 1px solid rgba(245, 197, 24, 0.2);
          border-radius: 6px;
          padding: 3px 8px;
        }
        .ep-imdb-logo {
          background: #f5c518;
          color: #000;
          font-size: 9px;
          font-weight: 900;
          padding: 1px 4px;
          border-radius: 3px;
          letter-spacing: 0.03em;
        }
        .ep-imdb-score {
          font-size: 11px;
          font-weight: 700;
          color: #f5c518;
          letter-spacing: 0.02em;
        }
        .ep-imdb-votes {
          font-size: 10px;
          color: rgba(245, 197, 24, 0.4);
        }
        .ep-imdb-loading {
          width: 64px;
          height: 22px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 6px;
          animation: shimmer 1.5s ease-in-out infinite;
        }

        @media (max-width: 968px) {
          .content-grid {
            grid-template-columns: 230px 1fr;
            gap: 28px;
          }
          .show-title {
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
          .show-title {
            font-size: 26px;
          }
        }
        @media (max-width: 480px) {
          .poster-section {
            grid-template-columns: 1fr;
          }
          .show-title {
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
        <Link href="/tv" className="back-link">
          <ArrowLeft size={16} />
          Back to TV Shows
        </Link>

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
                {/* Close button */}
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

                {/* Next Episode button — appears 90s before episode ends */}
                <AnimatePresence>
                  {showNextEpisodeBtn && (
                    <motion.button
                      key="next-ep-btn"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowNextBtn(false);
                        handleNextEpisode();
                      }}
                      style={{
                        position: "absolute",
                        bottom: 20,
                        right: 20,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "10px 18px",
                        background: "rgba(0,0,0,0.85)",
                        border: "1px solid rgba(255,193,60,0.5)",
                        borderRadius: 8,
                        cursor: "pointer",
                        color: "#ffc13c",
                        fontSize: 13,
                        fontWeight: 700,
                        fontFamily: "'DM Sans', sans-serif",
                        letterSpacing: "0.02em",
                        backdropFilter: "blur(8px)",
                        zIndex: 10,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255,193,60,0.15)";
                        e.currentTarget.style.borderColor = "#ffc13c";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(0,0,0,0.85)";
                        e.currentTarget.style.borderColor =
                          "rgba(255,193,60,0.5)";
                      }}
                    >
                      {hasNext
                        ? `Next: S${selectedSeason}E${episodes[currentIdx + 1]?.episode_number} →`
                        : `Next Season →`}
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Server selector */}
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
                      onClick={() => setTvServer(server.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 12px",
                        border: `1px solid ${tvServer === server.id ? server.color : "rgba(255,255,255,0.1)"}`,
                        borderRadius: 6,
                        cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: "0.02em",
                        background:
                          tvServer === server.id
                            ? `${server.color}1a`
                            : "rgba(0,0,0,0.5)",
                        color:
                          tvServer === server.id
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
                  key={`${tvServer}-${selectedSeason}-${selectedEpisode}`}
                  src={servers.find((s) => s.id === tvServer)?.url}
                  style={{ width: "100%", height: "100%", border: "none" }}
                  frameBorder="0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  title={`Watch ${show.name} S${selectedSeason}E${selectedEpisode}`}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {backdropUrl && (
          <div className="backdrop">
            <img src={backdropUrl} alt={`${show.name} backdrop`} />
          </div>
        )}

        <div className="content-grid">
          <div className="poster-section">
            <img
              src={posterUrl}
              alt={`${show.name} poster`}
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
                  background:
                    !selectedSeason || !selectedEpisode
                      ? "rgba(255,193,60,0.4)"
                      : "#ffc13c",
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
                disabled={!selectedSeason || !selectedEpisode}
              >
                <Play size={18} fill="#0d0d0f" color="#0d0d0f" />
                Watch S{selectedSeason}E{selectedEpisode}
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

          <div className="details">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="show-title">
                {show.name.split(" ").slice(0, -1).join(" ")}{" "}
                <span>{show.name.split(" ").slice(-1)}</span>
              </h1>
              {show.tagline && <p className="tagline">"{show.tagline}"</p>}

              <div className="metadata">
                {showImdbRating === undefined && OMDB_KEY ? (
                  <div className="imdb-shimmer" />
                ) : showImdbRating ? (
                  <div className="imdb-badge">
                    <span className="imdb-logo">IMDb</span>
                    <span className="imdb-score">{showImdbRating.rating}</span>
                    <span className="imdb-votes">
                      / 10 ·{" "}
                      {Number(
                        showImdbRating.votes?.replace(/,/g, ""),
                      ).toLocaleString()}{" "}
                      votes
                    </span>
                  </div>
                ) : null}

                <div className="meta-item">
                  <Calendar size={15} />
                  <span>
                    {new Date(show.first_air_date).getFullYear() || "N/A"}
                  </span>
                </div>
                <div className="meta-item">
                  <Tv size={15} />
                  <span>
                    {show.number_of_seasons} Season
                    {show.number_of_seasons !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {show.genres?.length > 0 && (
                <div className="genres">
                  {show.genres.map((genre) => (
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
                {show.overview || "No overview available."}
              </p>
            </div>

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
                    {!watchProviders.flatrate &&
                      watchProviders.buy?.slice(0, 3).map((provider) => (
                        <div
                          key={provider.provider_id}
                          style={{ textAlign: "center" }}
                        >
                          <img
                            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                            alt={provider.provider_name}
                            title={`${provider.provider_name} (Buy)`}
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
                            Buy
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

            {validSeasons.length > 0 && (
              <div className="section">
                <h2 className="section-title">Select Season</h2>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {validSeasons.map((season) => (
                    <TVSeasonBtn
                      key={season.id}
                      season={season}
                      isActive={selectedSeason === season.season_number}
                      onClick={() => handleSeasonChange(season.season_number)}
                    />
                  ))}
                </div>
              </div>
            )}

            {loadingSeason ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "14px",
                  padding: "40px 20px",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    border: "3px solid rgba(255,193,60,0.12)",
                    borderTopColor: "#ffc13c",
                    borderRadius: "50%",
                    animation: "spin 0.9s linear infinite",
                  }}
                />
                <p
                  style={{
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.35)",
                    margin: 0,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Loading episodes...
                </p>
              </div>
            ) : seasonData?.episodes ? (
              <div className="section">
                <h2 className="section-title">
                  Episodes
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "rgba(255,255,255,0.25)",
                      letterSpacing: "0.05em",
                      textTransform: "none",
                    }}
                  >
                    {seasonData.episodes.length} eps
                  </span>
                </h2>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {seasonData.episodes.map((episode, index) => (
                    <TVEpisodeCard
                      key={episode.id}
                      episode={episode}
                      isActive={selectedEpisode === episode.episode_number}
                      onClick={() => setSelectedEpisode(episode.episode_number)}
                      index={index}
                      omdb={
                        omdbCache[
                          `S${selectedSeason}E${episode.episode_number}`
                        ]
                      }
                      hasOmdbKey={!!OMDB_KEY && !!externalIds?.imdb_id}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {creators.length > 0 && (
              <div className="section">
                <h2 className="section-title">
                  {creators.length > 1 ? "Creators" : "Creator"}
                </h2>
                <p className="creator-text">
                  {creators.map((p) => p.name).join(", ")}
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
                    <TVCastCard key={actor.id} actor={actor} />
                  ))}
                </div>
              </div>
            )}

            {show.production_companies?.length > 0 && (
              <div className="section">
                <h2 className="section-title">Production</h2>
                <p className="creator-text">
                  {show.production_companies
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

/* ── Season button ─────────────────────────────────── */
function TVSeasonBtn({ season, isActive, onClick }) {
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
        border: `1px solid ${isActive ? "rgba(255,193,60,0.5)" : hovered ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.08)"}`,
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

/* ── Episode card ──────────────────────────────────── */
function TVEpisodeCard({
  episode,
  isActive,
  onClick,
  index,
  omdb,
  hasOmdbKey,
}) {
  const [hovered, setHovered] = useState(false);
  const F = { fontFamily: "'DM Sans', sans-serif" };

  const formatRuntime = (mins) => {
    if (!mins) return null;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };
  const runtime = formatRuntime(episode.runtime);
  const airDate = episode.air_date
    ? new Date(episode.air_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const showRatingRow = omdb || (hasOmdbKey && omdb === undefined);

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
        border: `1px solid ${isActive ? "rgba(255,193,60,0.3)" : hovered ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: "10px",
        cursor: "pointer",
        boxShadow: isActive ? "0 0 0 1px rgba(255,193,60,0.1)" : "none",
        transition:
          "background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: showRatingRow || episode.overview ? "8px" : 0,
        }}
      >
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
          <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
          <span
            style={{
              ...F,
              color: isActive
                ? "rgba(255,255,255,0.95)"
                : "rgba(255,255,255,0.8)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {episode.name || "Untitled"}
          </span>
        </h4>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
          }}
        >
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
          {airDate && (
            <span
              style={{
                ...F,
                fontSize: "11px",
                fontWeight: "600",
                color: "rgba(255,193,60,0.6)",
                whiteSpace: "nowrap",
                letterSpacing: "0.02em",
              }}
            >
              {airDate}
            </span>
          )}
        </div>
      </div>

      {showRatingRow && (
        <div className="ep-ratings">
          {omdb ? (
            <div className="ep-imdb-badge">
              <span className="ep-imdb-logo">IMDb</span>
              <span className="ep-imdb-score">{omdb.rating}</span>
              {omdb.votes && (
                <span className="ep-imdb-votes">
                  ({Number(omdb.votes.replace(/,/g, "")).toLocaleString()})
                </span>
              )}
            </div>
          ) : (
            <div className="ep-imdb-loading" />
          )}
        </div>
      )}

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
          {episode.overview.length > 150
            ? `${episode.overview.slice(0, 150)}...`
            : episode.overview}
        </p>
      ) : null}
    </motion.div>
  );
}

/* ── Cast card ─────────────────────────────────────── */
function TVCastCard({ actor }) {
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
