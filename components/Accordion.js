"use client";
import { useCallback, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

/**
 * A single accordion section. Rendered by <Accordion> — not used directly.
 *
 * Height animates via framer-motion's `height: auto`, so the panel grows to its
 * natural content height without measuring anything in JS.
 */
function AccordionPanel({
  title,
  subtitle,
  icon,
  content,
  open,
  onToggle,
  id,
  triggerRef,
  onKeyDown,
}) {
  return (
    <div className={`accordion-item${open ? " is-open" : ""}`}>
      <h3 className="accordion-heading">
        <button
          type="button"
          ref={triggerRef}
          id={`${id}-trigger`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          onKeyDown={onKeyDown}
          className="accordion-trigger"
        >
          {icon && <span className="accordion-icon">{icon}</span>}
          <span className="accordion-labels">
            <span className="accordion-title">{title}</span>
            {subtitle && <span className="accordion-subtitle">{subtitle}</span>}
          </span>
          <ChevronDown size={18} className="accordion-chevron" />
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-trigger`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
            className="accordion-panel"
          >
            <div className="accordion-panel-inner">{content}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Accordion({
  items,
  defaultOpen = [],
  allowMultiple = true,
  collapsed = false,
  className = "",
}) {
  const baseId = useId();
  const [openKeys, setOpenKeys] = useState(() =>
    Array.isArray(defaultOpen) ? defaultOpen : [defaultOpen],
  );
  const triggerRefs = useRef(new Map());

  const keyOf = useCallback(
    (item) => item.key ?? item.title,
    [],
  );

  const toggle = useCallback(
    (key) => {
      setOpenKeys((prev) => {
        const isOpen = prev.includes(key);
        if (isOpen) return prev.filter((k) => k !== key);
        return allowMultiple ? [...prev, key] : [key];
      });
    },
    [allowMultiple],
  );

  const allKeys = items.map(keyOf);

  /* Roving arrow-key navigation between headers, as expected of a tablist. */
  const onKeyDown = (event, index) => {
    const focusAt = (next) => {
      event.preventDefault();
      const node = triggerRefs.current.get(allKeys[next]);
      node?.focus();
    };

    switch (event.key) {
      case "ArrowDown":
        focusAt((index + 1) % allKeys.length);
        break;
      case "ArrowUp":
        focusAt((index - 1 + allKeys.length) % allKeys.length);
        break;
      case "Home":
        focusAt(0);
        break;
      case "End":
        focusAt(allKeys.length - 1);
        break;
      default:
    }
  };

  return (
    <div className={`accordion${collapsed ? " is-collapsed" : ""} ${className}`}>
      {items.map((item, index) => {
        const key = keyOf(item);
        return (
          <AccordionPanel
            key={key}
            id={`${baseId}-${index}`}
            title={item.title}
            subtitle={item.subtitle}
            icon={item.icon}
            content={item.content}
            open={openKeys.includes(key)}
            onToggle={() => toggle(key)}
            triggerRef={(node) => {
              if (node) triggerRefs.current.set(key, node);
              else triggerRefs.current.delete(key);
            }}
            onKeyDown={(event) => onKeyDown(event, index)}
          />
        );
      })}

      <style jsx global>{`
        .accordion {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .accordion-item {
          border-radius: var(--radius-lg);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          overflow: hidden;
          transition:
            border-color var(--transition-base),
            background var(--transition-base),
            box-shadow var(--transition-base);
        }
        .accordion-item:hover {
          border-color: var(--border-hover);
        }
        .accordion-item.is-open {
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--accent-border);
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
        }
        .accordion-heading {
          margin: 0;
        }
        .accordion-trigger {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          padding: 16px 18px;
          text-align: left;
          color: var(--text-primary);
          cursor: pointer;
        }
        .accordion-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          border-radius: var(--radius-md);
          color: var(--accent);
          background: var(--accent-subtle);
          border: 1px solid var(--accent-border);
        }
        .accordion-labels {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .accordion-title {
          font-size: var(--text-sm);
          font-weight: var(--font-bold);
        }
        .accordion-subtitle {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          line-height: 1.5;
        }
        .accordion-chevron {
          flex-shrink: 0;
          color: var(--text-tertiary);
          transition: transform var(--transition-base);
        }
        .accordion-item.is-open .accordion-chevron {
          transform: rotate(180deg);
          color: var(--accent);
        }
        .accordion-panel-inner {
          padding: 0 18px 18px 66px;
          font-size: var(--text-sm);
          line-height: 1.7;
          color: var(--text-secondary);
        }
        .accordion-panel-inner > *:first-child {
          margin-top: 0;
        }
        .accordion-panel-inner > *:last-child {
          margin-bottom: 0;
        }
        .accordion.is-collapsed .accordion-item {
          border-radius: var(--radius-md);
        }
        .accordion.is-collapsed .accordion-trigger {
          padding: 13px 15px;
        }
        @media (max-width: 480px) {
          .accordion-trigger {
            padding: 14px;
            gap: 11px;
          }
          .accordion-panel-inner {
            padding: 0 14px 16px;
          }
        }
      `}</style>
    </div>
  );
}