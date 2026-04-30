"use client";
import { motion } from "framer-motion";
import MediaCard from "@/components/MediaCard";

export default function SearchResults({ movies }) {
  if (!movies?.length) return null;

  return (
    <motion.div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        gap: 16,
        padding: "0 var(--container-padding)",
        justifyItems: "center",
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {movies.map((item, i) => (
        <MediaCard
          key={`${item.media_type}-${item.id}`}
          item={item}
          type={item.media_type === "tv" ? "tv" : "movie"}
          index={i}
        />
      ))}
    </motion.div>
  );
}
