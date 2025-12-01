'use client';
import { motion } from 'framer-motion';

export default function DMCAPage() {
  return (
    <>
      <style jsx>{`
        .dmca-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
        }

        .dmca-title {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 10px;
          color: var(--accent);
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

        .notice-box {
          background-color: rgba(229, 9, 20, 0.1);
          border-left: 4px solid var(--accent);
          padding: 20px;
          border-radius: 5px;
          margin: 20px 0;
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
          .dmca-title {
            font-size: 28px;
          }

          .section-title {
            font-size: 20px;
          }
        }
      `}</style>

      <motion.div
        className="dmca-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="dmca-title">DMCA Notice</h1>

        <div className="notice-box">
          <p className="section-text" style={{ marginBottom: 0 }}>
            <strong>Important:</strong> Flickster does not host, upload, or
            store any video files on our servers. We only provide links to
            content hosted on third-party platforms. All content is embedded
            from external sources.
          </p>
        </div>

        <div className="section">
          <h2 className="section-title">Copyright Infringement Notice</h2>
          <p className="section-text">
            Flickster respects the intellectual property rights of others and
            expects our users to do the same. We comply with the Digital
            Millennium Copyright Act (DMCA) and will respond to valid copyright
            infringement notices.
          </p>
        </div>

        <div className="section">
          <h2 className="section-title">How to File a DMCA Notice</h2>
          <p className="section-text">
            If you believe that your copyrighted work has been infringed, please
            provide us with a written notice containing the following
            information:
          </p>
          <ul className="list">
            <li>
              A physical or electronic signature of the copyright owner or
              authorized representative
            </li>
            <li>
              Identification of the copyrighted work claimed to have been
              infringed
            </li>
            <li>
              The specific URL or location on our website where the allegedly
              infringing material is located
            </li>
            <li>
              Your contact information (name, address, telephone number, and
              email address)
            </li>
            <li>
              A statement that you have a good faith belief that the disputed
              use is not authorized
            </li>
            <li>
              A statement that the information in the notice is accurate and,
              under penalty of perjury, that you are authorized to act on behalf
              of the copyright owner
            </li>
          </ul>
        </div>

        <div className="section">
          <h2 className="section-title">What We Will Do</h2>
          <p className="section-text">
            Upon receiving a valid DMCA notice, we will:
          </p>
          <ul className="list">
            <li>
              Remove or disable access to the allegedly infringing content link
            </li>
            <li>Notify the user who posted the content (if applicable)</li>
            <li>Take appropriate action as required by law</li>
          </ul>
        </div>

        <div className="section">
          <h2 className="section-title">Counter-Notice</h2>
          <p className="section-text">
            If you believe your content was removed in error, you may file a
            counter-notice containing:
          </p>
          <ul className="list">
            <li>Your physical or electronic signature</li>
            <li>Identification of the material that was removed</li>
            <li>
              A statement under penalty of perjury that you have a good faith
              belief the material was removed by mistake
            </li>
            <li>Your contact information and consent to jurisdiction</li>
          </ul>
        </div>

        <div className="section">
          <h2 className="section-title">Important Notes</h2>
          <ul className="list">
            <li>
              We are not responsible for content hosted on third-party platforms
            </li>
            <li>
              Takedown requests should also be sent to the actual content
              hosting service
            </li>
            <li>False claims may result in legal liability</li>
            <li>
              We reserve the right to remove any content at our discretion
            </li>
          </ul>
        </div>

        <div className="section">
          <h2 className="section-title">Contact for DMCA Notices</h2>
          <p className="section-text">
            Please send all DMCA notices and counter-notices to:
            <br />
            <strong>Email:</strong> deva12jith@gmail.com
            <br />
            <strong>Subject Line:</strong> "DMCA Takedown Request" or "DMCA
            Counter-Notice"
          </p>
        </div>
      </motion.div>
    </>
  );
}
