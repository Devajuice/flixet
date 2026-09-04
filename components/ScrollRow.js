"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, ChevronRight as ViewChevron } from "lucide-react";
import Link from "next/link";

export default function ScrollRow({
  title,
  icon,
  subtitle,
  href,
  children,
}) {
  const ref = useRef(null);

  const scroll = (dir) => {
    const el = ref.current;
    if (!el) return;
    const scrollAmount = window.innerWidth < 768 ? 300 : 600;
    el.scrollBy({ left: dir * scrollAmount, behavior: "smooth" });
  };

  return (
    <section>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: "var(--space-4)",
          padding: "0 var(--container-padding)",
        }}
      >
        {/* Blue accent bar */}
        <span
          style={{
            width: 4,
            height: 22,
            borderRadius: 2,
            background: "linear-gradient(180deg, #d97706, #fbbf24)",
            boxShadow: "0 0 12px rgba(59,130,246,0.4)",
            flexShrink: 0,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {icon}
          <div style={{ minWidth: 0 }}>
            {title && (
              <h2
                style={{
                  fontSize: "var(--text-xl)",
                  fontWeight: "var(--font-bold)",
                  letterSpacing: "-0.01em",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--text-tertiary)",
                  margin: "2px 0 0",
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          {href && (
            <Link
              href={href}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 14px",
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-semibold)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-full)",
                textDecoration: "none",
                background: "rgba(255,255,255,0.03)",
                transition:
                  "all var(--transition-base), background var(--transition-base)",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-border)";
                e.currentTarget.style.color = "var(--accent)";
                e.currentTarget.style.background = "var(--accent-subtle)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              }}
            >
              View All <ViewChevron size={14} />
            </Link>
          )}
          <div style={{ display: "flex", gap: 8 }} className="scroll-nav">
            <button
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              style={{
                width: 38,
                height: 38,
                borderRadius: "var(--radius-full)",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all var(--transition-base)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent-subtle)";
                e.currentTarget.style.borderColor = "var(--accent-border)";
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text-primary)";
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              style={{
                width: 38,
                height: 38,
                borderRadius: "var(--radius-full)",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all var(--transition-base)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent-subtle)";
                e.currentTarget.style.borderColor = "var(--accent-border)";
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text-primary)";
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
      <div ref={ref} className="scroll-row">
        {children}
      </div>
    </section>
  );
}
