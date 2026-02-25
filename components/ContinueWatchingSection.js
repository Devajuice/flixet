'use client';
import { useContinueWatching } from '@/context/ContinueWatchingContext';
import ContinueWatchingCard from './ContinueWatchingCard';

export default function ContinueWatchingSection() {
  const { continueWatching } = useContinueWatching();

  if (continueWatching.length === 0) return null;

  return (
    <>
      <style jsx global>{`
        .cw-section {
          margin: 40px 0;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Header ────────────────────────────────────── */
        .cw-header {
          margin-bottom: 20px;
        }

        .cw-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.88);
          text-transform: uppercase;
          letter-spacing: 0.09em;
          margin: 0 0 4px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cw-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.06);
        }

        .cw-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.25);
          margin: 0;
          letter-spacing: 0.05em;
        }

        /* ── Grid ──────────────────────────────────────── */
        .cw-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        @media (max-width: 768px) {
          .cw-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 12px;
          }
        }

        @media (max-width: 480px) {
          .cw-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section className="cw-section">
        <div className="cw-header">
          <h2 className="cw-title">Continue Watching</h2>
          <p className="cw-subtitle">Pick up where you left off</p>
        </div>

        <div className="cw-grid">
          {continueWatching.map((item) => (
            <ContinueWatchingCard
              key={`${item.type}-${item.id}-${item.season}-${item.episode}`}
              item={item}
            />
          ))}
        </div>
      </section>
    </>
  );
}
