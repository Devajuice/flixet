"use client";

import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useSyncExternalStore,
} from "react";

const ContinueWatchingContext = createContext();

const STORAGE_KEY = "continueWatching";

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch (error) {
    console.error("Error reading continue watching:", error);
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

// Helper function to format seconds to MM:SS or HH:MM:SS
const formatTime = (seconds) => {
  if (!seconds || seconds < 0) return "0:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

export function ContinueWatchingProvider({ children }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const continueWatching = useMemo(() => {
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.error("Error loading continue watching:", error);
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
      console.error("Error saving continue watching:", error);
    }
  }, []);

  const addToContinueWatching = useCallback(
    (item) => {
      update((prev) => {
        // Remove existing entry for this movie/show
        const filtered = prev.filter(
          (i) => !(i.id === item.id && i.type === item.type),
        );

        // Add new entry at the beginning (most recent first)
        const newItem = {
          ...item,
          lastWatched: new Date().toISOString(),
        };

        // Keep only last 20 items
        return [newItem, ...filtered].slice(0, 20);
      });
    },
    [update],
  );

  const removeFromContinueWatching = useCallback(
    (id, type) => {
      update((prev) =>
        prev.filter((item) => !(item.id === id && item.type === type)),
      );
    },
    [update],
  );

  const clearContinueWatching = useCallback(() => {
    update([]);
  }, [update]);

  const getProgress = useCallback(
    (id, type) => {
      return continueWatching.find(
        (item) => item.id === id && item.type === type,
      );
    },
    [continueWatching],
  );

  return (
    <ContinueWatchingContext.Provider
      value={{
        continueWatching,
        addToContinueWatching,
        removeFromContinueWatching,
        clearContinueWatching,
        getProgress,
        formatTime, // Export helper
      }}
    >
      {children}
    </ContinueWatchingContext.Provider>
  );
}

export function useContinueWatching() {
  const context = useContext(ContinueWatchingContext);
  if (!context) {
    throw new Error(
      "useContinueWatching must be used within ContinueWatchingProvider",
    );
  }
  return context;
}
