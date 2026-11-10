"use client";

import Link from "next/link";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center", padding: 20, background: "#000", color: "#fafafa" }}>
          <p style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--font-bold)", color: "#f59e0b", marginBottom: 12 }}>
            Critical error
          </p>
          <p style={{ color: "rgba(250,250,250,0.7)", marginBottom: 24, maxWidth: 480 }}>
            {error?.message || "The application encountered an unrecoverable error."}
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <button onClick={() => reset()} style={{ padding: "10px 18px", background: "linear-gradient(135deg,#d97706,#f59e0b)", border: "none", borderRadius: 10, fontWeight: 700, color: "#000", cursor: "pointer" }}>Reload</button>
            <Link href="/"><button style={{ padding: "10px 18px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontWeight: 700, color: "#fafafa", cursor: "pointer" }}>Back to Home</button></Link>
          </div>
        </div>
      </body>
    </html>
  );
}
