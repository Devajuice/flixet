"use client";
import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const IMG = "https://image.tmdb.org/t/p";

const GENRE_MAP = {
  "action-adventure": 10759,
  comedy: 35,
  drama: 18,
  crime: 80,
  documentary: 99,
  "sci-fi-fantasy": 10765,
  reality: 10764,
  kids: 10762,
};
const GENRE_NAMES = {
  10759: "Action & Adventure",
  35: "Comedy",
  18: "Drama",
  80: "Crime",
  99: "Documentary",
  10765: "Sci-Fi & Fantasy",
  10764: "Reality",
  10762: "Kids",
};
const GENRES = [
  { id: 10759, name: "Action & Adventure" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10764, name: "Reality" },
  { id: 10762, name: "Kids" },
];
const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Top Rated" },
  { value: "first_air_date.desc", label: "Newest First" },
];

function TVCard({ show, index }) {
  const [hovered, setHovered] = useState(false);
  const img = show.poster_path ? `${IMG}/w342${show.poster_path}` : null;
  const title = show.name || show.title;
  return (
    <Link href={`/tv/${show.id}`}>
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(index * 0.03, 0.4), duration: 0.3 }}
        style={{
          position: "relative",
          borderRadius: 8,
          overflow: "hidden",
          background: "#1a1a1a",
          cursor: "pointer",
          aspectRatio: "2/3",
          boxShadow: hovered
            ? "0 20px 50px rgba(0,0,0,0.8)"
            : "0 4px 16px rgba(0,0,0,0.4)",
          transform: hovered ? "scale(1.04)" : "scale(1)",
          transition: "transform 0.22s ease, box-shadow 0.22s ease",
          zIndex: hovered ? 5 : 1,
        }}
      >
        {img ? (
          <img
            src={img}
            alt={title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            loading="lazy"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 12,
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.3)",
                textAlign: "center",
              }}
            >
              {title}
            </span>
          </div>
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 55%)",
            pointerEvents: "none",
          }}
        />
        {show.vote_average > 0 && (
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(8px)",
              padding: "3px 7px",
              borderRadius: 5,
              fontSize: 11,
              fontWeight: 700,
              color: "#f5c518",
            }}
          >
            ★ {show.vote_average.toFixed(1)}
          </div>
        )}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "10px 10px 12px",
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              marginBottom: 2,
            }}
          >
            {title}
          </p>
          {show.first_air_date && (
            <span
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.4)",
                fontWeight: 500,
              }}
            >
              {new Date(show.first_air_date).getFullYear()}
            </span>
          )}
        </div>
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(229,9,20,0.12)",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "rgba(229,9,20,0.9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Play size={20} fill="white" color="white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
}

function GenreRow({ genreId, genreName }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const rowRef = useRef(null);
  const scroll = (dir) =>
    rowRef.current?.scrollBy({ left: dir * 600, behavior: "smooth" });

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`,
    )
      .then((r) => r.json())
      .then((d) => {
        setItems(d.results || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [genreId]);

  return (
    <section style={{ marginBottom: 52 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>{genreName}</h2>
          <Link
            href={`/tv?genre=${genreName.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
            style={{
              fontSize: 12,
              color: "#e50914",
              fontWeight: 600,
              letterSpacing: "0.01em",
            }}
          >
            See all →
          </Link>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[ChevronLeft, ChevronRight].map((Icon, i) => (
            <button
              key={i}
              onClick={() => scroll(i ? 1 : -1)}
              aria-label={i ? "Scroll right" : "Scroll left"}
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
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>
      <div ref={rowRef} className="scroll-row">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="skeleton"
                style={{
                  width: 140,
                  height: 210,
                  borderRadius: 8,
                  flexShrink: 0,
                }}
                aria-hidden="true"
              />
            ))
          : items.map((item) => (
              <Link key={item.id} href={`/tv/${item.id}`}>
                <motion.div
                  whileHover={{ scale: 1.06 }}
                  style={{
                    width: 140,
                    height: 210,
                    borderRadius: 8,
                    overflow: "hidden",
                    flexShrink: 0,
                    background: "#1a1a1a",
                    cursor: "pointer",
                    position: "relative",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                  }}
                >
                  {item.poster_path ? (
                    <img
                      src={`${IMG}/w185${item.poster_path}`}
                      alt={item.name || item.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      loading="lazy"
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          color: "rgba(255,255,255,0.3)",
                          textAlign: "center",
                        }}
                      >
                        {item.name || item.title}
                      </span>
                    </div>
                  )}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 50%)",
                    }}
                  />
                  {item.vote_average > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        background: "rgba(0,0,0,0.75)",
                        padding: "2px 6px",
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#f5c518",
                      }}
                    >
                      ★ {item.vote_average.toFixed(1)}
                    </div>
                  )}
                  <p
                    style={{
                      position: "absolute",
                      bottom: 8,
                      left: 8,
                      right: 8,
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#fff",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.name || item.title}
                  </p>
                </motion.div>
              </Link>
            ))}
      </div>
    </section>
  );
}

function TVContent() {
  const searchParams = useSearchParams();
  const genreParam = searchParams.get("genre");
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [activeGenre, setActiveGenre] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const observerTarget = useRef(null);

  const fetchShows = useCallback(
    async (page, reset = false, sort = sortBy, genre = activeGenre) => {
      if (reset) setLoading(true);
      else setLoadingMore(true);
      try {
        let url = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&page=${page}&sort_by=${sort}`;
        const gId = genre || (genreParam && GENRE_MAP[genreParam]);
        if (gId) url += `&with_genres=${gId}`;
        const res = await fetch(url);
        const data = await res.json();
        if (reset) {
          setShows(data.results || []);
          setTotalResults(data.total_results || 0);
        } else {
          setShows((prev) => {
            const ids = new Set(prev.map((s) => s.id));
            return [
              ...prev,
              ...(data.results || []).filter((s) => !ids.has(s.id)),
            ];
          });
        }
        setCurrentPage(page);
        setHasMore(page < data.total_pages && page < 500);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [genreParam, sortBy, activeGenre],
  );

  useEffect(() => {
    setShows([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchShows(1, true, sortBy, activeGenre);
  }, [genreParam, sortBy, activeGenre]); // eslint-disable-line

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore)
          fetchShows(currentPage + 1, false, sortBy, activeGenre);
      },
      { threshold: 0.1 },
    );
    const t = observerTarget.current;
    if (t) observer.observe(t);
    return () => {
      if (t) observer.unobserve(t);
    };
  }, [
    hasMore,
    loading,
    loadingMore,
    currentPage,
    fetchShows,
    sortBy,
    activeGenre,
  ]);

  const showRows = !genreParam && !activeGenre && sortBy === "popularity.desc";

  return (
    <>
      <style jsx>{`
        .tv-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 16px;
          margin-bottom: 40px;
        }
        @media (max-width: 600px) {
          .tv-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }
        }
        @media (min-width: 1200px) {
          .tv-grid {
            grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
            gap: 20px;
          }
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 32,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 800,
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: "0.02em",
              lineHeight: 1,
            }}
          >
            {genreParam
              ? genreParam
                  .split("-")
                  .map((w) => w[0].toUpperCase() + w.slice(1))
                  .join(" ") + " TV Shows"
              : activeGenre
                ? (GENRE_NAMES[activeGenre] || "") + " TV Shows"
                : "TV Shows"}
          </h1>
          {totalResults > 0 && !loading && !showRows && (
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.4)",
                marginTop: 4,
              }}
            >
              {totalResults.toLocaleString()} titles
            </p>
          )}
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 18px",
            background: showFilters ? "#e50914" : "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 8,
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          <SlidersHorizontal size={16} aria-hidden="true" /> Filters
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden", marginBottom: 32 }}
          >
            <div
              style={{
                padding: 20,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 12,
                }}
              >
                Sort By
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 20,
                }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSortBy(opt.value);
                      setShowFilters(false);
                    }}
                    style={{
                      padding: "7px 14px",
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      background:
                        sortBy === opt.value
                          ? "#e50914"
                          : "rgba(255,255,255,0.06)",
                      border: `1px solid ${sortBy === opt.value ? "#e50914" : "rgba(255,255,255,0.1)"}`,
                      color: "#fff",
                      transition: "all 0.2s",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 12,
                }}
              >
                Genre
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {GENRES.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => {
                      setActiveGenre((prev) => (prev === g.id ? null : g.id));
                      setShowFilters(false);
                    }}
                    style={{
                      padding: "7px 14px",
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      background:
                        activeGenre === g.id
                          ? "#e50914"
                          : "rgba(255,255,255,0.06)",
                      border: `1px solid ${activeGenre === g.id ? "#e50914" : "rgba(255,255,255,0.1)"}`,
                      color: "#fff",
                      transition: "all 0.2s",
                    }}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showRows ? (
        GENRES.map((g) => (
          <GenreRow key={g.id} genreId={g.id} genreName={g.name} />
        ))
      ) : loading ? (
        <div
          className="tv-grid"
          role="status"
          aria-label="Loading TV shows"
          aria-busy="true"
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{ borderRadius: 8, aspectRatio: "2/3" }}
              aria-hidden="true"
            />
          ))}
        </div>
      ) : shows.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          <p style={{ fontSize: 18, fontWeight: 600 }}>No TV shows found</p>
          <button
            onClick={() => {
              setActiveGenre(null);
              setSortBy("popularity.desc");
            }}
            style={{
              marginTop: 16,
              padding: "10px 22px",
              background: "#e50914",
              border: "none",
              borderRadius: 8,
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
      ) : (
        <>
          <div className="tv-grid">
            {shows.map((s, i) => (
              <TVCard key={s.id} show={s} index={i} />
            ))}
          </div>
          <div
            ref={observerTarget}
            style={{
              minHeight: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
            }}
            aria-live="polite"
          >
            {loadingMore && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
                role="status"
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    border: "3px solid rgba(229,9,20,0.2)",
                    borderTopColor: "#e50914",
                    borderRadius: "50%",
                    animation: "spin 0.9s linear infinite",
                  }}
                  aria-hidden="true"
                />
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                  Loading more…
                </p>
              </div>
            )}
            {!hasMore && shows.length > 0 && (
              <div style={{ textAlign: "center" }} role="status">
                <Sparkles size={16} color="#e50914" />
                <p
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.3)",
                    marginTop: 6,
                  }}
                >
                  All {shows.length} TV shows loaded
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default function TVPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              border: "4px solid rgba(229,9,20,0.2)",
              borderTopColor: "#e50914",
              borderRadius: "50%",
              animation: "spin 0.9s linear infinite",
            }}
          />
        </div>
      }
    >
      <TVContent />
    </Suspense>
  );
}
