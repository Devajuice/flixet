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
      <style jsx>{`
        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
              135deg,
              rgba(229, 9, 20, 0.15) 0%,
              rgba(15, 15, 15, 0.85) 50%,
              rgba(15, 15, 15, 0.95) 100%
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
            rgba(229, 9, 20, 0.2) 0%,
            transparent 50%
          );
        }

        .hero-title {
          font-size: 36px;
          font-weight: 900;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #ffffff 0%, #e50914 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1.1;
          letter-spacing: -0.5px;
        }

        .hero-subtitle {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 35px;
          line-height: 1.6;
          font-weight: 300;
          max-width: 650px;
          margin-left: auto;
          margin-right: auto;
          padding: 0 10px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(229, 9, 20, 0.2);
          border: 1px solid rgba(229, 9, 20, 0.5);
          padding: 8px 18px;
          border-radius: 50px;
          font-size: 12px;
          color: #ff4458;
          margin-bottom: 25px;
          backdrop-filter: blur(10px);
          font-weight: 600;
        }

        .hero-content-wrapper {
          background: rgba(15, 15, 15, 0.5);
          backdrop-filter: blur(15px);
          padding: 40px 20px;
          border-radius: 20px;
          border: 1px solid rgba(229, 9, 20, 0.2);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          position: relative;
          z-index: 1;
        }

        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin: 40px 0;
          padding: 0 15px;
        }

        .feature-card {
          background: linear-gradient(
            135deg,
            rgba(26, 26, 26, 0.8) 0%,
            rgba(42, 42, 42, 0.6) 100%
          );
          padding: 25px 20px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 0;
          background: linear-gradient(180deg, #e50914 0%, #ff4458 100%);
          transition: height 0.4s ease;
        }

        .feature-card:active::before {
          height: 100%;
        }

        .feature-card:active {
          transform: translateY(-4px);
          border-color: rgba(229, 9, 20, 0.3);
          box-shadow: 0 15px 30px rgba(229, 9, 20, 0.15);
        }

        .feature-icon-wrapper {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #e50914 0%, #ff4458 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          box-shadow: 0 6px 12px rgba(229, 9, 20, 0.3);
        }

        .feature-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 10px;
          color: var(--text-primary);
        }

        .feature-description {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
        }

        .stats-section {
          background: linear-gradient(
            135deg,
            rgba(229, 9, 20, 0.05) 0%,
            rgba(26, 26, 26, 0.8) 100%
          );
          padding: 40px 20px;
          border-radius: 18px;
          margin: 40px 15px;
          text-align: center;
          border: 1px solid rgba(229, 9, 20, 0.2);
          backdrop-filter: blur(10px);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-top: 30px;
        }

        .stat-item {
          padding: 20px;
          background: rgba(15, 15, 15, 0.5);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }

        .stat-item:active {
          transform: scale(1.03);
          border-color: rgba(229, 9, 20, 0.3);
        }

        .stat-number {
          font-size: 36px;
          font-weight: 900;
          background: linear-gradient(135deg, #e50914 0%, #ff4458 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 6px;
          letter-spacing: -0.5px;
        }

        .stat-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
        }

        .info-section {
          background: linear-gradient(
            135deg,
            rgba(26, 26, 26, 0.8) 0%,
            rgba(42, 42, 42, 0.6) 100%
          );
          padding: 35px 20px;
          border-radius: 18px;
          margin: 40px 15px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .info-title {
          font-size: 26px;
          font-weight: 800;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #ffffff 0%, #e50914 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.3px;
        }

        .info-text {
          font-size: 15px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 16px;
        }

        .cta-section {
          text-align: center;
          padding: 50px 20px;
          background: linear-gradient(
            135deg,
            rgba(229, 9, 20, 0.15) 0%,
            rgba(0, 0, 0, 0.4) 100%
          );
          border-radius: 20px;
          margin: 40px 15px 60px;
          border: 1px solid rgba(229, 9, 20, 0.2);
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle,
            rgba(229, 9, 20, 0.1) 0%,
            transparent 70%
          );
        }

        .cta-title {
          font-size: 28px;
          font-weight: 900;
          margin-bottom: 14px;
          letter-spacing: -0.5px;
        }

        .cta-text {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 35px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          padding: 0 10px;
        }

        .btn-icon {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 35px;
          padding: 0 15px;
        }

        .section-title {
          font-size: 28px;
          font-weight: 900;
          background: linear-gradient(135deg, #ffffff 0%, #e50914 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
          letter-spacing: -0.3px;
        }

        .section-subtitle {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 400;
        }

        .step-card {
          display: flex;
          gap: 15px;
          align-items: flex-start;
          padding: 18px;
          background: rgba(15, 15, 15, 0.5);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .step-number {
          min-width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #e50914 0%, #ff4458 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: bold;
          color: white;
          flex-shrink: 0;
        }

        .step-content h4 {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 6px;
          color: white;
        }

        .step-content p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          margin: 0;
        }

        .notice-section {
          background: linear-gradient(
            135deg,
            rgba(229, 9, 20, 0.1) 0%,
            rgba(15, 15, 15, 0.8) 100%
          );
          border: 1px solid rgba(229, 9, 20, 0.3);
          padding: 30px 20px;
          border-radius: 16px;
          margin: 40px 15px;
        }

        .notice-title {
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 20px;
          color: #e50914;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .notice-content {
          display: grid;
          gap: 16px;
        }

        .notice-content p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.7;
          margin: 0;
        }

        .trust-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 15px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          flex-wrap: wrap;
          justify-content: center;
        }

        /* Tablet (768px - 1023px) */
        @media (min-width: 768px) {
          .hero-title {
            font-size: 52px;
            letter-spacing: -1px;
          }

          .hero-subtitle {
            font-size: 20px;
            margin-bottom: 32px;
          }

          .hero-badge {
            font-size: 13px;
            padding: 7px 18px;
            gap: 7px;
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
            padding: 30px 25px;
          }

          .feature-card:hover::before {
            height: 100%;
          }

          .feature-card:hover {
            transform: translateY(-8px);
            border-color: rgba(229, 9, 20, 0.3);
            box-shadow: 0 20px 40px rgba(229, 9, 20, 0.15);
          }

          .feature-icon-wrapper {
            width: 52px;
            height: 52px;
            margin-bottom: 18px;
          }

          .feature-title {
            font-size: 19px;
          }

          .feature-description {
            font-size: 15px;
          }

          .stats-section {
            padding: 50px 35px;
            margin: 50px 0;
          }

          .stats-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 25px;
          }

          .stat-item {
            padding: 22px;
          }

          .stat-item:hover {
            transform: scale(1.05);
            border-color: rgba(229, 9, 20, 0.3);
          }

          .stat-number {
            font-size: 40px;
          }

          .stat-label {
            font-size: 15px;
          }

          .info-section {
            padding: 45px 35px;
            margin: 50px 0;
          }

          .info-title {
            font-size: 30px;
            margin-bottom: 22px;
          }

          .info-text {
            font-size: 16px;
            margin-bottom: 18px;
          }

          .section-header {
            margin-bottom: 45px;
          }

          .section-title {
            font-size: 34px;
          }

          .section-subtitle {
            font-size: 16px;
          }

          .step-card {
            gap: 18px;
            padding: 20px;
          }

          .step-number {
            min-width: 44px;
            height: 44px;
            font-size: 22px;
          }

          .step-content h4 {
            font-size: 17px;
          }

          .step-content p {
            font-size: 15px;
          }

          .notice-section {
            padding: 35px 30px;
            margin: 50px 0;
          }

          .notice-title {
            font-size: 23px;
          }

          .notice-content p {
            font-size: 15px;
          }

          .cta-section {
            padding: 75px 30px;
            margin: 50px 0 60px;
          }

          .cta-title {
            font-size: 36px;
          }

          .cta-text {
            font-size: 18px;
          }

          .trust-badge {
            font-size: 13px;
            margin-top: 18px;
          }
        }

        /* Desktop (1024px+) */
        @media (min-width: 1024px) {
          .hero-title {
            font-size: 72px;
            letter-spacing: -1.5px;
          }

          .hero-subtitle {
            font-size: 24px;
            margin-bottom: 35px;
          }

          .hero-badge {
            font-size: 14px;
            padding: 8px 20px;
            gap: 8px;
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
            padding: 35px 30px;
          }

          .feature-icon-wrapper {
            width: 56px;
            height: 56px;
            margin-bottom: 20px;
          }

          .feature-title {
            font-size: 20px;
            margin-bottom: 12px;
          }

          .stats-section {
            padding: 60px 40px;
            margin: 60px 0;
          }

          .stats-grid {
            gap: 30px;
            margin-top: 40px;
          }

          .stat-item {
            padding: 25px;
          }

          .stat-number {
            font-size: 44px;
          }

          .info-section {
            padding: 50px 40px;
          }

          .info-title {
            font-size: 32px;
            margin-bottom: 25px;
          }

          .section-header {
            margin-bottom: 50px;
          }

          .section-title {
            font-size: 36px;
          }

          .section-subtitle {
            font-size: 17px;
          }

          .step-card {
            gap: 20px;
          }

          .step-number {
            min-width: 48px;
            height: 48px;
            font-size: 24px;
          }

          .step-content h4 {
            font-size: 18px;
            margin-bottom: 8px;
          }

          .notice-section {
            padding: 40px;
          }

          .notice-title {
            font-size: 26px;
            gap: 12px;
          }

          .cta-section {
            padding: 100px 30px;
          }

          .cta-title {
            font-size: 42px;
          }

          .cta-text {
            font-size: 19px;
            margin-bottom: 45px;
          }

          .trust-badge {
            font-size: 14px;
            margin-top: 20px;
          }
        }

        /* Extra small phones */
        @media (max-width: 375px) {
          .hero-title {
            font-size: 32px;
          }

          .hero-subtitle {
            font-size: 15px;
          }

          .hero-badge {
            font-size: 11px;
            padding: 5px 14px;
          }

          .hero-content-wrapper {
            padding: 35px 18px;
          }

          .section-title {
            font-size: 24px;
          }

          .section-subtitle {
            font-size: 14px;
          }

          .info-title {
            font-size: 24px;
          }

          .cta-title {
            font-size: 24px;
          }

          .cta-text {
            font-size: 15px;
          }

          .notice-title {
            font-size: 18px;
            flex-direction: column;
            align-items: flex-start;
          }
        }

        /* Fix for background attachment on mobile */
        @media (max-width: 768px) {
          .hero-background {
            background-attachment: scroll;
          }
        }
      `}</style>

      {/* Hero Section */}
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
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Sparkles size={14} />
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
                    <Play size={18} fill="white" /> Start Watching
                  </span>
                </motion.button>
              </Link>

              <Link href="/tv">
                <motion.button
                  style={styles.secondaryButton}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="btn-icon">
                    <Tv size={18} /> Browse Library
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
              <Star size={14} fill="#ffd700" color="#ffd700" />
              <span>Trusted by thousands worldwide</span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Continue Watching Section */}
      <ContinueWatchingSection />

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
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
            <motion.div
              className="stat-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <TrendingUp
                size={24}
                color="#e50914"
                style={{ marginBottom: '8px' }}
              />
              <div className="stat-number">15,000+</div>
              <div className="stat-label">Movies & Shows</div>
            </motion.div>
            <motion.div
              className="stat-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Film size={24} color="#e50914" style={{ marginBottom: '8px' }} />
              <div className="stat-number">100%</div>
              <div className="stat-label">Free Forever</div>
            </motion.div>
            <motion.div
              className="stat-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Sparkles
                size={24}
                color="#e50914"
                style={{ marginBottom: '8px' }}
              />
              <div className="stat-number">24/7</div>
              <div className="stat-label">Always Available</div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
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
              icon: <DollarSign size={24} />,
              title: '100% Free',
              description:
                'No subscription fees, no hidden costs, no credit card required. Enjoy unlimited streaming completely free.',
            },
            {
              icon: <Library size={24} />,
              title: 'Massive Library',
              description:
                'Access thousands of movies, TV shows and anime from various genres. New content added regularly.',
            },
            {
              icon: <Smartphone size={24} />,
              title: 'Any Device',
              description:
                'Watch on your phone, tablet, laptop, or smart TV. Fully responsive design for all screen sizes.',
            },
            {
              icon: <UserX size={24} />,
              title: 'No Registration',
              description:
                'Start watching immediately. No account creation, no email required. Just click and play.',
            },
            {
              icon: <RefreshCw size={24} />,
              title: 'Multiple Servers',
              description:
                "If one server doesn't work, switch to another. We provide multiple streaming options for reliability.",
            },
            {
              icon: <Search size={24} />,
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
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon-wrapper">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* What is Flixet Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
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
            <strong style={{ color: '#e50914' }}>Important:</strong> We don't
            host any video content on our servers. All videos are embedded from
            legitimate third-party sources. We simply provide a convenient way
            to discover and access content that's already available on the
            internet.
          </p>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="info-section">
          <h2 className="info-title">How Does Flixet Work?</h2>
          <div style={{ display: 'grid', gap: '16px' }}>
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

      {/* Important Notice Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="notice-section">
          <h2 className="notice-title">
            <AlertTriangle size={22} /> Important Information
          </h2>
          <div className="notice-content">
            <p>
              <strong style={{ color: 'white' }}>
                Ad Blockers Recommended:
              </strong>{' '}
              The third-party streaming services we use may display
              advertisements. We recommend using an ad blocker extension (like
              uBlock Origin) for the best viewing experience.
            </p>
            <p>
              <strong style={{ color: 'white' }}>Legal Disclaimer:</strong>{' '}
              Flixet is a search engine for streaming content. We do not host,
              upload, or control any of the video content. All content is
              provided by third-party sources.
            </p>
            <p>
              <strong style={{ color: 'white' }}>User Responsibility:</strong>{' '}
              Users are responsible for ensuring they comply with local laws
              regarding online streaming in their jurisdiction.
            </p>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.div
        className="cta-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
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
            gap: '15px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Link href="/movies">
            <motion.button style={styles.ctaButton} whileTap={{ scale: 0.95 }}>
              <span className="btn-icon">
                Browse Movies <ArrowRight size={18} />
              </span>
            </motion.button>
          </Link>
          <Link href="/tv">
            <motion.button
              style={{
                ...styles.ctaButton,
                background: 'rgba(15, 15, 15, 0.8)',
                border: '2px solid #e50914',
                backdropFilter: 'blur(10px)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="btn-icon">
                Browse TV Shows <ArrowRight size={18} />
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
    gap: '15px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '25px',
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #e50914 0%, #ff4458 100%)',
    color: 'white',
    padding: '16px 36px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 8px 20px rgba(229, 9, 20, 0.3)',
    transition: 'all 0.3s ease',
  },
  secondaryButton: {
    background: 'rgba(15, 15, 15, 0.6)',
    color: 'white',
    padding: '16px 36px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '700',
    border: '2px solid rgba(229, 9, 20, 0.5)',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
  },
  ctaButton: {
    background: 'linear-gradient(135deg, #e50914 0%, #ff4458 100%)',
    color: 'white',
    padding: '15px 35px',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 8px 25px rgba(229, 9, 20, 0.3)',
    transition: 'all 0.3s ease',
  },
};
