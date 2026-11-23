"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PillNav({
  items = [],
  activeHref,
  activeIndex: controlledIndex,
  onItemClick,
  className = "",
  ariaLabel = "Navigation",
}) {
  const [hovered, setHovered] = useState(-1);
  const [glide, setGlide] = useState({ x: 0, w: 0, opacity: 0 });
  const itemRefs = useRef([]);
  const trackRef = useRef(null);

  const activeIndex =
    typeof controlledIndex === "number"
      ? controlledIndex
      : activeHref
      ? items.findIndex((i) => i.href === activeHref)
      : -1;

  const targetIndex = hovered >= 0 ? hovered : activeIndex;
  const targetRef = useRef(targetIndex);

  const updateGlide = () => {
    const track = trackRef.current;
    const el = itemRefs.current[targetRef.current];
    if (!track || !el) {
      setGlide((s) => ({ ...s, opacity: 0 }));
      return;
    }
    const tr = track.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setGlide({ x: r.left - tr.left, w: r.width, opacity: 1 });
  };

  const updateRef = useRef(null);

  useEffect(() => {
    updateRef.current = updateGlide;
    targetRef.current = targetIndex;
    const run = () => updateRef.current?.();
    const id = requestAnimationFrame(run);
    window.addEventListener("resize", run);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", run);
    };
  });

  useEffect(() => {
    const fonts = document.fonts;
    if (!fonts?.ready) return;
    let cancelled = false;
    fonts.ready.then(() => { if (!cancelled) requestAnimationFrame(() => updateRef.current()); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return (
    <nav className={`pill-nav ${className}`} aria-label={ariaLabel}>
      <div className="pill-nav-track" ref={trackRef} onMouseLeave={() => setHovered(-1)}>
        <motion.span
          className="pill-nav-glide"
          aria-hidden="true"
          animate={{ x: glide.x, width: glide.w, opacity: glide.opacity }}
          transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.8 }}
        />
        <ul className="pill-nav-list">
          {items.map((item, index) => {
            const active = index === activeIndex;
            const cls = `pill-nav-item${active ? " is-active" : ""}`;
            const common = {
              className: cls,
              onMouseEnter: () => setHovered(index),
              onFocus: () => setHovered(index),
              onBlur: () => setHovered(-1),
              onClick: (e) => onItemClick?.(item, index, e),
              "aria-current": active ? "page" : undefined,
            };
            const content = (
              <>
                {item.icon ? <span className="pill-nav-icon">{item.icon}</span> : null}
                <span className="pill-nav-label">{item.label}</span>
              </>
            );
            return (
              <li
                key={`${item.label}-${index}`}
                className="pill-nav-slot"
                ref={(el) => { itemRefs.current[index] = el; }}
              >
                {item.href ? (
                  <Link href={item.href} {...common}>{content}</Link>
                ) : (
                  <button type="button" {...common}>{content}</button>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <style jsx global>{`
        .pill-nav { display: inline-flex; align-items: center; max-width: 100%; }
        .pill-nav-track {
          position: relative; display: inline-flex; padding: 4px; border-radius: 999px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(16px) saturate(1.2); -webkit-backdrop-filter: blur(16px) saturate(1.2);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 12px 30px rgba(0,0,0,0.18);
        }
        .pill-nav-glide {
          position: absolute; top: 4px; bottom: 4px; left: 0; border-radius: 999px;
          background: linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.1) 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.12);
          backdrop-filter: blur(12px) saturate(1.2); -webkit-backdrop-filter: blur(12px) saturate(1.2);
          pointer-events: none;
        }
        .pill-nav-list { position: relative; z-index: 1; display: flex; align-items: stretch; gap: 2px; list-style: none; margin: 0; padding: 0; }
        .pill-nav-slot { display: flex; }
        .pill-nav-item {
          position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          height: 40px; padding: 0 18px; border-radius: 999px; border: 0; background: transparent;
          color: rgba(255,255,255,0.66); font-size: 14px; font-weight: 600; line-height: 1;
          text-decoration: none; cursor: pointer; white-space: nowrap;
          transition: color .2s ease; -webkit-tap-highlight-color: transparent;
        }
        .pill-nav-item:hover, .pill-nav-item:focus-visible, .pill-nav-item.is-active { color: #fff; }
        .pill-nav-item:focus-visible { outline: 2px solid rgba(255,255,255,0.45); outline-offset: 2px; }
        .pill-nav-icon { display: inline-flex; }
        .pill-nav-label { position: relative; }
        @media (max-width: 640px) {
          .pill-nav-item { height: 38px; padding: 0 14px; font-size: 13px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pill-nav-glide { transition: none !important; }
        }
      `}</style>
    </nav>
  );
}
