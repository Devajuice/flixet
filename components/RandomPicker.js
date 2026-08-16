"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dices, Loader2 } from "lucide-react";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function RandomPicker({ variant = "header" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const pick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const type = Math.random() < 0.5 ? "movie" : "tv";
      const page = 1 + Math.floor(Math.random() * 100);
      const url = `https://api.themoviedb.org/3/discover/${type}?api_key=${API_KEY}&sort_by=popularity.desc&page=${page}&vote_count.gte=50`;
      const res = await fetch(url);
      const data = await res.json();
      const results = data.results?.filter((r) => r.poster_path) || [];
      if (results.length === 0) throw new Error("No results");
      const pickItem = results[Math.floor(Math.random() * results.length)];
      router.push(`/${type}/${pickItem.id}`);
      setLoading(false);
    } catch (err) {
      console.error("Random pick failed:", err);
      setLoading(false);
    }
  };

  if (variant === "mobile") {
    return (
      <button
        onClick={pick}
        disabled={loading}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "11px 14px",
          color: "var(--text-secondary)",
          borderRadius: "var(--radius-lg)",
          marginBottom: 2,
          background: "transparent",
          border: "none",
          width: "100%",
          cursor: "pointer",
          textAlign: "left",
          fontSize: "var(--text-sm)",
        }}
      >
        {loading ? (
          <Loader2 size={18} style={{ animation: "spin 0.9s linear infinite" }} />
        ) : (
          <Dices size={18} />
        )}{" "}
        {loading ? "Picking..." : "Surprise Me"}
      </button>
    );
  }

  return (
    <button
      onClick={pick}
      disabled={loading}
      aria-label="Pick a random movie or show"
      title="Surprise Me — pick a random movie or show"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "9px 14px",
        borderRadius: "var(--radius-lg)",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid var(--border)",
        color: "var(--text-secondary)",
        fontSize: "var(--text-sm)",
        fontWeight: "var(--font-semibold)",
        cursor: loading ? "wait" : "pointer",
        whiteSpace: "nowrap",
        transition: "all 0.2s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--accent-border)";
        e.currentTarget.style.color = "var(--accent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.color = "var(--text-secondary)";
      }}
    >
      {loading ? (
        <Loader2 size={15} style={{ animation: "spin 0.9s linear infinite" }} />
      ) : (
        <Dices size={15} />
      )}
      {loading ? "Picking..." : "Surprise Me"}
    </button>
  );
}
