'use client';
import { motion } from 'framer-motion';
import { getImageUrl } from '@/lib/tmdb';

export default function CastSection({ cast }) {
  if (!cast || cast.length === 0) return null;

  // Show top 12 cast members
  const displayCast = cast.slice(0, 12);

  return (
    <motion.section 
      style={styles.section}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <h2 style={styles.title}>Cast</h2>
      <div style={styles.castGrid}>
        {displayCast.map((member, index) => (
          <motion.div
            key={member.id || index}
            style={styles.castCard}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + index * 0.05 }}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
          >
            <div style={styles.imageContainer}>
              {member.profile_path ? (
                <img
                  src={getImageUrl(member.profile_path, 'w185')}
                  alt={member.name}
                  style={styles.image}
                />
              ) : (
                <div style={styles.placeholder}>
                  <span style={styles.placeholderIcon}>👤</span>
                </div>
              )}
            </div>
            <div style={styles.info}>
              <h3 style={styles.name}>{member.name}</h3>
              <p style={styles.character}>
                {member.character || member.roles?.[0]?.character || 'Unknown Role'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

const styles = {
  section: {
    marginTop: '50px',
  },
  title: {
    fontSize: '28px',
    marginBottom: '25px',
    fontWeight: 'bold',
  },
  castGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '20px',
  },
  castCard: {
    backgroundColor: 'var(--card-bg)',
    borderRadius: '10px',
    overflow: 'hidden',
    transition: 'var(--transition)',
    cursor: 'pointer',
  },
  imageContainer: {
    position: 'relative',
    paddingBottom: '150%',
    overflow: 'hidden',
    backgroundColor: 'var(--secondary-bg)',
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholder: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--secondary-bg)',
  },
  placeholderIcon: {
    fontSize: '60px',
    opacity: 0.3,
  },
  info: {
    padding: '12px',
  },
  name: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '5px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  character: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};
