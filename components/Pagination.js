"use client";
import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Builds a page list with `null` marking an elision gap:
 *   1 … 4 [5] 6 … 20
 */
function buildPages(current, total, siblings) {
  if (total <= 1) return [];

  const window = siblings * 2 + 5;
  if (total <= window) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const left = Math.max(current - siblings, 1);
  const right = Math.min(current + siblings, total);
  const showLeftGap = left > 2;
  const showRightGap = right < total - 1;

  const pages = [1];
  if (showLeftGap) pages.push(null);
  for (let p = Math.max(2, left); p <= Math.min(total - 1, right); p++) {
    pages.push(p);
  }
  if (showRightGap) pages.push(null);
  pages.push(total);

  return pages;
}

export default function Pagination({
  page,
  totalPages,
  totalResults,
  pageSize = 20,
  onChange,
  siblings = 1,
  scrollTo = true,
}) {
  const pages = useMemo(
    () => buildPages(page, totalPages, siblings),
    [page, totalPages, siblings],
  );

  if (totalPages <= 1) return null;

  const goTo = (next) => {
    const target = Math.min(Math.max(next, 1), totalPages);
    if (target === page) return;
    onChange(target);
    if (scrollTo) {
      window.requestAnimationFrame(() => {
        document
          .getElementById("main-content")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  const from = totalResults ? (page - 1) * pageSize + 1 : 0;
  const to = totalResults ? Math.min(page * pageSize, totalResults) : 0;

  return (
    <nav className="pager" aria-label="Pagination">
      {totalResults > 0 && (
        <p className="pager-range">
          Showing <strong>{from.toLocaleString()}</strong>–
          <strong>{to.toLocaleString()}</strong> of{" "}
          <strong>{totalResults.toLocaleString()}</strong>
        </p>
      )}

      <ul className="pager-list">
        <li>
          <button
            type="button"
            onClick={() => goTo(page - 1)}
            disabled={page <= 1}
            className="pager-btn pager-step"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
        </li>

        {pages.map((p, i) =>
          p === null ? (
            <li key={`gap-${i}`} className="pager-gap" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                onClick={() => goTo(p)}
                aria-label={`Page ${p}`}
                aria-current={p === page ? "page" : undefined}
                className={`pager-btn${p === page ? " is-active" : ""}`}
              >
                {p}
              </button>
            </li>
          ),
        )}

        <li>
          <button
            type="button"
            onClick={() => goTo(page + 1)}
            disabled={page >= totalPages}
            className="pager-btn pager-step"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </li>
      </ul>

      <style jsx global>{`
        .pager {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          margin-top: 40px;
        }
        .pager-range {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
          margin: 0;
        }
        .pager-range strong {
          color: var(--text-primary);
          font-weight: var(--font-bold);
        }
        .pager-list {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          justify-content: center;
          list-style: none;
          padding: 0;
        }
        .pager-btn {
          min-width: 40px;
          height: 40px;
          padding: 0 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border);
          transition: all var(--transition-fast);
        }
        .pager-btn:hover:not(:disabled):not(.is-active) {
          background: rgba(255, 255, 255, 0.09);
          border-color: var(--border-hover);
          color: #fff;
        }
        .pager-btn.is-active {
          color: #000;
          background: linear-gradient(135deg, #d97706, #f59e0b);
          border-color: transparent;
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.35);
        }
        .pager-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .pager-gap {
          min-width: 24px;
          text-align: center;
          color: var(--text-muted);
          font-size: var(--text-sm);
          user-select: none;
        }
        @media (max-width: 480px) {
          .pager-btn {
            min-width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </nav>
  );
}