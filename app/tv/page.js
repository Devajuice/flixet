"use client";
import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Star,
  Calendar,
  X,
} from "lucide-react";
import MediaCard from "@/components/MediaCard";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const GENRE_MAP = {
  action: 10759,
  comedy: 35,
  drama: 18,
  horror: 9648,
  "sci-fi": 10765,
  thriller: 9648,
  romance: 10749,
  animation: 16,
};
const GENRES = [
  { id: 10759, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 9648, name: "Mystery" },
  { id: 10765, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
  { id: 10749, name: "Romance" },
  { id: 16, name: "Animation" },
];
const GENRE_NAMES = {
  10759: "Action",
  35: "Comedy",
  18: "Drama",
  9648: "Mystery",
  10765: "Sci-Fi",
  53: "Thriller",
  10749: "Romance",
  16: "Animation",
};
const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular", icon: TrendingUp },
  { value: "vote_average.desc", label: "Top Rated", icon: Star },
  { value: "first_air_date.desc", label: "Newest First", icon: Calendar },
  { value: "vote_count.desc", label: "Most Votes", icon: Star },
];
const YEAR_OPTIONS = [
  { value: "", label: "All Years" },
  { value: "2026", label: "2026" },
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
  { value: "2020-2023", label: "2020s" },
  { value: "2010-2019", label: "2010s" },
  { value: "2000-2009", label: "2000s" },
  { value: "1990-1999", label: "1990s" },
];
const RATING_OPTIONS = [
  { value: "", label: "Any Rating" },
  { value: "9", label: "9+ ⭐" },
  { value: "8", label: "8+ ⭐" },
  { value: "7", label: "7+ ⭐" },
  { value: "6", label: "6+ ⭐" },
];

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
  const [yearRange, setYearRange] = useState("");
  const [minRating, setMinRating] = useState("");

  const activeFilterCount = [
    activeGenre,
    yearRange,
    minRating,
    sortBy !== "popularity.desc",
  ].filter(Boolean).length;

  const fetchShows = useCallback(
    async (
      page,
      reset = false,
      sort = sortBy,
      genre = activeGenre,
      year = yearRange,
      rating = minRating,
    ) => {
      if (reset) setLoading(true);
      else setLoadingMore(true);
      try {
        let url = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&page=${page}&sort_by=${sort}`;
        const gId = genre || (genreParam && GENRE_MAP[genreParam]);
        if (gId) url += `&with_genres=${gId}`;
        if (year) {
          const [start, end] = year.split("-");
          url += `&first_air_date.gte=${start}-01-01`;
          url += `&first_air_date.lte=${end || start}-12-31`;
        }
        if (rating) url += `&vote_average.gte=${rating}`;
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
    [genreParam, sortBy, activeGenre, yearRange, minRating],
  );

  useEffect(() => {
    setShows([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchShows(1, true, sortBy, activeGenre, yearRange, minRating);
  }, [genreParam, sortBy, activeGenre, yearRange, minRating]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore)
          fetchShows(
            currentPage + 1,
            false,
            sortBy,
            activeGenre,
            yearRange,
            minRating,
          );
      },
      { threshold: 0.1 },
    );
    const t = document.getElementById("tv-observer");
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
    yearRange,
    minRating,
  ]);

  return (
    <div
      style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: "0 var(--container-padding)",
      }}
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
          {genreParam
            ? genreParam
                .split("-")
                .map((w) => w[0].toUpperCase() + w.slice(1))
                .join(" ") + " TV Shows"
            : activeGenre
              ? GENRES.find((g) => g.id === activeGenre)?.name + " TV Shows"
              : "TV Shows"}
        </h1>
        {totalResults > 0 && !loading && (
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--text-tertiary)",
              marginTop: 4,
            }}
          >
            {totalResults.toLocaleString()} titles
          </p>
        )}
      </div>

      {/* Filter bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 24,
        }}
      >
        <button
          onClick={() => setShowFilters(true)}
          className="btn btn-secondary"
          style={{
            background:
              showFilters || activeFilterCount > 0
                ? "var(--accent)"
                : "rgba(255,255,255,0.08)",
            position: "relative",
          }}
        >
          <SlidersHorizontal size={16} /> Filters
          {activeFilterCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: -6,
                right: -6,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "#fff",
                color: "var(--accent)",
                fontSize: 10,
                fontWeight: "var(--font-bold)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter modal */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowFilters(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(8px)",
                zIndex: 9999,
              }}
            />
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10000,
                pointerEvents: "none",
                padding: 16,
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="filter-modal"
                style={{
                  width: "min(520px, 100%)",
                  maxHeight: "calc(100vh - 32px)",
                  overflowY: "auto",
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-xl)",
                  padding: "clamp(16px, 4vw, 32px)",
                  boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
                  pointerEvents: "auto",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 28,
                  }}
                >
                  <h2
                    style={{
                      fontSize: "var(--text-xl)",
                      fontWeight: "var(--font-bold)",
                      margin: 0,
                    }}
                  >
                    Filters
                  </h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid var(--border)",
                      color: "var(--text-tertiary)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.06)";
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Sort By */}
                <div style={{ marginBottom: 24 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 10,
                    }}
                  >
                    <TrendingUp size={14} color="var(--accent)" />
                    <p
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-bold)",
                        color: "var(--text-tertiary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        margin: 0,
                      }}
                    >
                      Sort By
                    </p>
                  </div>
                  <div
                    className="filter-sort-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(140px, 1fr))",
                      gap: 8,
                    }}
                  >
                    {SORT_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => setSortBy(opt.value)}
                          className="btn"
                          style={{
                            padding: "10px 14px",
                            fontSize: "var(--text-sm)",
                            background:
                              sortBy === opt.value
                                ? "var(--accent)"
                                : "rgba(255,255,255,0.04)",
                            border: `1px solid ${sortBy === opt.value ? "var(--accent)" : "var(--border)"}`,
                            color:
                              sortBy === opt.value
                                ? "#fff"
                                : "var(--text-secondary)",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            justifyContent: "flex-start",
                            transition: "all 0.2s",
                          }}
                        >
                          <Icon size={14} /> {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Genre */}
                <div style={{ marginBottom: 24 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 10,
                    }}
                  >
                    <Sparkles size={14} color="var(--accent)" />
                    <p
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-bold)",
                        color: "var(--text-tertiary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        margin: 0,
                      }}
                    >
                      Genre
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <button
                      onClick={() => setActiveGenre(null)}
                      className="btn"
                      style={{
                        padding: "7px 12px",
                        fontSize: "var(--text-sm)",
                        background: !activeGenre
                          ? "var(--accent)"
                          : "rgba(255,255,255,0.04)",
                        border: `1px solid ${!activeGenre ? "var(--accent)" : "var(--border)"}`,
                        color: !activeGenre ? "#fff" : "var(--text-secondary)",
                        transition: "all 0.2s",
                      }}
                    >
                      All
                    </button>
                    {GENRES.map((g) => (
                      <button
                        key={g.id}
                        onClick={() =>
                          setActiveGenre((prev) =>
                            prev === g.id ? null : g.id,
                          )
                        }
                        className="btn"
                        style={{
                          padding: "7px 12px",
                          fontSize: "var(--text-sm)",
                          background:
                            activeGenre === g.id
                              ? "var(--accent)"
                              : "rgba(255,255,255,0.04)",
                          border: `1px solid ${activeGenre === g.id ? "var(--accent)" : "var(--border)"}`,
                          color:
                            activeGenre === g.id
                              ? "#fff"
                              : "var(--text-secondary)",
                          transition: "all 0.2s",
                        }}
                      >
                        {g.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Year */}
                <div style={{ marginBottom: 24 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 10,
                    }}
                  >
                    <Calendar size={14} color="var(--accent)" />
                    <p
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-bold)",
                        color: "var(--text-tertiary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        margin: 0,
                      }}
                    >
                      Year
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {YEAR_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setYearRange(opt.value)}
                        className="btn"
                        style={{
                          padding: "7px 12px",
                          fontSize: "var(--text-sm)",
                          background:
                            yearRange === opt.value
                              ? "var(--accent)"
                              : "rgba(255,255,255,0.04)",
                          border: `1px solid ${yearRange === opt.value ? "var(--accent)" : "var(--border)"}`,
                          color:
                            yearRange === opt.value
                              ? "#fff"
                              : "var(--text-secondary)",
                          transition: "all 0.2s",
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div style={{ marginBottom: 28 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 10,
                    }}
                  >
                    <Star size={14} color="var(--accent)" />
                    <p
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-bold)",
                        color: "var(--text-tertiary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        margin: 0,
                      }}
                    >
                      Min Rating
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {RATING_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setMinRating(opt.value)}
                        className="btn"
                        style={{
                          padding: "7px 12px",
                          fontSize: "var(--text-sm)",
                          background:
                            minRating === opt.value
                              ? "var(--accent)"
                              : "rgba(255,255,255,0.04)",
                          border: `1px solid ${minRating === opt.value ? "var(--accent)" : "var(--border)"}`,
                          color:
                            minRating === opt.value
                              ? "#fff"
                              : "var(--text-secondary)",
                          transition: "all 0.2s",
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: 20,
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <button
                    onClick={() => {
                      setSortBy("popularity.desc");
                      setActiveGenre(null);
                      setYearRange("");
                      setMinRating("");
                    }}
                    className="btn"
                    style={{
                      padding: "9px 18px",
                      fontSize: "var(--text-sm)",
                      background: "transparent",
                      border: "1px solid var(--border)",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="btn btn-primary"
                    style={{ padding: "9px 24px", fontSize: "var(--text-sm)" }}
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 16,
            marginBottom: 40,
          }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{ borderRadius: "var(--radius-lg)", aspectRatio: "2/3" }}
            />
          ))}
        </div>
      ) : shows.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            color: "var(--text-tertiary)",
          }}
        >
          <p
            style={{
              fontSize: "var(--text-xl)",
              fontWeight: "var(--font-semibold)",
              marginBottom: 16,
            }}
          >
            No TV shows found
          </p>
          <button
            onClick={() => {
              setActiveGenre(null);
              setSortBy("popularity.desc");
              setYearRange("");
              setMinRating("");
            }}
            className="btn btn-primary"
          >
            Reset
          </button>
        </div>
      ) : (
        <>
          <div className="tv-grid">
            {shows.map((s, i) => (
              <MediaCard key={s.id} item={s} type="tv" index={i} />
            ))}
          </div>
          <div
            id="tv-observer"
            style={{
              minHeight: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            {loadingMore && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    border: "3px solid rgba(229,9,20,0.2)",
                    borderTopColor: "var(--accent)",
                    borderRadius: "50%",
                    animation: "spin 0.9s linear infinite",
                  }}
                />
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--text-tertiary)",
                  }}
                >
                  Loading more…
                </p>
              </div>
            )}
            {!hasMore && shows.length > 0 && (
              <div style={{ textAlign: "center" }}>
                <Sparkles size={16} color="var(--accent)" />
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--text-tertiary)",
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

      <style jsx global>{`
        .tv-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 16px;
          margin-bottom: 40px;
          justify-items: center;
        }
        @media (max-width: 768px) {
          .tv-grid {
            gap: 12px;
          }
        }
        @media (max-width: 480px) {
          .tv-grid {
            gap: 10px;
          }
          .filter-modal {
            max-height: 90vh !important;
          }
          .filter-sort-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
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
              borderTopColor: "var(--accent)",
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
