"use client";
import { useContinueWatching } from "@/context/ContinueWatchingContext";
import ContinueWatchingCard from "./ContinueWatchingCard";

export default function ContinueWatchingSection() {
  const { continueWatching } = useContinueWatching();
  if (continueWatching.length === 0) return null;

  return (
    <>
      <style jsx global>{`
        .cw-section {
          margin: 32px 0;
          font-family: "DM Sans", sans-serif;
        }

        /* ── Header ──────────────────────────────── */
        .cw-header {
          margin-bottom: 14px;
        }
        .cw-section-title {
          font-family: "DM Sans", sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.88);
          text-transform: uppercase;
          letter-spacing: 0.09em;
          margin: 0 0 3px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .cw-section-title::after {
          content: "";
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.06);
        }
        .cw-subtitle {
          font-family: "DM Sans", sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.25);
          margin: 0;
          letter-spacing: 0.04em;
        }

        /* ── Horizontal scroll row ───────────────── */
        .cw-row {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }

        @media (max-width: 768px) {
          .cw-row {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 10px;
          }
        }

        @media (max-width: 480px) {
          .cw-row {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
        }
      `}</style>

      <section className="cw-section">
        <div className="cw-header">
          <h2 className="cw-section-title">Continue Watching</h2>
          <p className="cw-subtitle">Pick up where you left off</p>
        </div>
        <div className="cw-row">
          {continueWatching.map((item) => (
            <ContinueWatchingCard key={`${item.type}-${item.id}`} item={item} />
          ))}
        </div>
      </section>
    </>
  );
}
