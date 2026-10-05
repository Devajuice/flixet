"use client";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { formatDate } from "@/lib/utils";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

/* Local array rather than toLocaleString, which can differ between the server
   and client timezones and trip a hydration mismatch. */
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/* Captured once at module scope: the calendar's default month never changes. */
const nowYear = new Date().getFullYear();
const nowMonth = new Date().getMonth();

const localTodayKey = () => {
  const now = new Date();
  return toKey(now.getFullYear(), now.getMonth(), now.getDate());
};

/* Today's date never changes while the page is open. */
const noopSubscribe = () => () => {};

const toKey = (year, month, day) =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

/** Monday-first offset of the 1st, so the grid lines up with the weekday row. */
const leadingBlanks = (year, month) => (new Date(year, month, 1).getDay() + 6) % 7;

const sameDay = (a, b) => a === b;

/**
 * Calendar popover for picking a single date or a from/to range.
 *
 * Renders from plain year/month/day integers instead of `Date` objects so the
 * grid is identical on the server and the client (no timezone drift, which
 * would otherwise cause a hydration mismatch).
 */
export default function Calendar({
  value,
  onChange,
  mode = "single",
  min,
  max,
  placeholder = "Select a date",
  label = "Date",
  clearable = true,
}) {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState(() => ({
    start: value?.start ?? null,
    end: value?.end ?? null,
  }));

  /* Seed the visible month from the selection, else the current month. The
     empty string is a legitimate "no filter" value, so filter falsy entries
     rather than using `??`. */
  const seed = useMemo(
    () => [value?.start, value?.end].find(Boolean) ?? null,
    [value],
  );

  const [viewYear, setViewYear] = useState(() => {
    if (typeof seed === "string") return Number(seed.slice(0, 4)) || nowYear;
    return nowYear;
  });
  const [viewMonth, setViewMonth] = useState(() => {
    if (typeof seed === "string") return (Number(seed.slice(5, 7)) || 1) - 1;
    return nowMonth;
  });

  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const gridRef = useRef(null);
  const baseId = useId();

  /* Resolved client-side only: computing "today" during render would bake the
     server's timezone into the markup and mismatch on hydration. */
  const today = useSyncExternalStore(noopSubscribe, localTodayKey, () => null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const shiftMonth = useCallback(
    (delta) => {
      setViewMonth((prev) => {
        const next = prev + delta;
        if (next < 0) {
          setViewYear((y) => y - 1);
          return 11;
        }
        if (next > 11) {
          setViewYear((y) => y + 1);
          return 0;
        }
        return next;
      });
    },
    [],
  );

  const grid = useMemo(() => {
    const total = daysInMonth(viewYear, viewMonth);
    const blanks = leadingBlanks(viewYear, viewMonth);
    const cells = [];

    for (let i = 0; i < blanks; i++) cells.push(null);
    for (let day = 1; day <= total; day++) cells.push(day);

    return cells;
  }, [viewYear, viewMonth]);

  const isDisabled = useCallback(
    (key) => {
      if (min && key < min) return true;
      if (max && key > max) return true;
      return false;
    },
    [min, max],
  );

  const selectDay = (day) => {
    const key = toKey(viewYear, viewMonth, day);
    if (isDisabled(key)) return;

    if (mode === "single") {
      onChange?.({ start: key, end: key });
      setRange({ start: key, end: key });
      setOpen(false);
      return;
    }

    /* First click sets the start; the second completes the range. */
    if (!range.start || (range.start && range.end)) {
      const next = { start: key, end: null };
      setRange(next);
      onChange?.(next);
      return;
    }

    const next =
      key < range.start
        ? { start: key, end: range.start }
        : { start: range.start, end: key };
    setRange(next);
    onChange?.(next);
  };

  const clear = () => {
    const next = { start: null, end: null };
    setRange(next);
    onChange?.(next);
    setOpen(false);
  };

  const onGridKeyDown = (event) => {
    const cell = event.target.closest("[data-day]");
    if (!cell) return;
    const day = Number(cell.dataset.day);

    const move = (delta) => {
      event.preventDefault();
      let target = day + delta;
      let month = viewMonth;
      let year = viewYear;

      if (target < 1) {
        month -= 1;
        if (month < 0) {
          month = 11;
          year -= 1;
        }
        target = daysInMonth(year, month);
      } else if (target > daysInMonth(year, month)) {
        target = 1;
        month += 1;
        if (month > 11) {
          month = 0;
          year += 1;
        }
      }

      setViewYear(year);
      setViewMonth(month);
      requestAnimationFrame(() => {
        gridRef.current
          ?.querySelector(`[data-day="${target}"]`)
          ?.focus();
      });
    };

    switch (event.key) {
      case "ArrowLeft":
        move(-1);
        break;
      case "ArrowRight":
        move(1);
        break;
      case "ArrowUp":
        move(-7);
        break;
      case "ArrowDown":
        move(7);
        break;
      case "PageUp":
        event.preventDefault();
        shiftMonth(-1);
        break;
      case "PageDown":
        event.preventDefault();
        shiftMonth(1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        selectDay(day);
        break;
      default:
    }
  };

  const displayText = (() => {
    if (!range.start) return placeholder;
    if (mode === "single") return formatDate(range.start);
    if (!range.end) return `${formatDate(range.start)} → …`;
    if (sameDay(range.start, range.end)) return formatDate(range.start);
    return `${formatDate(range.start)} → ${formatDate(range.end)}`;
  })();

  const monthLabel = `${MONTH_NAMES[viewMonth]} ${viewYear}`;

  const hasValue = Boolean(range.start);

  return (
    <div className="cal" ref={rootRef}>
      <button
        type="button"
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={`${baseId}-panel`}
        aria-label={`${label}: ${displayText}`}
        className={`cal-trigger${open ? " is-open" : ""}${hasValue ? " has-value" : ""}`}
      >
        <CalendarDays size={15} color="var(--accent)" />
        <span className="cal-text">{displayText}</span>
        {hasValue && clearable && (
          <span
            role="button"
            tabIndex={-1}
            aria-label="Clear date"
            className="cal-clear"
            onClick={(event) => {
              event.stopPropagation();
              clear();
            }}
          >
            <X size={13} />
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={`${baseId}-panel`}
            role="dialog"
            aria-label={label}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="cal-pop"
          >
            <div className="cal-head">
              <button
                type="button"
                className="cal-nav"
                onClick={() => shiftMonth(-1)}
                aria-label="Previous month"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="cal-month" aria-live="polite">
                {monthLabel}
              </span>
              <button
                type="button"
                className="cal-nav"
                onClick={() => shiftMonth(1)}
                aria-label="Next month"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="cal-weekdays" aria-hidden="true">
              {WEEKDAYS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>

            <div
              className="cal-grid"
              role="grid"
              ref={gridRef}
              onKeyDown={onGridKeyDown}
            >
              {grid.map((day, index) => {
                if (day === null) {
                  return <span key={`blank-${index}`} className="cal-blank" />;
                }

                const key = toKey(viewYear, viewMonth, day);
                const disabled = isDisabled(key);
                const isStart = sameDay(key, range.start);
                const isEnd = sameDay(key, range.end);
                const inRange =
                  mode === "range" &&
                  range.start &&
                  range.end &&
                  key > range.start &&
                  key < range.end;

                return (
                  <button
                    key={key}
                    type="button"
                    data-day={day}
                    disabled={disabled}
                    role="gridcell"
                    aria-selected={isStart || isEnd}
                    aria-label={formatDate(key)}
                    onClick={() => selectDay(day)}
                    className={[
                      "cal-day",
                      isStart || isEnd ? "is-selected" : "",
                      isStart && isEnd ? "is-single" : "",
                      inRange ? "in-range" : "",
                      key === today ? "is-today" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="cal-foot">
              <span className="cal-hint">
                {mode === "range"
                  ? range.start && !range.end
                    ? "Now pick the end date"
                    : "Pick a start date"
                  : displayText}
              </span>
              {mode === "range" && (
                <button
                  type="button"
                  className="cal-apply"
                  disabled={!range.start || !range.end}
                  onClick={() => setOpen(false)}
                >
                  Apply
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .cal {
          position: relative;
          width: 100%;
        }
        .cal-trigger {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 11px 13px;
          border-radius: var(--radius-md);
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          text-align: left;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border);
          transition: all var(--transition-base);
        }
        .cal-trigger:hover,
        .cal-trigger.is-open {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--border-hover);
          color: #fff;
        }
        .cal-trigger.has-value {
          color: var(--accent);
          border-color: var(--accent-border);
        }
        .cal-text {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .cal-clear {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          border-radius: 50%;
          color: var(--text-muted);
          transition: all var(--transition-fast);
        }
        .cal-clear:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.12);
        }
        .cal-pop {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          z-index: 60;
          width: 292px;
          padding: 14px;
          border-radius: var(--radius-lg);
          background: rgba(16, 16, 16, 0.98);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border-hover);
          box-shadow: var(--shadow-xl);
        }
        .cal-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 12px;
        }
        .cal-month {
          font-size: var(--text-sm);
          font-weight: var(--font-bold);
          color: #fff;
        }
        .cal-nav {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          color: var(--text-tertiary);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          transition: all var(--transition-fast);
        }
        .cal-nav:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
        }
        .cal-weekdays,
        .cal-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }
        .cal-weekdays {
          margin-bottom: 4px;
        }
        .cal-weekdays span {
          text-align: center;
          font-size: 10px;
          font-weight: var(--font-bold);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted);
          padding: 4px 0;
        }
        .cal-blank,
        .cal-day {
          aspect-ratio: 1;
        }
        .cal-day {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          font-size: var(--text-xs);
          font-weight: var(--font-medium);
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }
        .cal-day:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
        .cal-day:disabled {
          color: var(--text-muted);
          opacity: 0.35;
          cursor: not-allowed;
        }
        .cal-day.is-today {
          box-shadow: inset 0 0 0 1px var(--accent-border);
          color: var(--accent);
        }
        .cal-day.in-range {
          background: var(--accent-subtle);
          border-radius: 0;
          color: var(--accent);
        }
        .cal-day.is-selected {
          background: linear-gradient(135deg, #d97706, var(--accent));
          color: #000;
          font-weight: var(--font-bold);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
        }
        .cal-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--border);
        }
        .cal-hint {
          font-size: var(--text-xs);
          color: var(--text-muted);
        }
        .cal-apply {
          padding: 6px 14px;
          border-radius: var(--radius-sm);
          font-size: var(--text-xs);
          font-weight: var(--font-bold);
          color: #000;
          background: linear-gradient(135deg, #d97706, var(--accent));
          transition: all var(--transition-fast);
        }
        .cal-apply:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        @media (max-width: 360px) {
          .cal-pop {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}