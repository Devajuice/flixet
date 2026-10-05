"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ToastContainer from "@/components/ToastContainer";

const ToastContext = createContext(null);

const MAX_VISIBLE = 4;
let toastSeq = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  /* Mirrors `toasts` so callbacks can read current state without holding stale
     closures — and without side effects inside a state updater. */
  const toastsRef = useRef([]);
  /* id -> { timer, remaining, startedAt } so hover can pause the countdown */
  const timers = useRef(new Map());

  const commit = useCallback((updater) => {
    const next =
      typeof updater === "function" ? updater(toastsRef.current) : updater;
    toastsRef.current = next;
    setToasts(next);
  }, []);

  const clearTimer = useCallback((id) => {
    const entry = timers.current.get(id);
    if (entry) {
      clearTimeout(entry.timer);
      timers.current.delete(id);
    }
  }, []);

  const dismiss = useCallback(
    (id) => {
      clearTimer(id);
      commit((prev) => {
        const next = prev.filter((t) => t.id !== id);
        /* Trim from the front so the newest messages always get screen time. */
        return next.length > MAX_VISIBLE
          ? next.slice(next.length - MAX_VISIBLE)
          : next;
      });
    },
    [clearTimer, commit],
  );

  const clearToasts = useCallback(() => {
    timers.current.forEach((entry) => clearTimeout(entry.timer));
    timers.current.clear();
    commit([]);
  }, [commit]);

  const schedule = useCallback(
    (id, duration) => {
      clearTimer(id);
      if (!duration) return;
      timers.current.set(id, {
        timer: setTimeout(() => dismiss(id), duration),
        remaining: duration,
        startedAt: Date.now(),
      });
    },
    [clearTimer, dismiss],
  );

  const showToast = useCallback(
    (message, options = {}) => {
      const { type = "info", duration = 3600, ...rest } = options;
      const id = ++toastSeq;
      commit((prev) => [
        ...prev,
        { id, message, type, duration, ...rest },
      ]);
      schedule(id, duration);
      return id;
    },
    [commit, schedule],
  );

  const updateToast = useCallback(
    (id, patch) => {
      if (typeof patch === "string") patch = { message: patch };

      const current = toastsRef.current.find((t) => t.id === id);
      if (!current) return;

      const next = { ...current, ...patch };
      commit((prev) => prev.map((t) => (t.id === id ? next : t)));

      /* A different duration restarts the countdown from now. */
      if (patch.duration !== undefined && patch.duration !== current.duration) {
        schedule(id, next.duration);
      }
    },
    [commit, schedule],
  );

  const pauseToast = useCallback((id) => {
    const entry = timers.current.get(id);
    if (!entry || entry.timer === null) return;
    clearTimeout(entry.timer);
    entry.remaining -= Date.now() - entry.startedAt;
    entry.timer = null;
  }, []);

  const resumeToast = useCallback(
    (id) => {
      const entry = timers.current.get(id);
      if (!entry) return;
      if (entry.remaining <= 0) {
        dismiss(id);
        return;
      }
      entry.timer = setTimeout(() => dismiss(id), entry.remaining);
      entry.startedAt = Date.now();
    },
    [dismiss],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((entry) => clearTimeout(entry.timer));
      pending.clear();
    };
  }, []);

  const value = useMemo(
    () => ({
      toasts,
      showToast,
      updateToast,
      dismiss,
      clearToasts,
      pauseToast,
      resumeToast,
    }),
    [
      toasts,
      showToast,
      updateToast,
      dismiss,
      clearToasts,
      pauseToast,
      resumeToast,
    ],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

/** Shorthand helpers so call sites read as `toast.success("Saved")`. */
export function useToastActions() {
  const { showToast, updateToast, dismiss } = useToast();

  return useMemo(
    () => ({
      show: (message, options) => showToast(message, options),
      info: (message, options) =>
        showToast(message, { ...options, type: "info" }),
      success: (message, options) =>
        showToast(message, { ...options, type: "success" }),
      error: (message, options) =>
        showToast(message, { duration: 5000, ...options, type: "error" }),
      warning: (message, options) =>
        showToast(message, { ...options, type: "warning" }),
      /** Sticky toast showing a determinate bar — dismiss it yourself. */
      progress: (message, percent = 0, options) =>
        showToast(message, {
          type: "progress",
          percent,
          duration: 0,
          ...options,
        }),
      update: updateToast,
      dismiss,
    }),
    [showToast, updateToast, dismiss],
  );
}