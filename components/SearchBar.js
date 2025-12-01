'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar({ onClose }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      onClose?.();
    }
  };

  return (
    <form onSubmit={handleSearch} style={styles.form}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for movies..."
        style={styles.input}
        autoFocus
      />
      <button type="submit" style={styles.button}>Search</button>
    </form>
  );
}

const styles = {
  form: {
    display: 'flex',
    gap: '10px',
    width: '100%',
    maxWidth: '600px',
  },
  input: {
    flex: 1,
    padding: '12px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: 'var(--card-bg)',
    color: 'var(--text-primary)',
  },
  button: {
    padding: '12px 30px',
    backgroundColor: 'var(--accent)',
    color: 'white',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'var(--transition)',
  },
};
