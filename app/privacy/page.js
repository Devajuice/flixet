'use client';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  return (
    <>
      <style jsx>{`
        .privacy-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
        }

        .privacy-title {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 10px;
          color: var(--accent);
        }

        .last-updated {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 30px;
        }

        .section {
          margin-bottom: 30px;
        }

        .section-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 15px;
          color: var(--text-primary);
        }

        .section-text {
          font-size: 16px;
          line-height: 1.8;
          color: var(--text-secondary);
          margin-bottom: 15px;
        }

        .list {
          list-style: none;
          padding-left: 0;
        }

        .list li {
          padding: 8px 0 8px 25px;
          position: relative;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .list li:before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--accent);
          font-weight: bold;
          font-size: 20px;
        }

        @media (max-width: 768px) {
          .privacy-title {
            font-size: 28px;
          }

          .section-title {
            font-size: 20px;
          }
        }
      `}</style>

      <motion.div
        className="privacy-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="privacy-title">Privacy Policy</h1>
        <p className="last-updated">Last Updated: December 1, 2025</p>

        <div className="section">
          <h2 className="section-title">1. Information We Collect</h2>
          <p className="section-text">
            Flixet does not collect personal information from users. However, we
            may collect:
          </p>
          <ul className="list">
            <li>
              Anonymous usage data (page views, browser type, device type)
            </li>
            <li>Non-personal technical information (IP address, cookies)</li>
            <li>
              Information from third-party embed services you interact with
            </li>
          </ul>
        </div>

        <div className="section">
          <h2 className="section-title">2. How We Use Information</h2>
          <p className="section-text">
            Any non-personal information collected may be used to:
          </p>
          <ul className="list">
            <li>Improve website functionality and user experience</li>
            <li>Analyze website traffic and usage patterns</li>
            <li>Maintain and optimize website performance</li>
          </ul>
        </div>

        <div className="section">
          <h2 className="section-title">3. Third-Party Services</h2>
          <p className="section-text">
            Our website uses third-party services including:
          </p>
          <ul className="list">
            <li>
              <strong>TMDb API:</strong> For movie and TV show information
            </li>
            <li>
              <strong>Video Embed Services:</strong> For streaming content
              (VidSrc, 2Embed, etc.)
            </li>
            <li>
              <strong>
                These services may have their own privacy policies and cookies
              </strong>
            </li>
          </ul>
          <p className="section-text">
            We are not responsible for the privacy practices of these
            third-party services.
          </p>
        </div>

        <div className="section">
          <h2 className="section-title">4. Cookies</h2>
          <p className="section-text">
            We may use cookies to enhance user experience. Third-party embed
            services may also set their own cookies. You can disable cookies in
            your browser settings, but this may affect website functionality.
          </p>
        </div>

        <div className="section">
          <h2 className="section-title">5. Data Security</h2>
          <p className="section-text">
            Since we do not collect personal information, there is no personal
            data stored on our servers. However, we cannot guarantee the
            security of data transmitted to third-party services.
          </p>
        </div>

        <div className="section">
          <h2 className="section-title">6. Children's Privacy</h2>
          <p className="section-text">
            Our website is not intended for children under 18. We do not
            knowingly collect information from minors. If you are under 18,
            please do not use this website.
          </p>
        </div>

        <div className="section">
          <h2 className="section-title">7. Changes to Privacy Policy</h2>
          <p className="section-text">
            We may update this Privacy Policy from time to time. Changes will be
            posted on this page with an updated revision date.
          </p>
        </div>

        <div className="section">
          <h2 className="section-title">8. Your Rights</h2>
          <p className="section-text">
            Since we don't collect personal data, there is no personal
            information to access, modify, or delete. However, you can:
          </p>
          <ul className="list">
            <li>Clear your browser cookies at any time</li>
            <li>Use browser privacy modes (incognito/private browsing)</li>
            <li>Use ad-blockers and privacy extensions</li>
          </ul>
        </div>

        <div className="section">
          <h2 className="section-title">9. Contact Us</h2>
          <p className="section-text">
            If you have questions about this Privacy Policy, please contact us
            through the information provided on our website.
          </p>
        </div>
      </motion.div>
    </>
  );
}
