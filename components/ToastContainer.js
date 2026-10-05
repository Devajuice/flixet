"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  X,
  XCircle,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

/* Explicit rgba rather than color-mix() for the tinted surfaces. */
const VARIANTS = {
  info: { Icon: Info, accent: "var(--accent)", soft: "rgba(245,158,11,0.14)" },
  success: {
    Icon: CheckCircle2,
    accent: "var(--success)",
    soft: "rgba(34,197,94,0.14)",
  },
  error: { Icon: XCircle, accent: "var(--error)", soft: "rgba(239,68,68,0.14)" },
  warning: { Icon: AlertTriangle, accent: "var(--gold)", soft: "rgba(245,197,24,0.14)" },
  progress: { Icon: Loader2, accent: "var(--accent)", soft: "rgba(245,158,11,0.14)" },
};

export default function ToastContainer() {
  const { toasts, dismiss, pauseToast, resumeToast } = useToast();

  return (
    <div className="messenger" role="region" aria-label="Notifications">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const { Icon, accent, soft } = VARIANTS[toast.type] || VARIANTS.info;

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className={`messenger-toast messenger-toast--${toast.type}`}
              style={{ "--toast-accent": accent, "--toast-soft": soft }}
              role={toast.type === "error" ? "alert" : "status"}
              aria-live={toast.type === "error" ? "assertive" : "polite"}
              onMouseEnter={() => pauseToast(toast.id)}
              onMouseLeave={() => resumeToast(toast.id)}
            >
              <span className="messenger-icon">
                <Icon
                  size={17}
                  style={
                    toast.type === "progress"
                      ? { animation: "spin 0.9s linear infinite" }
                      : undefined
                  }
                />
              </span>

              <div className="messenger-body">
                {toast.title && (
                  <strong className="messenger-title">{toast.title}</strong>
                )}
                <span className="messenger-message">{toast.message}</span>

                {toast.type === "progress" && (
                  <div
                    className="messenger-track"
                    role="progressbar"
                    aria-valuenow={Math.round(toast.percent ?? 0)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <span
                      className="messenger-fill"
                      style={{ width: `${Math.min(100, Math.max(0, toast.percent ?? 0))}%` }}
                    />
                  </div>
                )}

                {toast.action && (
                  <button
                    className="messenger-action"
                    onClick={() => {
                      toast.action.onClick();
                      dismiss(toast.id);
                    }}
                  >
                    {toast.action.label}
                  </button>
                )}
              </div>

              <button
                className="messenger-close"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <style jsx global>{`
        .messenger {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 10050;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
          width: min(380px, calc(100vw - 32px));
          pointer-events: none;
        }
        .messenger-toast {
          pointer-events: auto;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          width: 100%;
          padding: 14px 14px 14px 16px;
          border-radius: var(--radius-lg);
          background: rgba(20, 20, 20, 0.96);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border-hover);
          box-shadow: var(--shadow-xl);
          position: relative;
          overflow: hidden;
        }
        .messenger-toast::before {
          content: "";
          position: absolute;
          inset: 0 auto 0 0;
          width: 3px;
          background: var(--toast-accent);
        }
        .messenger-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          flex-shrink: 0;
          border-radius: 50%;
          color: var(--toast-accent);
          background: var(--toast-soft);
        }
        .messenger-body {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .messenger-title {
          font-size: var(--text-sm);
          font-weight: var(--font-bold);
          color: #fff;
        }
        .messenger-message {
          font-size: var(--text-sm);
          line-height: 1.45;
          color: var(--text-secondary);
          overflow-wrap: anywhere;
        }
        .messenger-track {
          margin-top: 8px;
          height: 4px;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.1);
          overflow: hidden;
        }
        .messenger-fill {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: var(--toast-accent);
          transition: width 0.25s ease;
        }
        .messenger-action {
          align-self: flex-start;
          margin-top: 6px;
          padding: 5px 12px;
          border-radius: var(--radius-md);
          font-size: var(--text-xs);
          font-weight: var(--font-bold);
          color: var(--toast-accent);
          background: var(--toast-soft);
          border: 1px solid var(--toast-accent);
          transition: all var(--transition-fast);
        }
        .messenger-action:hover {
          filter: brightness(1.25);
        }
        .messenger-close {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          color: var(--text-muted);
          transition: all var(--transition-fast);
        }
        .messenger-close:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.08);
        }
        @media (max-width: 768px) {
          .messenger {
            right: 16px;
            left: 16px;
            bottom: 5rem;
            width: auto;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
}