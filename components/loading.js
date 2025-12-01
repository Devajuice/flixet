'use client';

export default function Loading() {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}>🎬</div>
      <p style={styles.text}>Loading...</p>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '20px',
  },
  spinner: {
    fontSize: '60px',
    animation: 'spin 1s linear infinite',
  },
  text: {
    fontSize: '18px',
    color: 'var(--text-secondary)',
  },
};
