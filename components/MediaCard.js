"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import WatchlistButton from "./WatchlistButton";

const IMG = "https://image.tmdb.org/t/p";

export default function MediaCard({
  item,
  type,
  index,
  variant = "poster",
  showRemove,
  onRemove,
}) {
  const [hovered, setHovered] = useState(false);

  const mediaType = type || item.media_type || (item.title ? "movie" : "tv");
  const href = `/${mediaType === "movie" ? "movie" : "tv"}/${item.id}`;
  const title = item.title || item.name;

  const imgPath =
    variant === "backdrop"
      ? item.backdrop_path || item.poster_path
      : item.poster_path;

  const imgSrc = imgPath
    ? `${IMG}${variant === "backdrop" ? "/w780" : "/w342"}${imgPath}`
    : null;

  const width = variant === "backdrop" ? 240 : 140;

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemove) onRemove(item.id, mediaType);
  };

  const cardContent = (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min((index || 0) * 0.04, 0.4), duration: 0.3 }}
      style={{
        width,
        margin: "0 auto",
        position: "relative",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        background: "var(--bg-secondary)",
        cursor: "pointer",
        aspectRatio: variant === "backdrop" ? "16/9" : "2/3",
        boxShadow: hovered ? "var(--shadow-xl)" : "var(--shadow-md)",
        transform: hovered ? "translateY(-4px) scale(1.02)" : "none",
        transition: "all var(--transition-slow)",
        zIndex: hovered ? 10 : 1,
      }}
    >
      {imgSrc ? (
        <Image
          src={imgSrc}
          alt={title}
          fill
          sizes={
            variant === "backdrop"
              ? "(max-width: 768px) 240px, 240px"
              : "(max-width: 768px) 140px, 140px"
          }
          style={{
            objectFit: "cover",
            display: "block",
            transition: "all var(--transition-slow)",
            transform: hovered ? "scale(1.05)" : "none",
            filter: hovered ? "brightness(0.5)" : "none",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "var(--bg-tertiary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--space-3)",
          }}
        >
          <span
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--text-muted)",
              textAlign: "center",
            }}
          >
            {title}
          </span>
        </div>
      )}

      {/* Full overlay — this is the centering container */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: hovered
            ? "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.05) 100%)"
            : "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 40%)",
          transition: "background var(--transition-slow)",
          pointerEvents: "none",
        }}
      >
        {/* Play button — centered by flexbox */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                width: 48,
                height: 48,
                borderRadius: "var(--radius-full)",
                background: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 32px rgba(229,9,20,0.5)",
              }}
            >
              <Play size={20} fill="white" color="white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rating badge — top left */}
        {item.vote_average > 0 && (
          <div
            style={{
              position: "absolute",
              top: "var(--space-2)",
              left: "var(--space-2)",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-1)",
              padding: "3px 8px",
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(8px)",
              borderRadius: "var(--radius-md)",
              fontSize: "var(--text-xs)",
              fontWeight: "var(--font-bold)",
              color: "var(--gold)",
            }}
          >
            ★ {item.vote_average.toFixed(1)}
          </div>
        )}

        {/* Remove button (watchlist) */}
        {showRemove && (
          <div
            style={{
              position: "absolute",
              top: "var(--space-2)",
              right: "var(--space-2)",
              pointerEvents: "auto",
            }}
          >
            <motion.button
              onClick={handleRemove}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: 28,
                height: 28,
                borderRadius: "var(--radius-md)",
                background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(8px)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-secondary)",
                cursor: "pointer",
              }}
            >
              <X size={13} />
            </motion.button>
          </div>
        )}

        {/* Watchlist button (normal) */}
        {!showRemove && (
          <div
            style={{
              position: "absolute",
              top: "var(--space-2)",
              right: "var(--space-2)",
              opacity: hovered ? 1 : 0,
              transform: hovered ? "translateY(0)" : "translateY(-4px)",
              transition: "all var(--transition-base)",
              pointerEvents: "auto",
            }}
          >
            <WatchlistButton
              item={{
                id: item.id,
                type: mediaType,
                title,
                name: title,
                poster_path: item.poster_path,
                vote_average: item.vote_average,
                release_date: item.release_date,
                first_air_date: item.first_air_date,
              }}
            />
          </div>
        )}

        {/* Title — bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "var(--space-2) var(--space-3) var(--space-3)",
          }}
        >
          <p
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-semibold)",
              color: "var(--text-primary)",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </p>
          {(item.release_date || item.first_air_date) && (
            <span
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--text-tertiary)",
              }}
            >
              {new Date(item.release_date || item.first_air_date).getFullYear()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );

  return showRemove ? (
    <div style={{ display: "block" }}>{cardContent}</div>
  ) : (
    <Link href={href} style={{ display: "block" }}>
      {cardContent}
    </Link>
  );
}
