"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Info,
  ChevronRight,
  TrendingUp,
  Star,
  Clock,
} from "lucide-react";
import MediaCard from "@/components/MediaCard";
import ScrollRow from "@/components/ScrollRow";
import ContinueWatchingSection from "@/components/ContinueWatchingSection";
import {
  SkeletonCard,
  SkeletonWide,
  SkeletonHero,
} from "@/components/Skeleton";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const IMG = "https://image.tmdb.org/t/p";

/* ── Quick genre pills ────────────────────────────────────────────── */
function GenreQuickLinks() {
  const genres = [
    { name: "Action", slug: "action", icon: "🔥" },
    { name: "Comedy", slug: "comedy", icon: "😂" },
    { name: "Horror", slug: "horror", icon: "👻" },
    { name: "Sci-Fi", slug: "sci-fi", icon: "🚀" },
    { name: "Romance", slug: "romance", icon: "💕" },
    { name: "Anime", slug: "", icon: "⛩️", href: "/anime" },
    { name: "Thriller", slug: "thriller", icon: "🔪" },
    { name: "Drama", slug: "drama", icon: "🎭" },
  ];

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 24 }}>
      {genres.map((g) => {
        const href = g.href || `/movies?genre=${g.slug}`;
        return (
          <Link key={g.name} href={href}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-full)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-medium)",
                color: "var(--text-secondary)",
                cursor: "pointer",
                textDecoration: "none",
                transition: "all var(--transition-base)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-border)";
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              <span style={{ fontSize: 14 }}>{g.icon}</span> {g.name}
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}

/* ── Hero banner ──────────────────────────────────────────────────── */
function HeroBanner({ items }) {
  const [idx, setIdx] = useState(0);
  const item = items[idx];

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 8000);
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
        height: "clamp(320px, 65vh, 700px)",
        overflow: "hidden",
      }}
    >
      {/* Background image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{ position: "absolute", inset: 0 }}
        >
          {backdrop && (
            <Image
              src={backdrop}
              alt=""
              fill
              sizes="100vw"
              priority
              style={{ objectFit: "cover" }}
            />
          )}
          {/* Left-to-right fade */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.5) 40%, transparent 70%)",
            }}
          />
          {/* Bottom fade */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "40%",
              background:
                "linear-gradient(to top, var(--bg) 0%, transparent 100%)",
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
          padding: "0 var(--container-padding)",
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5 }}
            style={{ maxWidth: 600 }}
          >
            {/* Meta badges */}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 16,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px 10px",
                  background: "rgba(229,9,20,0.15)",
                  border: "1px solid rgba(229,9,20,0.3)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-bold)",
                  color: "var(--accent)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {item.media_type === "movie" ? "Movie" : "TV Show"}
              </span>
              {item.vote_average > 0 && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "4px 10px",
                    background: "rgba(245,197,24,0.12)",
                    border: "1px solid rgba(245,197,24,0.25)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "var(--text-xs)",
                    fontWeight: "var(--font-bold)",
                    color: "var(--gold)",
                  }}
                >
                  <Star size={11} fill="currentColor" />{" "}
                  {item.vote_average.toFixed(1)}
                </span>
              )}
              {(item.release_date || item.first_air_date) && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "4px 10px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "var(--text-xs)",
                    fontWeight: "var(--font-medium)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <Clock size={11} />{" "}
                  {new Date(
                    item.release_date || item.first_air_date,
                  ).getFullYear()}
                </span>
              )}
            </div>

            <h1
              style={{
                fontSize: "clamp(36px, 5vw, 64px)",
                lineHeight: 1.05,
                fontWeight: "var(--font-extrabold)",
                letterSpacing: "-0.025em",
                color: "var(--text-primary)",
                marginBottom: 16,
                textShadow: "0 4px 24px rgba(0,0,0,0.5)",
              }}
            >
              {title}
            </h1>

            {item.overview && (
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--text-secondary)",
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
                  className="btn btn-primary"
                  style={{
                    padding: "clamp(10px, 2vw, 14px) clamp(20px, 4vw, 32px)",
                    fontSize: "clamp(var(--text-sm), 2.5vw, var(--text-base))",
                    fontWeight: "var(--font-bold)",
                  }}
                >
                  <Play size={18} fill="currentColor" /> Watch Now
                </motion.button>
              </Link>
              <Link href={`/${slug}/${item.id}`}>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "var(--space-2)",
                    padding: "clamp(10px, 2vw, 14px) clamp(16px, 3vw, 24px)",
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    fontSize: "clamp(var(--text-sm), 2.5vw, var(--text-base))",
                    fontWeight: "var(--font-bold)",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                  }}
                >
                  <Info size={18} /> More Info
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dot nav */}
        <div style={{ display: "flex", gap: 6, marginTop: 32 }}>
          {items.slice(0, 6).map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === idx ? 28 : 8,
                height: 4,
                borderRadius: 4,
                background:
                  i === idx ? "var(--accent)" : "rgba(255,255,255,0.2)",
                border: "none",
                cursor: "pointer",
                transition: "all var(--transition-base)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Section header ───────────────────────────────────────────────── */
function SectionHeader({ title, icon, href }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 20,
      }}
    >
      {icon}
      <h2
        style={{
          fontSize: "var(--text-xl)",
          fontWeight: "var(--font-bold)",
          color: "var(--text-primary)",
          letterSpacing: "-0.01em",
          margin: 0,
        }}
      >
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: "var(--text-sm)",
            color: "var(--text-tertiary)",
            textDecoration: "none",
          }}
        >
          View All <ChevronRight size={14} />
        </Link>
      )}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────── */
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
    <div>
      {/* Hero */}
      {loading ? (
        <SkeletonHero />
      ) : (
        heroItems.length > 0 && <HeroBanner items={heroItems} />
      )}

      {/* Content */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 var(--container-padding)",
        }}
      >
        {/* Genre quick links */}
        {!loading && <GenreQuickLinks />}

        {/* Continue watching */}
        <div style={{ marginTop: loading ? 0 : 40 }}>
          <ContinueWatchingSection />
        </div>

        {/* Trending */}
        <div style={{ marginTop: 40 }}>
          <SectionHeader
            title="Trending This Week"
            icon={<TrendingUp size={20} color="var(--accent)" />}
            href="/movies"
          />
          <ScrollRow>
            {loading
              ? Array.from({ length: 12 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : trending.map((item, i) => (
                  <MediaCard key={item.id} item={item} index={i} />
                ))}
          </ScrollRow>
        </div>

        {/* Popular Movies */}
        <div style={{ marginTop: 40 }}>
          <SectionHeader
            title="Popular Movies"
            icon={<Play size={20} color="var(--accent)" />}
            href="/movies"
          />
          <ScrollRow>
            {loading
              ? Array.from({ length: 12 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : popularMovies.map((item, i) => (
                  <MediaCard key={item.id} item={item} type="movie" index={i} />
                ))}
          </ScrollRow>
        </div>

        {/* Popular TV */}
        <div style={{ marginTop: 40 }}>
          <SectionHeader
            title="Popular TV Shows"
            icon={<Info size={20} color="var(--accent)" />}
            href="/tv"
          />
          <ScrollRow>
            {loading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <SkeletonWide key={i} />
                ))
              : popularTV.map((item, i) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    type="tv"
                    variant="backdrop"
                    index={i}
                  />
                ))}
          </ScrollRow>
        </div>

        {/* Top Rated */}
        <div style={{ marginTop: 40 }}>
          <SectionHeader
            title="Top Rated"
            icon={<Star size={20} color="var(--gold)" />}
            href="/movies"
          />
          <ScrollRow>
            {loading
              ? Array.from({ length: 12 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : topRated.map((item, i) => (
                  <MediaCard key={item.id} item={item} type="movie" index={i} />
                ))}
          </ScrollRow>
        </div>

        {/* Action */}
        <div style={{ marginTop: 40, marginBottom: 60 }}>
          <SectionHeader
            title="Action & Adventure"
            icon={<span style={{ fontSize: 20 }}>🔥</span>}
            href="/movies?genre=action"
          />
          <ScrollRow>
            {loading
              ? Array.from({ length: 12 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : action.map((item, i) => (
                  <MediaCard key={item.id} item={item} type="movie" index={i} />
                ))}
          </ScrollRow>
        </div>
      </div>
    </div>
  );
}
