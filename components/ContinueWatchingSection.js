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
        }
        .cw-header {
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .cw-title {
          font-size: var(--text-xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          letter-spacing: -0.01em;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .cw-subtitle {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          margin-left: auto;
        }
        .cw-row {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 12px;
        }
        @media (max-width: 768px) {
          .cw-row {
            gap: 10px;
          }
        }
        @media (max-width: 480px) {
          .cw-row {
            gap: 8px;
          }
        }
      `}</style>

      <section className="cw-section">
        <div className="cw-header">
          <h2 className="cw-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Continue Watching
          </h2>
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
