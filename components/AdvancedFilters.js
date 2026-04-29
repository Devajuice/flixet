"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // ✅ Added
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";

export default function AdvancedFilters({
  type = "movie",
  onFilterChange,
  initialFilters = {},
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [mounted, setMounted] = useState(false); // ✅ Added
  const [filters, setFilters] = useState({
    sort_by: "popularity.desc",
    with_genres: "",
    ...initialFilters,
  });

  // ✅ Added: Prevent SSR issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const sortOptions = [
    { value: "popularity.desc", label: "Most Popular" },
    { value: "popularity.asc", label: "Least Popular" },
    { value: "vote_average.desc", label: "Highest Rated" },
    { value: "vote_average.asc", label: "Lowest Rated" },
    { value: "primary_release_date.desc", label: "Newest First" },
    { value: "primary_release_date.asc", label: "Oldest First" },
    { value: "title.asc", label: "A-Z" },
    { value: "title.desc", label: "Z-A" },
  ];

  const genres =
    type === "movie"
      ? [
          { id: 28, name: "Action" },
          { id: 12, name: "Adventure" },
          { id: 16, name: "Animation" },
          { id: 35, name: "Comedy" },
          { id: 80, name: "Crime" },
          { id: 99, name: "Documentary" },
          { id: 18, name: "Drama" },
          { id: 10751, name: "Family" },
          { id: 14, name: "Fantasy" },
          { id: 36, name: "History" },
          { id: 27, name: "Horror" },
          { id: 10402, name: "Music" },
          { id: 9648, name: "Mystery" },
          { id: 10749, name: "Romance" },
          { id: 878, name: "Science Fiction" },
          { id: 10770, name: "TV Movie" },
          { id: 53, name: "Thriller" },
          { id: 10752, name: "War" },
          { id: 37, name: "Western" },
        ]
      : [
          { id: 10759, name: "Action & Adventure" },
          { id: 16, name: "Animation" },
          { id: 35, name: "Comedy" },
          { id: 80, name: "Crime" },
          { id: 99, name: "Documentary" },
          { id: 18, name: "Drama" },
          { id: 10751, name: "Family" },
          { id: 10762, name: "Kids" },
          { id: 9648, name: "Mystery" },
          { id: 10763, name: "News" },
          { id: 10764, name: "Reality" },
          { id: 10765, name: "Sci-Fi & Fantasy" },
          { id: 10766, name: "Soap" },
          { id: 10767, name: "Talk" },
          { id: 10768, name: "War & Politics" },
          { id: 37, name: "Western" },
        ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== ""),
    );
    onFilterChange(cleanFilters);
    setShowFilters(false);
  };

  const resetFilters = () => {
    const defaultFilters = {
      sort_by: "popularity.desc",
      with_genres: "",
    };
    setFilters(defaultFilters);
    onFilterChange({ sort_by: "popularity.desc" });
  };

  const activeFilterCount = () => {
    let count = 0;

    if (filters.with_genres) {
      const genreCount = filters.with_genres.split(",").filter(Boolean).length;
      count += genreCount;
    }

    if (filters.sort_by && filters.sort_by !== "popularity.desc") {
      count += 1;
    }

    return count;
  };

  // ✅ Modal content extracted
  const modalContent = (
    <AnimatePresence>
      {showFilters && (
        <>
          <style jsx global>{`
            .filter-modal {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.88);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 99998;
              padding: 20px;
              backdrop-filter: blur(10px);
              overflow-y: auto;
            }

            .filter-content {
              background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
              border-radius: 16px;
              width: 520px;
              max-width: 520px;
              min-width: 520px;
              max-height: 85vh;
              overflow-y: auto;
              padding: 30px;
              border: 1px solid rgba(229, 9, 20, 0.3);
              box-shadow: 0 25px 70px rgba(0, 0, 0, 0.9);
              position: relative;
              z-index: 99999;
            }

            .filter-content::-webkit-scrollbar {
              width: 8px;
            }

            .filter-content::-webkit-scrollbar-track {
              background: rgba(0, 0, 0, 0.3);
              border-radius: 4px;
            }

            .filter-content::-webkit-scrollbar-thumb {
              background: #e50914;
              border-radius: 4px;
            }

            .filter-content::-webkit-scrollbar-thumb:hover {
              background: #ff4458;
            }

            .filter-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 28px;
              padding-bottom: 18px;
              border-bottom: 1px solid rgba(229, 9, 20, 0.2);
            }

            .filter-title {
              font-size: 24px;
              font-weight: 800;
              background: linear-gradient(135deg, #ffffff 0%, #e50914 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }

            .close-button {
              background: rgba(229, 9, 20, 0.12);
              border: 1px solid rgba(229, 9, 20, 0.3);
              color: var(--text-secondary);
              cursor: pointer;
              padding: 8px;
              border-radius: 50%;
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 36px;
              height: 36px;
            }

            .close-button:hover {
              background: rgba(229, 9, 20, 0.25);
              color: var(--accent);
              transform: rotate(90deg);
            }

            .filter-section {
              margin-bottom: 24px;
            }

            .filter-label {
              font-size: 16px;
              font-weight: 700;
              color: var(--text-primary);
              margin-bottom: 12px;
              display: block;
            }

            .filter-select {
              width: 100%;
              padding: 12px 16px;
              background: rgba(15, 15, 15, 0.7);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 10px;
              color: var(--text-primary);
              font-size: 14px;
              transition: all 0.3s ease;
              cursor: pointer;
            }

            .filter-select:focus {
              outline: none;
              border-color: var(--accent);
              background: rgba(15, 15, 15, 0.9);
            }

            .filter-select:hover {
              border-color: rgba(229, 9, 20, 0.3);
            }

            .filter-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 8px;
            }

            .genre-chip {
              padding: 9px 12px;
              background: rgba(15, 15, 15, 0.7);
              border: 2px solid rgba(255, 255, 255, 0.1);
              border-radius: 20px;
              text-align: center;
              cursor: pointer;
              transition: all 0.3s ease;
              font-size: 13px;
              font-weight: 500;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .genre-chip:hover {
              border-color: var(--accent);
              background: rgba(229, 9, 20, 0.15);
              transform: translateY(-2px);
            }

            .genre-chip.active {
              background: linear-gradient(135deg, #e50914 0%, #ff4458 100%);
              border-color: transparent;
              color: white;
              font-weight: 700;
              box-shadow: 0 4px 12px rgba(229, 9, 20, 0.4);
            }

            .filter-actions {
              display: flex;
              gap: 10px;
              margin-top: 26px;
              padding-top: 22px;
              border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .btn-apply {
              flex: 1;
              padding: 13px 24px;
              background: linear-gradient(135deg, #e50914 0%, #ff4458 100%);
              color: white;
              border: none;
              border-radius: 10px;
              font-size: 15px;
              font-weight: 700;
              cursor: pointer;
              transition: all 0.3s ease;
              box-shadow: 0 4px 15px rgba(229, 9, 20, 0.3);
            }

            .btn-apply:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(229, 9, 20, 0.5);
            }

            .btn-reset {
              flex: 1;
              padding: 13px 24px;
              background: transparent;
              color: var(--text-secondary);
              border: 2px solid rgba(255, 255, 255, 0.2);
              border-radius: 10px;
              font-size: 15px;
              font-weight: 700;
              cursor: pointer;
              transition: all 0.3s ease;
            }

            .btn-reset:hover {
              border-color: var(--accent);
              color: var(--accent);
              background: rgba(229, 9, 20, 0.05);
            }

            @media (min-width: 769px) {
              .filter-modal {
                padding: 40px;
              }

              .filter-content {
                width: 520px;
                max-width: 520px;
                min-width: 520px;
                padding: 35px;
              }

              .filter-title {
                font-size: 26px;
              }

              .filter-grid {
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
              }

              .genre-chip {
                padding: 10px 14px;
                font-size: 13px;
              }
            }

            @media (max-width: 768px) {
              .filter-modal {
                padding: 10px;
              }

              .filter-content {
                width: calc(100vw - 20px) !important;
                max-width: 95% !important;
                min-width: auto !important;
                padding: 25px 18px;
                border-radius: 14px;
              }

              .filter-header {
                margin-bottom: 22px;
                padding-bottom: 16px;
              }

              .filter-title {
                font-size: 21px;
              }

              .filter-section {
                margin-bottom: 20px;
              }

              .filter-label {
                font-size: 15px;
                margin-bottom: 10px;
              }

              .filter-select {
                padding: 11px 14px;
                font-size: 14px;
              }

              .filter-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
              }

              .genre-chip {
                font-size: 12px;
                padding: 8px 11px;
              }

              .filter-actions {
                margin-top: 22px;
                padding-top: 18px;
                gap: 10px;
              }

              .btn-apply,
              .btn-reset {
                padding: 12px 20px;
                font-size: 14px;
              }
            }

            @media (max-width: 400px) {
              .filter-content {
                padding: 20px 14px;
              }

              .filter-title {
                font-size: 19px;
              }

              .filter-section {
                margin-bottom: 18px;
              }

              .filter-label {
                font-size: 14px;
              }

              .filter-grid {
                gap: 6px;
              }

              .genre-chip {
                font-size: 11px;
                padding: 7px 9px;
              }
            }
          `}</style>

          <motion.div
            className="filter-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              className="filter-content"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="filter-header">
                <h2 className="filter-title">Advanced Filters</h2>
                <button
                  className="close-button"
                  onClick={() => setShowFilters(false)}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Sort By */}
              <div className="filter-section">
                <label className="filter-label">Sort By</label>
                <select
                  className="filter-select"
                  value={filters.sort_by}
                  onChange={(e) =>
                    handleFilterChange("sort_by", e.target.value)
                  }
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Genres */}
              <div className="filter-section">
                <label className="filter-label">Genres</label>
                <div className="filter-grid">
                  {genres.map((genre) => {
                    const isActive = filters.with_genres.includes(
                      genre.id.toString(),
                    );
                    return (
                      <div
                        key={genre.id}
                        className={`genre-chip ${isActive ? "active" : ""}`}
                        onClick={() => {
                          const currentGenres = filters.with_genres
                            .split(",")
                            .filter(Boolean);
                          const genreId = genre.id.toString();

                          const newGenres = isActive
                            ? currentGenres.filter((g) => g !== genreId)
                            : [...currentGenres, genreId];

                          handleFilterChange(
                            "with_genres",
                            newGenres.join(","),
                          );
                        }}
                      >
                        {genre.name}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="filter-actions">
                <button className="btn-reset" onClick={resetFilters}>
                  Reset All
                </button>
                <button className="btn-apply" onClick={applyFilters}>
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <style jsx>{`
        .filter-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: var(--card-bg);
          border: 1px solid rgba(229, 9, 20, 0.3);
          border-radius: 8px;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          font-weight: 600;
        }

        .filter-button:hover {
          background: rgba(229, 9, 20, 0.1);
          border-color: var(--accent);
        }

        .filter-badge {
          background: var(--accent);
          color: white;
          border-radius: 50%;
          min-width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: bold;
          padding: 0 6px;
        }
      `}</style>

      {/* Filter Button */}
      <button className="filter-button" onClick={() => setShowFilters(true)}>
        <SlidersHorizontal size={18} />
        Filters
        {activeFilterCount() > 0 && (
          <span className="filter-badge">{activeFilterCount()}</span>
        )}
      </button>

      {/* ✅ Render modal as Portal to document.body */}
      {mounted &&
        typeof document !== "undefined" &&
        createPortal(modalContent, document.body)}
    </>
  );
}
