"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Film, Tv, Sparkles, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

/**
 * ComingSoonPage — shared component for /coming-soon/movies and /coming-soon/tv
 *
 * Props:
 *   type        — "movie" | "tv"
 *   CardComponent — MovieCard or TVCard
 */
export default function ComingSoonPage({ type, CardComponent }) {
  const isMovie = type === "movie";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const observerTarget = useRef(null);

  useEffect(() => {
    fetchItems(1, true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          fetchItems(currentPage + 1, false);
        }
      },
      { threshold: 0.1 },
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [hasMore, loading, loadingMore, currentPage]);

  const fetchItems = async (page, reset = false) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);

    try {
      const endpoint = isMovie
        ? `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${page}&region=US`
        : `https://api.themoviedb.org/3/tv/on_the_air?api_key=${API_KEY}&language=en-US&page=${page}`;

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Fetch failed");
      const data = await response.json();

      if (reset) {
        setItems(data.results || []);
        setTotalResults(data.total_results || 0);
        if (isMovie && data.dates) {
          setDateRange({ start: data.dates.minimum, end: data.dates.maximum });
        }
      } else {
        setItems((prev) => {
          const existingIds = new Set(prev.map((i) => i.id));
          return [
            ...prev,
            ...(data.results || []).filter((i) => !existingIds.has(i.id)),
          ];
        });
      }

      setCurrentPage(page);
      setHasMore(page < data.total_pages && page < 500);
    } catch (err) {
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const formatDate = (str) => {
    if (!str) return "";
    return new Date(str).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  /* ─── Loading screen ─────────────────────────────────────────── */
  if (loading) {
    return (
      <>
        <style jsx>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
        <div style={loadingStyles.wrap}>
          <div style={loadingStyles.spinner} />
          <p style={loadingStyles.text}>
            Loading {isMovie ? "upcoming movies" : "airing TV shows"}…
          </p>
        </div>
      </>
    );
  }

  /* ─── Page ───────────────────────────────────────────────────── */
  const Icon = isMovie ? Film : Tv;
  const browseHref = isMovie ? "/movies" : "/tv";
  const browseLinkLabel = isMovie ? "Browse All Movies" : "Browse All TV Shows";

  return (
    <>
      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ── Page ─────────────────────────────────── */
        .cs-page {
          padding: 20px;
          padding-bottom: 100px;
          font-family: "DM Sans", sans-serif;
        }

        /* ── Header ───────────────────────────────── */
        .cs-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .cs-header-icon {
          display: flex;
          justify-content: center;
          margin-bottom: 14px;
          opacity: 0.9;
        }
        .cs-title {
          font-family: "DM Sans", sans-serif;
          font-size: 38px;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin: 0 0 10px;
          color: rgba(255, 255, 255, 0.95);
        }
        .cs-title span {
          color: #ffc13c;
        }
        .cs-subtitle {
          font-family: "DM Sans", sans-serif;
          font-size: 15px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.38);
          margin: 0;
          letter-spacing: 0.01em;
        }

        /* ── Stats bar ────────────────────────────── */
        .cs-stats-bar {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }
        .cs-stat-chip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 14px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 50px;
          font-family: "DM Sans", sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 0.02em;
        }
        .cs-stat-chip strong {
          color: #ffc13c;
          font-weight: 700;
        }

        /* ── Grid ─────────────────────────────────── */
        .cs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        /* Each cell must carry the 2/3 aspect ratio so MovieCard/TVCard
           (which use width:100% height:100% internally) render correctly */
        .cs-grid > * {
          aspect-ratio: 2 / 3;
          width: 100%;
        }
        @media (min-width: 1024px) {
          .cs-grid {
            grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
            gap: 24px;
          }
        }
        @media (max-width: 768px) {
          .cs-page {
            padding: 15px;
            padding-bottom: 80px;
          }
          .cs-title {
            font-size: 28px;
          }
          .cs-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
        @media (max-width: 480px) {
          .cs-title {
            font-size: 24px;
          }
          .cs-grid {
            gap: 10px;
          }
        }

        /* ── Empty state ──────────────────────────── */
        .cs-empty {
          text-align: center;
          padding: 80px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
        }
        .cs-empty h2 {
          font-family: "DM Sans", sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.88);
          margin: 0;
        }
        .cs-empty p {
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.35);
          margin: 0;
        }
        .cs-browse-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 11px 24px;
          background: #ffc13c;
          color: #0d0d0f;
          border: none;
          border-radius: 8px;
          font-family: "DM Sans", sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: opacity 0.2s ease;
        }
        .cs-browse-btn:hover {
          opacity: 0.88;
        }

        /* ── Observer zone ────────────────────────── */
        .cs-observer {
          min-height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 32px;
        }
        .cs-loading-more {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .cs-spinner-sm {
          width: 30px;
          height: 30px;
          border: 3px solid rgba(255, 193, 60, 0.12);
          border-top-color: #ffc13c;
          border-radius: 50%;
          animation: spin 0.9s linear infinite;
        }
        .cs-loading-more p {
          font-family: "DM Sans", sans-serif;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.35);
          margin: 0;
        }
        .cs-end-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .cs-end-message p {
          font-family: "DM Sans", sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.3);
          margin: 0;
          letter-spacing: 0.02em;
        }
        .cs-end-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 20px;
          background: transparent;
          color: #ffc13c;
          border: 1px solid rgba(255, 193, 60, 0.35);
          border-radius: 8px;
          font-family: "DM Sans", sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition:
            background 0.2s ease,
            border-color 0.2s ease;
        }
        .cs-end-link-btn:hover {
          background: rgba(255, 193, 60, 0.08);
          border-color: rgba(255, 193, 60, 0.6);
        }
      `}</style>

      <motion.div
        className="cs-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* ── Header ── */}
        <motion.div
          className="cs-header"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="cs-header-icon">
            <Icon size={28} color="#ffc13c" />
          </div>
          <h1 className="cs-title">
            {isMovie ? (
              <>
                Upcoming <span>Movies</span>
              </>
            ) : (
              <>
                On The <span>Air</span>
              </>
            )}
          </h1>
          <p className="cs-subtitle">
            {isMovie
              ? "New releases coming to theaters near you"
              : "TV shows currently airing new episodes"}
          </p>
        </motion.div>

        {/* ── Stats bar ── */}
        {totalResults > 0 && (
          <motion.div
            className="cs-stats-bar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="cs-stat-chip">
              <TrendingUp size={13} color="#ffc13c" />
              <strong>{totalResults.toLocaleString()}</strong>
              {isMovie ? " movies" : " TV shows"}
            </div>

            {isMovie && dateRange.start && dateRange.end && (
              <div className="cs-stat-chip">
                <Calendar size={13} color="#ffc13c" />
                {formatDate(dateRange.start)} – {formatDate(dateRange.end)}
              </div>
            )}

            {!isMovie && (
              <div className="cs-stat-chip">
                <Sparkles size={13} color="#ffc13c" />
                Active &amp; releasing now
              </div>
            )}

            <div className="cs-stat-chip">
              Showing <strong>&nbsp;{items.length}</strong>&nbsp;results
            </div>
          </motion.div>
        )}

        {/* ── Grid or empty ── */}
        {items.length === 0 ? (
          <motion.div
            className="cs-empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Icon size={44} color="rgba(255,255,255,0.12)" />
            <h2>Nothing here yet</h2>
            <p>
              {isMovie
                ? "No upcoming movies found right now."
                : "No TV shows currently airing."}
            </p>
            <Link href={browseHref}>
              <button className="cs-browse-btn">
                <Icon size={15} />
                {browseLinkLabel}
              </button>
            </Link>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="cs-grid"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {items.map((item) => (
                <CardComponent
                  key={item.id}
                  {...(isMovie ? { movie: item } : { show: item })}
                />
              ))}
            </motion.div>

            <div ref={observerTarget} className="cs-observer">
              {loadingMore && (
                <motion.div
                  className="cs-loading-more"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="cs-spinner-sm" />
                  <p>Loading more {isMovie ? "movies" : "shows"}…</p>
                </motion.div>
              )}
              {!hasMore && items.length > 0 && (
                <motion.div
                  className="cs-end-message"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Sparkles size={18} color="#ffc13c" />
                  <p>
                    You've explored all {items.length}{" "}
                    {isMovie ? "movies" : "shows"}!
                  </p>
                  <Link href={browseHref}>
                    <button className="cs-end-link-btn">
                      <Icon size={14} />
                      {browseLinkLabel}
                    </button>
                  </Link>
                </motion.div>
              )}
            </div>
          </>
        )}
      </motion.div>
    </>
  );
}

const loadingStyles = {
  wrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
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
  text: {
    color: "rgba(255,255,255,0.38)",
    fontSize: "14px",
    margin: 0,
    letterSpacing: "0.02em",
  },
};
