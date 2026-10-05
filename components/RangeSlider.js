"use client";
import { useCallback, useEffect, useId, useRef, useState } from "react";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Dual-handle range slider.
 *
 * Dragging works on the whole track (the nearer thumb wins), and each thumb is
 * a focusable `role="slider"` so the whole range is reachable by keyboard.
 */
export default function RangeSlider({
  min = 1970,
  max = new Date().getFullYear(),
  step = 1,
  value,
  onChange,
  onCommit,
  formatValue = (v) => v,
  label = "Range",
  disabled = false,
}) {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(null);
  const latest = useRef(value);
  const [range, setRange] = useState(() => {
    const [lo, hi] = value;
    return [clamp(lo ?? min, min, max), clamp(hi ?? max, min, max)];
  });
  latest.current = range;

  /* Preset chips and the slider drive the same filter, so adopt the incoming
     value whenever the parent changes it from outside. */
  useEffect(() => {
    const next = [
      clamp(value?.[0] ?? min, min, max),
      clamp(value?.[1] ?? max, min, max),
    ];
    setRange((prev) => (prev[0] === next[0] && prev[1] === next[1] ? prev : next));
  }, [value, min, max]);

  const baseId = useId();

  /* Normalise so the lower thumb never crosses the upper one. */
  const emit = useCallback(
    (nextLo, nextHi, commit) => {
      let lo = clamp(Math.round(nextLo / step) * step, min, max);
      let hi = clamp(Math.round(nextHi / step) * step, min, max);
      if (lo > hi) [lo, hi] = [hi, lo];

      const next = [lo, hi];
      latest.current = next;
      setRange(next);
      onChange?.(next);
      if (commit) onCommit?.(next);
    },
    [min, max, step, onChange, onCommit],
  );

  const valueFromClientX = useCallback(
    (clientX) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0) return min;
      const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
      return min + ratio * (max - min);
    },
    [min, max],
  );

  const moveThumb = useCallback(
    (which, clientX, commit = false) => {
      const [lo, hi] = latest.current;
      const raw = valueFromClientX(clientX);
      if (which === "lower") emit(raw, hi, commit);
      else emit(lo, raw, commit);
    },
    [emit, valueFromClientX],
  );

  const onThumbPointerDown = (which) => (event) => {
    if (disabled) return;
    event.preventDefault();
    /* Keep the track's own pointerdown from re-picking a thumb. */
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDragging(which);
    moveThumb(which, event.clientX);
  };

  /* Clicking anywhere on the track jumps whichever thumb is closer. */
  const onTrackPointerDown = (event) => {
    if (disabled || event.button !== 0) return;
    event.preventDefault();
    const raw = valueFromClientX(event.clientX);
    const [lo, hi] = latest.current;
    const which = Math.abs(raw - lo) <= Math.abs(hi - raw) ? "lower" : "upper";
    setDragging(which);
    moveThumb(which, event.clientX, true);
  };

  /* Pointer capture keeps the drag alive even if the cursor leaves the track. */
  const onPointerMove = (event) => {
    if (!dragging) return;
    moveThumb(dragging, event.clientX);
  };

  const endDrag = (event) => {
    if (!dragging) return;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    setDragging(null);
    onCommit?.(latest.current);
  };

  /* Fallback for mouse users when pointer events are not captured. */
  useEffect(() => {
    if (!dragging) return;
    const onMove = (event) => moveThumb(dragging, event.clientX);
    const onUp = () => {
      setDragging(null);
      onCommit?.(latest.current);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging, moveThumb, onCommit]);

  const onKeyDown = (which) => (event) => {
    const [lo, hi] = range;
    const big = Math.max(step * 10, Math.round((max - min) / 10));
    let nextLo = lo;
    let nextHi = hi;

    switch (event.key) {
      case "ArrowLeft":
      case "ArrowDown":
        if (which === "lower") nextLo = lo - step;
        else nextHi = hi - step;
        break;
      case "ArrowRight":
      case "ArrowUp":
        if (which === "lower") nextLo = lo + step;
        else nextHi = hi + step;
        break;
      case "PageDown":
        if (which === "lower") nextLo = lo - big;
        else nextHi = hi - big;
        break;
      case "PageUp":
        if (which === "lower") nextLo = lo + big;
        else nextHi = hi + big;
        break;
      case "Home":
        if (which === "lower") nextLo = min;
        else nextHi = lo;
        break;
      case "End":
        if (which === "lower") nextLo = hi;
        else nextHi = max;
        break;
      default:
        return;
    }

    event.preventDefault();
    emit(nextLo, nextHi, true);
  };

  const toPercent = (v) => ((v - min) / (max - min)) * 100;
  const isFullRange = range[0] === min && range[1] === max;

  return (
    <div className={`range${disabled ? " is-disabled" : ""}`}>
      <div className="range-readout">
        <span className="range-value">{formatValue(range[0])}</span>
        <span className="range-sep" aria-hidden="true">
          –
        </span>
        <span className="range-value">
          {isFullRange ? "Now" : formatValue(range[1])}
        </span>
      </div>

      <div
        ref={trackRef}
        className="range-track"
        onPointerDown={onTrackPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <span className="range-rail" />
        <span
          className="range-fill"
          style={{
            left: `${toPercent(range[0])}%`,
            width: `${toPercent(range[1]) - toPercent(range[0])}%`,
          }}
        />

        {["lower", "upper"].map((which, i) => (
          <span
            key={which}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-label={
              which === "lower" ? `${label} start year` : `${label} end year`
            }
            aria-valuemin={which === "lower" ? min : range[0]}
            aria-valuemax={which === "upper" ? max : range[1]}
            aria-valuenow={range[i]}
            aria-valuetext={formatValue(range[i])}
            aria-disabled={disabled || undefined}
            onPointerDown={onThumbPointerDown(which)}
            onKeyDown={onKeyDown(which)}
            className={`range-thumb${dragging === which ? " is-active" : ""}`}
            style={{ left: `${toPercent(range[i])}%` }}
          />
        ))}
      </div>

      <div className="range-scale" aria-hidden="true">
        <span>{formatValue(min)}</span>
        <button
          type="button"
          className="range-reset"
          onClick={() => emit(min, max, true)}
          disabled={disabled || isFullRange}
        >
          Reset
        </button>
        <span>{formatValue(max)}</span>
      </div>

      <style jsx global>{`
        .range {
          width: 100%;
        }
        .range.is-disabled {
          opacity: 0.45;
          pointer-events: none;
        }
        .range-readout {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
        }
        .range-value {
          padding: 5px 12px;
          border-radius: var(--radius-md);
          font-size: var(--text-sm);
          font-weight: var(--font-bold);
          color: var(--accent);
          background: var(--accent-subtle);
          border: 1px solid var(--accent-border);
        }
        .range-sep {
          color: var(--text-muted);
        }
        .range-track {
          position: relative;
          height: 24px;
          display: flex;
          align-items: center;
          touch-action: none;
          cursor: pointer;
        }
        .range-rail {
          position: absolute;
          left: 0;
          right: 0;
          height: 4px;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.12);
        }
        .range-fill {
          position: absolute;
          height: 4px;
          border-radius: var(--radius-full);
          background: linear-gradient(90deg, #d97706, var(--accent));
          box-shadow: 0 0 12px rgba(245, 158, 11, 0.4);
        }
        .range-thumb {
          position: absolute;
          width: 18px;
          height: 18px;
          margin-left: -9px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid var(--accent);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
          cursor: grab;
          transition:
            transform var(--transition-fast),
            box-shadow var(--transition-fast);
        }
        .range-thumb:hover,
        .range-thumb.is-active {
          transform: scale(1.18);
          box-shadow: 0 0 0 6px rgba(245, 158, 11, 0.18);
        }
        .range-thumb:active {
          cursor: grabbing;
        }
        .range-scale {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
          font-size: var(--text-xs);
          color: var(--text-muted);
        }
        .range-reset {
          font-size: var(--text-xs);
          font-weight: var(--font-semibold);
          color: var(--text-tertiary);
          padding: 3px 10px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
          transition: all var(--transition-fast);
        }
        .range-reset:hover:not(:disabled) {
          color: var(--accent);
          border-color: var(--accent-border);
        }
        .range-reset:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}