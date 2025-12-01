'use client';

export default function AdBlockerNotice() {
  return (
    <>
      <style jsx>{`
        .notice {
          background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
          border-left: 4px solid var(--accent);
          padding: 15px 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .notice-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
          color: var(--accent);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .notice-text {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 10px;
        }

        .notice-list {
          list-style: none;
          padding-left: 0;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .notice-list li {
          padding: 5px 0;
          padding-left: 20px;
          position: relative;
        }

        .notice-list li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #4caf50;
          font-weight: bold;
        }

        @media (max-width: 640px) {
          .notice {
            padding: 12px 15px;
          }
          
          .notice-title {
            font-size: 14px;
          }
          
          .notice-text {
            font-size: 13px;
          }
        }
      `}</style>

      <div className="notice">
        <div className="notice-title">
          💡 Tips for Better Viewing Experience
        </div>
        <p className="notice-text">
          We use free streaming services which may show ads. For the best experience:
        </p>
        <ul className="notice-list">
          <li>Use an ad-blocker browser extension (uBlock Origin recommended)</li>
          <li>Try different servers if one has too many ads</li>
          <li>Close any pop-ups that may appear</li>
          <li>Never enter personal information on pop-ups</li>
        </ul>
      </div>
    </>
  );
}
