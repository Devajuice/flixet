'use client';
import { motion } from 'framer-motion';

export default function EpisodeSelector({
  seasons,
  selectedSeason,
  selectedEpisode,
  onSeasonChange,
  onEpisodeChange,
}) {
  const currentSeason = seasons.find((s) => s.season_number === selectedSeason);

  return (
    <div style={styles.container}>
      {/* Season Selector */}
      <div style={styles.section}>
        <h3 style={styles.label}>Season</h3>
        <div style={styles.seasonGrid}>
          {seasons.map((season) => (
            <motion.button
              key={season.season_number}
              onClick={() => onSeasonChange(season.season_number)}
              style={{
                ...styles.seasonButton,
                ...(selectedSeason === season.season_number
                  ? styles.activeButton
                  : {}),
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Season {season.season_number}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Episode List */}
      {currentSeason && (
        <motion.div
          style={styles.section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 style={styles.label}>Episodes</h3>
          <div style={styles.episodeList}>
            {currentSeason.episodes && currentSeason.episodes.length > 0
              ? // Display episodes with details
                currentSeason.episodes.map((episode, index) => (
                  <motion.div
                    key={episode.episode_number || index}
                    onClick={() => onEpisodeChange(episode.episode_number)}
                    style={{
                      ...styles.episodeCard,
                      ...(selectedEpisode === episode.episode_number
                        ? styles.activeCard
                        : {}),
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div style={styles.episodeHeader}>
                      <h4 style={styles.episodeTitle}>
                        <span style={styles.episodeNumber}>
                          Episode {episode.episode_number}
                        </span>
                        <span style={styles.episodeSeparator}>·</span>
                        <span style={styles.episodeName}>
                          {episode.name || 'Untitled'}
                        </span>
                      </h4>
                      {episode.air_date && (
                        <span style={styles.airDate}>{episode.air_date}</span>
                      )}
                    </div>
                    {episode.overview && (
                      <p style={styles.episodeOverview}>{episode.overview}</p>
                    )}
                    {!episode.overview && (
                      <p style={styles.noOverview}>No description available</p>
                    )}
                  </motion.div>
                ))
              : // Fallback if no episode details available
                Array.from(
                  { length: currentSeason.episode_count },
                  (_, i) => i + 1
                ).map((ep, index) => (
                  <motion.div
                    key={ep}
                    onClick={() => onEpisodeChange(ep)}
                    style={{
                      ...styles.episodeCard,
                      ...(selectedEpisode === ep ? styles.activeCard : {}),
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div style={styles.episodeHeader}>
                      <h4 style={styles.episodeTitle}>
                        <span style={styles.episodeNumber}>Episode {ep}</span>
                      </h4>
                    </div>
                    <p style={styles.noOverview}>
                      Episode details not available
                    </p>
                  </motion.div>
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
    marginBottom: '30px',
  },
  label: {
    fontSize: '24px',
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  seasonGrid: {
    display: 'flex',
    flexWrap: 'wrap',
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
    border: 'none',
    cursor: 'pointer',
  },
  episodeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  episodeCard: {
    padding: '20px',
    backgroundColor: 'var(--card-bg)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '2px solid transparent',
  },
  activeCard: {
    backgroundColor: 'var(--accent)',
    borderColor: 'var(--accent)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
  episodeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
    gap: '15px',
  },
  episodeTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
    flex: 1,
  },
  episodeNumber: {
    color: 'var(--text-primary)',
  },
  episodeSeparator: {
    color: 'var(--text-secondary)',
    opacity: 0.5,
  },
  episodeName: {
    color: 'var(--text-primary)',
  },
  airDate: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    whiteSpace: 'nowrap',
  },
  episodeOverview: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: 'var(--text-secondary)',
    margin: 0,
  },
  noOverview: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    fontStyle: 'italic',
    opacity: 0.6,
    margin: 0,
  },
  activeButton: {
    backgroundColor: 'var(--accent)',
  },
};
