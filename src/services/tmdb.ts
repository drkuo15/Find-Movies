import type { MovieListResponse } from '../types/movie';

export const TMDB_API_URL = 'https://api.themoviedb.org/3';

export async function fetcher<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_ACCESS_TOKEN}`,
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

interface PaginationParams {
  endpoint: string;
  pageParam: number;
  queryParams?: Record<string, string>;
}

export function generatePaginationKey({
  endpoint,
  pageParam,
  queryParams,
}: PaginationParams): string {
  const baseUrl = `${TMDB_API_URL}${endpoint}`;
  const searchParams = new URLSearchParams({ page: String(pageParam) });

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      searchParams.append(key, value);
    });
  }

  return `${baseUrl}?${searchParams.toString()}`;
}

export function getMovieSearchKey(
  pageIndex: number,
  previousPageData: MovieListResponse | null,
  searchQuery: string,
) {
  if (!searchQuery || (previousPageData && !previousPageData.results.length)) {
    return null;
  }

  return generatePaginationKey({
    endpoint: '/search/movie',
    pageParam: pageIndex + 1,
    queryParams: { query: searchQuery },
  });
}

export function getMovieReviewsKey(movieId: string, pageIndex: number) {
  return generatePaginationKey({
    endpoint: `/movie/${movieId}/reviews`,
    pageParam: pageIndex + 1,
  });
}

export function getMovieDetailsKey(
  movieId: number,
  appendToResponse?: string[],
) {
  const appendToResponseParam = appendToResponse?.length
    ? `?append_to_response=${appendToResponse.join(',')}`
    : '';
  return `${TMDB_API_URL}/movie/${movieId}${appendToResponseParam}`;
}
