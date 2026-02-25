'use client';

import Link from 'next/link';
import {
  AlertTriangle,
  Film,
  Tv,
  FileText,
  Shield,
  Mail,
  Heart,
  ExternalLink,
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style jsx global>{`
        @keyframes heartbeat {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.18);
          }
        }

        /* ── Shell ───────────────────────────────────── */
        .footer {
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(13, 13, 15, 0.98) 100%
          );
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding: 64px 0 0;
          margin-top: 80px;
          font-family: 'DM Sans', sans-serif;
        }

        .footer-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ── Disclaimer ──────────────────────────────── */
        .disclaimer {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-left: 3px solid #ffc13c;
          border-radius: 12px;
          padding: 22px 24px;
          margin-bottom: 52px;
          backdrop-filter: blur(10px);
        }

        .disclaimer-header {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 12px;
        }

        .disclaimer-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #ffc13c;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          margin: 0;
        }

        .disclaimer-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          line-height: 1.85;
          color: rgba(255, 255, 255, 0.35);
          margin: 0;
        }

        /* ── Content grid ────────────────────────────── */
        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 44px;
          margin-bottom: 44px;
        }

        .footer-section {
          display: flex;
          flex-direction: column;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 16px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .footer-section h3 {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.88);
          margin: 0;
          letter-spacing: 0.01em;
        }

        .footer-section p {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.35);
          line-height: 1.85;
          margin: 0;
        }

        /* ── Nav links ───────────────────────────────── */
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .footer-links li {
          position: relative;
        }

        .footer-links a {
          color: rgba(255, 255, 255, 0.38) !important;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 0 7px 16px;
          letter-spacing: 0.01em;
          transition:
            color 0.2s ease,
            padding-left 0.2s ease;
          position: relative;
        }

        .footer-links a::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255, 193, 60, 0.35);
          transition: background 0.2s ease;
        }

        .footer-links a:hover {
          color: #ffc13c !important;
          padding-left: 20px;
        }

        .footer-links a:hover::before {
          background: #ffc13c;
        }

        /* ── Contact ─────────────────────────────────── */
        .contact-info {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 8px;
          padding: 12px 14px;
          margin-top: 16px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.38);
        }

        .contact-link {
          color: #ffc13c !important;
          text-decoration: none;
          font-weight: 600;
          transition: opacity 0.2s ease;
        }

        .contact-link:hover {
          opacity: 0.75;
        }

        /* ── Divider ─────────────────────────────────── */
        .footer-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.06);
          margin: 0 0 36px;
        }

        /* ── Bottom bar ──────────────────────────────── */
        .footer-bottom {
          text-align: center;
          padding-bottom: 44px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .copyright {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.25);
          margin: 0;
          letter-spacing: 0.02em;
        }

        .made-with {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.25);
        }

        .heart-icon {
          color: #ffc13c;
          display: inline-flex;
          animation: heartbeat 1.8s ease-in-out infinite;
        }

        /* ── TMDb credit ─────────────────────────────── */
        .tmdb-section {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          padding: 16px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          margin-top: 4px;
        }

        .tmdb-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.22);
          text-transform: uppercase;
          letter-spacing: 0.09em;
          font-weight: 600;
          margin: 0;
        }

        .tmdb-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #ffc13c !important;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.01em;
          transition: opacity 0.2s ease;
        }

        .tmdb-link:hover {
          opacity: 0.75;
        }

        .tmdb-disclaimer {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.18);
          text-align: center;
          margin: 0;
          letter-spacing: 0.01em;
        }

        /* ── Responsive ──────────────────────────────── */
        @media (max-width: 768px) {
          .footer {
            padding: 44px 0 0;
            margin-top: 60px;
          }
          .footer-container {
            padding: 0 16px;
          }
          .disclaimer {
            padding: 18px 20px;
            margin-bottom: 36px;
          }
          .footer-content {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .footer-section h3 {
            font-size: 14px;
          }
        }
      `}</style>

      <footer className="footer">
        <div className="footer-container">
          {/* ── Disclaimer ─────────────────────────────── */}
          <div className="disclaimer">
            <div className="disclaimer-header">
              <AlertTriangle size={15} color="#ffc13c" />
              <h4 className="disclaimer-title">Important Disclaimer</h4>
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

          {/* ── Content grid ───────────────────────────── */}
          <div className="footer-content">
            {/* About */}
            <div className="footer-section">
              <div className="section-header">
                <Film size={16} color="#ffc13c" />
                <h3>About Flixet</h3>
              </div>
              <p>
                Flixet is a free streaming aggregator that provides links to
                movies and TV shows from various third-party sources. We do not
                upload or host any files on our servers.
              </p>
              <div className="contact-info">
                <div className="contact-item">
                  <Mail size={13} color="#ffc13c" />
                  <a
                    href="mailto:devajuice@zohomail.in"
                    className="contact-link"
                  >
                    devajuice@zohomail.in
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <div className="section-header">
                <Tv size={16} color="#ffc13c" />
                <h3>Quick Links</h3>
              </div>
              <ul className="footer-links">
                <li>
                  <Link href="/">
                    <Film size={13} />
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/movies">
                    <Film size={13} />
                    Movies
                  </Link>
                </li>
                <li>
                  <Link href="/tv">
                    <Tv size={13} />
                    TV Shows
                  </Link>
                </li>
                <li>
                  <Link href="/coming-soon/movies">
                    <Film size={13} />
                    Upcoming Movies
                  </Link>
                </li>
                <li>
                  <Link href="/coming-soon/tv">
                    <Tv size={13} />
                    On The Air
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="footer-section">
              <div className="section-header">
                <Shield size={16} color="#ffc13c" />
                <h3>Legal</h3>
              </div>
              <ul className="footer-links">
                <li>
                  <Link href="/terms">
                    <FileText size={13} />
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy">
                    <Shield size={13} />
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/dmca">
                    <AlertTriangle size={13} />
                    DMCA
                  </Link>
                </li>
              </ul>
              <p style={{ marginTop: '18px', fontSize: '12px' }}>
                By using this website, you agree to our Terms of Service. Users
                are responsible for complying with their local laws regarding
                online streaming.
              </p>
            </div>
          </div>

          {/* ── Divider ────────────────────────────────── */}
          <div className="footer-divider" />

          {/* ── Bottom bar ─────────────────────────────── */}
          <div className="footer-bottom">
            <p className="copyright">
              © {currentYear} Flixet. All rights reserved.
            </p>

            <div className="made-with">
              Made with <Heart size={13} className="heart-icon" /> by Flixet
              Team
            </div>

            <div className="tmdb-section">
              <p className="tmdb-title">Powered by</p>
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="tmdb-link"
              >
                The Movie Database (TMDb)
                <ExternalLink size={12} />
              </a>
              <p className="tmdb-disclaimer">
                This product uses the TMDb API but is not endorsed or certified
                by TMDb.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
