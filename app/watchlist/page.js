"use client";
import { motion } from "framer-motion";
import { useWatchlist } from "@/context/WatchlistContext";
import { Trash2, Bookmark, Film, Tv } from "lucide-react";
import Link from "next/link";
import MediaCard from "@/components/MediaCard";

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist, clearWatchlist, loading } =
    useWatchlist();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: "4px solid rgba(229,9,20,0.2)",
            borderTopColor: "var(--accent)",
            borderRadius: "50%",
            animation: "spin 0.9s linear infinite",
          }}
        />
      </div>
    );
  }

  const movieCount = watchlist.filter((i) => i.type === "movie").length;
  const tvCount = watchlist.filter((i) => i.type === "tv").length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: "var(--font-extrabold)",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          My Watchlist
        </h1>
        {watchlist.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginTop: 8,
              justifyContent: "center",
            }}
          >
            {movieCount > 0 && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "4px 10px",
                  background: "rgba(229,9,20,0.12)",
                  border: "1px solid rgba(229,9,20,0.25)",
                  borderRadius: "50px",
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-semibold)",
                  color: "var(--accent)",
                }}
              >
                <Film size={11} />
                {movieCount} {movieCount === 1 ? "Movie" : "Movies"}
              </span>
            )}
            {tvCount > 0 && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "4px 10px",
                  background: "rgba(59,130,246,0.1)",
                  border: "1px solid rgba(59,130,246,0.25)",
                  borderRadius: "50px",
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-semibold)",
                  color: "#60a5fa",
                }}
              >
                <Tv size={11} />
                {tvCount} TV {tvCount === 1 ? "Show" : "Shows"}
              </span>
            )}
          </div>
        )}
      </div>

      {watchlist.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 24,
          }}
        >
          <motion.button
            className="btn"
            onClick={clearWatchlist}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "9px 18px",
              fontSize: "var(--text-sm)",
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text-tertiary)",
            }}
          >
            <Trash2 size={14} /> Clear All
          </motion.button>
        </div>
      )}

      {watchlist.length === 0 ? (
        <motion.div
          style={{ textAlign: "center", padding: "64px 20px 80px" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              background: "rgba(229,9,20,0.08)",
              border: "1px solid rgba(229,9,20,0.15)",
              borderRadius: "22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <Bookmark size={36} color="var(--accent)" />
          </div>
          <h2
            style={{
              fontSize: "var(--text-xl)",
              fontWeight: "var(--font-bold)",
              marginBottom: 12,
            }}
          >
            Your watchlist is empty
          </h2>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--text-tertiary)",
              lineHeight: 1.7,
              maxWidth: 380,
              margin: "0 auto 32px",
            }}
          >
            Browse movies and TV shows and save anything you want to watch
            later. Your list is saved locally and always available.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: 32,
            }}
          >
            <Link href="/movies">
              <motion.span
                className="btn btn-primary"
                style={{ padding: "12px 24px", fontSize: "var(--text-sm)" }}
                whileTap={{ scale: 0.97 }}
              >
                <Film size={15} /> Browse Movies
              </motion.span>
            </Link>
            <Link href="/tv">
              <motion.span
                className="btn btn-secondary"
                style={{ padding: "12px 24px", fontSize: "var(--text-sm)" }}
                whileTap={{ scale: 0.97 }}
              >
                <Tv size={15} /> Browse TV Shows
              </motion.span>
            </Link>
          </div>
        </motion.div>
      ) : (
        <motion.div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 16,
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {watchlist.map((item, index) => {
            const itemType = item.type === "tv" ? "tv" : "movie";
            return (
              <MediaCard
                key={`${itemType}-${item.id}-${index}`}
                item={item}
                type={itemType}
                onRemove={() => removeFromWatchlist(item.id, itemType)}
                showRemove
              />
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
