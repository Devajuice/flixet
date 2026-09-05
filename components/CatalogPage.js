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
  DollarSign,
  Clapperboard,
  Tv,
  ChevronDown,
  X,
  Search,
  Layers,
  RotateCcw,
} from "lucide-react";
import MediaCard from "@/components/MediaCard";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

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
  { value: "9", label: "9+ ★" },
  { value: "8", label: "8+ ★" },
  { value: "7", label: "7+ ★" },
  { value: "6", label: "6+ ★" },
];

const SORT_PRESETS = {
  movie: [
    { value: "popularity.desc", label: "Most Popular", icon: TrendingUp },
    { value: "vote_average.desc", label: "Top Rated", icon: Star },
    { value: "release_date.desc", label: "Newest First", icon: Calendar },
    { value: "revenue.desc", label: "Highest Grossing", icon: DollarSign },
    { value: "vote_count.desc", label: "Most Votes", icon: Star },
  ],
  tv: [
    { value: "popularity.desc", label: "Most Popular", icon: TrendingUp },
    { value: "vote_average.desc", label: "Top Rated", icon: Star },
    { value: "first_air_date.desc", label: "Newest First", icon: Calendar },
    { value: "vote_count.desc", label: "Most Votes", icon: Star },
  ],
};

function CatalogContent({
  type,
  genres,
  genreNames,
  genreMap,
  dateField,
  pluralLabel,
}) {
  const searchParams = useSearchParams();
  const genreParam = searchParams.get("genre");
  const sortParam = searchParams.get("sort");
  const sortOptions = SORT_PRESETS[type] || SORT_PRESETS.movie;
  const [sortBy, setSortBy] = useState(() =>
    sortParam && SORT_PRESETS[type]?.some((o) => o.value === sortParam)
      ? sortParam
      : "popularity.desc",
  );

  const [prevSortParam, setPrevSortParam] = useState(sortParam);
  if (sortParam !== prevSortParam) {
    setPrevSortParam(sortParam);
    if (sortParam && sortOptions.some((o) => o.value === sortParam)) {
      setSortBy(sortParam);
    }
  }

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [activeGenre, setActiveGenre] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [yearRange, setYearRange] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const observerTarget = useRef(null);

  const activeFilterCount = [
    activeGenre,
    yearRange,
    minRating,
    sortBy !== "popularity.desc",
  ].filter(Boolean).length;

  const genreId = activeGenre || (genreParam && genreMap[genreParam]);

  const fetchItems = useCallback(
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
        let url = `https://api.themoviedb.org/3/discover/${type}?api_key=${API_KEY}&page=${page}&sort_by=${sort}`;
        const gId = genre || (genreParam && genreMap[genreParam]);
        if (gId) url += `&with_genres=${gId}`;
        if (year) {
          const [start, end] = year.split("-");
          url += `&${dateField}.gte=${start}-01-01`;
          url += `&${dateField}.lte=${end || start}-12-31`;
        }
        if (rating) url += `&vote_average.gte=${rating}`;
        const res = await fetch(url);
        const data = await res.json();
        if (reset) {
          setItems(data.results || []);
          setTotalResults(data.total_results || 0);
        } else {
          setItems((prev) => {
            const ids = new Set(prev.map((m) => m.id));
            return [
              ...prev,
              ...(data.results || []).filter((m) => !ids.has(m.id)),
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
    [type, genreParam, sortBy, activeGenre, yearRange, minRating, dateField, genreMap],
  );

  useEffect(() => {
    setItems([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchItems(1, true, sortBy, activeGenre, yearRange, minRating);
  }, [fetchItems, sortBy, activeGenre, yearRange, minRating]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore)
          fetchItems(
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
    fetchItems,
    sortBy,
    activeGenre,
    yearRange,
    minRating,
  ]);

  const resetAll = () => {
    setSortBy("popularity.desc");
    setActiveGenre(null);
    setYearRange("");
    setMinRating("");
  };

  let baseTitle = genreParam
    ? genreParam
        .split("-")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" ")
    : activeGenre
      ? genreNames[activeGenre] || ""
      : "";

  if (!baseTitle) {
    if (sortBy === "vote_average.desc") baseTitle = "Top Rated";
    else if (sortBy === "popularity.desc") baseTitle = "Trending";
  }

  const h1 = baseTitle ? `${baseTitle} ${pluralLabel}` : pluralLabel;
  const Icon = type === "movie" ? Clapperboard : Tv;

  const activeSort = sortOptions.find((o) => o.value === sortBy);

  return (
    <div className="catalog-page">
      {/* Header */}
      <div className="catalog-header">
        <div className="catalog-eyebrow">
          <span className="catalog-eyebrow-bar" />
          <Icon size={14} color="var(--accent)" />
          <span>EXPLORE</span>
        </div>
        <div className="catalog-header-row">
          <h1>{h1}</h1>
          {totalResults > 0 && !loading && (
            <span className="catalog-count">
              {totalResults.toLocaleString()} titles
            </span>
          )}
        </div>
        <p className="catalog-subtitle">
          Browse the full {pluralLabel.toLowerCase()} catalog. Filter by genre,
          sort by popularity, rating, release year, and more.
        </p>

        {/* Genre rail */}
        <div className="catalog-genre-rail">
          <button
            onClick={() => setActiveGenre(null)}
            className={`catalog-genre-chip${!activeGenre ? " is-active" : ""}`}
          >
            <Layers size={13} /> All
          </button>
          {genres.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGenre((prev) => (prev === g.id ? null : g.id))}
              className={`catalog-genre-chip${activeGenre === g.id ? " is-active" : ""}`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="catalog-toolbar">
          <div className="catalog-sort">
            <button
              className="catalog-sort-trigger"
              onClick={() => setSortOpen((v) => !v)}
            >
              <TrendingUp size={15} color="var(--accent)" />
              <span>Sort</span>
              <strong>{activeSort ? activeSort.label : "Most Popular"}</strong>
              <ChevronDown
                size={15}
                className={`catalog-chevron${sortOpen ? " is-open" : ""}`}
              />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="catalog-sort-menu"
                >
                  {sortOptions.map((opt) => {
                    const SIcon = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSortBy(opt.value);
                          setSortOpen(false);
                        }}
                        className={`catalog-sort-item${sortBy === opt.value ? " is-active" : ""}`}
                      >
                        <SIcon size={15} />
                        <span>{opt.label}</span>
                        {sortBy === opt.value && (
                          <span className="catalog-sort-check">✓</span>
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setShowFilters(true)}
            className={`catalog-filters-btn${activeFilterCount > 0 ? " has-filters" : ""}`}
          >
            <SlidersHorizontal size={15} /> Filters
            {activeFilterCount > 0 && (
              <span className="catalog-filters-badge">{activeFilterCount}</span>
            )}
          </button>

          {(activeFilterCount > 0 || genreParam) && (
            <button onClick={resetAll} className="catalog-reset-btn">
              <RotateCcw size={14} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Filter drawer */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowFilters(false)}
              className="catalog-backdrop"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
              className="catalog-drawer"
            >
              <div className="catalog-drawer-head">
                <div>
                  <div className="catalog-drawer-eyebrow">REFINE RESULTS</div>
                  <h2>Filters</h2>
                </div>
                <button
                  className="catalog-drawer-close"
                  onClick={() => setShowFilters(false)}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="catalog-drawer-body">
                {/* Sort */}
                <div className="catalog-field">
                  <div className="catalog-field-label">
                    <TrendingUp size={14} color="var(--accent)" /> Sort By
                  </div>
                  <div className="catalog-sort-grid">
                    {sortOptions.map((opt) => {
                      const SIcon = opt.icon;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => setSortBy(opt.value)}
                          className={`catalog-chip-lg${sortBy === opt.value ? " is-active" : ""}`}
                        >
                          <SIcon size={14} /> {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Year */}
                <div className="catalog-field">
                  <div className="catalog-field-label">
                    <Calendar size={14} color="var(--accent)" /> Year
                  </div>
                  <div className="catalog-chips">
                    {YEAR_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setYearRange(opt.value)}
                        className={`catalog-chip-sm${yearRange === opt.value ? " is-active" : ""}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div className="catalog-field">
                  <div className="catalog-field-label">
                    <Star size={14} color="var(--accent)" /> Minimum Rating
                  </div>
                  <div className="catalog-chips">
                    {RATING_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setMinRating(opt.value)}
                        className={`catalog-chip-sm${minRating === opt.value ? " is-active" : ""}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="catalog-drawer-actions">
                <button onClick={resetAll} className="catalog-reset-btn-lg">
                  <RotateCcw size={14} /> Reset all
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="catalog-done-btn"
                >
                  Show results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Body */}
      {loading ? (
        <div className="catalog-skeleton-grid">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="skeleton catalog-skeleton-card" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="catalog-empty">
          <div className="catalog-empty-icon">
            <Search size={28} color="var(--accent)" />
          </div>
          <p className="catalog-empty-title">No {pluralLabel.toLowerCase()} found</p>
          <p className="catalog-empty-desc">
            Try widening your filters or resetting to see more results.
          </p>
          <button onClick={resetAll} className="catalog-empty-reset">
            <RotateCcw size={14} /> Reset filters
          </button>
        </div>
      ) : (
        <>
          <motion.div
            key={`${type}-${genreId || "all"}-${sortBy}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="catalog-grid"
          >
            {items.map((item, i) => (
              <MediaCard key={item.id} item={item} type={type} index={i} variant="tile" />
            ))}
          </motion.div>
          <div ref={observerTarget} className="catalog-observer">
            {loadingMore && (
              <div className="catalog-loading-more">
                <div className="catalog-spinner" />
                <p>Loading more…</p>
              </div>
            )}
            {!hasMore && items.length > 0 && (
              <div className="catalog-end">
                <Sparkles size={16} color="var(--accent)" />
                <p>You&apos;ve reached the end of the catalog</p>
              </div>
            )}
          </div>
        </>
      )}

      <style jsx global>{`
        .catalog-page {
          max-width: 1400px;
          margin: 0 auto;
          padding: 48px var(--container-padding) 80px;
        }
        .catalog-header {
          margin-bottom: 36px;
        }
        .catalog-eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          font-size: 12px;
          font-weight: var(--font-bold);
          color: var(--accent);
          margin-bottom: 16px;
        }
        .catalog-eyebrow-bar {
          width: 10px;
          height: 10px;
          border-radius: 3px;
          background: linear-gradient(135deg, #d97706, #fbbf24);
          box-shadow: 0 0 16px rgba(245, 158, 11, 0.6);
        }
        .catalog-header-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
        }
        .catalog-header h1 {
          font-size: clamp(32px, 5vw, 52px);
          font-weight: var(--font-extrabold);
          letter-spacing: -0.02em;
          line-height: 1;
          margin: 0;
          background: linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0.72) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .catalog-count {
          display: inline-flex;
          align-items: center;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          color: var(--accent);
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.25);
          white-space: nowrap;
        }
        .catalog-subtitle {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
          margin: 18px 0 26px;
          max-width: 640px;
        }
        .catalog-genre-rail {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding: 4px 2px 14px;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .catalog-genre-rail::-webkit-scrollbar {
          display: none;
        }
        .catalog-genre-chip {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          border-radius: 999px;
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border);
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .catalog-genre-chip:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--border-hover);
          color: #fff;
        }
        .catalog-genre-chip.is-active {
          color: #fff;
          background: linear-gradient(135deg, #d97706, #f59e0b);
          border-color: transparent;
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.35);
        }
        .catalog-toolbar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 6px;
          flex-wrap: wrap;
        }
        .catalog-sort {
          position: relative;
        }
        .catalog-sort-trigger {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 12px;
          font-size: var(--text-sm);
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          cursor: pointer;
          transition: all 0.2s;
        }
        .catalog-sort-trigger:hover {
          background: rgba(255, 255, 255, 0.09);
          border-color: var(--border-hover);
        }
        .catalog-sort-trigger strong {
          color: #fff;
          font-weight: var(--font-semibold);
        }
        .catalog-chevron {
          transition: transform 0.2s;
        }
        .catalog-chevron.is-open {
          transform: rotate(180deg);
        }
        .catalog-sort-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          min-width: 240px;
          z-index: 50;
          padding: 6px;
          background: rgba(20, 27, 43, 0.98);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border);
          border-radius: 14px;
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.55);
          overflow: hidden;
        }
        .catalog-sort-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 11px 12px;
          border-radius: 10px;
          font-size: var(--text-sm);
          color: var(--text-secondary);
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s;
        }
        .catalog-sort-item:hover {
          background: rgba(255, 255, 255, 0.06);
          color: #fff;
        }
        .catalog-sort-item.is-active {
          color: var(--accent);
          background: rgba(245, 158, 11, 0.1);
          font-weight: var(--font-semibold);
        }
        .catalog-sort-check {
          margin-left: auto;
          color: var(--accent);
        }
        .catalog-filters-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 12px;
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }
        .catalog-filters-btn:hover {
          background: rgba(255, 255, 255, 0.09);
          border-color: var(--border-hover);
        }
        .catalog-filters-btn.has-filters {
          color: #fff;
          background: linear-gradient(135deg, #d97706, #f59e0b);
          border-color: transparent;
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.3);
        }
        .catalog-filters-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: var(--font-bold);
          color: var(--accent);
          background: #fff;
        }
        .catalog-reset-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 12px;
          font-size: var(--text-sm);
          color: var(--text-tertiary);
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
        }
        .catalog-reset-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.06);
        }
        .catalog-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(6px);
          z-index: 9999;
        }
        .catalog-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(420px, 100%);
          z-index: 10000;
          display: flex;
          flex-direction: column;
          background: rgba(10, 10, 10, 0.98);
          backdrop-filter: blur(24px);
          border-left: 1px solid var(--border);
          box-shadow: -24px 0 80px rgba(0, 0, 0, 0.6);
        }
        .catalog-drawer-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 24px 18px;
          border-bottom: 1px solid var(--border);
        }
        .catalog-drawer-eyebrow {
          font-size: 11px;
          font-weight: var(--font-bold);
          letter-spacing: 0.14em;
          color: var(--accent);
          margin-bottom: 6px;
        }
        .catalog-drawer-head h2 {
          margin: 0;
          font-size: var(--text-xl);
          font-weight: var(--font-bold);
        }
        .catalog-drawer-close {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border);
          color: var(--text-tertiary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .catalog-drawer-close:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #fff;
        }
        .catalog-drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 22px 24px;
        }
        .catalog-field {
          margin-bottom: 26px;
        }
        .catalog-field-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: var(--text-xs);
          font-weight: var(--font-bold);
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 12px;
        }
        .catalog-sort-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .catalog-chip-lg {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 12px;
          border-radius: 12px;
          font-size: var(--text-sm);
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border);
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        .catalog-chip-lg:hover {
          background: rgba(255, 255, 255, 0.08);
        }
        .catalog-chip-lg.is-active {
          color: #fff;
          background: linear-gradient(135deg, #d97706, #f59e0b);
          border-color: transparent;
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.3);
        }
        .catalog-chips {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .catalog-chip-sm {
          padding: 8px 14px;
          border-radius: 999px;
          font-size: var(--text-sm);
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border);
          cursor: pointer;
          transition: all 0.2s;
        }
        .catalog-chip-sm:hover {
          background: rgba(255, 255, 255, 0.08);
        }
        .catalog-chip-sm.is-active {
          color: #fff;
          background: linear-gradient(135deg, #d97706, #f59e0b);
          border-color: transparent;
        }
        .catalog-drawer-actions {
          display: flex;
          gap: 12px;
          padding: 18px 24px 26px;
          border-top: 1px solid var(--border);
        }
        .catalog-reset-btn-lg {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px;
          border-radius: 12px;
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          cursor: pointer;
          transition: all 0.2s;
        }
        .catalog-reset-btn-lg:hover {
          background: rgba(255, 255, 255, 0.09);
        }
        .catalog-done-btn {
          flex: 1.4;
          padding: 13px;
          border-radius: 12px;
          font-size: var(--text-sm);
          font-weight: var(--font-bold);
          color: #fff;
          background: linear-gradient(135deg, #d97706, #f59e0b);
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(245, 158, 11, 0.35);
          transition: all 0.2s;
        }
        .catalog-done-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 28px rgba(245, 158, 11, 0.45);
        }
        .catalog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 16px;
          margin-bottom: 40px;
        }
        .catalog-skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 16px;
          margin-bottom: 40px;
        }
        .catalog-skeleton-card {
          width: 100%;
          border-radius: var(--radius-lg);
          aspect-ratio: 2/3;
        }
        .catalog-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 90px 20px;
        }
        .catalog-empty-icon {
          width: 72px;
          height: 72px;
          border-radius: 24px;
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          box-shadow: 0 0 40px rgba(245, 158, 11, 0.15);
        }
        .catalog-empty-title {
          font-size: var(--text-xl);
          font-weight: var(--font-bold);
          margin: 0 0 8px;
          color: #fff;
        }
        .catalog-empty-desc {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
          margin: 0 0 22px;
        }
        .catalog-empty-reset {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 12px;
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          color: #fff;
          background: linear-gradient(135deg, #d97706, #f59e0b);
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(245, 158, 11, 0.35);
        }
        .catalog-observer {
          min-height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 20px;
        }
        .catalog-loading-more {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .catalog-spinner {
          width: 28px;
          height: 28px;
          border: 3px solid rgba(245, 158, 11, 0.2);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.9s linear infinite;
        }
        .catalog-loading-more p {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
          margin: 0;
        }
        .catalog-end {
          text-align: center;
        }
        .catalog-end p {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
          margin: 6px 0 0;
        }
        @media (max-width: 768px) {
          .catalog-page {
            padding-top: 28px;
          }
          .catalog-grid,
          .catalog-skeleton-grid {
            gap: 12px;
          }
        }
        @media (max-width: 480px) {
          .catalog-grid,
          .catalog-skeleton-grid {
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}

export default function CatalogPage({
  type,
  genres,
  genreNames,
  genreMap = {},
  dateField,
  pluralLabel,
}) {
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
              border: "4px solid rgba(245, 158, 11, 0.2)",
              borderTopColor: "var(--accent)",
              borderRadius: "50%",
              animation: "spin 0.9s linear infinite",
            }}
          />
        </div>
      }
    >
      <CatalogContent
        type={type}
        genres={genres}
        genreNames={genreNames}
        genreMap={genreMap}
        dateField={dateField}
        pluralLabel={pluralLabel}
      />
    </Suspense>
  );
}
