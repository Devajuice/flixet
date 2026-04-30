"use client";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { useContinueWatching } from "@/context/ContinueWatchingContext";

export default function ContinueWatchingCard({ item }) {
  const { removeFromContinueWatching } = useContinueWatching();

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromContinueWatching(item.id, item.type);
  };

  const getEpisodeInfo = () => {
    if (item.type === "tv" && item.season && item.episode) {
      return `S${item.season} · E${item.episode}`;
    }
    return null;
  };

  // Convert progress % + runtime into a readable timestamp e.g. "14:22"
  const getTimestamp = () => {
    if (!item.runtime || !item.progress) return null;
    const elapsed = Math.floor((item.progress / 100) * item.runtime * 60);
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progressPercent = Math.min(item.progress || 0, 100);
  const timestamp = getTimestamp();
  const episodeInfo = getEpisodeInfo();

  const imageUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
    : item.backdrop_path
      ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}`
      : "/placeholder.jpg";

  const linkUrl =
    item.type === "tv"
      ? `/tv/${item.id}?season=${item.season}&episode=${item.episode}`
      : `/movie/${item.id}`;

  return (
    <div className="cw-card-link" style={{ position: "relative" }}>
      {/* ── Remove button ──────────────────────── */}
      <button
        onClick={handleRemove}
        className="cw-remove"
        aria-label="Remove from continue watching"
        style={{
          position: "absolute",
          top: 6,
          right: 6,
          zIndex: 20,
          background: "rgba(0, 0, 0, 0.65)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          width: 18,
          height: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(4px)",
        }}
      >
        <X size={10} />
      </button>

      <Link href={linkUrl} style={{ textDecoration: "none", color: "inherit" }}>
        <div className="cw-card">
          {/* ── Thumbnail ──────────────────────────── */}
          <div className="cw-thumb" style={{ position: "relative" }}>
            <Image
              src={imageUrl}
              alt={item.title || item.name}
              fill
              sizes="(max-width: 768px) 140px, 140px"
              style={{ objectFit: "cover", display: "block" }}
            />

            {/* Play circle */}
            <div className="cw-play-overlay">
              <div className="cw-play-btn">
                <span className="cw-play-icon" />
              </div>
            </div>

            {/* Episode badge — top left */}
            {episodeInfo && <div className="cw-ep-badge">{episodeInfo}</div>}

            {/* Timestamp — bottom right of thumb */}
            {timestamp && <div className="cw-timestamp">{timestamp}</div>}
          </div>

          {/* ── Progress bar ────────────────────────── */}
          <div className="cw-progress-track">
            <div
              className="cw-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* ── Info ───────────────────────────────── */}
          <div className="cw-info">
            <h3 className="cw-title">{item.title || item.name}</h3>
            {episodeInfo && <p className="cw-meta">{episodeInfo}</p>}
          </div>
        </div>

        <style jsx>{`
          .cw-card-link {
            display: block;
            text-decoration: none;
            color: inherit;
          }

          /* ── Shell ───────────────────────────────── */
          .cw-card {
            position: relative;
            background: #0d0d0f;
            border-radius: 8px;
            overflow: hidden;
            box-shadow:
              0 2px 8px rgba(0, 0, 0, 0.55),
              0 0 0 1px rgba(255, 255, 255, 0.04);
            transition:
              transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.28s ease;
          }
          .cw-card:hover {
            transform: translateY(-4px) scale(1.02);
            box-shadow:
              0 12px 28px rgba(0, 0, 0, 0.7),
              0 0 0 1px rgba(255, 193, 60, 0.22),
              0 0 18px rgba(255, 193, 60, 0.07);
          }
          .cw-card:active {
            transform: scale(0.97);
            transition-duration: 0.1s;
          }

          /* ── Remove ──────────────────────────────── */
          .cw-remove {
            position: absolute;
            top: 6px;
            right: 6px;
            z-index: 10;
            background: rgba(0, 0, 0, 0.65);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: rgba(255, 255, 255, 0.7);
            opacity: 0;
            transform: translateY(-2px);
            transition:
              opacity 0.2s ease,
              transform 0.2s ease,
              background 0.2s ease;
            backdrop-filter: blur(4px);
          }
          .cw-card:hover .cw-remove {
            opacity: 1;
            transform: translateY(0);
          }
          .cw-remove:hover {
            background: rgba(220, 50, 50, 0.85);
            border-color: transparent;
            color: white;
          }

          /* ── Thumb ───────────────────────────────── */
          .cw-thumb {
            position: relative;
            aspect-ratio: 2 / 3;
            overflow: hidden;
            background: #111114;
          }
          .cw-thumb img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition:
              transform 0.45s ease,
              filter 0.35s ease;
          }
          .cw-card:hover .cw-thumb img {
            transform: scale(1.06);
            filter: brightness(0.42) saturate(1.1);
          }
          .cw-thumb::before {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 55%;
            background: linear-gradient(
              to top,
              rgba(13, 13, 15, 0.88) 0%,
              transparent 100%
            );
            pointer-events: none;
            z-index: 1;
          }

          /* ── Play overlay ────────────────────────── */
          .cw-play-overlay {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3;
            opacity: 0;
            transition: opacity 0.25s ease;
          }
          .cw-card:hover .cw-play-overlay {
            opacity: 1;
          }
          .cw-play-btn {
            width: 44px;
            height: 44px;
            background: rgba(255, 193, 60, 0.92);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 14px rgba(255, 193, 60, 0.45);
            transform: scale(0.82);
            transition: transform 0.2s ease;
          }
          .cw-card:hover .cw-play-btn {
            transform: scale(1);
          }
          .cw-play-icon {
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 5px 0 5px 8px;
            border-color: transparent transparent transparent #0d0d0f;
            margin-left: 2px;
          }

          /* ── Episode badge ───────────────────────── */
          .cw-ep-badge {
            position: absolute;
            top: 6px;
            left: 6px;
            z-index: 2;
            background: rgba(0, 0, 0, 0.72);
            border: 1px solid rgba(255, 193, 60, 0.3);
            border-radius: 4px;
            padding: 2px 6px;
            font-family: "DM Sans", sans-serif;
            font-size: 9px;
            font-weight: 700;
            color: #ffc13c;
            letter-spacing: 0.05em;
            backdrop-filter: blur(4px);
          }

          /* ── Timestamp badge ─────────────────────── */
          .cw-timestamp {
            position: absolute;
            bottom: 6px;
            right: 6px;
            z-index: 2;
            background: rgba(0, 0, 0, 0.72);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            padding: 2px 6px;
            font-family: "DM Sans", sans-serif;
            font-size: 9px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.72);
            letter-spacing: 0.02em;
            backdrop-filter: blur(4px);
          }

          /* ── Progress bar ────────────────────────── */
          .cw-progress-track {
            height: 2px;
            background: rgba(255, 255, 255, 0.06);
          }
          .cw-progress-fill {
            height: 100%;
            background: #ffc13c;
            border-radius: 0 1px 1px 0;
            transition: width 0.3s ease;
          }

          /* ── Info ────────────────────────────────── */
          .cw-info {
            padding: 7px 9px 8px;
            background: #0d0d0f;
          }
          .cw-title {
            font-family: "DM Sans", sans-serif;
            font-size: 11px;
            font-weight: 600;
            margin: 0 0 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: rgba(255, 255, 255, 0.88);
            letter-spacing: 0.01em;
            transition: color 0.2s;
          }
          .cw-card:hover .cw-title {
            color: #ffc13c;
          }
          .cw-meta {
            font-family: "DM Sans", sans-serif;
            font-size: 9px;
            font-weight: 600;
            color: rgba(255, 193, 60, 0.5);
            margin: 0;
            letter-spacing: 0.05em;
            text-transform: uppercase;
          }
        `}</style>
      </Link>
    </div>
  );
}
