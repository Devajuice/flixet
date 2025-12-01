'use client';
import { motion } from 'framer-motion';

export default function EpisodeSelector({ seasons, selectedSeason, selectedEpisode, onSeasonChange, onEpisodeChange }) {
  const currentSeason = seasons.find(s => s.season_number === selectedSeason);
  
  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <h3 style={styles.label}>Season</h3>
        <div style={styles.seasonGrid}>
          {seasons.map((season) => (
            <motion.button
              key={season.season_number}
              onClick={() => onSeasonChange(season.season_number)}
              style={{
                ...styles.seasonButton,
                ...(selectedSeason === season.season_number ? styles.activeButton : {}),
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Season {season.season_number}
            </motion.button>
          ))}
        </div>
      </div>

      {currentSeason && (
        <motion.div 
          style={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 style={styles.label}>Episode</h3>
          <div style={styles.episodeGrid}>
            {Array.from({ length: currentSeason.episode_count }, (_, i) => i + 1).map((ep) => (
              <motion.button
                key={ep}
                onClick={() => onEpisodeChange(ep)}
                style={{
                  ...styles.episodeButton,
                  ...(selectedEpisode === ep ? styles.activeButton : {}),
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {ep}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

const styles = {
  container: {
    marginBottom: '30px',
  },
  section: {
    marginBottom: '25px',
  },
  label: {
    fontSize: '20px',
    marginBottom: '15px',
    fontWeight: 'bold',
  },
  seasonGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  episodeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
    gap: '10px',
  },
  seasonButton: {
    padding: '12px 20px',
    backgroundColor: 'var(--card-bg)',
    color: 'var(--text-primary)',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'var(--transition)',
  },
  episodeButton: {
    padding: '12px',
    backgroundColor: 'var(--card-bg)',
    color: 'var(--text-primary)',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'var(--transition)',
  },
  activeButton: {
    backgroundColor: 'var(--accent)',
  },
};
