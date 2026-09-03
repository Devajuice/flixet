"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Server, ChevronDown, ChevronUp, Play } from "lucide-react";

const SERVERS = {
  movie: [
    {
      label: "VidCore",
      url: (id) => `https://vidcore.net/movie/${id}?theme=3b82f6`,
    },
    {
      label: "VidLink",
      url: (id) =>
        `https://vidlink.pro/movie/${id}?primaryColor=3b82f6&autoplay=true`,
    },
    {
      label: "VidSrc",
      url: (id) => `https://vidsrc.me/embed/movie?tmdb=${id}`,
    },
    { label: "2embed", url: (id) => `https://www.2embed.cc/embed/${id}` },
  ],
  tv: [
    {
      label: "VidCore",
      url: (id, s, e) =>
        `https://vidcore.net/tv/${id}/${s}/${e}?theme=3b82f6`,
    },
    {
      label: "VidLink",
      url: (id, s, e) =>
        `https://vidlink.pro/tv/${id}/${s}/${e}?primaryColor=3b82f6&autoplay=true&nextbutton=true`,
    },
    {
      label: "VidSrc",
      url: (id, s, e) =>
        `https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
    },
    {
      label: "2embed",
      url: (id, s, e) => `https://www.2embed.cc/embedtv/${id}?s=${s}&e=${e}`,
    },
  ],
};

export default function VideoPlayer({
  isOpen,
  onClose,
  type = "movie",
  id,
  title,
  season,
  episode,
  onNextEpisode,
  hasNext,
  onWatchedSeconds,
}) {
  const [activeServer, setActiveServer] = useState(0);
  const [showServerMenu, setShowServerMenu] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const openedAt = useRef(null);

  const resetKey = `${isOpen}-${id}-${season ?? ""}-${episode ?? ""}`;
  const [prevResetKey, setPrevResetKey] = useState(resetKey);
  if (resetKey !== prevResetKey) {
    setPrevResetKey(resetKey);
    if (isOpen) {
      setActiveServer(0);
      setShowServerMenu(false);
      setIframeLoaded(false);
    }
  }

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      if (!openedAt.current) openedAt.current = Date.now();
    } else if (openedAt.current) {
      const elapsed = Math.round((Date.now() - openedAt.current) / 1000);
      openedAt.current = null;
      if (elapsed > 0 && onWatchedSeconds) onWatchedSeconds(elapsed);
    }
  }, [isOpen, onWatchedSeconds]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const servers = SERVERS[type] || SERVERS.movie;
  const serverUrl =
    type === "tv"
      ? servers[activeServer]?.url(id, season, episode)
      : servers[activeServer]?.url(id);
  const displayTitle =
    type === "tv" ? `${title} — S${season}E${episode}` : title;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          position: "fixed",
          inset: 0,
          background: "#000",
          zIndex: 99999,
        }}
      >
        {/* Top bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "clamp(8px, 2vw, 14px) clamp(12px, 3vw, 18px)",
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              minWidth: 0,
              flex: 1,
            }}
          >
            <button
              onClick={onClose}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
                cursor: "pointer",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
              }
            >
              <X size={18} />
            </button>
            <p
              style={{
                fontSize: "clamp(13px, 3vw, 15px)",
                fontWeight: 600,
                color: "#fff",
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {displayTitle}
            </p>
          </div>

          {/* Server selector */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            {hasNext && onNextEpisode && (
              <button
                onClick={onNextEpisode}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "clamp(6px, 1.5vw, 7px) clamp(10px, 2vw, 12px)",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--accent)",
                  border: "none",
                  color: "#fff",
                  fontSize: "clamp(12px, 2.5vw, var(--text-sm))",
                  fontWeight: "var(--font-bold)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Next Episode <Play size={14} fill="currentColor" />
              </button>
            )}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <button
              onClick={() => setShowServerMenu((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "clamp(6px, 1.5vw, 7px) clamp(10px, 2vw, 12px)",
                borderRadius: "var(--radius-lg)",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                fontSize: "clamp(12px, 2.5vw, var(--text-sm))",
                fontWeight: "var(--font-medium)",
                cursor: "pointer",
              }}
            >
              <Server size={14} />
              <span className="server-label">
                {servers[activeServer].label}
              </span>
              {showServerMenu ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
            </button>

            <AnimatePresence>
              {showServerMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    background: "rgba(20,20,20,0.95)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: 6,
                    minWidth: 160,
                    boxShadow: "var(--shadow-xl)",
                    zIndex: 20,
                  }}
                >
                  {servers.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveServer(i);
                        setShowServerMenu(false);
                      }}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "var(--radius-md)",
                        fontSize: "var(--text-sm)",
                        textAlign: "left",
                        cursor: "pointer",
                        background:
                          activeServer === i ? "var(--accent)" : "transparent",
                        border: "none",
                        color:
                          activeServer === i ? "#fff" : "var(--text-secondary)",
                        fontWeight:
                          activeServer === i
                            ? "var(--font-bold)"
                            : "var(--font-medium)",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        transition: "all 0.15s",
                      }}
                    >
                      {s.label}
                      {activeServer === i && (
                        <div
                          style={{
                            marginLeft: "auto",
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "#fff",
                          }}
                        />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          </div>
        </div>

        {/* Loading state */}
        {!iframeLoaded && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#000",
              zIndex: 5,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                border: "3px solid rgba(59, 130, 246, 0.2)",
                borderTopColor: "var(--accent)",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <p
              style={{
                marginTop: 16,
                fontSize: "var(--text-sm)",
                color: "var(--text-tertiary)",
              }}
            >
              Loading player...
            </p>
          </div>
        )}

        <iframe
          key={`${activeServer}-${id}-${season || ''}-${episode || ''}`}
          src={serverUrl}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            position: "relative",
            zIndex: 1,
          }}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title={`Watch ${displayTitle}`}
          onLoad={() => setIframeLoaded(true)}
        />
      </motion.div>
    </AnimatePresence>
  );
}
