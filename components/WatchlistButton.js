"use client";
import { useWatchlist } from "@/context/WatchlistContext";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function WatchlistButton({ item, variant = "default" }) {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const isInWatchlist = watchlist.some(
    (w) => w.id === item.id && w.type === item.type,
  );

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWatchlist) {
      removeFromWatchlist(item.id, item.type);
    } else {
      addToWatchlist(item);
    }
  };

  /* ── Large variant (detail pages) ─────────────────────── */
  if (variant === "large") {
    return (
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "13px 24px",
          background: isInWatchlist
            ? "var(--accent)"
            : "rgba(255,255,255,0.06)",
          color: isInWatchlist ? "#fff" : "var(--text-secondary)",
          border: isInWatchlist ? "none" : "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          fontSize: "var(--text-sm)",
          fontWeight: "var(--font-bold)",
          letterSpacing: "0.01em",
          cursor: "pointer",
          transition: "all var(--transition-base)",
          whiteSpace: "nowrap",
        }}
      >
        {isInWatchlist ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        {isInWatchlist ? "In Watchlist" : "Watchlist"}
      </motion.button>
    );
  }

  /* ── Default small variant (grid cards) ───────────────── */
  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: isInWatchlist ? "var(--accent)" : "rgba(0,0,0,0.7)",
        border: isInWatchlist ? "none" : "1px solid rgba(255,255,255,0.15)",
        color: isInWatchlist ? "#fff" : "rgba(255,255,255,0.6)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(6px)",
        transition: "all var(--transition-base)",
      }}
    >
      {isInWatchlist ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
    </motion.button>
  );
}
