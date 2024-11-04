import { MovieResponse } from '../types/movie';

export async function fetcher(url: string): Promise<MovieResponse> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_ACCESS_TOKEN}`,
      accept: 'application/json',
    },
  });
  return response.json();
}

export function getKey(
  pageIndex: number,
  previousPageData: MovieResponse | null,
  searchQuery: string,
) {
  if (previousPageData && !previousPageData.results.length) return null;

  if (pageIndex === 0) {
    return searchQuery
      ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchQuery)}&page=1`
      : null;
  }

  return `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchQuery)}&page=${pageIndex + 1}`;
}
