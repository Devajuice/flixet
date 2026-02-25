const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

// Helper function to handle fetch requests
async function fetchFromTMDB(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);

  // Add default API Key
  url.searchParams.append('api_key', API_KEY);

  // Add other params (page, query, etc.)
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined) {
      url.searchParams.append(key, params[key]);
    }
  });

  const res = await fetch(url.toString(), {
    // Next.js specific caching (optional)
    next: { revalidate: 3600 }, // Revalidate data every hour
  });

  if (!res.ok) {
    throw new Error(`TMDB API Error: ${res.statusText}`);
  }

  return res.json();
}

// Movie APIs
export const getPopularMovies = (page = 1) =>
  fetchFromTMDB('/movie/popular', { page });

export const getTrendingMovies = () => fetchFromTMDB('/trending/movie/week');

export const getMovieDetails = (id) => fetchFromTMDB(`/movie/${id}`);

export const searchMovies = (query, page = 1) =>
  fetchFromTMDB('/search/movie', { query, page });

// TV Series APIs
export const getPopularTVShows = (page = 1) =>
  fetchFromTMDB('/tv/popular', { page });

export const getTrendingTVShows = () => fetchFromTMDB('/trending/tv/week');

export const getTVShowDetails = (id) => fetchFromTMDB(`/tv/${id}`);

export const getSeasonDetails = (tvId, seasonNumber) =>
  fetchFromTMDB(`/tv/${tvId}/season/${seasonNumber}`);

export const searchTVShows = (query, page = 1) =>
  fetchFromTMDB('/search/tv', { query, page });

export const searchMulti = (query, page = 1) =>
  fetchFromTMDB('/search/multi', { query, page });

// Credits APIs
export const getMovieCredits = (id) => fetchFromTMDB(`/movie/${id}/credits`);

export const getTVCredits = (id) =>
  fetchFromTMDB(`/tv/${id}/aggregate_credits`);

// Image URLs (Logic remains the same)
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return '/placeholder.png';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Streaming URLs (Logic remains the same)
export const getStreamUrl = (movieId) =>
  `https://vidsrc.xyz/embed/movie/${movieId}`;
export const getTVStreamUrl = (tvId, season, episode) =>
  `https://vidsrc.xyz/embed/tv/${tvId}/${season}-${episode}`;
export const getWorkingStreamUrl = (movieId) =>
  `https://www.2embed.cc/embed/${movieId}`;
export const getWorkingTVStreamUrl = (tvId, season, episode) =>
  `https://www.2embed.cc/embedtv/${tvId}&s=${season}&e=${episode}`;
