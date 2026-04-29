"use client";
import { createContext, useContext, useState, useEffect } from "react";

const WatchlistContext = createContext();

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("watchlist");
    if (stored) {
      try {
        setWatchlist(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading watchlist:", error);
      }
    }
    setLoading(false);
  }, []);

  // Save to localStorage whenever watchlist changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
    }
  }, [watchlist, loading]);

  // Add item to watchlist
  const addToWatchlist = (item) => {
    setWatchlist((prev) => {
      // Check if already exists
      if (prev.some((i) => i.id === item.id && i.type === item.type)) {
        return prev;
      }
      return [...prev, { ...item, addedAt: Date.now() }];
    });
  };

  // Remove item from watchlist
  const removeFromWatchlist = (id, type) => {
    setWatchlist((prev) =>
      prev.filter((item) => !(item.id === id && item.type === type)),
    );
  };

  // Check if item is in watchlist
  const isInWatchlist = (id, type) => {
    return watchlist.some((item) => item.id === id && item.type === type);
  };

  // Clear entire watchlist
  const clearWatchlist = () => {
    setWatchlist([]);
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        clearWatchlist,
        loading,
      }}
    >
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
