"use client";

import { motion } from "framer-motion";
import {
  FileText,
  ShieldCheck,
  Globe,
  Users,
  Copyright,
  Shield,
  AlertTriangle,
  UserX,
  Edit,
  Ban,
  Mail,
} from "lucide-react";

export default function TermsOfService() {
  return (
    <>
      <style>{`
        /* ── Container ─────────────────────────────────── */
        .terms-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 20px 100px;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Header ────────────────────────────────────── */
        .terms-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .terms-title {
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

        .terms-title svg {
          color: #ffc13c;
          flex-shrink: 0;
        }

        .last-updated {
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

        .terms-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.38);
          max-width: 680px;
          margin: 14px auto 0;
          line-height: 1.85;
        }

        /* ── Section cards ─────────────────────────────── */
        .terms-section {
          margin-bottom: 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 28px 30px;
          backdrop-filter: blur(10px);
          transition: border-color 0.2s ease;
        }

        .terms-section:hover {
          border-color: rgba(255, 193, 60, 0.1);
        }

        .terms-section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .terms-section-number {
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

        .terms-section-header svg {
          color: #ffc13c;
          flex-shrink: 0;
        }

        .terms-section-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.88);
          margin: 0;
          letter-spacing: 0.01em;
        }

        /* ── Body text ─────────────────────────────────── */
        .terms-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          line-height: 1.85;
          color: rgba(255, 255, 255, 0.38);
          margin-bottom: 14px;
        }

        .terms-text:last-child {
          margin-bottom: 0;
        }

        /* ── List ──────────────────────────────────────── */
        .terms-list {
          list-style: none;
          padding-left: 0;
          margin: 12px 0 0;
        }

        .terms-list li {
          padding: 10px 0 10px 20px;
          position: relative;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.38);
          line-height: 1.7;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .terms-list li:last-child {
          border-bottom: none;
        }

        .terms-list li::before {
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

        /* ── Warning box ───────────────────────────────── */
        .terms-warning {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-left: 3px solid #ffc13c;
          border-radius: 10px;
          padding: 14px 16px;
          margin: 16px 0;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .terms-warning svg {
          color: #ffc13c;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .terms-warning p {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          line-height: 1.85;
          color: rgba(255, 255, 255, 0.38);
          margin: 0;
        }

        .terms-warning strong {
          color: #ffc13c;
          font-weight: 700;
        }

        /* ── Disclaimer box ────────────────────────────── */
        .terms-disclaimer {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          padding: 16px 18px;
          margin: 14px 0;
        }

        .terms-disclaimer p {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          line-height: 1.85;
          color: rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0;
        }

        /* ── Contact card ──────────────────────────────── */
        .terms-contact-card {
          background: rgba(255, 193, 60, 0.04);
          border: 1px solid rgba(255, 193, 60, 0.15);
          border-radius: 10px;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 14px;
        }

        .terms-contact-card svg {
          color: #ffc13c;
          flex-shrink: 0;
        }

        .terms-contact-card p {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.38);
          margin: 0;
          line-height: 1.7;
        }

        .terms-contact-card strong {
          color: #ffc13c;
          font-weight: 700;
        }

        /* ── Responsive ────────────────────────────────── */
        @media (max-width: 768px) {
          .terms-container {
            padding: 20px 14px 60px;
          }
          .terms-header {
            margin-bottom: 28px;
          }
          .terms-title {
            font-size: 24px;
            flex-direction: column;
            gap: 6px;
          }
          .terms-title svg {
            width: 28px;
            height: 28px;
          }
          .terms-subtitle {
            font-size: 12px;
          }
          .terms-section {
            padding: 16px;
            margin-bottom: 10px;
          }
          .terms-section-title {
            font-size: 14px;
          }
          .terms-text {
            font-size: 12px;
          }
          .terms-list li {
            font-size: 12px;
            padding: 8px 0 8px 18px;
          }
          .terms-warning {
            flex-direction: column;
          }
          .terms-warning p {
            font-size: 12px;
          }
          .terms-disclaimer p {
            font-size: 11px;
          }
          .terms-contact-card {
            flex-direction: column;
            text-align: center;
          }
          .terms-contact-card p {
            font-size: 12px;
          }
        }
        @media (max-width: 375px) {
          .terms-container {
            padding: 16px 12px 50px;
          }
          .terms-title {
            font-size: 20px;
          }
          .terms-section {
            padding: 14px;
          }
        }
      `}</style>

      <motion.div
        className="terms-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="terms-header">
          <h1 className="terms-title">
            <FileText size={40} />
            Terms of Service
          </h1>
          <p className="last-updated">Last Updated: February 25, 2026</p>
          <p className="terms-subtitle">
            Please read these terms carefully before using Flixet. By accessing
            our website, you agree to be bound by these terms.
          </p>
        </div>

        {[
          {
            num: 1,
            icon: <ShieldCheck size={18} />,
            title: "Acceptance of Terms",
            content: (
              <p className="terms-text">
                By accessing and using Flixet ("the Website"), you accept and
                agree to be bound by the terms and provisions of this agreement.
                If you do not agree to these Terms of Service, please do not use
                the Website.
              </p>
            ),
          },
          {
            num: 2,
            icon: <Globe size={18} />,
            title: "Description of Service",
            content: (
              <>
                <p className="terms-text">
                  Flixet is a free online streaming aggregator that provides
                  links to movies and TV shows hosted on third-party platforms.
                  We do not host, upload, or store any video content on our
                  servers.
                </p>
                <div className="terms-warning">
                  <AlertTriangle size={16} />
                  <p>
                    <strong>Important:</strong> All content is provided by
                    third-party sources. We act solely as an aggregator and
                    directory service.
                  </p>
                </div>
              </>
            ),
          },
          {
            num: 3,
            icon: <Users size={18} />,
            title: "Third-Party Content",
            content: (
              <>
                <p className="terms-text">
                  All video content is embedded from third-party sources. We are
                  not responsible for:
                </p>
                <ul className="terms-list">
                  <li>
                    The availability, quality, or legality of embedded content
                  </li>
                  <li>
                    Any advertisements displayed by third-party embed services
                  </li>
                  <li>
                    Any malware, viruses, or security issues from external
                    sources
                  </li>
                  <li>
                    The accuracy of information provided by third-party services
                  </li>
                </ul>
              </>
            ),
          },
          {
            num: 4,
            icon: <Shield size={18} />,
            title: "User Responsibilities",
            content: (
              <>
                <p className="terms-text">
                  As a user of this Website, you agree to:
                </p>
                <ul className="terms-list">
                  <li>
                    Use the Website in compliance with all applicable local,
                    state, national, and international laws
                  </li>
                  <li>
                    Not use the Website for any illegal or unauthorized purpose
                  </li>
                  <li>
                    Not attempt to gain unauthorized access to any portion of
                    the Website
                  </li>
                  <li>
                    Not transmit any viruses, malware, or other harmful code
                  </li>
                  <li>
                    Take responsibility for your own actions and the legality of
                    content you access
                  </li>
                  <li>
                    Use ad-blockers and antivirus software when accessing
                    third-party content
                  </li>
                </ul>
              </>
            ),
          },
          {
            num: 5,
            icon: <Copyright size={18} />,
            title: "Intellectual Property",
            content: (
              <p className="terms-text">
                All content, trademarks, and data on this Website are the
                property of their respective copyright holders. We respect
                intellectual property rights and expect our users to do the
                same. Flixet does not claim ownership of any content available
                through the Website.
              </p>
            ),
          },
          {
            num: 6,
            icon: <ShieldCheck size={18} />,
            title: "DMCA Compliance",
            content: (
              <>
                <p className="terms-text">
                  We comply with the Digital Millennium Copyright Act (DMCA). If
                  you believe your copyrighted work has been infringed, please
                  contact us with:
                </p>
                <ul className="terms-list">
                  <li>A description of the copyrighted work</li>
                  <li>
                    The URL where the allegedly infringing material is located
                  </li>
                  <li>Your contact information</li>
                  <li>
                    A statement of good faith belief that the use is not
                    authorized
                  </li>
                  <li>
                    A statement that the information is accurate and you are
                    authorized to act
                  </li>
                </ul>
              </>
            ),
          },
          {
            num: 7,
            icon: <AlertTriangle size={18} />,
            title: "Disclaimer of Warranties",
            content: (
              <div className="terms-disclaimer">
                <p>
                  The website is provided "as is" and "as available" without
                  warranties of any kind, either express or implied. We do not
                  warrant that the website will be uninterrupted, error-free, or
                  free of viruses or other harmful components.
                </p>
              </div>
            ),
          },
          {
            num: 8,
            icon: <Shield size={18} />,
            title: "Limitation of Liability",
            content: (
              <div className="terms-disclaimer">
                <p>
                  In no event shall Flixet be liable for any direct, indirect,
                  incidental, special, consequential, or exemplary damages
                  arising from your use of the website or third-party content.
                </p>
              </div>
            ),
          },
          {
            num: 9,
            icon: <UserX size={18} />,
            title: "Age Restriction",
            content: (
              <div className="terms-warning">
                <AlertTriangle size={16} />
                <p>
                  <strong>18+ Only:</strong> You must be at least 18 years old
                  to use this Website. By using the Website, you represent and
                  warrant that you are at least 18 years of age.
                </p>
              </div>
            ),
          },
          {
            num: 10,
            icon: <Edit size={18} />,
            title: "Modifications to Terms",
            content: (
              <p className="terms-text">
                We reserve the right to modify these Terms of Service at any
                time. Your continued use of the Website following any changes
                constitutes your acceptance of the new Terms of Service. We
                encourage you to review these terms periodically.
              </p>
            ),
          },
          {
            num: 11,
            icon: <Ban size={18} />,
            title: "Termination",
            content: (
              <p className="terms-text">
                We reserve the right to terminate or suspend access to the
                Website immediately, without prior notice or liability, for any
                reason, including breach of these Terms of Service.
              </p>
            ),
          },
          {
            num: 12,
            icon: <Mail size={18} />,
            title: "Contact Information",
            content: (
              <>
                <p className="terms-text">
                  For any questions or concerns regarding these Terms of
                  Service, please contact us:
                </p>
                <div className="terms-contact-card">
                  <Mail size={24} />
                  <p>
                    Reach out through the contact information provided on our
                    website or email us at{" "}
                    <strong>devajuice@zohomail.in</strong>
                  </p>
                </div>
              </>
            ),
          },
        ].map((s) => (
          <div key={s.num} className="terms-section">
            <div className="terms-section-header">
              <div className="terms-section-number">{s.num}</div>
              {s.icon}
              <h2 className="terms-section-title">{s.title}</h2>
            </div>
            {s.content}
          </div>
        ))}
      </motion.div>
    </>
  );
}
