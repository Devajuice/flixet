"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Plus,
  Info,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import ContinueWatchingSection from "@/components/ContinueWatchingSection";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const IMG = "https://image.tmdb.org/t/p";

/* ── tiny helpers ─────────────────────────────────────────────────────────── */
function SkeletonCard({ wide }) {
  return (
    <div
      className="skeleton"
      style={{
        width: wide ? 280 : 150,
        height: wide ? 158 : 225,
        borderRadius: 10,
        flexShrink: 0,
      }}
      aria-hidden="true"
    />
  );
}

function MediaCard({ item, wide, type }) {
  const [hovered, setHovered] = useState(false);
  const slug = type || item.media_type || (item.title ? "movie" : "tv");
  const href = `/${slug === "movie" ? "movie" : "tv"}/${item.id}`;
  // poster cards: always use poster_path; wide (backdrop) cards: use backdrop
  const img = wide
    ? item.backdrop_path
      ? `${IMG}/w500${item.backdrop_path}`
      : item.poster_path
        ? `${IMG}/w342${item.poster_path}`
        : null
    : item.poster_path
      ? `${IMG}/w342${item.poster_path}`
      : null;
  const title = item.title || item.name;

  return (
    <Link
      href={href}
      style={{ flexShrink: 0, display: "block", width: wide ? 280 : 150 }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "100%",
          height: wide ? 158 : 225,
          borderRadius: 10,
          overflow: "hidden",
          position: "relative",
          background: "#1a1a1a",
          cursor: "pointer",
          boxShadow: hovered
            ? "0 16px 40px rgba(0,0,0,0.75)"
            : "0 4px 14px rgba(0,0,0,0.5)",
          transform: hovered ? "scale(1.05)" : "scale(1)",
          transition: "transform 0.22s ease, box-shadow 0.22s ease",
          zIndex: hovered ? 5 : 1,
          isolation: "isolate",
        }}
      >
        {img ? (
          <img
            src={img}
            alt={title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
            loading="lazy"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "#222",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 8px",
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.3)",
                textAlign: "center",
              }}
            >
              {title}
            </span>
          </div>
        )}
        {/* gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 55%)",
            pointerEvents: "none",
          }}
        />

        {/* rating badge */}
        {item.vote_average > 0 && (
          <div
            style={{
              position: "absolute",
              top: 7,
              left: 7,
              background: "rgba(0,0,0,0.72)",
              backdropFilter: "blur(6px)",
              padding: "2px 6px",
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 700,
              color: "#f5c518",
            }}
          >
            ★ {item.vote_average.toFixed(1)}
          </div>
        )}

        {/* title + play on hover */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "8px 10px 10px",
            opacity: hovered ? 1 : wide ? 0.8 : 0,
            transition: "opacity 0.22s ease",
          }}
        >
          <p
            style={{
              fontSize: wide ? 13 : 12,
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              margin: 0,
            }}
          >
            {title}
          </p>
        </div>

        {/* play circle */}
        {hovered && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(229,9,20,0.92)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 20px rgba(229,9,20,0.5)",
            }}
          >
            <Play size={16} fill="white" color="white" />
          </div>
        )}
      </div>
    </Link>
  );
}

function Row({ title, items, wide, loading, type }) {
  const ref = useRef(null);
  const scroll = (dir) =>
    ref.current?.scrollBy({ left: dir * 600, behavior: "smooth" });

  return (
    <section style={{ marginBottom: 52 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em" }}>
          {title}
        </h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              cursor: "pointer",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              cursor: "pointer",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      {/* paddingBottom gives hover-scale room; overflow visible lets cards pop above siblings */}
      <div
        ref={ref}
        className="scroll-row"
        style={{ paddingBottom: 16, paddingTop: 8 }}
      >
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} wide={wide} />
            ))
          : items.map((item) => (
              <MediaCard key={item.id} item={item} wide={wide} type={type} />
            ))}
      </div>
    </section>
  );
}

/* ── Hero banner ──────────────────────────────────────────────────────────── */
function HeroBanner({ items }) {
  const [idx, setIdx] = useState(0);
  const item = items[idx];

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 7000);
    return () => clearInterval(t);
  }, [items.length]);

  if (!item) return null;
  const backdrop = item.backdrop_path
    ? `${IMG}/original${item.backdrop_path}`
    : null;
  const title = item.title || item.name;
  const slug = item.media_type === "movie" ? "movie" : "tv";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "92vh",
        minHeight: 500,
        overflow: "hidden",
        marginBottom: 48,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{ position: "absolute", inset: 0 }}
        >
          {backdrop && (
            <img
              src={backdrop}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, #0a0a0a 0%, transparent 40%)",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          left: 0,
          right: 0,
          padding: "0 40px",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {item.vote_average > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 12,
                }}
              >
                <Star size={14} fill="#f5c518" color="#f5c518" />
                <span
                  style={{ fontSize: 13, fontWeight: 700, color: "#f5c518" }}
                >
                  {item.vote_average.toFixed(1)}
                </span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                  / 10
                </span>
              </div>
            )}

            <h1
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(42px, 6vw, 88px)",
                lineHeight: 1,
                letterSpacing: "0.02em",
                color: "#fff",
                marginBottom: 16,
                maxWidth: 700,
                textShadow: "0 4px 24px rgba(0,0,0,0.6)",
              }}
            >
              {title}
            </h1>

            {item.overview && (
              <p
                style={{
                  fontSize: 15,
                  color: "rgba(255,255,255,0.7)",
                  maxWidth: 520,
                  lineHeight: 1.7,
                  marginBottom: 28,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {item.overview}
              </p>
            )}

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href={`/${slug}/${item.id}`}>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "13px 28px",
                    background: "#e50914",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: "pointer",
                    letterSpacing: "0.01em",
                  }}
                >
                  <Play size={18} fill="white" aria-hidden="true" /> Watch Now
                </motion.button>
              </Link>
              <Link href={`/${slug}/${item.id}`}>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "13px 24px",
                    background: "rgba(255,255,255,0.15)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Info size={18} aria-hidden="true" /> More Info
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dot nav */}
        <div style={{ display: "flex", gap: 6, marginTop: 24 }}>
          {items.slice(0, 6).map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Banner ${i + 1}`}
              style={{
                width: i === idx ? 24 : 8,
                height: 4,
                borderRadius: 4,
                background: i === idx ? "#e50914" : "rgba(255,255,255,0.25)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function HomePage() {
  const [trending, setTrending] = useState([]);
  const [popularMovies, setPopMovies] = useState([]);
  const [popularTV, setPopTV] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [action, setAction] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetches = [
      fetch(
        `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`,
      ),
      fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`),
      fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}`),
      fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`),
      fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=28&sort_by=popularity.desc`,
      ),
    ];
    Promise.all(fetches)
      .then((rs) => Promise.all(rs.map((r) => r.json())))
      .then(([t, pm, ptv, tr, ac]) => {
        setTrending(t.results || []);
        setPopMovies(pm.results || []);
        setPopTV(ptv.results || []);
        setTopRated(tr.results || []);
        setAction(ac.results || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const heroItems = trending.filter((i) => i.backdrop_path).slice(0, 6);

  return (
    <div style={{ marginTop: -40 }}>
      {/* Hero */}
      {loading ? (
        <div
          className="skeleton"
          style={{
            width: "100%",
            height: "92vh",
            minHeight: 500,
            borderRadius: 0,
          }}
          aria-label="Loading featured content"
          role="status"
        />
      ) : (
        heroItems.length > 0 && <HeroBanner items={heroItems} />
      )}

      {/* Rows */}
      <div className="container">
        <Row title="🔥 Trending This Week" items={trending} loading={loading} />
        <ContinueWatchingSection />
        <Row
          title="🎬 Popular Movies"
          items={popularMovies}
          loading={loading}
          type="movie"
        />
        <Row
          title="📺 Popular TV Shows"
          items={popularTV}
          loading={loading}
          type="tv"
          wide
        />
        <Row
          title="⭐ Top Rated Movies"
          items={topRated}
          loading={loading}
          type="movie"
        />
        <Row
          title="💥 Action & Adventure"
          items={action}
          loading={loading}
          type="movie"
        />
      </div>
    </div>
  );
}
