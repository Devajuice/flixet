"use client";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

const PLACEMENT_GAP = 10;
const EDGE_PADDING = 12;

/** `top`/`bottom` resolve on the Y axis, `left`/`right` on the X axis. */
const IS_VERTICAL = { top: true, bottom: true, left: false, right: false };

export default function Tooltip({
  content,
  children,
  placement = "top",
  delay = 120,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const [anchorNode, setAnchorNode] = useState(null);
  const tipRef = useRef(null);
  const timer = useRef(null);
  const tooltipId = useId();

  const measure = useCallback(() => {
    if (!anchorNode) return;

    const rect = anchorNode.getBoundingClientRect();
    const width = tipRef.current?.offsetWidth ?? 0;
    const height = tipRef.current?.offsetHeight ?? 0;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const vertical = IS_VERTICAL[placement] !== false;

    let top;
    let left;

    if (vertical) {
      /* Flip below the anchor when there is no room above. */
      const flip =
        placement === "top" && rect.top - height - PLACEMENT_GAP < EDGE_PADDING;
      top = flip
        ? rect.bottom + PLACEMENT_GAP
        : rect.top - height - PLACEMENT_GAP;
      left = rect.left + rect.width / 2 - width / 2;
      left = Math.min(Math.max(left, EDGE_PADDING), vw - width - EDGE_PADDING);
    } else {
      const flip =
        placement === "left" &&
        rect.left - width - PLACEMENT_GAP < EDGE_PADDING;
      left = flip
        ? rect.right + PLACEMENT_GAP
        : rect.left - width - PLACEMENT_GAP;
      top = rect.top + rect.height / 2 - height / 2;
      top = Math.min(Math.max(top, EDGE_PADDING), vh - height - EDGE_PADDING);
    }

    setPos({ top: Math.max(top, EDGE_PADDING), left });
  }, [placement, anchorNode]);

  /* Measure after layout so the bubble's own box is available. Deferred by a
     frame to keep the position update out of the effect body. */
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(frame);
  }, [open, measure]);

  /* The bubble is viewport-fixed, so it has to track its anchor. */
  useEffect(() => {
    if (!open) return;
    const update = () => measure();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, measure]);

  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const hide = useCallback(() => {
    clearTimer();
    setOpen(false);
  }, [clearTimer]);

  const show = () => {
    if (disabled || !content) return;
    clearTimer();
    timer.current = setTimeout(() => setOpen(true), delay);
  };

  useEffect(() => clearTimer, [clearTimer]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") hide();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, hide]);

  const anchorHandlers = {
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus: () => setOpen(true),
    onBlur: hide,
    "aria-describedby": open ? tooltipId : undefined,
  };

  /* The bubble is measured against this wrapper, so it is always rendered.
     `flex-shrink: 0` keeps it from collapsing inside flex toolbars. */
  const anchor = (
    <span {...anchorHandlers} ref={setAnchorNode} className="tooltip-anchor">
      {children}
    </span>
  );

  return (
    <>
      {anchor}

      <AnimatePresence>
        {open && content && (
          <motion.div
            ref={tipRef}
            id={tooltipId}
            role="tooltip"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className="tooltip-bubble"
            style={{
              top: pos?.top ?? 0,
              left: pos?.left ?? 0,
              visibility: pos ? "visible" : "hidden",
            }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .tooltip-anchor {
          display: inline-flex;
          flex-shrink: 0;
        }
        .tooltip-bubble {
          position: fixed;
          z-index: 10100;
          max-width: 260px;
          padding: 8px 12px;
          border-radius: var(--radius-md);
          background: rgba(28, 28, 28, 0.97);
          backdrop-filter: blur(16px);
          border: 1px solid var(--border-hover);
          box-shadow: var(--shadow-lg);
          font-size: var(--text-xs);
          line-height: 1.5;
          font-weight: var(--font-medium);
          color: var(--text-primary);
          text-align: left;
          pointer-events: none;
        }
      `}</style>
    </>
  );
}