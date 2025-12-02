'use client';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function Footer() {
  return (
    <>
      <style jsx>{`
        .footer {
          background-color: var(--secondary-bg);
          border-top: 1px solid #333;
          padding: 40px 0 20px;
          margin-top: 60px;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }

        .footer-section h3 {
          font-size: 18px;
          margin-bottom: 15px;
          color: var(--accent);
        }

        .footer-section p,
        .footer-section li {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.8;
        }

        .footer-links {
          list-style: none;
          padding: 0;
        }

        .footer-links li {
          margin-bottom: 10px;
        }

        .footer-links a {
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-links a:hover {
          color: var(--accent);
        }

        .disclaimer {
          background-color: rgba(229, 9, 20, 0.1);
          border-left: 4px solid var(--accent);
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
        }

        .disclaimer-title {
          font-weight: bold;
          color: var(--accent);
          margin-bottom: 10px;
          font-size: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .disclaimer-text {
          font-size: 13px;
          line-height: 1.6;
        }

        .footer-bottom {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #333;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .tmdb-credit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 15px;
          font-size: 12px;
        }

        @media (min-width: 768px) {
          .footer-content {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>

      <footer className="footer">
        <div className="container">
          <div className="disclaimer">
            <div className="disclaimer-title">
              <AlertTriangle size={20} />
              Important Disclaimer
            </div>
            <p className="disclaimer-text">
              Flixet does not host, store, or distribute any video content. All
              videos are embedded from third-party sources. We do not claim
              ownership of any content displayed on this website. All
              trademarks, logos, and brand names are the property of their
              respective owners. If you believe any content infringes on your
              copyright, please contact us for removal.
            </p>
          </div>

          <div className="footer-content">
            <div className="footer-section">
              <h3>About Flixet </h3>
              <p>
                Flixet is a free streaming aggregator that provides links to
                movies and TV shows from various third-party sources. We do not
                upload or host any files on our servers.
              </p>
            </div>

            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul className="footer-links">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/movies">Movies</Link>
                </li>
                <li>
                  <Link href="/tv">TV Shows</Link>
                </li>
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/dmca">DMCA</Link>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h3>Legal</h3>
              <p>
                By using this website, you agree to our Terms of Service. This
                site is for educational and informational purposes only. Users
                are responsible for complying with their local laws regarding
                online streaming.
              </p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Flixet . All rights reserved.</p>
            <div className="tmdb-credit">
              <span>Powered by</span>
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent)' }}
              >
                The Movie Database (TMDb)
              </a>
            </div>
            <p style={{ marginTop: '10px', fontSize: '11px' }}>
              This product uses the TMDb API but is not endorsed or certified by
              TMDb.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
