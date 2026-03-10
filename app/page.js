"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Play, Tv, ArrowRight, Sparkles, Star } from "lucide-react";
import ContinueWatchingSection from "@/components/ContinueWatchingSection";

export default function HomePage() {
  return (
    <>
      <style>{`
        .hero-bg {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              135deg,
              rgba(255,193,60,0.12) 0%,
              rgba(13,13,15,0.95) 45%,
              #0d0d0f 100%
            );
          z-index: 0;
        }
        .hero-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 20% 50%, rgba(255,193,60,0.09) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 20%, rgba(255,193,60,0.05) 0%, transparent 45%);
        }
        .hero-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 36px;
          font-weight: 900;
          margin: 0 0 20px;
          background: linear-gradient(135deg, #ffffff 0%, #ffc13c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1.1;
          letter-spacing: -0.5px;
        }
        .hero-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          color: rgba(255,255,255,0.6);
          margin: 0 auto 35px;
          line-height: 1.8;
          font-weight: 400;
          max-width: 560px;
          padding: 0 10px;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,193,60,0.08);
          border: 1px solid rgba(255,193,60,0.25);
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
        .hero-glass {
          background: rgba(13,13,15,0.5);
          backdrop-filter: blur(20px);
          padding: 40px 20px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow: 0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04);
          position: relative;
          z-index: 1;
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
          color: rgba(255,255,255,0.25);
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }
        .btn-icon {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        /* CTA */
        .cta-section {
          text-align: center;
          padding: 50px 20px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          margin: 0 0 60px;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }
        .cta-section::before {
          content: '';
          position: absolute;
          top: -60%; right: -30%;
          width: 60%; height: 200%;
          background: radial-gradient(circle, rgba(255,193,60,0.04) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 26px;
          font-weight: 900;
          margin: 0 0 14px;
          color: rgba(255,255,255,0.88);
          letter-spacing: -0.02em;
        }
        .cta-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,0.38);
          margin: 0 auto 35px;
          max-width: 500px;
          padding: 0 10px;
          line-height: 1.85;
        }

        @media (min-width: 768px) {
          .hero-title { font-size: 52px; letter-spacing: -1px; }
          .hero-subtitle { font-size: 18px; }
          .hero-glass { padding: 70px 50px; border-radius: 24px; }
          .cta-section { padding: 75px 30px; }
          .cta-title { font-size: 32px; }
        }
        @media (min-width: 1024px) {
          .hero-title { font-size: 68px; letter-spacing: -1.5px; }
          .hero-subtitle { font-size: 20px; }
          .hero-glass { padding: 90px 70px; }
          .cta-section { padding: 100px 30px; }
          .cta-title { font-size: 38px; }
        }
        @media (max-width: 375px) {
          .hero-title { font-size: 30px; }
          .hero-subtitle { font-size: 14px; }
          .hero-glass { padding: 32px 16px; }
          .cta-title { font-size: 22px; }
        }

      `}</style>

      {/* ── Hero ── */}
      <section style={s.hero}>
        <div className="hero-bg" />
        <motion.div
          style={s.heroInner}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.6, 0.05, 0.01, 0.9] }}
        >
          <div className="hero-glass">
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Sparkles size={13} />
              100% Free Streaming
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
              Thousands of movies, TV shows & anime. No subscription, no
              registration, completely free.
            </motion.p>

            <motion.div
              style={s.heroButtons}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Link href="/movies">
                <motion.button style={s.primaryBtn} whileTap={{ scale: 0.95 }}>
                  <span className="btn-icon">
                    <Play size={17} fill="#0d0d0f" color="#0d0d0f" />
                    Start Watching
                  </span>
                </motion.button>
              </Link>
              <Link href="/tv">
                <motion.button
                  style={s.secondaryBtn}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="btn-icon">
                    <Tv size={17} />
                    Browse Library
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
              Trusted by thousands worldwide
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── Continue Watching ── */}
      <ContinueWatchingSection />

      {/* ── CTA ── */}
      <motion.div
        className="cta-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <h2 className="cta-title">Ready to Start Watching?</h2>
        <p className="cta-text">
          Thousands of movies, TV shows and anime are waiting. No signup
          required.
        </p>
        <div style={s.ctaButtons}>
          <Link href="/movies">
            <motion.button style={s.primaryBtn} whileTap={{ scale: 0.95 }}>
              <span className="btn-icon">
                Browse Movies <ArrowRight size={17} />
              </span>
            </motion.button>
          </Link>
          <Link href="/tv">
            <motion.button style={s.secondaryBtn} whileTap={{ scale: 0.95 }}>
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

const s = {
  hero: {
    position: "relative",
    minHeight: "85vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px 15px",
    textAlign: "center",
    marginBottom: "40px",
    overflow: "hidden",
  },
  heroInner: {
    maxWidth: "1000px",
    width: "100%",
  },
  heroButtons: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "25px",
  },
  ctaButtons: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
    position: "relative",
    zIndex: 1,
  },
  primaryBtn: {
    background: "#ffc13c",
    color: "#0d0d0f",
    padding: "14px 32px",
    borderRadius: "10px",
    fontSize: "14px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: "700",
    cursor: "pointer",
    border: "none",
    letterSpacing: "0.01em",
  },
  secondaryBtn: {
    background: "rgba(13,13,15,0.6)",
    color: "rgba(255,255,255,0.7)",
    padding: "14px 32px",
    borderRadius: "10px",
    fontSize: "14px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: "600",
    border: "1px solid rgba(255,193,60,0.2)",
    cursor: "pointer",
    backdropFilter: "blur(10px)",
    letterSpacing: "0.01em",
  },
};
