"use client";

import { Film } from "lucide-react";

export default function Loading() {
  return (
    <>
      <style jsx global>{`
        @keyframes ldg-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes ldg-spin-rev {
          to {
            transform: rotate(-360deg);
          }
        }

        @keyframes ldg-pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }

        @keyframes ldg-fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes ldg-slideUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes ldg-dot {
          0%,
          80%,
          100% {
            transform: scale(0.7);
            opacity: 0.3;
          }
          40% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        @keyframes ldg-progress {
          0% {
            width: 0%;
          }
          50% {
            width: 65%;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes ldg-glow {
          0%,
          100% {
            opacity: 0.06;
          }
          50% {
            opacity: 0.12;
          }
        }

        /* ── Container ─────────────────────────────────── */
        .ldg-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          gap: 28px;
          position: relative;
          overflow: hidden;
          font-family: "DM Sans", sans-serif;
        }

        .ldg-container::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 480px;
          height: 480px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 193, 60, 0.08) 0%,
            transparent 70%
          );
          animation: ldg-glow 3s ease-in-out infinite;
          pointer-events: none;
        }

        /* ── Spinner ───────────────────────────────────── */
        .ldg-spinner-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: ldg-fadeIn 0.5s ease-out;
        }

        .ldg-ring-outer {
          width: 96px;
          height: 96px;
          border: 2px solid rgba(255, 193, 60, 0.08);
          border-top: 2px solid #ffc13c;
          border-radius: 50%;
          animation: ldg-spin 1s linear infinite;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ldg-ring-inner {
          width: 66px;
          height: 66px;
          border: 2px solid rgba(255, 193, 60, 0.06);
          border-bottom: 2px solid rgba(255, 193, 60, 0.5);
          border-radius: 50%;
          animation: ldg-spin-rev 0.7s linear infinite;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ldg-film-icon {
          color: #ffc13c;
          animation: ldg-pulse 2s ease-in-out infinite;
        }

        /* ── Text ──────────────────────────────────────── */
        .ldg-text-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          animation: ldg-slideUp 0.6s ease-out;
        }

        .ldg-title {
          font-family: "DM Sans", sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.88);
          margin: 0;
          letter-spacing: -0.02em;
        }

        .ldg-subtitle {
          font-family: "DM Sans", sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.25);
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.09em;
        }

        /* ── Dots ──────────────────────────────────────── */
        .ldg-dots {
          display: flex;
          gap: 6px;
          margin-top: 2px;
        }

        .ldg-dot {
          width: 6px;
          height: 6px;
          background: #ffc13c;
          border-radius: 50%;
          animation: ldg-dot 1.4s ease-in-out infinite;
        }

        .ldg-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .ldg-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        /* ── Progress bar ──────────────────────────────── */
        .ldg-progress-track {
          width: 180px;
          height: 2px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 2px;
          overflow: hidden;
        }

        .ldg-progress-fill {
          height: 100%;
          background: #ffc13c;
          border-radius: 2px;
          animation: ldg-progress 1.6s ease-in-out infinite;
        }

        /* ── Responsive ────────────────────────────────── */
        @media (max-width: 768px) {
          .ldg-ring-outer {
            width: 76px;
            height: 76px;
          }
          .ldg-ring-inner {
            width: 52px;
            height: 52px;
          }
          .ldg-title {
            font-size: 17px;
          }
          .ldg-progress-track {
            width: 140px;
          }
        }
      `}</style>

      <div className="ldg-container">
        {/* Spinner */}
        <div className="ldg-spinner-wrapper">
          <div className="ldg-ring-outer">
            <div className="ldg-ring-inner">
              <Film size={28} className="ldg-film-icon" />
            </div>
          </div>
        </div>

        {/* Text + dots + progress */}
        <div className="ldg-text-wrap">
          <h2 className="ldg-title">Loading Flixet</h2>
          <p className="ldg-subtitle">Please wait a moment</p>

          <div className="ldg-dots">
            <div className="ldg-dot" />
            <div className="ldg-dot" />
            <div className="ldg-dot" />
          </div>

          <div className="ldg-progress-track">
            <div className="ldg-progress-fill" />
          </div>
        </div>
      </div>
    </>
  );
}
