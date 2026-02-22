'use client';
import { useState } from 'react';
import AdBlockerNotice from './AdBlockerNotice';

export default function VideoPlayer({ movieId, tmdbId }) {
  const id = tmdbId || movieId;

  const servers = [
    {
      id: '2embed',
      name: 'Server 1',
      url: `https://www.2embed.cc/embed/${id}`,
      color: '#f59e0b',
    },
    {
      id: 'vidsrcme',
      name: 'Server 2',
      url: `https://vidsrc.me/embed/movie?tmdb=${id}`,
      color: '#10b981',
    },
    {
      id: 'vidsrcnet',
      name: 'Server 3',
      url: `https://vidsrc.net/embed/movie/${id}`,
      color: '#3b82f6',
    },
    {
      id: 'vidsrcto',
      name: 'Server 4',
      url: `https://vidsrc.to/embed/movie/${id}`,
      color: '#8b5cf6',
    },
    {
      id: 'vidsrcxyz',
      name: 'Server 5',
      url: `https://vidsrc.xyz/embed/movie/${id}`,
      color: '#ec4899',
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
      '_blank',
      `width=${width},height=${height},left=${left},top=${top}`,
    );
  };

  return (
    <div style={styles.wrapper}>
      <AdBlockerNotice />

      <div style={styles.infoBanner}>
        <span style={{ marginRight: '8px' }}>💡</span>
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
                  selectedServer === server.id ? server.color : '#334155',
                background:
                  selectedServer === server.id
                    ? `linear-gradient(135deg, ${server.color}22 0%, ${server.color}11 100%)`
                    : '#1e293b',
              }}
            >
              <div
                style={{
                  ...styles.serverDot,
                  backgroundColor: server.color,
                }}
              />
              {server.name}
              {server.id === '2embed' && (
                <span style={styles.defaultBadge}>Default</span>
              )}
            </button>
          ))}
        </div>

        <button style={styles.openBtn} onClick={openInNewWindow}>
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
  wrapper: { width: '100%', marginTop: '20px' },
  infoBanner: {
    background: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '8px',
    padding: '12px 15px',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
    color: '#60a5fa',
  },
  controls: {
    background: 'rgba(30, 41, 59, 0.5)',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '15px',
    backdropFilter: 'blur(10px)',
  },
  serverGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '10px',
    marginBottom: '12px',
  },
  serverBtn: {
    padding: '12px 16px',
    border: '2px solid',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    color: '#e2e8f0',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    position: 'relative',
  },
  serverDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  defaultBadge: {
    fontSize: '9px',
    fontWeight: '700',
    background: '#f59e0b',
    color: '#000',
    borderRadius: '4px',
    padding: '2px 5px',
    marginLeft: 'auto',
  },
  openBtn: {
    width: '100%',
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    paddingBottom: '56.25%',
    background: '#000',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)',
  },
  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
  },
};
