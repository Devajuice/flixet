"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Star, Sparkles } from "lucide-react";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function ComingSoon({ type = "movie" }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComingSoon();
  }, [type]);

  const fetchComingSoon = async () => {
    setLoading(true);
    try {
      const url =
        type === "movie"
          ? `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1&region=US`
          : `https://api.themoviedb.org/3/tv/on_the_air?api_key=${API_KEY}&language=en-US&page=1`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setItems(data.results?.slice(0, 12) || []);
    } catch (error) {
      console.error("Error fetching coming soon:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={s.loading}>
          <div style={s.spinner} />
        </div>
      </>
    );
  }

  if (items.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .cs-card:hover {
          transform: translateY(-6px) scale(1.02) !important;
          box-shadow: 0 18px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,193,60,0.25), 0 0 30px rgba(255,193,60,0.08) !important;
        }
        .cs-card:active {
          transform: scale(0.97) !important;
          transition-duration: 0.1s !important;
        }
        .cs-card:hover .cs-img {
          transform: scale(1.06);
          filter: brightness(0.5) saturate(1.1);
        }
        .cs-card:hover .cs-overlay { opacity: 1; }
        .cs-card:hover .cs-badge {
          background: rgba(255,193,60,0.28);
          border-color: rgba(255,193,60,0.7);
        }
        .cs-card:hover .cs-play-btn { transform: scale(1); }
        .cs-card:hover .cs-title { color: #ffc13c; }
        .cs-img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.4s ease;
        }
        .cs-overlay {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.3s ease; z-index: 2;
        }
        .cs-play-btn {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,193,60,0.92); color: #0d0d0f;
          padding: 11px 22px; border-radius: 50px;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700;
          letter-spacing: 0.03em; text-transform: uppercase;
          box-shadow: 0 4px 20px rgba(255,193,60,0.45);
          transform: scale(0.88); transition: transform 0.2s ease; white-space: nowrap;
        }
        .cs-badge {
          position: absolute; top: 10px; left: 10px;
          background: rgba(255,193,60,0.15); border: 1px solid rgba(255,193,60,0.4);
          color: #ffc13c; padding: 4px 9px; border-radius: 6px;
          font-family: 'DM Sans', sans-serif; font-size: 9px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.06em; z-index: 3;
          display: flex; align-items: center; gap: 4px; backdrop-filter: blur(6px);
          transition: background 0.3s ease, border-color 0.3s ease;
        }
        .cs-title {
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          line-height: 1.35; color: rgba(255,255,255,0.92); margin: 0;
          overflow: hidden; text-overflow: ellipsis;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          letter-spacing: 0.01em; transition: color 0.2s;
        }
      `}</style>

      {/* Header */}
      <div style={s.header}>
        <h2 style={s.sectionTitle}>
          <Sparkles size={22} color="#ffc13c" />
          Coming Soon
          <span style={{ color: "#ffc13c" }}>•</span>
          {type === "movie" ? "Movies" : "TV Shows"}
        </h2>
        <Link
          href={type === "movie" ? "/coming-soon/movies" : "/coming-soon/tv"}
        >
          <motion.span
            style={s.viewAll}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All →
          </motion.span>
        </Link>
      </div>

      {/* Grid — inline style so aspect-ratio on cells is guaranteed */}
      <motion.div
        style={s.grid}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {items.map((item) => (
          <div key={item.id} style={s.cardWrapper}>
            <Link
              href={type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`}
              style={s.cardLink}
            >
              <div className="cs-card" style={s.card}>
                {/* Poster */}
                <div style={{ ...s.posterArea, position: "relative" }}>
                  <Image
                    src={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : "/placeholder.png"
                    }
                    alt={item.title || item.name}
                    fill
                    sizes="(max-width: 768px) 160px, 250px"
                    className="cs-img"
                    style={{ objectFit: "cover" }}
                  />
                  <div style={s.vignette} />
                  <div className="cs-badge">
                    <Sparkles size={9} />
                    Coming Soon
                  </div>
                  <div className="cs-overlay">
                    <div className="cs-play-btn">
                      <span style={s.playIcon} />
                      Play
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div style={s.info}>
                  <h3 className="cs-title">{item.title || item.name}</h3>
                  <div style={s.meta}>
                    <div style={s.metaItem}>
                      <Calendar size={12} color="rgba(255,255,255,0.4)" />
                      <span style={s.metaText}>
                        {formatDate(item.release_date || item.first_air_date)}
                      </span>
                    </div>
                    {item.vote_average > 0 && (
                      <div style={s.metaItem}>
                        <Star size={12} fill="#ffc13c" color="#ffc13c" />
                        <span style={s.ratingText}>
                          {item.vote_average.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </motion.div>
    </>
  );
}

const s = {
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "300px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid rgba(255,193,60,0.1)",
    borderTop: "4px solid #ffc13c",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  sectionTitle: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "clamp(20px, 4vw, 26px)",
    fontWeight: "800",
    color: "rgba(255,255,255,0.92)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    letterSpacing: "-0.02em",
    margin: 0,
  },
  viewAll: {
    fontFamily: "'DM Sans', sans-serif",
    color: "#ffc13c",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    letterSpacing: "0.02em",
    opacity: 0.85,
    display: "inline-block",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "20px",
    marginBottom: "60px",
  },
  // This is the key fix — each grid cell has a hard 2:3 aspect ratio
  cardWrapper: {
    width: "100%",
    aspectRatio: "2 / 3",
  },
  cardLink: {
    display: "block",
    width: "100%",
    height: "100%",
    textDecoration: "none",
    color: "inherit",
  },
  card: {
    position: "relative",
    width: "100%",
    height: "100%",
    borderRadius: "12px",
    overflow: "hidden",
    background: "#0d0d0f",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 2px 8px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)",
    transition:
      "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease",
    isolation: "isolate",
  },
  posterArea: {
    position: "relative",
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
    background: "#111114",
  },
  vignette: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "55%",
    background:
      "linear-gradient(to top, rgba(13,13,15,0.92) 0%, rgba(13,13,15,0.3) 55%, transparent 100%)",
    pointerEvents: "none",
    zIndex: 1,
  },
  info: {
    padding: "10px 12px 12px",
    background: "#0d0d0f",
    borderTop: "1px solid rgba(255,255,255,0.045)",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flexShrink: 0,
  },
  meta: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  metaText: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "11px",
    fontWeight: "500",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: "0.02em",
  },
  ratingText: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "11px",
    fontWeight: "600",
    color: "#ffc13c",
    letterSpacing: "0.02em",
  },
  playIcon: {
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderWidth: "5px 0 5px 9px",
    borderColor: "transparent transparent transparent #0d0d0f",
    flexShrink: 0,
  },
};
