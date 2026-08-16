"use client";

import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useSyncExternalStore,
} from "react";

const HistoryContext = createContext();

const STORAGE_KEY = "recentlyViewed";

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch (error) {
    console.error("Error reading recently viewed:", error);
    return "";
  }
}

function subscribe(callback) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getServerSnapshot() {
  return null;
}

export function HistoryProvider({ children }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const history = useMemo(() => {
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.error("Error loading recently viewed:", error);
      return [];
    }
  }, [raw]);

  const update = useCallback((updater) => {
    try {
      const currentRaw = window.localStorage.getItem(STORAGE_KEY);
      let current = [];
      if (currentRaw) {
        try {
          current = JSON.parse(currentRaw);
        } catch {
          current = [];
        }
      }
      const next = typeof updater === "function" ? updater(current) : updater;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Error saving recently viewed:", error);
    }
  }, []);

  const addToHistory = useCallback(
    (item) => {
      update((prev) => {
        const filtered = prev.filter(
          (i) => !(i.id === item.id && i.type === item.type),
        );
        const newItem = {
          ...item,
          lastViewedAt: new Date().toISOString(),
        };
        return [newItem, ...filtered].slice(0, 30);
      });
    },
    [update],
  );

  const removeFromHistory = useCallback(
    (id, type) => {
      update((prev) => prev.filter((item) => !(item.id === id && item.type === type)));
    },
    [update],
  );

  const clearHistory = useCallback(() => {
    update([]);
  }, [update]);

  return (
    <HistoryContext.Provider
      value={{
        history,
        addToHistory,
        removeFromHistory,
        clearHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("useHistory must be used within HistoryProvider");
  }
  return context;
}
