"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Film, Tv, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const IMG = "https://image.tmdb.org/t/p";

export default function SearchBar({ autoFocus }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  const debouncedSearch = useCallback(
    debounce((searchQuery) => {
      if (searchQuery.trim().length >= 2) {
        searchContent(searchQuery);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300),
    [],
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchContent = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&page=1`,
      );
      const data = await response.json();
      const filtered = data.results
        .filter(
          (item) => item.media_type === "movie" || item.media_type === "tv",
        )
        .filter((item) => item.poster_path)
        .slice(0, 8);
      setResults(filtered);
      setIsOpen(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  const handleResultClick = (item) => {
    const path =
      item.media_type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;
    router.push(path);
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setFocused(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} style={{ position: "relative", width: "100%" }}>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Search
            size={16}
            style={{
              position: "absolute",
              left: 12,
              color: focused ? "var(--accent)" : "var(--text-tertiary)",
              pointerEvents: "none",
              zIndex: 1,
              transition: "color 0.2s ease",
            }}
          />
          <input
            type="text"
            placeholder="Search movies, TV shows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setFocused(true);
              if (results.length > 0) setIsOpen(true);
            }}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit(e);
            }}
            autoComplete="off"
            autoFocus={autoFocus}
            aria-label="Search movies and TV shows"
            role="searchbox"
            aria-autocomplete="list"
            style={{
              width: "100%",
              padding: "8px 36px 8px 36px",
              background: focused
                ? "rgba(255,255,255,0.06)"
                : "rgba(255,255,255,0.04)",
              border: `1px solid ${focused ? "var(--accent-border)" : "var(--border)"}`,
              borderRadius: "var(--radius-lg)",
              color: "var(--text-primary)",
              fontSize: "var(--text-sm)",
              fontFamily: "var(--font-sans)",
              outline: "none",
              transition: "all 0.2s ease",
            }}
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              style={{
                position: "absolute",
                right: 10,
                color: "var(--text-tertiary)",
                cursor: "pointer",
                padding: 4,
                display: "flex",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text-secondary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-tertiary)")
              }
            >
              <X size={14} />
            </button>
          )}
        </div>
      </form>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              right: 0,
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-xl)",
              maxHeight: "min(420px, 50vh)",
              overflowY: "auto",
              zIndex: 1000,
              boxShadow: "var(--shadow-xl)",
            }}
          >
            {loading ? (
              <div
                style={{
                  padding: "24px 16px",
                  textAlign: "center",
                  color: "var(--text-tertiary)",
                  fontSize: "var(--text-sm)",
                }}
              >
                Searching...
              </div>
            ) : results.length > 0 ? (
              results.map((item, index) => (
                <SearchResult
                  key={`${item.media_type}-${item.id}`}
                  item={item}
                  onClick={() => handleResultClick(item)}
                  isLast={index === results.length - 1}
                />
              ))
            ) : (
              <div
                style={{
                  padding: "24px 16px",
                  textAlign: "center",
                  color: "var(--text-tertiary)",
                  fontSize: "var(--text-sm)",
                }}
              >
                No results found
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SearchResult({ item, onClick, isLast }) {
  const [hovered, setHovered] = useState(false);
  const isTV = item.media_type === "tv";
  const title = item.title || item.name;
  const year =
    item.release_date || item.first_air_date
      ? new Date(item.release_date || item.first_air_date).getFullYear()
      : null;
  const poster = item.poster_path ? `${IMG}/w92${item.poster_path}` : null;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "8px 12px",
        cursor: "pointer",
        background: hovered ? "rgba(255,255,255,0.04)" : "transparent",
        borderBottom: isLast ? "none" : "1px solid var(--border)",
        transition: "background 0.15s ease",
      }}
    >
      {poster ? (
        <Image
          src={poster}
          alt=""
          width={40}
          height={60}
          sizes="40px"
          style={{
            objectFit: "cover",
            borderRadius: "var(--radius-sm)",
            flexShrink: 0,
            background: "var(--bg-tertiary)",
          }}
        />
      ) : (
        <div
          style={{
            width: 40,
            height: 60,
            borderRadius: "var(--radius-sm)",
            flexShrink: 0,
            background: "var(--bg-tertiary)",
          }}
        />
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-semibold)",
            color: hovered ? "var(--text-primary)" : "var(--text-secondary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            transition: "color 0.15s ease",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 3,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
              fontSize: 10,
              fontWeight: "var(--font-medium)",
              color: isTV ? "#60a5fa" : "var(--accent)",
            }}
          >
            {isTV ? <Tv size={10} /> : <Film size={10} />}
            {isTV ? "TV" : "Movie"}
          </span>
          {year && (
            <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
              {year}
            </span>
          )}
          {item.vote_average > 0 && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 2,
                fontSize: 11,
                color: "var(--gold)",
                fontWeight: "var(--font-medium)",
              }}
            >
              <Star size={10} fill="var(--gold)" />{" "}
              {item.vote_average.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
