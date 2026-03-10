"use client";

import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function DMCAPage() {
  return (
    <>
      <style>{`
        /* ── Container ─────────────────────────────────── */
        .dmca-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 20px 100px;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Header ────────────────────────────────────── */
        .dmca-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .dmca-title {
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

        .dmca-title svg {
          color: #ffc13c;
          flex-shrink: 0;
        }

        .dmca-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.38);
          max-width: 680px;
          margin: 0 auto;
          line-height: 1.85;
        }

        /* ── Important notice banner ───────────────────── */
        .dmca-notice-box {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-left: 3px solid #ffc13c;
          border-radius: 12px;
          padding: 20px 22px;
          margin-bottom: 24px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .dmca-notice-box svg {
          color: #ffc13c;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .dmca-notice-box p {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          line-height: 1.85;
          color: rgba(255, 255, 255, 0.38);
          margin: 0;
        }

        .dmca-notice-box strong {
          color: #ffc13c;
          font-weight: 700;
        }

        /* ── Section cards ─────────────────────────────── */
        .dmca-section {
          margin-bottom: 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 28px 30px;
          backdrop-filter: blur(10px);
          transition: border-color 0.2s ease;
        }

        .dmca-section:hover {
          border-color: rgba(255, 193, 60, 0.1);
        }

        .dmca-section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .dmca-section-header svg {
          color: #ffc13c;
          flex-shrink: 0;
        }

        .dmca-section-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.88);
          margin: 0;
          letter-spacing: 0.01em;
        }

        /* ── Body text ─────────────────────────────────── */
        .dmca-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          line-height: 1.85;
          color: rgba(255, 255, 255, 0.38);
          margin-bottom: 14px;
        }

        .dmca-text:last-child {
          margin-bottom: 0;
        }

        /* ── List ──────────────────────────────────────── */
        .dmca-list {
          list-style: none;
          padding-left: 0;
          margin: 12px 0 0;
        }

        .dmca-list li {
          padding: 10px 0 10px 20px;
          position: relative;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.38);
          line-height: 1.7;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .dmca-list li:last-child {
          border-bottom: none;
        }

        .dmca-list li::before {
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

        /* ── Steps grid ────────────────────────────────── */
        .dmca-steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin-top: 16px;
        }

        .dmca-step-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          padding: 18px 16px;
          text-align: center;
          transition: border-color 0.2s ease;
        }

        .dmca-step-card:hover {
          border-color: rgba(255, 193, 60, 0.15);
        }

        .dmca-step-number {
          width: 34px;
          height: 34px;
          background: rgba(255, 193, 60, 0.1);
          border: 1px solid rgba(255, 193, 60, 0.25);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          font-weight: 800;
          font-size: 14px;
          color: #ffc13c;
          margin: 0 auto 12px;
        }

        .dmca-step-card p {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.38);
          line-height: 1.7;
          margin: 0;
        }

        /* ── Contact card ──────────────────────────────── */
        .dmca-contact-card {
          background: rgba(255, 193, 60, 0.04);
          border: 1px solid rgba(255, 193, 60, 0.15);
          border-radius: 10px;
          padding: 18px 20px;
          margin-top: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .dmca-contact-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
        }

        .dmca-contact-item svg {
          color: #ffc13c;
          flex-shrink: 0;
        }

        .dmca-contact-label {
          color: rgba(255, 255, 255, 0.35);
          font-weight: 600;
        }

        .dmca-contact-value {
          color: #ffc13c;
          font-weight: 700;
        }

        /* ── Responsive ────────────────────────────────── */
        @media (max-width: 768px) {
          .dmca-container {
            padding: 20px 14px 60px;
          }
          .dmca-title {
            font-size: 24px;
            flex-direction: column;
            gap: 6px;
          }
          .dmca-title svg {
            width: 28px;
            height: 28px;
          }
          .dmca-subtitle {
            font-size: 12px;
          }
          .dmca-header {
            margin-bottom: 28px;
          }
          .dmca-section {
            padding: 16px;
            margin-bottom: 10px;
          }
          .dmca-section-title {
            font-size: 14px;
          }
          .dmca-text {
            font-size: 12px;
          }
          .dmca-list li {
            font-size: 12px;
            padding: 8px 0 8px 18px;
          }
          .dmca-notice-box {
            flex-direction: column;
            padding: 14px 16px;
          }
          .dmca-notice-box p {
            font-size: 12px;
          }
          .dmca-steps-grid {
            grid-template-columns: 1fr;
          }
          .dmca-contact-item {
            font-size: 12px;
            flex-wrap: wrap;
          }
        }
        @media (max-width: 375px) {
          .dmca-container {
            padding: 16px 12px 50px;
          }
          .dmca-title {
            font-size: 20px;
          }
          .dmca-section {
            padding: 14px;
          }
        }
      `}</style>

      <motion.div
        className="dmca-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="dmca-header">
          <h1 className="dmca-title">
            <Shield size={40} />
            DMCA Policy
          </h1>
          <p className="dmca-subtitle">
            Flixet respects intellectual property rights and complies with the
            Digital Millennium Copyright Act (DMCA). Learn how we handle
            copyright concerns.
          </p>
        </div>

        {/* Important notice banner */}
        <div className="dmca-notice-box">
          <AlertTriangle size={16} />
          <p>
            <strong>Important Notice:</strong> Flixet does not host, upload, or
            store any video files on our servers. We only provide links to
            content hosted on third-party platforms. All content is embedded
            from external sources.
          </p>
        </div>

        {/* Sections */}
        {[
          {
            icon: <FileText size={18} />,
            title: "Copyright Infringement Notice",
            content: (
              <p className="dmca-text">
                Flixet respects the intellectual property rights of others and
                expects our users to do the same. We comply with the Digital
                Millennium Copyright Act (DMCA) and will respond to valid
                copyright infringement notices promptly and appropriately.
              </p>
            ),
          },
          {
            icon: <Mail size={18} />,
            title: "How to File a DMCA Notice",
            content: (
              <>
                <p className="dmca-text">
                  If you believe that your copyrighted work has been infringed,
                  please provide us with a written notice containing the
                  following information:
                </p>
                <ul className="dmca-list">
                  <li>
                    A physical or electronic signature of the copyright owner or
                    authorized representative
                  </li>
                  <li>
                    Identification of the copyrighted work claimed to have been
                    infringed
                  </li>
                  <li>
                    The specific URL or location on our website where the
                    allegedly infringing material is located
                  </li>
                  <li>
                    Your contact information (name, address, telephone number,
                    and email address)
                  </li>
                  <li>
                    A statement that you have a good faith belief that the
                    disputed use is not authorized
                  </li>
                  <li>
                    A statement that the information in the notice is accurate
                    and, under penalty of perjury, that you are authorized to
                    act on behalf of the copyright owner
                  </li>
                </ul>
              </>
            ),
          },
          {
            icon: <CheckCircle size={18} />,
            title: "Our Response Process",
            content: (
              <>
                <p className="dmca-text">
                  Upon receiving a valid DMCA notice, we will:
                </p>
                <div className="dmca-steps-grid">
                  {[
                    "Review the notice for validity",
                    "Remove or disable access to the link",
                    "Notify the user if applicable",
                  ].map((step, i) => (
                    <div key={i} className="dmca-step-card">
                      <div className="dmca-step-number">{i + 1}</div>
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
              </>
            ),
          },
          {
            icon: <XCircle size={18} />,
            title: "Counter-Notice",
            content: (
              <>
                <p className="dmca-text">
                  If you believe your content was removed in error, you may file
                  a counter-notice containing:
                </p>
                <ul className="dmca-list">
                  <li>Your physical or electronic signature</li>
                  <li>Identification of the material that was removed</li>
                  <li>
                    A statement under penalty of perjury that you have a good
                    faith belief the material was removed by mistake
                  </li>
                  <li>Your contact information and consent to jurisdiction</li>
                </ul>
              </>
            ),
          },
          {
            icon: <AlertTriangle size={18} />,
            title: "Important Notes",
            content: (
              <ul className="dmca-list">
                <li>
                  We are not responsible for content hosted on third-party
                  platforms
                </li>
                <li>
                  Takedown requests should also be sent to the actual content
                  hosting service
                </li>
                <li>
                  False claims may result in legal liability under Section
                  512(f) of the DMCA
                </li>
                <li>
                  We reserve the right to remove any content at our discretion
                </li>
              </ul>
            ),
          },
          {
            icon: <Mail size={18} />,
            title: "Contact for DMCA Notices",
            content: (
              <>
                <p className="dmca-text">
                  Please send all DMCA notices and counter-notices to our
                  designated copyright agent:
                </p>
                <div className="dmca-contact-card">
                  <div className="dmca-contact-item">
                    <Mail size={15} />
                    <span className="dmca-contact-label">Email:</span>
                    <span className="dmca-contact-value">
                      devajuice@zohomail.in
                    </span>
                  </div>
                  <div className="dmca-contact-item">
                    <FileText size={15} />
                    <span className="dmca-contact-label">Subject Line:</span>
                    <span className="dmca-contact-value">
                      "DMCA Takedown Request"
                    </span>
                  </div>
                </div>
              </>
            ),
          },
        ].map((s, i) => (
          <div key={i} className="dmca-section">
            <div className="dmca-section-header">
              {s.icon}
              <h2 className="dmca-section-title">{s.title}</h2>
            </div>
            {s.content}
          </div>
        ))}
      </motion.div>
    </>
  );
}
