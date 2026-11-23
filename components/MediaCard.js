"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import WatchlistButton from "./WatchlistButton";

const IMG = "https://image.tmdb.org/t/p";

function releaseYear(item) {
  const date = item.release_date || item.first_air_date;
  return date ? String(date).slice(0, 4) : null;
}

function MediaCard({
  item,
  type,
  index,
  variant = "poster",
  showRemove,
  onRemove,
  cardWidth,
}) {
  const [hovered, setHovered] = useState(false);

  const mediaType = type || item.media_type || (item.title ? "movie" : "tv");
  const href =
    item.href ||
    (item.tmdbId
      ? `/${item.tmdbMediaType || "tv"}/${item.tmdbId}`
      : `/${mediaType === "movie" ? "movie" : "tv"}/${item.id}`);
  const title = item.title || item.name;

  const directImage = item.imageUrl || item.coverImage || null;
  const imgPath =
    variant === "backdrop"
      ? item.backdrop_path || item.poster_path
      : item.poster_path;

  const imgSrc = directImage
    ? directImage
    : imgPath
      ? `${IMG}${variant === "backdrop" ? "/w780" : "/w342"}${imgPath}`
      : null;

  const width = variant === "backdrop" ? 240 : variant === "tile" ? 240 : 140;

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemove) onRemove(item.id, mediaType);
  };

  const year = releaseYear(item);

  /* ── Split-tile variant (catalog grid) ─────────────────────── */
  if (variant === "tile") {
    const tileContent = (
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min((index || 0) * 0.04, 0.4), duration: 0.3 }}
        style={{
          width: cardWidth || "100%",
          minWidth: cardWidth || 0,
          flexShrink: cardWidth ? 0 : 1,
          position: "relative",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          background: "var(--bg-secondary)",
          cursor: "pointer",
          border: "1px solid var(--border)",
          boxShadow: hovered
            ? "0 16px 40px rgba(0, 0, 0, 0.6)"
            : "var(--shadow-sm)",
          transform: hovered ? "scale(1.05)" : "none",
          transition: "all var(--transition-slow)",
          zIndex: hovered ? 10 : 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Poster area */}
        <div
          style={{
            position: "relative",
            aspectRatio: "2/3",
            overflow: "hidden",
            background: "var(--bg-tertiary)",
            flexShrink: 0,
          }}
        >
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={title}
              fill
              sizes="(max-width: 480px) 42vw, (max-width: 768px) 30vw, 200px"
              style={{
                objectFit: "cover",
                display: "block",
                transition: "all var(--transition-slow)",
                transform: hovered ? "scale(1.06)" : "none",
                filter: hovered ? "brightness(0.45)" : "none",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
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

          {/* Hover overlay with details */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              background: hovered
                ? "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.1) 100%)"
                : "linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 40%)",
              transition: "background var(--transition-slow)",
              pointerEvents: "none",
              opacity: hovered ? 1 : 0,
            }}
          >
            <div style={{ padding: "10px 10px 12px" }}>
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-bold)",
                  color: "var(--text-primary)",
                  margin: "0 0 6px",
                  lineHeight: 1.3,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {title}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                {item.vote_average > 0 && (
                  <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--font-bold)", color: "var(--gold)" }}>
                    ★ {item.vote_average.toFixed(1)}
                  </span>
                )}
                {year && (
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>{year}</span>
                )}
                <span
                  style={{
                    marginLeft: "auto",
                    padding: "2px 6px",
                    borderRadius: "var(--radius-full)",
                    background: "var(--accent-subtle)",
                    border: "1px solid var(--accent-border)",
                    fontSize: 9,
                    fontWeight: "var(--font-semibold)",
                    color: "var(--accent)",
                    textTransform: "uppercase",
                  }}
                >
                  {mediaType === "movie" ? "Movie" : "TV"}
                </span>
              </div>
            </div>
          </div>

          {/* Play button */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "var(--radius-full)",
                    background: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <Play size={19} fill="#000000" color="#000000" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!showRemove && (
            <div
              className="media-card-action"
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
          {showRemove && (
            <div style={{ position: "absolute", top: "var(--space-2)", right: "var(--space-2)", pointerEvents: "auto" }}>
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
        </div>
      </motion.div>
    );

    return showRemove ? (
      <div style={{ display: "block" }}>{tileContent}</div>
    ) : (
      <Link href={href} style={{ display: "block" }}>
        {tileContent}
      </Link>
    );
  }

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
        transform: hovered ? "scale(1.08)" : "none",
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
              ? "(max-width: 768px) 42vw, 280px"
              : "(max-width: 768px) 33vw, 180px"
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
          flexDirection: "column",
          justifyContent: "flex-end",
          background: hovered
            ? "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 45%, transparent 100%)"
            : "transparent",
          transition: "background var(--transition-slow)",
          pointerEvents: "none",
          opacity: hovered ? 1 : 0,
        }}
      >
        <div style={{ padding: "var(--space-2) var(--space-3) var(--space-3)", pointerEvents: "none" }}>
          <p style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-semibold)", color: "var(--text-primary)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</p>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 2 }}>
            {item.vote_average > 0 && <span style={{ fontSize: "var(--text-xs)", color: "var(--gold)", fontWeight: "var(--font-bold)" }}>★ {item.vote_average.toFixed(1)}</span>}
            {year && <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>{year}</span>}
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
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
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
              }}
            >
              <Play size={20} fill="#000000" color="#000000" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {item.vote_average > 0 && (
        <div style={{ position: "absolute", top: "var(--space-2)", left: "var(--space-2)", display: "flex", alignItems: "center", gap: "var(--space-1)", padding: "3px 8px", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", borderRadius: "var(--radius-md)", fontSize: "var(--text-xs)", fontWeight: "var(--font-bold)", color: "var(--gold)", opacity: hovered ? 1 : 0.9, transition: "opacity 0.2s" }}>
          ★ {item.vote_average.toFixed(1)}
        </div>
      )}
      {showRemove && (
        <div style={{ position: "absolute", top: "var(--space-2)", right: "var(--space-2)", pointerEvents: "auto" }}>
          <motion.button onClick={handleRemove} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label={`Remove ${title} from watchlist`} style={{ width: 28, height: 28, borderRadius: "var(--radius-md)", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", cursor: "pointer" }}>
            <X size={13} />
          </motion.button>
        </div>
      )}
      {!showRemove && (
        <div className="media-card-action" style={{ position: "absolute", top: "var(--space-2)", right: "var(--space-2)", opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(-4px)", transition: "all var(--transition-base)", pointerEvents: "auto" }}>
          <WatchlistButton item={{ id: item.id, type: mediaType, title, name: title, poster_path: item.poster_path, vote_average: item.vote_average, release_date: item.release_date, first_air_date: item.first_air_date }} />
        </div>
      )}
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

export default React.memo(MediaCard);
