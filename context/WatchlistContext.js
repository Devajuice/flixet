"use client";
import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useSyncExternalStore,
} from "react";

const WatchlistContext = createContext();

const STORAGE_KEY = "watchlist";

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch (error) {
    console.error("Error reading watchlist:", error);
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

export function WatchlistProvider({ children }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const watchlist = useMemo(() => {
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.error("Error loading watchlist:", error);
      return [];
    }
  }, [raw]);

  const loading = raw === null;

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
      console.error("Error saving watchlist:", error);
    }
  }, []);

  // Add item to watchlist
  const addToWatchlist = useCallback(
    (item) => {
      update((prev) => {
        // Check if already exists
        if (prev.some((i) => i.id === item.id && i.type === item.type)) {
          return prev;
        }
        return [...prev, { ...item, addedAt: Date.now() }];
      });
    },
    [update],
  );

  // Remove item from watchlist
  const removeFromWatchlist = useCallback(
    (id, type) => {
      update((prev) =>
        prev.filter((item) => !(item.id === id && item.type === type)),
      );
    },
    [update],
  );

  // Check if item is in watchlist
  const isInWatchlist = useCallback(
    (id, type) => {
      return watchlist.some((item) => item.id === id && item.type === type);
    },
    [watchlist],
  );

  // Clear entire watchlist
  const clearWatchlist = useCallback(() => {
    update([]);
  }, [update]);

  const value = useMemo(
    () => ({
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
      clearWatchlist,
      loading,
    }),
    [
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
      clearWatchlist,
      loading,
    ],
  );

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within WatchlistProvider");
  }
  return context;
}
