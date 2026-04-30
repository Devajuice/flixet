"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ScrollRow({ title, children }) {
  const ref = useRef(null);

  const scroll = (dir) => {
    const el = ref.current;
    if (!el) return;
    const scrollAmount = window.innerWidth < 768 ? 300 : 600;
    el.scrollBy({ left: dir * scrollAmount, behavior: "smooth" });
  };

  return (
    <section style={{ marginBottom: "var(--space-12)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "var(--space-4)",
          padding: "0 var(--container-padding)",
        }}
      >
        <h2
          style={{
            fontSize: "var(--text-xl)",
            fontWeight: "var(--font-bold)",
            letterSpacing: "-0.01em)",
          }}
        >
          {title}
        </h2>
        <div style={{ display: "flex", gap: 8 }} className="scroll-nav">
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            style={{
              width: 40,
              height: 40,
              borderRadius: "var(--radius-full)",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid var(--border)",
              cursor: "pointer",
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all var(--transition-base)",
            }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            style={{
              width: 40,
              height: 40,
              borderRadius: "var(--radius-full)",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid var(--border)",
              cursor: "pointer",
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all var(--transition-base)",
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div ref={ref} className="scroll-row">
        {children}
      </div>
    </section>
  );
}
