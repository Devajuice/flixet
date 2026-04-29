"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import MediaCard from "@/components/MediaCard";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function AnimePage() {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);

  const fetchAnime = useCallback(async (page, reset = false) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=16&with_origin_country=JP&sort_by=popularity.desc&page=${page}`,
      );
      const data = await res.json();
      if (reset) {
        setAnimeList(data.results || []);
      } else {
        setAnimeList((prev) => {
          const ids = new Set(prev.map((a) => a.id));
          return [
            ...prev,
            ...(data.results || []).filter((a) => !ids.has(a.id)),
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
  }, []);

  useEffect(() => {
    fetchAnime(1, true);
  }, [fetchAnime]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore)
          fetchAnime(currentPage + 1, false);
      },
      { threshold: 0.1 },
    );
    const t = observerTarget.current;
    if (t) observer.observe(t);
    return () => {
      if (t) observer.unobserve(t);
    };
  }, [hasMore, loading, loadingMore, currentPage, fetchAnime]);

  return (
    <div
      style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: "0 var(--container-padding)",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: "var(--font-extrabold)",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <Sparkles size={28} color="var(--accent)" /> Anime Series
          </h1>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--text-tertiary)",
              marginTop: 4,
            }}
          >
            Popular anime series from Japan
          </p>
        </div>

        {loading && animeList.length === 0 ? (
          <div className="anime-grid">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="skeleton"
                style={{ borderRadius: "var(--radius-lg)", aspectRatio: "2/3" }}
              />
            ))}
          </div>
        ) : !animeList.length ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "40vh",
              gap: 12,
            }}
          >
            <Sparkles size={40} color="rgba(229,9,20,0.2)" />
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--text-tertiary)",
              }}
            >
              No anime found.
            </p>
          </div>
        ) : (
          <>
            <div className="anime-grid">
              {animeList.map((show, i) => (
                <MediaCard key={show.id} item={show} type="tv" index={i} />
              ))}
            </div>

            <div
              ref={observerTarget}
              style={{
                minHeight: 80,
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
                    gap: 12,
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
              {!hasMore && animeList.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: "var(--text-sm)",
                    color: "var(--text-tertiary)",
                  }}
                >
                  <Sparkles size={14} color="var(--accent)" />{" "}
                  {animeList.length} series loaded
                </div>
              )}
            </div>
          </>
        )}
      </motion.div>

      <style jsx global>{`
        .anime-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 16px;
          margin-bottom: 40px;
        }
        @media (max-width: 768px) {
          .anime-grid {
            gap: 12px;
          }
        }
        @media (max-width: 480px) {
          .anime-grid {
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}
