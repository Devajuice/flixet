"use client";
import { useState } from "react";
import AdBlockerNotice from "./AdBlockerNotice";

export default function VideoPlayer({ movieId, tmdbId }) {
  const id = tmdbId || movieId;

  const servers = [
    {
      id: "vidsrccc",
      name: "Server 1",
      url: `https://vidsrc.cc/v2/embed/movie/${id}`,
      color: "#ffc13c",
    },
    {
      id: "vidlink",
      name: "Server 2",
      url: `https://vidlink.pro/movie/${id}?primaryColor=ffc13c&secondaryColor=0d0d0f&iconColor=ffc13c&autoplay=true`,
      color: "#34d399",
    },
    {
      id: "2embed",
      name: "Server 3",
      url: `https://www.2embed.cc/embed/${id}`,
      color: "#60a5fa",
    },
    {
      id: "vidsrcme",
      name: "Server 4",
      url: `https://vidsrc.me/embed/movie?tmdb=${id}`,
      color: "#a78bfa",
    },
    {
      id: "vidsrcnet",
      name: "Server 5",
      url: `https://vidsrc.net/embed/movie/${id}`,
      color: "#f472b6",
    },
    {
      id: "moviewp",
      name: "Server 6",
      url: `https://moviewp.com/se.php?video_id=${id}&tmdb=1`,
      color: "#fb923c",
    },
  ];

  const [selectedServer, setSelectedServer] = useState(servers[0].id);

  const currentServer = servers.find((s) => s.id === selectedServer);

  const handleServerChange = (serverId) => {
    setSelectedServer(serverId);
  };

  const handleIframeError = () => {
    const currentIndex = servers.findIndex((s) => s.id === selectedServer);
    const nextServer = servers[currentIndex + 1];
    if (nextServer) {
      setSelectedServer(nextServer.id);
    }
  };

  const openInNewWindow = () => {
    const width = 1280;
    const height = 720;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    window.open(
      currentServer.url,
      "_blank",
      `width=${width},height=${height},left=${left},top=${top}`,
    );
  };

  return (
    <div style={styles.wrapper}>
      <AdBlockerNotice />

      <div style={styles.infoBanner}>
        <span style={{ marginRight: "8px" }}>💡</span>
        <span>
          If video doesn't load within 15 seconds, try switching servers below.
        </span>
      </div>

      <div style={styles.controls}>
        <div style={styles.serverGrid}>
          {servers.map((server) => (
            <button
              key={server.id}
              onClick={() => handleServerChange(server.id)}
              style={{
                ...styles.serverBtn,
                borderColor:
                  selectedServer === server.id
                    ? server.color
                    : "rgba(255,255,255,0.08)",
                background:
                  selectedServer === server.id
                    ? `${server.color}1a`
                    : "rgba(255,255,255,0.03)",
                color:
                  selectedServer === server.id
                    ? server.color
                    : "rgba(255,255,255,0.5)",
              }}
            >
              <div
                style={{
                  ...styles.serverDot,
                  backgroundColor: server.color,
                }}
              />
              {server.name}
              {server.id === "vidsrccc" && (
                <span
                  style={{
                    ...styles.defaultBadge,
                    background: "#ffc13c",
                    color: "#0d0d0f",
                  }}
                >
                  Default
                </span>
              )}
            </button>
          ))}
        </div>

        <button
          style={styles.openBtn}
          onClick={openInNewWindow}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,193,60,0.2)";
            e.currentTarget.style.borderColor = "#ffc13c";
            e.currentTarget.style.color = "#ffc13c";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,193,60,0.08)";
            e.currentTarget.style.borderColor = "rgba(255,193,60,0.3)";
            e.currentTarget.style.color = "rgba(255,193,60,0.8)";
          }}
        >
          🚀 Open in New Window
        </button>
      </div>

      <div style={styles.videoContainer}>
        <iframe
          key={selectedServer}
          style={styles.iframe}
          src={currentServer.url}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="no-referrer-when-downgrade"
          loading="lazy"
          onError={handleIframeError}
        />
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    width: "100%",
    marginTop: "20px",
    fontFamily: "'DM Sans', sans-serif",
  },
  infoBanner: {
    background: "rgba(255,193,60,0.06)",
    border: "1px solid rgba(255,193,60,0.2)",
    borderLeft: "3px solid #ffc13c",
    borderRadius: "8px",
    padding: "12px 15px",
    marginBottom: "15px",
    display: "flex",
    alignItems: "center",
    fontSize: "13px",
    color: "rgba(255,193,60,0.8)",
    fontFamily: "'DM Sans', sans-serif",
  },
  controls: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "15px",
    backdropFilter: "blur(10px)",
  },
  serverGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
    gap: "8px",
    marginBottom: "12px",
  },
  serverBtn: {
    padding: "8px 12px",
    border: "1px solid",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    letterSpacing: "0.02em",
    fontFamily: "'DM Sans', sans-serif",
  },
  serverDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  defaultBadge: {
    fontSize: "9px",
    fontWeight: "700",
    borderRadius: "4px",
    padding: "2px 5px",
    marginLeft: "auto",
    letterSpacing: "0.02em",
  },
  openBtn: {
    width: "100%",
    padding: "10px 20px",
    background: "rgba(255,193,60,0.08)",
    color: "rgba(255,193,60,0.8)",
    border: "1px solid rgba(255,193,60,0.3)",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "all 0.2s ease",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.02em",
  },
  videoContainer: {
    position: "relative",
    width: "100%",
    paddingBottom: "56.25%",
    background: "#000",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 24px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,193,60,0.1)",
  },
  iframe: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: "none",
  },
};
