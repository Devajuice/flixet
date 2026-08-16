"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Check } from "lucide-react";

export default function ShareButton({ title, href }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e) => {
    e.stopPropagation();
    const base = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const url = `${base}${href}`;
    const shareData = {
      title: `Watch ${title} on Flixet`,
      url,
    };

    if (typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err?.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleShare}
      className="btn btn-secondary"
      aria-label={copied ? "Link copied" : "Share"}
      style={{
        padding: "clamp(10px, 2vw, 14px) clamp(16px, 3vw, 24px)",
        minHeight: 46,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      {copied ? <Check size={16} /> : <Share2 size={16} />}
      {copied ? "Copied!" : "Share"}
    </motion.button>
  );
}
