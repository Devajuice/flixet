import { searchMovies } from '@/lib/tmdb';
import MovieGrid from '@/components/MovieGrid';

export default async function SearchPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || '';
  const data = query ? await searchMovies(query) : { results: [] };

  return (
    <div>
      <h1 style={styles.title}>
        {query ? `Search results for "${query}"` : 'Search Movies'}
      </h1>
      
      {data.results.length > 0 ? (
        <MovieGrid movies={data.results} />
      ) : (
        <p style={styles.noResults}>
          {query ? 'No movies found. Try a different search.' : 'Enter a search term to find movies.'}
        </p>
      )}
    </div>
  );
}

const styles = {
  title: {
    fontSize: '36px',
    marginBottom: '40px',
  },
  noResults: {
    fontSize: '20px',
    color: 'var(--text-secondary)',
    textAlign: 'center',
    marginTop: '100px',
  },
};
