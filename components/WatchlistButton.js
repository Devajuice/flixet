'use client';
import { useWatchlist } from '@/context/WatchlistContext';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WatchlistButton({ item, variant = 'default' }) {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  const isInWatchlist = watchlist.some(
    (w) => w.id === item.id && w.type === item.type,
  );

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWatchlist) {
      removeFromWatchlist(item.id, item.type);
    } else {
      addToWatchlist(item);
    }
  };

  /* ── Large variant (detail pages) ─────────────────────── */
  if (variant === 'large') {
    return (
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        style={{
          width: '100%',
          padding: '13px',
          background: isInWatchlist ? '#ffc13c' : 'transparent',
          color: isInWatchlist ? '#0d0d0f' : 'rgba(255,255,255,0.7)',
          border: isInWatchlist ? 'none' : '1px solid rgba(255, 193, 60, 0.3)',
          borderRadius: '10px',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '14px',
          fontWeight: '700',
          letterSpacing: '0.01em',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '9px',
          transition: 'all 0.2s ease',
        }}
      >
        {isInWatchlist ? (
          <>
            <BookmarkCheck size={18} />
            In Watchlist
          </>
        ) : (
          <>
            <Bookmark size={18} />
            Add to Watchlist
          </>
        )}
      </motion.button>
    );
  }

  /* ── Default small variant (grid cards) ───────────────── */
  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
      style={{
        width: '34px',
        height: '34px',
        borderRadius: '50%',
        background: isInWatchlist ? '#ffc13c' : 'rgba(13, 13, 15, 0.8)',
        border: isInWatchlist ? 'none' : '1px solid rgba(255, 255, 255, 0.15)',
        color: isInWatchlist ? '#0d0d0f' : 'rgba(255,255,255,0.6)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(6px)',
        transition: 'all 0.2s ease',
      }}
    >
      {isInWatchlist ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
    </motion.button>
  );
}
