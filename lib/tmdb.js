import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Movie APIs
export const getPopularMovies = async (page = 1) => {
  const response = await tmdbApi.get('/movie/popular', {
    params: { page },
  });
  return response.data;
};

export const getTrendingMovies = async () => {
  const response = await tmdbApi.get('/trending/movie/week');
  return response.data;
};

export const getMovieDetails = async (id) => {
  const response = await tmdbApi.get(`/movie/${id}`);
  return response.data;
};

export const searchMovies = async (query, page = 1) => {
  const response = await tmdbApi.get('/search/movie', {
    params: { query, page },
  });
  return response.data;
};

// TV Series APIs
export const getPopularTVShows = async (page = 1) => {
  const response = await tmdbApi.get('/tv/popular', {
    params: { page },
  });
  return response.data;
};

export const getTrendingTVShows = async () => {
  const response = await tmdbApi.get('/trending/tv/week');
  return response.data;
};

export const getTVShowDetails = async (id) => {
  const response = await tmdbApi.get(`/tv/${id}`);
  return response.data;
};

export const getSeasonDetails = async (tvId, seasonNumber) => {
  const response = await tmdbApi.get(`/tv/${tvId}/season/${seasonNumber}`);
  return response.data;
};

export const searchTVShows = async (query, page = 1) => {
  const response = await tmdbApi.get('/search/tv', {
    params: { query, page },
  });
  return response.data;
};

export const searchMulti = async (query, page = 1) => {
  const response = await tmdbApi.get('/search/multi', {
    params: { query, page },
  });
  return response.data;
};

// Credits APIs
export const getMovieCredits = async (id) => {
  const response = await tmdbApi.get(`/movie/${id}/credits`);
  return response.data;
};

export const getTVCredits = async (id) => {
  const response = await tmdbApi.get(`/tv/${id}/aggregate_credits`);
  return response.data;
};

// Image URLs
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return '/placeholder.png';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Streaming URLs
export const getStreamUrl = (movieId) => {
  return `https://vidsrc.xyz/embed/movie/${movieId}`;
};

export const getTVStreamUrl = (tvId, season, episode) => {
  return `https://vidsrc.xyz/embed/tv/${tvId}/${season}-${episode}`;
};
// Working streaming URLs that support embedding
export const getWorkingStreamUrl = (movieId) => {
  // Use embed services that allow iframe embedding
  return `https://www.2embed.cc/embed/${movieId}`;
};

export const getWorkingTVStreamUrl = (tvId, season, episode) => {
  return `https://www.2embed.cc/embedtv/${tvId}&s=${season}&e=${episode}`;
};