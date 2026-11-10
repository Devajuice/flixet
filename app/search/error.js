"use client";

import Link from "next/link";

export default function Error({ error, reset }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center", padding: 20 }}>
      <p style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--font-bold)", color: "var(--accent)", marginBottom: 12 }}>
        Search failed
      </p>
      <p style={{ color: "var(--text-tertiary)", marginBottom: 24, maxWidth: 480 }}>
        {error?.message || "We couldn't load search results right now."}
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <button className="btn btn-primary" onClick={() => reset()}>Try again</button>
        <Link href="/"><button className="btn btn-secondary">Back to Home</button></Link>
      </div>
    </div>
  );
}
