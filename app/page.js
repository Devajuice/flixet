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
} from 'lucide-react';

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
          background-image: linear-gradient(
              to bottom,
              rgba(15, 15, 15, 0.4),
              rgba(15, 15, 15, 0.95)
            ),
            url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          z-index: 0;
        }

        .hero-title {
          font-size: 42px;
          font-weight: bold;
          margin-bottom: 20px;
          background: linear-gradient(to right, #e50914, #f40612);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1.2;
        }

        .hero-subtitle {
          font-size: 20px;
          color: #ffffff;
          margin-bottom: 50px;
          line-height: 1.6;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        }

        .hero-content-wrapper {
          background: rgba(15, 15, 15, 0.75);
          backdrop-filter: blur(15px);
          padding: 60px 40px;
          border-radius: 20px;
          border: 1px solid rgba(229, 9, 20, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
          position: relative;
          z-index: 1;
        }

        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px;
          margin: 60px 0;
        }

        .feature-card {
          background-color: var(--card-bg);
          padding: 30px;
          border-radius: 10px;
          border-left: 4px solid var(--accent);
          transition: transform 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
        }

        .feature-icon {
          margin-bottom: 15px;
          color: var(--accent);
        }

        .feature-title {
          font-size: 22px;
          font-weight: bold;
          margin-bottom: 10px;
          color: var(--text-primary);
        }

        .feature-description {
          font-size: 16px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .stats-section {
          background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
          padding: 40px;
          border-radius: 15px;
          margin: 50px 0;
          text-align: center;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px;
          margin-top: 30px;
        }

        .stat-item {
          padding: 20px;
        }

        .stat-number {
          font-size: 36px;
          font-weight: bold;
          color: var(--accent);
          margin-bottom: 10px;
        }

        .stat-label {
          font-size: 16px;
          color: var(--text-secondary);
        }

        .info-section {
          background-color: var(--secondary-bg);
          padding: 40px;
          border-radius: 10px;
          margin: 40px 0;
        }

        .info-title {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 20px;
          color: var(--accent);
        }

        .info-text {
          font-size: 16px;
          line-height: 1.8;
          color: var(--text-secondary);
          margin-bottom: 15px;
        }

        .cta-section {
          text-align: center;
          padding: 80px 20px;
          background: linear-gradient(
            135deg,
            rgba(229, 9, 20, 0.1) 0%,
            rgba(0, 0, 0, 0.3) 100%
          );
          border-radius: 15px;
          margin: 50px 0;
        }

        .cta-title {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 15px;
        }

        .cta-text {
          font-size: 18px;
          color: var(--text-secondary);
          margin-bottom: 40px;
        }

        .btn-icon {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        @media (min-width: 768px) {
          .hero-title {
            font-size: 56px;
          }

          .hero-subtitle {
            font-size: 24px;
          }

          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .stats-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .hero-content-wrapper {
            padding: 80px 60px;
          }
        }

        @media (min-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 640px) {
          .hero-content-wrapper {
            padding: 40px 20px;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div className="hero-background" />
        <motion.div
          style={styles.heroContent}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-content-wrapper">
            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Unlimited Movies, TV Shows & Anime
            </motion.h1>

            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Watch anywhere. Stream for free. No subscription required.
            </motion.p>

            <motion.div
              style={styles.heroButtons}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/movies">
                <motion.button
                  style={styles.primaryButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="btn-icon">
                    <Film size={20} /> Watch Movies
                  </span>
                </motion.button>
              </Link>

              <Link href="/tv">
                <motion.button
                  style={styles.secondaryButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="btn-icon">
                    <Tv size={20} /> Watch TV Shows
                  </span>
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              style={styles.scrollIndicator}
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowRight size={30} style={{ transform: 'rotate(90deg)' }} />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Rest of the sections remain the same */}
      {/* What is Flixet Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="info-section">
          <h2 className="info-title">What is Flixet ?</h2>
          <p className="info-text">
            Flixet is a free streaming aggregator that brings you unlimited
            access to thousands of Movies, TV shows and Anime. We search and compile
            content from various third-party streaming sources, making it easy
            for you to find and watch your favorite entertainment in one place.
          </p>
          <p className="info-text">
            Unlike traditional streaming platforms, Flixet doesn't require any
            subscription, registration, or payment. We believe entertainment
            should be accessible to everyone. Our platform is completely free
            and always will be.
          </p>
          <p className="info-text">
            <strong>Important:</strong> We don't host any video content on our
            servers. All videos are embedded from legitimate third-party
            sources. We simply provide a convenient way to discover and access
            content that's already available on the internet.
          </p>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="features-grid">
          <motion.div className="feature-card" whileHover={{ scale: 1.03 }}>
            <div className="feature-icon">
              <DollarSign size={40} />
            </div>
            <h3 className="feature-title">100% Free</h3>
            <p className="feature-description">
              No subscription fees, no hidden costs, no credit card required.
              Enjoy unlimited streaming completely free.
            </p>
          </motion.div>

          <motion.div className="feature-card" whileHover={{ scale: 1.03 }}>
            <div className="feature-icon">
              <Library size={40} />
            </div>
            <h3 className="feature-title">Huge Library</h3>
            <p className="feature-description">
              Access thousands of Movies,TV Shows and Anime from various genres. New
              content added regularly.
            </p>
          </motion.div>

          <motion.div className="feature-card" whileHover={{ scale: 1.03 }}>
            <div className="feature-icon">
              <Smartphone size={40} />
            </div>
            <h3 className="feature-title">Any Device</h3>
            <p className="feature-description">
              Watch on your phone, tablet, laptop, or smart TV. Fully responsive
              design for all screen sizes.
            </p>
          </motion.div>

          <motion.div className="feature-card" whileHover={{ scale: 1.03 }}>
            <div className="feature-icon">
              <UserX size={40} />
            </div>
            <h3 className="feature-title">No Registration</h3>
            <p className="feature-description">
              Start watching immediately. No account creation, no email
              required. Just click and play.
            </p>
          </motion.div>

          <motion.div className="feature-card" whileHover={{ scale: 1.03 }}>
            <div className="feature-icon">
              <RefreshCw size={40} />
            </div>
            <h3 className="feature-title">Multiple Servers</h3>
            <p className="feature-description">
              If one server doesn't work, switch to another. We provide multiple
              streaming options for reliability.
            </p>
          </motion.div>

          <motion.div className="feature-card" whileHover={{ scale: 1.03 }}>
            <div className="feature-icon">
              <Search size={40} />
            </div>
            <h3 className="feature-title">Easy Search</h3>
            <p className="feature-description">
              Find what you want to watch quickly with our powerful search.
              Browse by genre, year, or rating.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="stats-section">
          <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>
            Why Choose Flixet ?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Join thousands of users enjoying free entertainment
          </p>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Movies Available</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5,000+</div>
              <div className="stat-label">TV Shows</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Always Available</div>
            </div>
          </div>
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
          <p className="info-text">
            <strong>1. Browse or Search:</strong> Explore our extensive library
            of movies and TV shows, or use the search function to find exactly
            what you're looking for.
          </p>
          <p className="info-text">
            <strong>2. Click to Watch:</strong> Select any title and you'll be
            taken to the streaming page where multiple server options are
            available.
          </p>
          <p className="info-text">
            <strong>3. Choose Your Server:</strong> We provide multiple
            streaming servers. If one doesn't work or has too many ads, simply
            switch to another server.
          </p>
          <p className="info-text">
            <strong>4. Enjoy:</strong> Sit back and enjoy your Movie, TV show or Anime.
            For TV shows and Anime, you can easily select different seasons and episodes.
          </p>
        </div>
      </motion.section>

      {/* Important Notice Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div
          style={{
            backgroundColor: 'rgba(229, 9, 20, 0.1)',
            border: '2px solid var(--accent)',
            padding: '30px',
            borderRadius: '10px',
            margin: '40px 0',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '15px',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <AlertTriangle size={24} /> Important Information
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--text-secondary)',
              lineHeight: '1.8',
              marginBottom: '15px',
            }}
          >
            <strong>Ad Blockers Recommended:</strong> The third-party streaming
            services we use may display advertisements. We recommend using an ad
            blocker extension (like uBlock Origin) for the best viewing
            experience.
          </p>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--text-secondary)',
              lineHeight: '1.8',
              marginBottom: '15px',
            }}
          >
            <strong>Legal Disclaimer:</strong> Flixet is a search engine for
            streaming content. We do not host, upload, or control any of the
            video content. All content is provided by third-party sources.
          </p>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--text-secondary)',
              lineHeight: '1.8',
            }}
          >
            <strong>User Responsibility:</strong> Users are responsible for
            ensuring they comply with local laws regarding online streaming in
            their jurisdiction.
          </p>
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
          Thousands of Movies, TV shows and Anime are waiting for you. No signup
          required.
        </p>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link href="/movies">
            <motion.button
              style={styles.ctaButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="btn-icon">
                Browse Movies <ArrowRight size={20} />
              </span>
            </motion.button>
          </Link>
          <Link href="/tv">
            <motion.button
              style={{
                ...styles.ctaButton,
                background: 'transparent',
                border: '2px solid var(--accent)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="btn-icon">
                Browse TV Shows <ArrowRight size={20} />
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
    padding: '20px',
    textAlign: 'center',
    marginBottom: '40px',
    overflow: 'hidden',
  },
  heroContent: {
    maxWidth: '900px',
    width: '100%',
  },
  heroButtons: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryButton: {
    background: 'var(--accent)',
    color: 'white',
    padding: '15px 35px',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    border: 'none',
  },
  secondaryButton: {
    background: 'transparent',
    color: 'white',
    padding: '15px 35px',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 'bold',
    border: '2px solid var(--accent)',
    cursor: 'pointer',
  },
  scrollIndicator: {
    marginTop: '40px',
    color: 'var(--accent)',
  },
  ctaButton: {
    background: 'var(--accent)',
    color: 'white',
    padding: '15px 40px',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    border: 'none',
  },
};
