"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { getImageUrl } from "@/lib/tmdb";
import { User } from "lucide-react";

export default function CastSection({ cast }) {
  if (!cast || cast.length === 0) return null;

  return (
    <>
      <style jsx global>{`
        .cast-section {
          margin-top: 50px;
          font-family: "DM Sans", sans-serif;
        }

        /* ── Section title ─────────────────────────────── */
        .cast-title {
          font-family: "DM Sans", sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.88);
          text-transform: uppercase;
          letter-spacing: 0.09em;
          margin: 0 0 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cast-title::after {
          content: "";
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.06);
        }

        /* ── Grid ──────────────────────────────────────── */
        .cast-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 14px;
        }

        /* ── Card ──────────────────────────────────────── */
        .cast-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          transition:
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .cast-card:hover {
          border-color: rgba(255, 193, 60, 0.2);
        }

        /* ── Image container ───────────────────────────── */
        .cast-img-wrap {
          position: relative;
          padding-bottom: 150%;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.03);
        }

        .cast-img {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .cast-card:hover .cast-img {
          transform: scale(1.05);
        }

        /* ── Placeholder ───────────────────────────────── */
        .cast-placeholder {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.02);
          color: rgba(255, 193, 60, 0.2);
        }

        /* ── Info ──────────────────────────────────────── */
        .cast-info {
          padding: 10px 12px 12px;
        }

        .cast-name {
          font-family: "DM Sans", sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.88);
          margin: 0 0 3px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }

        .cast-character {
          font-family: "DM Sans", sans-serif;
          font-size: 11px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.35);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }

        /* ── Responsive ────────────────────────────────── */
        @media (max-width: 768px) {
          .cast-grid {
            grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
            gap: 10px;
          }
        }
      `}</style>

      <motion.section
        className="cast-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="cast-title">Cast</h2>

        <div className="cast-grid">
          {cast.map((member, index) => (
            <motion.div
              key={member.id || index}
              className="cast-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.04 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <div className="cast-img-wrap" style={{ position: "relative" }}>
                {member.profile_path ? (
                  <Image
                    src={getImageUrl(member.profile_path, "w185")}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 130px, 185px"
                    className="cast-img"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="cast-placeholder">
                    <User size={40} strokeWidth={1} />
                  </div>
                )}
              </div>

              <div className="cast-info">
                <h3 className="cast-name">{member.name}</h3>
                <p className="cast-character">
                  {member.character ||
                    member.roles?.[0]?.character ||
                    "Unknown Role"}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </>
  );
}
