'use client';
import { useState } from 'react';
import AdBlockerNotice from './AdBlockerNotice';

export default function VideoPlayer({ movieId }) {
  const [selectedServer, setSelectedServer] = useState('server1');
  
  const servers = {
    server1: `https://www.2embed.cc/embed/${movieId}`,
    server2: `https://multiembed.mov/?video_id=${movieId}&tmdb=1`,
    server3: `https://vidsrc.me/embed/movie?tmdb=${movieId}`,
    server4: `https://vidsrc.xyz/embed/movie/${movieId}`,
  };

  return (
    <>
      <style jsx>{`
        .player-wrapper {
          width: 100%;
          margin-top: 20px;
        }

        .server-buttons {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }

        .server-btn {
          padding: 10px 20px;
          background-color: var(--card-bg);
          color: var(--text-primary);
          border: 2px solid transparent;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .server-btn:hover {
          background-color: var(--secondary-bg);
          transform: translateY(-2px);
        }

        .server-btn.active {
          background-color: var(--accent);
          border-color: var(--accent);
        }

        .video-container {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%;
          background-color: #000;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
        }

        .video-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }

        @media (max-width: 640px) {
          .server-btn {
            padding: 8px 15px;
            font-size: 12px;
          }
        }
      `}</style>

      <div className="player-wrapper">
        <AdBlockerNotice />
        
        <div className="server-buttons">
          <button
            onClick={() => setSelectedServer('server1')}
            className={`server-btn ${selectedServer === 'server1' ? 'active' : ''}`}
          >
            Server 1
          </button>
          <button
            onClick={() => setSelectedServer('server2')}
            className={`server-btn ${selectedServer === 'server2' ? 'active' : ''}`}
          >
            Server 2
          </button>
          <button
            onClick={() => setSelectedServer('server3')}
            className={`server-btn ${selectedServer === 'server3' ? 'active' : ''}`}
          >
            Server 3
          </button>
          <button
            onClick={() => setSelectedServer('server4')}
            className={`server-btn ${selectedServer === 'server4' ? 'active' : ''}`}
          >
            Server 4
          </button>
        </div>

        <div className="video-container">
          <iframe
            key={selectedServer}
            className="video-iframe"
            src={servers[selectedServer]}
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture"
            referrerPolicy="origin"
          />
        </div>
      </div>
    </>
  );
}
