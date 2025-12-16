'use client';
import { useWatchlist } from '@/context/WatchlistContext';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WatchlistButton({ item, variant = 'default' }) {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  const isInWatchlist = watchlist.some(
    (w) => w.id === item.id && w.type === item.type
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

  // Large variant for detail pages
  if (variant === 'large') {
    return (
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: '100%',
          padding: '15px',
          backgroundColor: isInWatchlist ? 'var(--accent)' : 'transparent',
          color: isInWatchlist ? 'white' : 'var(--accent)',
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: 'var(--accent)',
          borderRadius: '10px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          transition: 'all 0.3s ease',
        }}
      >
        {isInWatchlist ? (
          <>
            <BookmarkCheck size={20} />
            In Watchlist
          </>
        ) : (
          <>
            <Bookmark size={20} />
            Add to Watchlist
          </>
        )}
      </motion.button>
    );
  }

  // Default small variant for grid cards
  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: isInWatchlist ? 'var(--accent)' : 'rgba(0, 0, 0, 0.7)',
        border: isInWatchlist ? 'none' : '2px solid rgba(255, 255, 255, 0.3)',
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
      }}
      title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      {isInWatchlist ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
    </motion.button>
  );
}
