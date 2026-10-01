/**
 * Browser-side TMDB access.
 *
 * All requests go through the /api/tmdb proxy so the API key is never shipped
 * in the client bundle and responses are cached at the edge.
 */

const PROXY_BASE = "/api/tmdb";

function buildUrl(path, params = {}) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });

  const qs = search.toString();
  return `${PROXY_BASE}/${path}${qs ? `?${qs}` : ""}`;
}

export async function tmdbFetch(path, params = {}, options = {}) {
  const res = await fetch(buildUrl(path, params), {
    signal: options.signal,
  });

  if (!res.ok) {
    throw new Error(`TMDB request failed: ${res.status}`);
  }

  return res.json();
}

export const getPopularMovies = (page = 1, options) =>
  tmdbFetch("movie/popular", { page, language: "en-US" }, options);

export const getPopularTVShows = (page = 1, options) =>
  tmdbFetch("tv/popular", { page, language: "en-US" }, options);

export const getTopRatedMovies = (options) =>
  tmdbFetch("movie/top_rated", { page: 1, language: "en-US" }, options);

export const getTrendingAll = (options) =>
  tmdbFetch("trending/all/week", { language: "en-US" }, options);

export const getMovieDetails = (id, options) =>
  tmdbFetch(
    `movie/${id}`,
    {
      append_to_response: "credits,videos,recommendations,watch/providers",
      language: "en-US",
    },
    options,
  );

export const getMovieExternalIds = (id, options) =>
  tmdbFetch(`movie/${id}/external_ids`, {}, options);

export const getTVShowDetails = (id, options) =>
  tmdbFetch(
    `tv/${id}`,
    {
      append_to_response: "credits,videos,recommendations,watch/providers",
      language: "en-US",
    },
    options,
  );

export const getTVExternalIds = (id, options) =>
  tmdbFetch(`tv/${id}/external_ids`, {}, options);

export const getSeasonDetails = (tvId, seasonNumber, options) =>
  tmdbFetch(`tv/${tvId}/season/${seasonNumber}`, { language: "en-US" }, options);

export const getPersonDetails = (id, options) =>
  tmdbFetch(
    `person/${id}`,
    { append_to_response: "combined_credits", language: "en-US" },
    options,
  );

export const searchMulti = (query, page = 1, options) =>
  tmdbFetch(
    "search/multi",
    { query, page, language: "en-US", include_adult: "false" },
    options,
  );

export const discoverMovies = (params, options) =>
  tmdbFetch("discover/movie", { language: "en-US", ...params }, options);

export const discoverTV = (params, options) =>
  tmdbFetch("discover/tv", { language: "en-US", ...params }, options);

export const getUpcomingMovies = (page = 1, options) =>
  tmdbFetch(
    "movie/upcoming",
    { page, language: "en-US", region: "US" },
    options,
  );

export const getOnTheAirTV = (page = 1, options) =>
  tmdbFetch("tv/on_the_air", { page, language: "en-US" }, options);