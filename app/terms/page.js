'use client';
import { motion } from 'framer-motion';

export default function TermsOfService() {
  return (
    <>
      <style jsx>{`
        .terms-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
        }

        .terms-title {
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
          .terms-title {
            font-size: 28px;
          }

          .section-title {
            font-size: 20px;
          }
        }
      `}</style>

      <motion.div
        className="terms-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="terms-title">Terms of Service</h1>
        <p className="last-updated">Last Updated: December 1, 2025</p>

        <div className="section">
          <h2 className="section-title">1. Acceptance of Terms</h2>
          <p className="section-text">
            By accessing and using Flickster ("the Website"), you accept and
            agree to be bound by the terms and provisions of this agreement. If
            you do not agree to these Terms of Service, please do not use the
            Website.
          </p>
        </div>

        <div className="section">
          <h2 className="section-title">2. Description of Service</h2>
          <p className="section-text">
            Flickster is a free online streaming aggregator that provides links
            to movies and TV shows hosted on third-party platforms. We do not
            host, upload, or store any video content on our servers.
          </p>
        </div>

        <div className="section">
          <h2 className="section-title">3. Third-Party Content</h2>
          <p className="section-text">
            All video content is embedded from third-party sources. We are not
            responsible for:
          </p>
          <ul className="list">
            <li>The availability, quality, or legality of embedded content</li>
            <li>Any advertisements displayed by third-party embed services</li>
            <li>
              Any malware, viruses, or security issues from external sources
            </li>
            <li>
              The accuracy of information provided by third-party services
            </li>
          </ul>
        </div>

        <div className="section">
          <h2 className="section-title">4. User Responsibilities</h2>
          <p className="section-text">
            As a user of this Website, you agree to:
          </p>
          <ul className="list">
            <li>
              Use the Website in compliance with all applicable local, state,
              national, and international laws
            </li>
            <li>Not use the Website for any illegal or unauthorized purpose</li>
            <li>
              Not attempt to gain unauthorized access to any portion of the
              Website
            </li>
            <li>Not transmit any viruses, malware, or other harmful code</li>
            <li>
              Take responsibility for your own actions and the legality of
              content you access
            </li>
            <li>
              Use ad-blockers and antivirus software when accessing third-party
              content
            </li>
          </ul>
        </div>

        <div className="section">
          <h2 className="section-title">5. Intellectual Property</h2>
          <p className="section-text">
            All content, trademarks, and data on this Website are the property
            of their respective copyright holders. We respect intellectual
            property rights and expect our users to do the same. Flickster does
            not claim ownership of any content available through the Website.
          </p>
        </div>

        <div className="section">
          <h2 className="section-title">6. DMCA Compliance</h2>
          <p className="section-text">
            We comply with the Digital Millennium Copyright Act (DMCA). If you
            believe your copyrighted work has been infringed, please contact us
            with:
          </p>
          <ul className="list">
            <li>A description of the copyrighted work</li>
            <li>The URL where the allegedly infringing material is located</li>
            <li>Your contact information</li>
            <li>
              A statement of good faith belief that the use is not authorized
            </li>
            <li>
              A statement that the information is accurate and you are
              authorized to act
            </li>
          </ul>
        </div>

        <div className="section">
          <h2 className="section-title">7. Disclaimer of Warranties</h2>
          <p className="section-text">
            THE WEBSITE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
            WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT
            THAT THE WEBSITE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF
            VIRUSES OR OTHER HARMFUL COMPONENTS.
          </p>
        </div>

        <div className="section">
          <h2 className="section-title">8. Limitation of Liability</h2>
          <p className="section-text">
            IN NO EVENT SHALL Flickster BE LIABLE FOR ANY DIRECT, INDIRECT,
            INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES ARISING
            FROM YOUR USE OF THE WEBSITE OR THIRD-PARTY CONTENT.
          </p>
        </div>

        <div className="section">
          <h2 className="section-title">9. Age Restriction</h2>
          <p className="section-text">
            You must be at least 18 years old to use this Website. By using the
            Website, you represent and warrant that you are at least 18 years of
            age.
          </p>
        </div>

        <div className="section">
          <h2 className="section-title">10. Modifications to Terms</h2>
          <p className="section-text">
            We reserve the right to modify these Terms of Service at any time.
            Your continued use of the Website following any changes constitutes
            your acceptance of the new Terms of Service.
          </p>
        </div>

        <div className="section">
          <h2 className="section-title">11. Termination</h2>
          <p className="section-text">
            We reserve the right to terminate or suspend access to the Website
            immediately, without prior notice or liability, for any reason,
            including breach of these Terms of Service.
          </p>
        </div>

        <div className="section">
          <h2 className="section-title">12. Contact Information</h2>
          <p className="section-text">
            For any questions regarding these Terms of Service, please contact
            us through the information provided on our website.
          </p>
        </div>
      </motion.div>
    </>
  );
}
