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
  Compass,
  Clapperboard,
  Ghost,
  Rocket,
  Heart,
  Zap,
  Film,
  Drama,
  Flame,
  Sparkles,
} from "lucide-react";
import MediaCard from "@/components/MediaCard";
import ScrollRow from "@/components/ScrollRow";
import ContinueWatchingSection from "@/components/ContinueWatchingSection";
import { useHistory } from "@/context/HistoryContext";
import {
  SkeletonCard,
  SkeletonWide,
  SkeletonHero,
} from "@/components/Skeleton";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const IMG = "https://image.tmdb.org/t/p";

/* ── Browse by genre card grid ───────────────────────────────────── */
function GenreQuickLinks() {
  const genres = [
    { name: "Action", slug: "action", href: "/movies?genre=action", icon: <Zap size={22} /> },
    { name: "Comedy", slug: "comedy", href: "/movies?genre=comedy", icon: <Drama size={22} /> },
    { name: "Horror", slug: "horror", href: "/movies?genre=horror", icon: <Ghost size={22} /> },
    { name: "Sci-Fi", slug: "sci-fi", href: "/movies?genre=sci-fi", icon: <Rocket size={22} /> },
    { name: "Romance", slug: "romance", href: "/movies?genre=romance", icon: <Heart size={22} /> },
    { name: "Anime", slug: "", href: "/anime", icon: <Sparkles size={22} /> },
    { name: "Thriller", slug: "thriller", href: "/movies?genre=thriller", icon: <Clapperboard size={22} /> },
    { name: "Top Rated", slug: "top_rated", href: "/movies?sort=top_rated", icon: <Star size={22} /> },
  ];

  return (
    <section style={{ marginTop: 36 }}>
      <SectionHeader
        title="Browse by Genre"
        icon={<Compass size={20} color="var(--accent)" />}
        subtitle="Find something you'll love"
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: 12,
        }}
      >
        {genres.map((g, i) => (
          <Link key={g.name} href={g.href} style={{ textDecoration: "none" }}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              style={{
                position: "relative",
                overflow: "hidden",
                padding: "18px 16px",
                borderRadius: "var(--radius-xl)",
                background:
                  "linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                transition:
                  "border-color var(--transition-base), box-shadow var(--transition-base)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-border)";
                e.currentTarget.style.boxShadow =
                  "0 8px 28px rgba(59,130,246,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "var(--radius-lg)",
                  background: "var(--accent-subtle)",
                  border: "1px solid var(--accent-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent)",
                  marginBottom: 12,
                }}
              >
                {g.icon}
              </div>
              <span
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-semibold)",
                  color: "var(--text-primary)",
                }}
              >
                {g.name}
              </span>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ── Hero banner (auto-rotating, cinematic) ──────────────────────── */
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
        background: "var(--bg)",
      }}
    >
      {/* Background image + ambient glow */}
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
          {/* Deep cinematic fade from left */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(11,15,26,0.98) 0%, rgba(11,15,26,0.72) 35%, rgba(11,15,26,0.2) 75%)",
            }}
          />
          {/* Blue ambient glow bottom-right */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 80% 100%, rgba(59,130,246,0.18) 0%, transparent 55%)",
              pointerEvents: "none",
            }}
          />
          {/* Bottom fade into page bg */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "45%",
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
          bottom: "14%",
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
            style={{ maxWidth: 640 }}
          >
            {/* Eyebrow kicker */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 3,
                  borderRadius: 2,
                  background:
                    "linear-gradient(90deg, #2563eb, #60a5fa)",
                  boxShadow: "0 0 12px rgba(59,130,246,0.5)",
                }}
              />
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-bold)",
                  color: "var(--accent)",
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                }}
              >
                Featured
              </span>
            </div>

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
                  background: "rgba(59, 130, 246, 0.15)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  borderRadius: "var(--radius-full)",
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
                    borderRadius: "var(--radius-full)",
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
                    borderRadius: "var(--radius-full)",
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
                fontSize: "clamp(38px, 5.5vw, 68px)",
                lineHeight: 1.02,
                fontWeight: "var(--font-extrabold)",
                letterSpacing: "-0.03em",
                color: "var(--text-primary)",
                marginBottom: 16,
                textShadow: "0 6px 32px rgba(0,0,0,0.55)",
              }}
            >
              {title}
            </h1>

            {item.overview && (
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--text-secondary)",
                  lineHeight: 1.75,
                  marginBottom: 28,
                  maxWidth: 560,
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
                    padding: "clamp(10px, 2vw, 14px) clamp(22px, 4vw, 34px)",
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
                    background: "rgba(255,255,255,0.06)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    fontSize: "clamp(var(--text-sm), 2.5vw, var(--text-base))",
                    fontWeight: "var(--font-bold)",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                    transition: "all var(--transition-base)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent-border)";
                    e.currentTarget.style.boxShadow =
                      "0 0 20px rgba(59, 130, 246, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <Info size={18} /> More Info
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dot nav */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 32,
            alignItems: "center",
          }}
        >
          {items.slice(0, 6).map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === idx ? 30 : 10,
                height: 4,
                borderRadius: 4,
                background:
                  i === idx
                    ? "linear-gradient(90deg, #2563eb, #60a5fa)"
                    : "rgba(255,255,255,0.18)",
                border: "none",
                cursor: "pointer",
                transition: "all var(--transition-base)",
                boxShadow:
                  i === idx ? "0 0 12px rgba(59, 130, 246, 0.4)" : "none",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Section header with blue accent bar ─────────────────────────── */
function SectionHeader({ title, icon, href, subtitle }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
      }}
    >
      {/* Blue accent bar */}
      <span
        style={{
          width: 4,
          height: 22,
          borderRadius: 2,
          background: "linear-gradient(180deg, #2563eb, #60a5fa)",
          boxShadow: "0 0 12px rgba(59,130,246,0.4)",
          flexShrink: 0,
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        {icon}
        <div style={{ minWidth: 0 }}>
          <h2
            style={{
              fontSize: "var(--text-xl)",
              fontWeight: "var(--font-bold)",
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--text-tertiary)",
                margin: "2px 0 0",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {href && (
        <Link
          href={href}
          style={{
            marginLeft: "auto",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "6px 14px",
            fontSize: "var(--text-xs)",
            fontWeight: "var(--font-semibold)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-full)",
            textDecoration: "none",
            background: "rgba(255,255,255,0.03)",
            transition:
              "all var(--transition-base), background var(--transition-base)",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent-border)";
            e.currentTarget.style.color = "var(--accent)";
            e.currentTarget.style.background = "var(--accent-subtle)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--text-secondary)";
            e.currentTarget.style.background = "rgba(255,255,255,0.03)";
          }}
        >
          View All <ChevronRight size={14} />
        </Link>
      )}
    </div>
  );
}

/* ── Featured spotlight (two large editorial cards) ─────────────── */
function SpotlightSection({ items, loading }) {
  const top = (items || []).slice(0, 2);
  if (!loading && top.length < 2) return null;

  return (
    <section style={{ marginTop: 44 }}>
      <SectionHeader
        title="Editor's Spotlight"
        icon={<Flame size={20} color="var(--accent)" />}
        subtitle="Hand-picked standouts"
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {loading
          ? Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="skeleton"
                style={{ height: 200, borderRadius: "var(--radius-xl)" }}
              />
            ))
          : top.map((item, i) => {
              const isMovie = item.media_type === "movie" || item.title ? true : false;
              const slug = isMovie ? "movie" : "tv";
              const img = item.backdrop_path || item.poster_path;
              const title = item.title || item.name;
              return (
                <Link
                  key={item.id}
                  href={`/${slug}/${item.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.35 }}
                    whileHover={{ y: -4 }}
                    style={{
                      position: "relative",
                      height: 220,
                      borderRadius: "var(--radius-xl)",
                      overflow: "hidden",
                      cursor: "pointer",
                      border: "1px solid var(--border)",
                      boxShadow: "var(--shadow-lg)",
                      transition:
                        "border-color var(--transition-base), box-shadow var(--transition-base)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent-border)";
                      e.currentTarget.style.boxShadow =
                        "0 16px 48px rgba(59,130,246,0.18)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                    }}
                  >
                    {img && (
                      <Image
                        src={`${IMG}/w780${img}`}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: "cover", display: "block" }}
                      />
                    )}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(11,15,26,0.95) 0%, rgba(11,15,26,0.3) 50%, transparent 75%)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: 20,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--font-bold)",
                          color: "var(--accent)",
                          marginBottom: 8,
                        }}
                      >
                        <Sparkles size={12} /> #{i + 1} Spotlight
                      </span>
                      <h3
                        style={{
                          fontSize: "var(--text-lg)",
                          fontWeight: "var(--font-extrabold)",
                          color: "var(--text-primary)",
                          margin: 0,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {title}
                      </h3>
                      {item.vote_average > 0 && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            marginTop: 6,
                            fontSize: "var(--text-xs)",
                            fontWeight: "var(--font-semibold)",
                            color: "var(--gold)",
                          }}
                        >
                          <Star size={12} fill="currentColor" />{" "}
                          {item.vote_average.toFixed(1)} · Trending
                        </span>
                      )}
                    </div>
                  </motion.div>
                </Link>
              );
            })}
      </div>
    </section>
  );
}

/* ── Page ─────────────────────────────────────────────────────────── */
export default function HomePage() {
  const { history } = useHistory();
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
        {/* Continue watching */}
        <div style={{ marginTop: 36 }}>
          <ContinueWatchingSection />
        </div>

        {/* Browse by genre */}
        {!loading && <GenreQuickLinks />}

        {/* Recently viewed */}
        {history.length > 0 && (
          <div style={{ marginTop: 44 }}>
            <SectionHeader
              title="Recently Viewed"
              icon={<Clock size={20} color="var(--accent)" />}
            />
            <ScrollRow>
              {history.map((item, i) => (
                <MediaCard
                  key={`${item.type}-${item.id}`}
                  item={item}
                  type={item.type}
                  index={i}
                />
              ))}
            </ScrollRow>
          </div>
        )}

        {/* Featured spotlight */}
        <div style={{ marginTop: 44 }}>
          <SpotlightSection items={topRated} loading={loading} />
        </div>

        {/* Trending */}
        <div style={{ marginTop: 44 }}>
          <ScrollRow
            title="Trending This Week"
            icon={<TrendingUp size={20} color="var(--accent)" />}
            href="/movies"
          >
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
        <div style={{ marginTop: 44 }}>
          <ScrollRow
            title="Popular Movies"
            icon={<Play size={20} color="var(--accent)" />}
            href="/movies"
          >
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
        <div style={{ marginTop: 44 }}>
          <ScrollRow
            title="Popular TV Shows"
            icon={<Film size={20} color="var(--accent)" />}
            href="/tv"
          >
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
        <div style={{ marginTop: 44 }}>
          <ScrollRow
            title="Top Rated"
            icon={<Star size={20} color="var(--gold)" />}
            href="/movies"
          >
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
        <div style={{ marginTop: 44, marginBottom: 60 }}>
          <ScrollRow
            title="Action & Adventure"
            icon={<Clapperboard size={20} color="var(--accent)" />}
            href="/movies?genre=action"
          >
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
