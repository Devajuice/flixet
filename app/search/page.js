import { searchMulti } from '@/lib/tmdb';
import SearchPageWrapper from '@/components/SearchPageWrapper';

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = params.q || '';

  // Use searchMulti to get both movies and TV shows
  const rawData = query ? await searchMulti(query) : { results: [] };

  // Filter to only show movies and TV shows (exclude people, etc.)
  const data = {
    ...rawData,
    results: rawData.results.filter(
      (item) => item.media_type === 'movie' || item.media_type === 'tv'
    ),
  };

  return <SearchPageWrapper query={query} data={data} />;
}
