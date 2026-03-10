"use client";
import { motion } from "framer-motion";
import { useWatchlist } from "@/context/WatchlistContext";
import { Trash2, Bookmark, Film, Tv } from "lucide-react";
import Link from "next/link";
import WatchlistCard from "@/components/WatchlistCard";

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist, clearWatchlist, loading } =
    useWatchlist();

  if (loading) {
    return (
      <>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={s.loadingWrap}>
          <div style={s.spinner} />
        </div>
      </>
    );
  }

  const movieCount = watchlist.filter((i) => i.type === "movie").length;
  const tvCount = watchlist.filter((i) => i.type === "tv").length;

  return (
    <>
      <style>{`
        .wl-clear-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          background: transparent;
          color: rgba(255,255,255,0.38);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.01em;
        }
        .wl-clear-btn:hover {
          border-color: rgba(239,68,68,0.35);
          color: #f87171;
          background: rgba(239,68,68,0.06);
        }

        .wl-browse-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .wl-browse-btn.primary {
          background: #ffc13c;
          color: #0d0d0f;
          border: none;
        }
        .wl-browse-btn.primary:hover { opacity: 0.88; }
        .wl-browse-btn.secondary {
          background: transparent;
          color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.12);
        }
        .wl-browse-btn.secondary:hover {
          border-color: rgba(255,255,255,0.25);
          color: rgba(255,255,255,0.92);
          background: rgba(255,255,255,0.04);
        }

        @media (max-width: 768px) {
          .wl-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)) !important;
            gap: 12px !important;
          }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <motion.div
        style={s.page}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div style={s.header}>
          <div>
            <h1 style={s.title}>My Watchlist</h1>
            {watchlist.length > 0 && (
              <div style={s.countRow}>
                {movieCount > 0 && (
                  <span style={s.countChip}>
                    <Film size={11} />
                    {movieCount} {movieCount === 1 ? "Movie" : "Movies"}
                  </span>
                )}
                {tvCount > 0 && (
                  <span style={{ ...s.countChip, ...s.countChipTV }}>
                    <Tv size={11} />
                    {tvCount} TV {tvCount === 1 ? "Show" : "Shows"}
                  </span>
                )}
              </div>
            )}
          </div>

          {watchlist.length > 0 && (
            <motion.button
              className="wl-clear-btn"
              onClick={clearWatchlist}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 size={14} />
              Clear All
            </motion.button>
          )}
        </div>

        {/* Empty state */}
        {watchlist.length === 0 ? (
          <motion.div
            style={s.empty}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div style={s.emptyIconWrap}>
              <Bookmark size={36} color="#ffc13c" />
            </div>

            <h2 style={s.emptyTitle}>Your watchlist is empty</h2>
            <p style={s.emptyText}>
              Browse movies and TV shows and save anything you want to watch
              later.
              <br />
              Your list is saved locally and always available.
            </p>

            <div style={s.emptyButtons}>
              <Link href="/movies">
                <motion.span
                  className="wl-browse-btn primary"
                  whileTap={{ scale: 0.97 }}
                >
                  <Film size={15} />
                  Browse Movies
                </motion.span>
              </Link>
              <Link href="/tv">
                <motion.span
                  className="wl-browse-btn secondary"
                  whileTap={{ scale: 0.97 }}
                >
                  <Tv size={15} />
                  Browse TV Shows
                </motion.span>
              </Link>
            </div>

            {/* Category hints */}
            <div style={s.hintRow}>
              {["Action", "Comedy", "Drama", "Thriller", "Sci-Fi", "Anime"].map(
                (g) => (
                  <span key={g} style={s.hintChip}>
                    {g}
                  </span>
                ),
              )}
            </div>
          </motion.div>
        ) : (
          /* Grid */
          <motion.div
            className="wl-grid"
            style={s.grid}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {watchlist.map((item, index) => (
              <WatchlistCard
                key={`${item.type}-${item.id}-${index}`}
                item={item}
                onRemove={removeFromWatchlist}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </>
  );
}

const s = {
  loadingWrap: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "60vh",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid rgba(255,193,60,0.1)",
    borderTop: "4px solid #ffc13c",
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
  },
  page: {
    padding: "20px",
    paddingBottom: "100px",
    minHeight: "80vh",
    fontFamily: "'DM Sans', sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "32px",
    flexWrap: "wrap",
    gap: "15px",
  },
  title: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "38px",
    fontWeight: 900,
    color: "rgba(255,255,255,0.92)",
    margin: "0 0 10px",
    letterSpacing: "-0.03em",
  },
  countRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  countChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "4px 10px",
    background: "rgba(255,193,60,0.1)",
    border: "1px solid rgba(255,193,60,0.2)",
    borderRadius: "50px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "11px",
    fontWeight: 600,
    color: "#ffc13c",
    letterSpacing: "0.02em",
  },
  countChipTV: {
    background: "rgba(99,179,237,0.1)",
    border: "1px solid rgba(99,179,237,0.2)",
    color: "#63b3ed",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
    gap: "20px",
  },

  /* Empty state */
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "64px 20px 80px",
    gap: "0",
  },
  emptyIconWrap: {
    width: "80px",
    height: "80px",
    background: "rgba(255,193,60,0.07)",
    border: "1px solid rgba(255,193,60,0.18)",
    borderRadius: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
  },
  emptyTitle: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "22px",
    fontWeight: 800,
    color: "rgba(255,255,255,0.92)",
    margin: "0 0 12px",
    letterSpacing: "-0.02em",
  },
  emptyText: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "14px",
    color: "rgba(255,255,255,0.38)",
    margin: "0 0 32px",
    lineHeight: 1.85,
    maxWidth: "380px",
  },
  emptyButtons: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: "32px",
  },
  hintRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: "8px",
  },
  hintChip: {
    padding: "5px 13px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "50px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "12px",
    fontWeight: 500,
    color: "rgba(255,255,255,0.3)",
    letterSpacing: "0.02em",
  },
};
