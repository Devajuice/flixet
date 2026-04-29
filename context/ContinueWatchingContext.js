"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const ContinueWatchingContext = createContext();

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
  const [continueWatching, setContinueWatching] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("continueWatching");
    if (saved) {
      setContinueWatching(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("continueWatching", JSON.stringify(continueWatching));
  }, [continueWatching]);

  const addToContinueWatching = useCallback((item) => {
    setContinueWatching((prev) => {
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
  }, []);

  const removeFromContinueWatching = useCallback((id, type) => {
    setContinueWatching((prev) =>
      prev.filter((item) => !(item.id === id && item.type === type)),
    );
  }, []);

  const clearContinueWatching = useCallback(() => {
    setContinueWatching([]);
    localStorage.removeItem("continueWatching");
  }, []);

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
