"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Eye,
  Cookie,
  Lock,
  Users,
  FileText,
  Mail,
  AlertCircle,
} from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <>
      <style>{`
        /* ── Container ─────────────────────────────────── */
        .prv-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 20px 100px;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Header ────────────────────────────────────── */
        .prv-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .prv-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 42px;
          font-weight: 900;
          margin-bottom: 16px;
          color: rgba(255, 255, 255, 0.88);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          letter-spacing: -0.03em;
        }

        .prv-title svg {
          color: #ffc13c;
          flex-shrink: 0;
        }

        .prv-last-updated {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: #ffc13c;
          background: rgba(255, 193, 60, 0.08);
          padding: 6px 16px;
          border-radius: 20px;
          display: inline-block;
          border: 1px solid rgba(255, 193, 60, 0.2);
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        .prv-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.38);
          max-width: 680px;
          margin: 14px auto 0;
          line-height: 1.85;
        }

        /* ── Section cards ─────────────────────────────── */
        .prv-section {
          margin-bottom: 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 28px 30px;
          backdrop-filter: blur(10px);
          transition: border-color 0.2s ease;
        }

        .prv-section:hover {
          border-color: rgba(255, 193, 60, 0.1);
        }

        .prv-section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .prv-section-number {
          width: 32px;
          height: 32px;
          background: rgba(255, 193, 60, 0.1);
          border: 1px solid rgba(255, 193, 60, 0.25);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          font-weight: 800;
          font-size: 13px;
          color: #ffc13c;
          flex-shrink: 0;
        }

        .prv-section-header svg {
          color: #ffc13c;
          flex-shrink: 0;
        }

        .prv-section-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.88);
          margin: 0;
          letter-spacing: 0.01em;
        }

        /* ── Body text ─────────────────────────────────── */
        .prv-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          line-height: 1.85;
          color: rgba(255, 255, 255, 0.38);
          margin-bottom: 14px;
        }

        .prv-text:last-child {
          margin-bottom: 0;
        }

        /* ── List ──────────────────────────────────────── */
        .prv-list {
          list-style: none;
          padding-left: 0;
          margin: 12px 0 0;
        }

        .prv-list li {
          padding: 10px 0 10px 20px;
          position: relative;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.38);
          line-height: 1.7;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .prv-list li:last-child {
          border-bottom: none;
        }

        .prv-list li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255, 193, 60, 0.4);
        }

        /* ── Highlight box ─────────────────────────────── */
        .prv-highlight {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-left: 3px solid #ffc13c;
          border-radius: 10px;
          padding: 14px 16px;
          margin: 14px 0;
        }

        .prv-highlight p {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          line-height: 1.85;
          color: rgba(255, 255, 255, 0.38);
          margin: 0;
        }

        .prv-highlight strong {
          color: #ffc13c;
          font-weight: 700;
        }

        /* ── Service grid ──────────────────────────────── */
        .prv-service-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 10px;
          margin: 14px 0;
        }

        .prv-service-item {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          padding: 14px 16px;
          transition: border-color 0.2s ease;
        }

        .prv-service-item:hover {
          border-color: rgba(255, 193, 60, 0.15);
        }

        .prv-service-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #ffc13c;
          margin-bottom: 5px;
          letter-spacing: 0.01em;
        }

        .prv-service-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.35);
          margin: 0;
          line-height: 1.6;
        }

        /* ── Contact card ──────────────────────────────── */
        .prv-contact-card {
          background: rgba(255, 193, 60, 0.04);
          border: 1px solid rgba(255, 193, 60, 0.15);
          border-radius: 10px;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 14px;
        }

        .prv-contact-card svg {
          color: #ffc13c;
          flex-shrink: 0;
        }

        .prv-contact-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.25);
          text-transform: uppercase;
          letter-spacing: 0.09em;
          margin-bottom: 4px;
        }

        .prv-contact-email {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #ffc13c;
          letter-spacing: 0.01em;
        }

        /* ── Responsive ────────────────────────────────── */
        @media (max-width: 768px) {
          .prv-container {
            padding: 20px 14px 60px;
          }
          .prv-header {
            margin-bottom: 28px;
          }
          .prv-title {
            font-size: 24px;
            flex-direction: column;
            gap: 6px;
          }
          .prv-title svg {
            width: 28px;
            height: 28px;
          }
          .prv-subtitle {
            font-size: 12px;
          }
          .prv-section {
            padding: 16px;
            margin-bottom: 10px;
          }
          .prv-section-title {
            font-size: 14px;
          }
          .prv-text {
            font-size: 12px;
          }
          .prv-list li {
            font-size: 12px;
            padding: 8px 0 8px 18px;
          }
          .prv-highlight p {
            font-size: 12px;
          }
          .prv-service-grid {
            grid-template-columns: 1fr;
          }
          .prv-contact-card {
            flex-direction: column;
            text-align: center;
          }
        }
        @media (max-width: 375px) {
          .prv-container {
            padding: 16px 12px 50px;
          }
          .prv-title {
            font-size: 20px;
          }
          .prv-section {
            padding: 14px;
          }
        }
      `}</style>

      <motion.div
        className="prv-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="prv-header">
          <h1 className="prv-title">
            <Shield size={40} />
            Privacy Policy
          </h1>
          <p className="prv-last-updated">Last Updated: February 25, 2026</p>
          <p className="prv-subtitle">
            Your privacy matters to us. Learn how we handle information and
            protect your data while using Flixet.
          </p>
        </div>

        {[
          {
            num: 1,
            icon: <Eye size={18} />,
            title: "Information We Collect",
            content: (
              <>
                <p className="prv-text">
                  Flixet does not collect personal information from users.
                  However, we may collect:
                </p>
                <ul className="prv-list">
                  <li>
                    Anonymous usage data (page views, browser type, device type)
                  </li>
                  <li>
                    Non-personal technical information (IP address, cookies)
                  </li>
                  <li>
                    Information from third-party embed services you interact
                    with
                  </li>
                </ul>
              </>
            ),
          },
          {
            num: 2,
            icon: <FileText size={18} />,
            title: "How We Use Information",
            content: (
              <>
                <p className="prv-text">
                  Any non-personal information collected may be used to:
                </p>
                <ul className="prv-list">
                  <li>Improve website functionality and user experience</li>
                  <li>Analyze website traffic and usage patterns</li>
                  <li>Maintain and optimize website performance</li>
                </ul>
              </>
            ),
          },
          {
            num: 3,
            icon: <Users size={18} />,
            title: "Third-Party Services",
            content: (
              <>
                <p className="prv-text">
                  Our website uses third-party services including:
                </p>
                <div className="prv-service-grid">
                  <div className="prv-service-item">
                    <div className="prv-service-name">TMDb API</div>
                    <p className="prv-service-desc">
                      For movie and TV show information
                    </p>
                  </div>
                  <div className="prv-service-item">
                    <div className="prv-service-name">Video Embed Services</div>
                    <p className="prv-service-desc">
                      For streaming content (VidSrc, 2Embed, etc.)
                    </p>
                  </div>
                </div>
                <div className="prv-highlight">
                  <p>
                    <strong>Important:</strong> These services may have their
                    own privacy policies and cookies. We are not responsible for
                    the privacy practices of these third-party services.
                  </p>
                </div>
              </>
            ),
          },
          {
            num: 4,
            icon: <Cookie size={18} />,
            title: "Cookies",
            content: (
              <p className="prv-text">
                We may use cookies to enhance user experience. Third-party embed
                services may also set their own cookies. You can disable cookies
                in your browser settings, but this may affect website
                functionality.
              </p>
            ),
          },
          {
            num: 5,
            icon: <Lock size={18} />,
            title: "Data Security",
            content: (
              <p className="prv-text">
                Since we do not collect personal information, there is no
                personal data stored on our servers. However, we cannot
                guarantee the security of data transmitted to third-party
                services.
              </p>
            ),
          },
          {
            num: 6,
            icon: <AlertCircle size={18} />,
            title: "Children's Privacy",
            content: (
              <div className="prv-highlight">
                <p>
                  Our website is not intended for children under 18. We do not
                  knowingly collect information from minors. If you are under
                  18, please do not use this website without parental
                  supervision.
                </p>
              </div>
            ),
          },
          {
            num: 7,
            icon: <FileText size={18} />,
            title: "Changes to Privacy Policy",
            content: (
              <p className="prv-text">
                We may update this Privacy Policy from time to time. Changes
                will be posted on this page with an updated revision date. We
                encourage you to review this policy periodically.
              </p>
            ),
          },
          {
            num: 8,
            icon: <Shield size={18} />,
            title: "Your Rights",
            content: (
              <>
                <p className="prv-text">
                  Since we don't collect personal data, there is no personal
                  information to access, modify, or delete. However, you can:
                </p>
                <ul className="prv-list">
                  <li>Clear your browser cookies at any time</li>
                  <li>
                    Use browser privacy modes (incognito/private browsing)
                  </li>
                  <li>Use ad-blockers and privacy extensions</li>
                  <li>Opt-out of third-party tracking where available</li>
                </ul>
              </>
            ),
          },
          {
            num: 9,
            icon: <Mail size={18} />,
            title: "Contact Us",
            content: (
              <>
                <p className="prv-text">
                  If you have questions or concerns about this Privacy Policy,
                  please don't hesitate to reach out:
                </p>
                <div className="prv-contact-card">
                  <Mail size={24} />
                  <div>
                    <div className="prv-contact-label">Email us at</div>
                    <div className="prv-contact-email">
                      devajuice@zohomail.in
                    </div>
                  </div>
                </div>
              </>
            ),
          },
        ].map((s) => (
          <div key={s.num} className="prv-section">
            <div className="prv-section-header">
              <div className="prv-section-number">{s.num}</div>
              {s.icon}
              <h2 className="prv-section-title">{s.title}</h2>
            </div>
            {s.content}
          </div>
        ))}
      </motion.div>
    </>
  );
}
