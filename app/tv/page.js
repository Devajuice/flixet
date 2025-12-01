'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getPopularTVShows, getTrendingTVShows } from '@/lib/tmdb';
import TVGrid from '@/components/TVGrid';

export default function TVShowsPage() {
  const [popular, setPopular] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [popularData, trendingData] = await Promise.all([
        getPopularTVShows(),
        getTrendingTVShows(),
      ]);
      setPopular(popularData.results);
      setTrending(trendingData.results);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ fontSize: '60px' }}
        >
          📺
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <section style={styles.hero}>
        <motion.h1 
          style={styles.heroTitle}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          TV Shows
        </motion.h1>
        <motion.p 
          style={styles.heroSubtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Watch your favorite series with all episodes
        </motion.p>
      </section>

      <TVGrid shows={trending} title="🔥 Trending This Week" />
      <TVGrid shows={popular} title="⭐ Popular TV Shows" />
    </>
  );
}

const styles = {
  hero: {
    textAlign: 'center',
    padding: '40px 20px',
    marginBottom: '20px',
  },
  heroTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '15px',
    background: 'linear-gradient(to right, #e50914, #f40612)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '18px',
    color: 'var(--text-secondary)',
  },
};
