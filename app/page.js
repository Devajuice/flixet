"use client";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Play, Info, Volume2, VolumeX } from "lucide-react";
import MediaCard from "@/components/MediaCard";
import ContinueWatchingSection from "@/components/ContinueWatchingSection";
import PillNav from "@/components/PillNav";
import { SkeletonCard, SkeletonHero } from "@/components/Skeleton";
import {
  getTrendingAll,
  tmdbFetch,
} from "@/lib/tmdbClient";

const IMG = "https://image.tmdb.org/t/p";

function Hero({ items }) {
  const reduceMotion = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [trailerKey, setTrailerKey] = useState(null);
  const [muted, setMuted] = useState(true);
  const safe = items.filter((i) => i?.backdrop_path).slice(0, 6);
  const item = safe[idx] || safe[0];

  useEffect(() => {
    if (safe.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % safe.length), 9000);
    return () => clearInterval(t);
  }, [safe.length]);

  useEffect(() => {
    if (!item?.id || !item?.media_type || reduceMotion) {
      const id = setTimeout(() => setTrailerKey(null), 0);
      return () => clearTimeout(id);
    }
    const controller = new AbortController();
    const type = item.media_type === "movie" ? "movie" : "tv";
    tmdbFetch(`${type}/${item.id}/videos`, { language: "en-US" }, { signal: controller.signal })
      .then((data) => {
        const vids = data?.results || [];
        const pick =
          vids.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
          vids.find((v) => v.site === "YouTube" && v.type === "Teaser") ||
          vids.find((v) => v.site === "YouTube");
        setTrailerKey(pick?.key || null);
      })
      .catch(() => setTrailerKey(null));
    return () => controller.abort();
  }, [item?.id, item?.media_type, reduceMotion]);

  if (!item) return null;
  const title = item.title || item.name;
  const slug = item.media_type === "movie" ? "movie" : "tv";
  const backdrop = item.backdrop_path ? `${IMG}/original${item.backdrop_path}` : null;

  return (
    <section className="nf-hero">
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          className="nf-hero-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 1 }}
        >
          {trailerKey ? (
            <iframe
              title="Background trailer"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&modestbranding=1&rel=0&loop=1&playlist=${trailerKey}&playsinline=1`}
              allow="autoplay; encrypted-media"
              className="nf-hero-video"
            />
          ) : backdrop ? (
            <Image src={backdrop} alt="" fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 20%" }} />
          ) : null}
          <div className="nf-hero-shade-left" />
          <div className="nf-hero-shade-bottom" />
        </motion.div>
      </AnimatePresence>

      <div className="nf-hero-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: reduceMotion ? 0 : 0.55 }}
            className="nf-hero-copy"
          >
            <h1 className="nf-hero-title">{title}</h1>
            {item.overview ? <p className="nf-hero-overview">{item.overview}</p> : null}
            <div className="nf-hero-actions">
              <Link href={`/${slug}/${item.id}`} className="nf-btn nf-btn-play">
                <Play size={22} fill="currentColor" /> Play
              </Link>
              <Link href={`/${slug}/${item.id}`} className="nf-btn nf-btn-info">
                <Info size={22} /> More Info
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="nf-hero-controls">
        {trailerKey ? (
          <button className="nf-mute" onClick={() => setMuted((m) => !m)} aria-label={muted ? "Unmute" : "Mute"}>
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        ) : null}
        <div className="nf-maturity">{item.media_type === "movie" ? "MOVIE" : "SERIES"}</div>
      </div>

      <div className="nf-hero-dots">
        {safe.map((_, i) => (
          <button key={i} className={`nf-dot ${i === idx ? "active" : ""}`} onClick={() => setIdx(i)} aria-label={`Featured ${i + 1}`} />
        ))}
      </div>
    </section>
  );
}

function InfiniteGrid({ type }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const seen = useRef(new Set());
  const observerRef = useRef(null);
  const inflight = useRef(false);

  const fetchPage = useCallback(async (p, signal) => {
    const endpoint = type === "movie" ? "discover/movie" : "discover/tv";
    const params = {
      page: p,
      sort_by: "popularity.desc",
      include_adult: false,
      ...(type === "movie"
        ? { "vote_count.gte": 50 }
        : { "vote_count.gte": 30 }),
    };
    const data = await tmdbFetch(endpoint, params, signal ? { signal } : undefined);
    return data;
  }, [type]);

  useEffect(() => {
    seen.current = new Set();
    setItems([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    inflight.current = false;
    const controller = new AbortController();
    fetchPage(1, controller.signal)
      .then((data) => {
        const results = (data?.results || []).filter((i) => i?.poster_path && !seen.current.has(i.id));
        results.forEach((i) => seen.current.add(i.id));
        setItems(results);
        setHasMore((data?.page || 1) < Math.min(data?.total_pages || 1, 500));
        setPage(1);
      })
      .catch((e) => { if (e.name !== "AbortError") setHasMore(false); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [type, fetchPage]);

  const loadMore = useCallback(async () => {
    if (inflight.current || !hasMore || loading) return;
    inflight.current = true;
    setLoadingMore(true);
    const next = page + 1;
    try {
      const data = await fetchPage(next);
      const results = (data?.results || []).filter((i) => i?.poster_path && !seen.current.has(i.id));
      results.forEach((i) => seen.current.add(i.id));
      setItems((prev) => [...prev, ...results]);
      setPage(next);
      setHasMore(next < Math.min(data?.total_pages || 1, 500));
    } catch {
      setHasMore(false);
    } finally {
      inflight.current = false;
      setLoadingMore(false);
    }
  }, [page, hasMore, loading, fetchPage]);

  useEffect(() => {
    const node = observerRef.current;
    if (!node) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadMore();
    }, { rootMargin: "800px 0px" });
    obs.observe(node);
    return () => obs.disconnect();
  }, [loadMore]);

  return (
    <div className="nf-grid-wrap">
      <div className="nf-grid">
        {loading
          ? Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="nf-grid-cell"><SkeletonCard width="100%" height="100%" /></div>
            ))
          : items.map((item, i) => (
              <div key={`${type}-${item.id}-${i}`} className="nf-grid-cell">
                <MediaCard item={item} type={type} index={i} variant="tile" />
              </div>
            ))}
      </div>
      <div ref={observerRef} className="nf-grid-sentinel">
        {loadingMore && (
          <div className="nf-grid-loading">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="nf-grid-cell"><SkeletonCard width="100%" height="100%" /></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [filter, setFilter] = useState("movie");
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    getTrendingAll({ signal })
      .then((data) => setTrending(data?.results || []))
      .catch(() => {})
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  const heroItems = useMemo(() => trending.filter((i) => i.backdrop_path), [trending]);

  return (
    <div className="nf-home">
      {loading ? <SkeletonHero /> : <Hero items={heroItems} />}

      <div className="nf-filter-bar">
        <div className="nf-filter-inner">
          <PillNav
            ariaLabel="Content filter"
            activeIndex={["home", "movie", "tv"].indexOf(filter)}
            items={[
              { label: "Home" },
              { label: "Movies" },
              { label: "TV Shows" },
            ]}
            onItemClick={(_, index) => setFilter(["home", "movie", "tv"][index])}
          />
        </div>
      </div>

      {filter === "home" ? (
        <div className="nf-home-view">
          <div className="nf-home-cw">
            <ContinueWatchingSection />
          </div>
          <div className="nf-home-blank" aria-hidden="true">
            <div className="nf-home-blank-glow" />
            <div className="nf-home-blank-grid" />
            <div className="nf-home-blank-mark">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      ) : (
        <InfiniteGrid key={filter} type={filter} />
      )}

      <style jsx global>{`
        .nf-home {
          margin-top: calc(-1 * (var(--header-height) + 32px));
          background: #141414;
          min-height: 100vh;
        }
        .nf-hero {
          position: relative;
          width: 100%;
          height: min(86vh, 820px);
          min-height: 520px;
          overflow: hidden;
          background: #000;
          z-index: 25;
        }
        .nf-hero-bg { position: absolute; inset: 0; }
        .nf-hero-video {
          position: absolute; top: 50%; left: 50%;
          width: 177.78vh; height: 56.25vw;
          min-width: 100%; min-height: 100%;
          transform: translate(-50%, -50%) scale(1.02);
          border: 0; pointer-events: none;
        }
        .nf-hero-shade-left {
          position: absolute; inset: 0;
          background: linear-gradient(90deg, rgba(20,20,20,0.95) 0%, rgba(20,20,20,0.62) 28%, rgba(20,20,20,0.18) 55%, rgba(20,20,20,0.05) 72%, rgba(20,20,20,0.15) 100%);
        }
        .nf-hero-shade-bottom {
          position: absolute; inset: 0;
          background: linear-gradient(0deg, #141414 0%, rgba(20,20,20,0.85) 10%, rgba(20,20,20,0.25) 28%, rgba(20,20,20,0) 45%, rgba(20,20,20,0) 70%, rgba(20,20,20,0.35) 100%);
        }
        .nf-hero-content {
          position: absolute; left: 0; right: 0; bottom: 18%; z-index: 2;
          width: 100%; max-width: 1600px;
          padding: 0 var(--container-padding);
          margin: 0 auto;
        }
        .nf-hero-copy { max-width: min(640px, 90vw); }
        .nf-hero-title {
          margin: 0 0 18px;
          font-size: clamp(38px, 6vw, 72px);
          line-height: 0.95; font-weight: 800; letter-spacing: -0.04em;
          color: #fff; text-shadow: 0 4px 28px rgba(0,0,0,0.55);
        }
        .nf-hero-overview {
          margin: 0 0 28px;
          font-size: clamp(14px, 1.5vw, 18px); line-height: 1.6;
          color: rgba(255,255,255,0.88); text-shadow: 0 1px 12px rgba(0,0,0,0.7);
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
          max-width: 56ch;
        }
        .nf-hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }
        .nf-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          padding: 12px 28px; border-radius: 4px;
          font-size: 16px; font-weight: 700; text-decoration: none;
          transition: background .2s, opacity .2s, transform .15s; border: none; cursor: pointer;
        }
        .nf-btn:hover { opacity: 0.88; }
        .nf-btn:active { transform: scale(0.98); }
        .nf-btn-play { background: #fff; color: #000; }
        .nf-btn-play:hover { background: rgba(255,255,255,0.75); opacity: 1; }
        .nf-btn-info { background: rgba(109,109,110,0.7); color: #fff; backdrop-filter: blur(2px); }
        .nf-btn-info:hover { background: rgba(109,109,110,0.45); opacity: 1; }
        .nf-hero-controls {
          position: absolute; right: 0; bottom: 18%; z-index: 3;
          display: flex; align-items: center; gap: 12px;
        }
        .nf-mute {
          width: 42px; height: 42px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.6); background: rgba(0,0,0,0.2);
          color: #fff; display: inline-flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background .2s, border-color .2s;
        }
        .nf-mute:hover { background: rgba(255,255,255,0.12); border-color: #fff; }
        .nf-maturity {
          padding: 8px 14px 8px 12px;
          background: rgba(51,51,51,0.6); border-left: 3px solid rgba(255,255,255,0.75);
          color: #fff; font-size: 12px; font-weight: 600; letter-spacing: 0.08em;
        }
        .nf-hero-dots {
          position: absolute; left: 50%; bottom: 28px; transform: translateX(-50%);
          display: flex; gap: 8px; z-index: 3;
        }
        .nf-dot {
          width: 10px; height: 10px; border-radius: 50%; border: 0; padding: 0;
          background: rgba(255,255,255,0.35); cursor: pointer; transition: all .25s;
        }
        .nf-dot.active { background: #fff; transform: scale(1.15); }

        .nf-filter-bar {
          position: relative; z-index: 20;
          padding: 14px var(--container-padding);
          background: rgba(20,20,20,0.95);
          backdrop-filter: blur(10px);
        }
        .nf-filter-inner { display: flex; gap: 10px; max-width: 1600px; margin: 0 auto; }

        .nf-rows {
          position: relative; z-index: 4;
          margin-top: 0;
          padding: 8px 0 56px;
          display: flex; flex-direction: column; gap: 6px;
        }
        .nf-row-block { min-width: 0; }
        .nf-row-block .scroll-row { padding-top: 6px; padding-bottom: 18px; }

        .nf-grid-wrap {
          position: relative; z-index: 4;
          margin-top: 0;
          padding: 16px var(--container-padding) 60px;
          max-width: 1600px;
          margin-left: auto; margin-right: auto;
        }
        .nf-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 16px 12px;
        }
        .nf-grid-cell { width: 100%; aspect-ratio: 2/3; }
        .nf-grid-cell > * { width: 100% !important; height: 100% !important; }
        .nf-grid-sentinel { min-height: 40px; margin-top: 16px; }
        .nf-grid-loading {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 16px 12px;
        }

        .nf-home-view {
          position: relative;
          min-height: 52vh;
          padding: 20px var(--container-padding) 64px;
          max-width: 1600px;
          margin: 0 auto;
        }
        .nf-home-cw { position: relative; z-index: 2; }
        .nf-home-cw .cw-section { margin: 0; }
        .nf-home-blank {
          position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0;
        }
        .nf-home-blank-glow {
          position: absolute; top: -10%; left: 50%; width: min(900px, 120vw); height: 420px;
          transform: translateX(-50%);
          background: radial-gradient(circle at center, rgba(229,9,20,0.16) 0%, rgba(229,9,20,0.04) 38%, transparent 72%);
          filter: blur(2px);
        }
        .nf-home-blank-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse at center, black 20%, transparent 75%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 20%, transparent 75%);
          opacity: 0.5;
        }
        .nf-home-blank-mark {
          position: absolute; left: 50%; bottom: 8%; transform: translateX(-50%);
          display: flex; gap: 14px; opacity: 0.12;
        }
        .nf-home-blank-mark span {
          width: clamp(28px, 4vw, 52px); height: clamp(90px, 12vw, 150px);
          background: #fff; border-radius: 2px;
        }
        .nf-home-blank-mark span:nth-child(2) { transform: skewX(-18deg); background: #e50914; opacity: 0.9; }

        @media (max-width: 768px) {
          .nf-hero { height: 72vh; min-height: 460px; }
          .nf-hero-content, .nf-hero-controls { bottom: 16%; }
          .nf-hero-overview { -webkit-line-clamp: 2; margin-bottom: 20px; }
          .nf-btn { padding: 10px 20px; font-size: 15px; }
          .nf-maturity { display: none; }
          .nf-filter-bar { position: relative; top: auto; left: auto; right: auto; padding: 12px var(--container-padding); }
          .nf-rows { margin-top: 0; gap: 2px; padding-top: 8px; }
          .nf-grid-wrap { margin-top: 0; padding-top: 16px; }
          .nf-grid, .nf-grid-loading { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 14px 10px; }
        }
        @media (max-width: 480px) {
          .nf-hero { min-height: 420px; }
          .nf-hero-actions { gap: 10px; }
          .nf-btn { flex: 1; }
          .nf-mute { width: 36px; height: 36px; }
          .nf-rows { margin-top: 0; }
          .nf-grid, .nf-grid-loading { grid-template-columns: repeat(3, 1fr); gap: 12px 8px; }
        }
      `}</style>
    </div>
  );
}
