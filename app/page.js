'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Film,
  Tv,
  DollarSign,
  Library,
  Smartphone,
  UserX,
  RefreshCw,
  Search,
  AlertTriangle,
  ArrowRight,
  Play,
  Star,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import ContinueWatchingSection from '@/components/ContinueWatchingSection';

export default function HomePage() {
  return (
    <>
      <style jsx global>{`
        /* ── Hero ─────────────────────────────────────────── */
        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background:
            linear-gradient(
              135deg,
              rgba(255, 193, 60, 0.08) 0%,
              rgba(13, 13, 15, 0.88) 50%,
              rgba(13, 13, 15, 0.97) 100%
            ),
            url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80');
          background-size: cover;
          background-position: center;
          z-index: 0;
        }

        .hero-background::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            circle at 30% 50%,
            rgba(255, 193, 60, 0.07) 0%,
            transparent 55%
          );
        }

        .hero-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 36px;
          font-weight: 900;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #ffffff 0%, #ffc13c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1.1;
          letter-spacing: -0.5px;
        }

        .hero-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 35px;
          line-height: 1.8;
          font-weight: 400;
          max-width: 650px;
          margin-left: auto;
          margin-right: auto;
          padding: 0 10px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 193, 60, 0.08);
          border: 1px solid rgba(255, 193, 60, 0.25);
          padding: 8px 18px;
          border-radius: 50px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #ffc13c;
          margin-bottom: 25px;
          backdrop-filter: blur(10px);
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        .hero-content-wrapper {
          background: rgba(13, 13, 15, 0.5);
          backdrop-filter: blur(20px);
          padding: 40px 20px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
          position: relative;
          z-index: 1;
        }

        /* ── Features ─────────────────────────────────────── */
        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin: 40px 0;
          padding: 0 15px;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.02);
          padding: 25px 20px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 3px;
          height: 0;
          background: linear-gradient(
            180deg,
            #ffc13c 0%,
            rgba(255, 193, 60, 0.3) 100%
          );
          border-radius: 0 0 3px 3px;
          transition: height 0.35s ease;
        }

        .feature-card:hover::before,
        .feature-card:active::before {
          height: 100%;
        }

        .feature-card:hover,
        .feature-card:active {
          transform: translateY(-5px);
          border-color: rgba(255, 193, 60, 0.15);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
          background: rgba(255, 193, 60, 0.03);
        }

        .feature-icon-wrapper {
          width: 48px;
          height: 48px;
          background: rgba(255, 193, 60, 0.1);
          border: 1px solid rgba(255, 193, 60, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          color: #ffc13c;
        }

        .feature-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 10px;
          color: rgba(255, 255, 255, 0.88);
          letter-spacing: 0.01em;
        }

        .feature-description {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.38);
          line-height: 1.85;
        }

        /* ── Stats ────────────────────────────────────────── */
        .stats-section {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          padding: 40px 20px;
          border-radius: 18px;
          margin: 40px 15px;
          text-align: center;
          backdrop-filter: blur(10px);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-top: 30px;
        }

        .stat-item {
          padding: 20px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          transition: all 0.2s ease;
        }

        .stat-item:hover,
        .stat-item:active {
          border-color: rgba(255, 193, 60, 0.2);
          background: rgba(255, 193, 60, 0.03);
          transform: translateY(-3px);
        }

        .stat-number {
          font-family: 'DM Sans', sans-serif;
          font-size: 36px;
          font-weight: 900;
          color: #ffc13c;
          margin-bottom: 6px;
          letter-spacing: -0.03em;
        }

        .stat-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.38);
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        /* ── Info & shared sections ───────────────────────── */
        .info-section {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          padding: 35px 20px;
          border-radius: 18px;
          margin: 40px 15px;
        }

        .info-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 22px;
          font-weight: 800;
          margin-bottom: 20px;
          color: rgba(255, 255, 255, 0.88);
          letter-spacing: -0.02em;
        }

        .info-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          line-height: 1.85;
          color: rgba(255, 255, 255, 0.38);
          margin-bottom: 16px;
        }

        /* ── Section headers ─────────────────────────────── */
        .section-header {
          text-align: center;
          margin-bottom: 35px;
          padding: 0 15px;
        }

        .section-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.88);
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }

        .section-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.35);
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        /* ── Steps ───────────────────────────────────────── */
        .step-card {
          display: flex;
          gap: 15px;
          align-items: flex-start;
          padding: 18px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          transition: border-color 0.2s ease;
        }

        .step-card:hover {
          border-color: rgba(255, 193, 60, 0.15);
        }

        .step-number {
          min-width: 38px;
          height: 38px;
          background: rgba(255, 193, 60, 0.1);
          border: 1px solid rgba(255, 193, 60, 0.25);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 800;
          color: #ffc13c;
          flex-shrink: 0;
        }

        .step-content h4 {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 6px;
          color: rgba(255, 255, 255, 0.88);
        }

        .step-content p {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.38);
          line-height: 1.85;
          margin: 0;
        }

        /* ── Notice ──────────────────────────────────────── */
        .notice-section {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-left: 3px solid #ffc13c;
          padding: 30px 20px;
          border-radius: 12px;
          margin: 40px 15px;
          backdrop-filter: blur(10px);
        }

        .notice-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 20px;
          color: #ffc13c;
          display: flex;
          align-items: center;
          gap: 9px;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        .notice-content {
          display: grid;
          gap: 14px;
        }

        .notice-content p {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.35);
          line-height: 1.85;
          margin: 0;
        }

        /* ── CTA ─────────────────────────────────────────── */
        .cta-section {
          text-align: center;
          padding: 50px 20px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 20px;
          margin: 40px 15px 60px;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }

        .cta-section::before {
          content: '';
          position: absolute;
          top: -60%;
          right: -30%;
          width: 60%;
          height: 200%;
          background: radial-gradient(
            circle,
            rgba(255, 193, 60, 0.04) 0%,
            transparent 70%
          );
          pointer-events: none;
        }

        .cta-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 26px;
          font-weight: 900;
          margin-bottom: 14px;
          color: rgba(255, 255, 255, 0.88);
          letter-spacing: -0.02em;
        }

        .cta-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.38);
          margin-bottom: 35px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          padding: 0 10px;
          line-height: 1.85;
        }

        .btn-icon {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .trust-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 15px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.25);
          text-transform: uppercase;
          letter-spacing: 0.07em;
          flex-wrap: wrap;
        }

        /* ── Responsive: Tablet ──────────────────────────── */
        @media (min-width: 768px) {
          .hero-title {
            font-size: 52px;
            letter-spacing: -1px;
          }
          .hero-subtitle {
            font-size: 18px;
          }
          .hero-content-wrapper {
            padding: 70px 50px;
            border-radius: 24px;
          }
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin: 50px 0;
          }
          .feature-card {
            padding: 28px 24px;
          }
          .stats-section {
            padding: 50px 35px;
            margin: 50px 0;
          }
          .stats-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }
          .stat-number {
            font-size: 40px;
          }
          .info-section {
            padding: 45px 35px;
            margin: 50px 0;
          }
          .info-title {
            font-size: 26px;
          }
          .section-title {
            font-size: 30px;
          }
          .cta-section {
            padding: 75px 30px;
            margin: 50px 0 60px;
          }
          .cta-title {
            font-size: 32px;
          }
          .notice-section {
            padding: 35px 30px;
            margin: 50px 0;
          }
        }

        /* ── Responsive: Desktop ─────────────────────────── */
        @media (min-width: 1024px) {
          .hero-title {
            font-size: 68px;
            letter-spacing: -1.5px;
          }
          .hero-subtitle {
            font-size: 20px;
          }
          .hero-content-wrapper {
            padding: 90px 70px;
          }
          .features-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            margin: 60px 0;
          }
          .feature-card {
            padding: 32px 28px;
          }
          .stats-section {
            padding: 60px 40px;
            margin: 60px 0;
          }
          .stats-grid {
            gap: 24px;
            margin-top: 40px;
          }
          .stat-number {
            font-size: 44px;
          }
          .info-section {
            padding: 50px 40px;
          }
          .info-title {
            font-size: 28px;
          }
          .section-title {
            font-size: 32px;
          }
          .cta-section {
            padding: 100px 30px;
          }
          .cta-title {
            font-size: 38px;
          }
          .notice-section {
            padding: 40px;
          }
        }

        /* ── Responsive: Small phones ────────────────────── */
        @media (max-width: 375px) {
          .hero-title {
            font-size: 30px;
          }
          .hero-subtitle {
            font-size: 14px;
          }
          .hero-content-wrapper {
            padding: 32px 16px;
          }
          .section-title {
            font-size: 22px;
          }
          .info-title {
            font-size: 20px;
          }
          .cta-title {
            font-size: 22px;
          }
          .notice-title {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 768px) {
          .hero-background {
            background-attachment: scroll;
          }
        }
      `}</style>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section style={styles.hero}>
        <div className="hero-background" />
        <motion.div
          style={styles.heroContent}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.6, 0.05, 0.01, 0.9] }}
        >
          <div className="hero-content-wrapper">
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Sparkles size={13} />
              <span>100% Free Streaming</span>
            </motion.div>

            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Stream Unlimited
              <br />
              Entertainment
            </motion.h1>

            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Discover thousands of movies, TV shows & anime. No subscription,
              no registration, completely free.
            </motion.p>

            <motion.div
              style={styles.heroButtons}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Link href="/movies">
                <motion.button
                  style={styles.primaryButton}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="btn-icon">
                    <Play size={17} fill="#0d0d0f" color="#0d0d0f" /> Start
                    Watching
                  </span>
                </motion.button>
              </Link>
              <Link href="/tv">
                <motion.button
                  style={styles.secondaryButton}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="btn-icon">
                    <Tv size={17} /> Browse Library
                  </span>
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              className="trust-badge"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <Star size={12} fill="#ffc13c" color="#ffc13c" />
              <span>Trusted by thousands worldwide</span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── Continue Watching ────────────────────────────────── */}
      <ContinueWatchingSection />

      {/* ── Stats ────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="stats-section">
          <div className="section-header">
            <h2 className="section-title">Flixet by the Numbers</h2>
            <p className="section-subtitle">
              Join thousands streaming their favorite content
            </p>
          </div>
          <div className="stats-grid">
            {[
              {
                icon: <TrendingUp size={22} color="#ffc13c" />,
                number: '15,000+',
                label: 'Movies & Shows',
              },
              {
                icon: <Film size={22} color="#ffc13c" />,
                number: '100%',
                label: 'Free Forever',
              },
              {
                icon: <Sparkles size={22} color="#ffc13c" />,
                number: '24/7',
                label: 'Always Available',
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="stat-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div style={{ marginBottom: '10px' }}>{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Features ─────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="section-header">
          <h2 className="section-title">Why Choose Flixet?</h2>
          <p className="section-subtitle">
            Everything you need for the perfect streaming experience
          </p>
        </div>
        <div className="features-grid">
          {[
            {
              icon: <DollarSign size={22} />,
              title: '100% Free',
              description:
                'No subscription fees, no hidden costs, no credit card required. Enjoy unlimited streaming completely free.',
            },
            {
              icon: <Library size={22} />,
              title: 'Massive Library',
              description:
                'Access thousands of movies, TV shows and anime from various genres. New content added regularly.',
            },
            {
              icon: <Smartphone size={22} />,
              title: 'Any Device',
              description:
                'Watch on your phone, tablet, laptop, or smart TV. Fully responsive design for all screen sizes.',
            },
            {
              icon: <UserX size={22} />,
              title: 'No Registration',
              description:
                'Start watching immediately. No account creation, no email required. Just click and play.',
            },
            {
              icon: <RefreshCw size={22} />,
              title: 'Multiple Servers',
              description:
                "If one server doesn't work, switch to another. We provide multiple streaming options for reliability.",
            },
            {
              icon: <Search size={22} />,
              title: 'Smart Search',
              description:
                'Find what you want to watch quickly with our powerful search. Browse by genre, year, or rating.',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon-wrapper">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── What is Flixet ───────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="info-section">
          <h2 className="info-title">What is Flixet?</h2>
          <p className="info-text">
            Flixet is a free streaming aggregator that brings you unlimited
            access to thousands of movies, TV shows and anime. We search and
            compile content from various third-party streaming sources, making
            it easy for you to find and watch your favorite entertainment in one
            place.
          </p>
          <p className="info-text">
            Unlike traditional streaming platforms, Flixet doesn't require any
            subscription, registration, or payment. We believe entertainment
            should be accessible to everyone. Our platform is completely free
            and always will be.
          </p>
          <p className="info-text">
            <strong style={{ color: '#ffc13c' }}>Important:</strong> We don't
            host any video content on our servers. All videos are embedded from
            legitimate third-party sources. We simply provide a convenient way
            to discover and access content that's already available on the
            internet.
          </p>
        </div>
      </motion.section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="info-section">
          <h2 className="info-title">How Does Flixet Work?</h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {[
              {
                step: '1',
                title: 'Browse or Search',
                description:
                  "Explore our extensive library of movies and TV shows, or use the search function to find exactly what you're looking for.",
              },
              {
                step: '2',
                title: 'Click to Watch',
                description:
                  "Select any title and you'll be taken to the streaming page where multiple server options are available.",
              },
              {
                step: '3',
                title: 'Choose Your Server',
                description:
                  "We provide multiple streaming servers. If one doesn't work or has too many ads, simply switch to another server.",
              },
              {
                step: '4',
                title: 'Enjoy',
                description:
                  'Sit back and enjoy your movie, TV show or anime. For TV shows and anime, you can easily select different seasons and episodes.',
              },
            ].map((item) => (
              <div key={item.step} className="step-card">
                <div className="step-number">{item.step}</div>
                <div className="step-content">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Important Notice ─────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="notice-section">
          <h2 className="notice-title">
            <AlertTriangle size={15} color="#ffc13c" /> Important Information
          </h2>
          <div className="notice-content">
            <p>
              <strong style={{ color: 'rgba(255,255,255,0.7)' }}>
                Ad Blockers Recommended:
              </strong>{' '}
              The third-party streaming services we use may display
              advertisements. We recommend using an ad blocker extension (like
              uBlock Origin) for the best viewing experience.
            </p>
            <p>
              <strong style={{ color: 'rgba(255,255,255,0.7)' }}>
                Legal Disclaimer:
              </strong>{' '}
              Flixet is a search engine for streaming content. We do not host,
              upload, or control any of the video content. All content is
              provided by third-party sources.
            </p>
            <p>
              <strong style={{ color: 'rgba(255,255,255,0.7)' }}>
                User Responsibility:
              </strong>{' '}
              Users are responsible for ensuring they comply with local laws
              regarding online streaming in their jurisdiction.
            </p>
          </div>
        </div>
      </motion.section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <motion.div
        className="cta-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <h2 className="cta-title">Ready to Start Watching?</h2>
        <p className="cta-text">
          Thousands of movies, TV shows and anime are waiting for you. No signup
          required.
        </p>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Link href="/movies">
            <motion.button style={styles.ctaButton} whileTap={{ scale: 0.95 }}>
              <span className="btn-icon">
                Browse Movies <ArrowRight size={17} />
              </span>
            </motion.button>
          </Link>
          <Link href="/tv">
            <motion.button
              style={styles.ctaButtonOutline}
              whileTap={{ scale: 0.95 }}
            >
              <span className="btn-icon">
                Browse TV Shows <ArrowRight size={17} />
              </span>
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </>
  );
}

const styles = {
  hero: {
    position: 'relative',
    minHeight: '85vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '30px 15px',
    textAlign: 'center',
    marginBottom: '40px',
    overflow: 'hidden',
  },
  heroContent: {
    maxWidth: '1000px',
    width: '100%',
  },
  heroButtons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '25px',
  },
  primaryButton: {
    background: '#ffc13c',
    color: '#0d0d0f',
    padding: '14px 32px',
    borderRadius: '10px',
    fontSize: '14px',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: '700',
    cursor: 'pointer',
    border: 'none',
    letterSpacing: '0.01em',
    transition: 'opacity 0.2s ease',
  },
  secondaryButton: {
    background: 'rgba(13, 13, 15, 0.6)',
    color: 'rgba(255,255,255,0.7)',
    padding: '14px 32px',
    borderRadius: '10px',
    fontSize: '14px',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: '600',
    border: '1px solid rgba(255, 193, 60, 0.2)',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    letterSpacing: '0.01em',
    transition: 'all 0.2s ease',
  },
  ctaButton: {
    background: '#ffc13c',
    color: '#0d0d0f',
    padding: '13px 28px',
    borderRadius: '10px',
    fontSize: '14px',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: '700',
    cursor: 'pointer',
    border: 'none',
    letterSpacing: '0.01em',
    transition: 'opacity 0.2s ease',
  },
  ctaButtonOutline: {
    background: 'rgba(13, 13, 15, 0.6)',
    color: 'rgba(255,255,255,0.6)',
    padding: '13px 28px',
    borderRadius: '10px',
    fontSize: '14px',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: '600',
    cursor: 'pointer',
    border: '1px solid rgba(255, 193, 60, 0.2)',
    backdropFilter: 'blur(10px)',
    letterSpacing: '0.01em',
    transition: 'all 0.2s ease',
  },
};
