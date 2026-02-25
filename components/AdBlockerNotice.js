'use client';

import { Shield, AlertTriangle, CheckCircle, X, Zap } from 'lucide-react';
import { useState } from 'react';

export default function AdBlockerNotice() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <>
      <style jsx global>{`
        .abn-container {
          margin-bottom: 30px;
          animation: abn-slideDown 0.4s ease-out;
        }

        @keyframes abn-slideDown {
          from {
            opacity: 0;
            transform: translateY(-16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ── Shell ─────────────────────────────────────── */
        .abn-notice {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-left: 3px solid #ffc13c;
          border-radius: 12px;
          padding: 22px 24px;
          position: relative;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Header ────────────────────────────────────── */
        .abn-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .abn-title-wrapper {
          display: flex;
          align-items: center;
          gap: 9px;
          flex: 1;
        }

        .abn-icon {
          width: 36px;
          height: 36px;
          background: rgba(255, 193, 60, 0.08);
          border: 1px solid rgba(255, 193, 60, 0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .abn-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #ffc13c;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        .abn-close {
          width: 30px;
          height: 30px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          color: rgba(255, 255, 255, 0.35);
          flex-shrink: 0;
        }

        .abn-close:hover {
          background: rgba(255, 193, 60, 0.08);
          border-color: rgba(255, 193, 60, 0.2);
          color: #ffc13c;
          transform: rotate(90deg);
        }

        /* ── Body text ─────────────────────────────────── */
        .abn-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.35);
          line-height: 1.85;
          margin-bottom: 18px;
        }

        /* ── Tips grid ─────────────────────────────────── */
        .abn-tips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 8px;
          margin-bottom: 16px;
        }

        .abn-tip {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 11px 13px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          transition:
            border-color 0.2s ease,
            padding-left 0.2s ease;
        }

        .abn-tip:hover {
          border-color: rgba(255, 193, 60, 0.15);
          padding-left: 17px;
        }

        .abn-tip-icon {
          flex-shrink: 0;
          margin-top: 1px;
        }

        .abn-tip-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.38);
          line-height: 1.7;
          margin: 0;
        }

        /* ── Warning box ───────────────────────────────── */
        .abn-warning {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-left: 3px solid rgba(255, 193, 60, 0.5);
          border-radius: 10px;
          padding: 13px 14px;
          margin-top: 14px;
        }

        .abn-warning-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.35);
          margin: 0;
          line-height: 1.85;
        }

        .abn-warning-text strong {
          color: #ffc13c;
          font-weight: 700;
        }

        /* ── Badge ─────────────────────────────────────── */
        .abn-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 193, 60, 0.06);
          border: 1px solid rgba(255, 193, 60, 0.18);
          color: #ffc13c;
          padding: 6px 13px;
          border-radius: 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          margin-top: 14px;
          letter-spacing: 0.01em;
        }

        /* ── Responsive ────────────────────────────────── */
        @media (max-width: 768px) {
          .abn-notice {
            padding: 18px 16px;
          }
          .abn-tips-grid {
            grid-template-columns: 1fr;
            gap: 6px;
          }
        }
      `}</style>

      <div className="abn-container">
        <div className="abn-notice">
          {/* Header */}
          <div className="abn-header">
            <div className="abn-title-wrapper">
              <div className="abn-icon">
                <Shield size={18} color="#ffc13c" />
              </div>
              <h3 className="abn-title">Safe Viewing Tips</h3>
            </div>
            <button
              className="abn-close"
              onClick={() => setIsVisible(false)}
              aria-label="Close notice"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <p className="abn-text">
            We use free streaming services which may show ads. Follow these tips
            for a better and safer viewing experience:
          </p>

          {/* Tips */}
          <div className="abn-tips-grid">
            {[
              'Use an ad-blocker browser extension (uBlock Origin recommended)',
              'Try different servers if one has too many ads',
              'Close any pop-ups that may appear immediately',
              'Never enter personal information on pop-ups',
            ].map((tip, i) => (
              <div key={i} className="abn-tip">
                <CheckCircle
                  size={16}
                  className="abn-tip-icon"
                  color="#ffc13c"
                />
                <p className="abn-tip-text">{tip}</p>
              </div>
            ))}
          </div>

          {/* Warning */}
          <div className="abn-warning">
            <AlertTriangle
              size={16}
              color="#ffc13c"
              style={{ flexShrink: 0, marginTop: 1 }}
            />
            <p className="abn-warning-text">
              <strong>Important:</strong> Never download anything from pop-ups
              or provide credit card information. Our service is completely
              free.
            </p>
          </div>

          {/* Badge */}
          <div className="abn-badge">
            <Zap size={13} />
            Recommended: Use Brave Browser or uBlock Origin
          </div>
        </div>
      </div>
    </>
  );
}
