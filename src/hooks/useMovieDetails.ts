import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import {
  fetcher,
  getMovieDetailsKey,
  getMovieReviewsKey,
} from '../services/tmdb';
import type {
  MovieDetailAndCreditResponse,
  MovieReviewsResponse,
} from '../types/movie';

interface UseMovieDetailsReturn {
  movie: MovieDetailAndCreditResponse | undefined;
  reviews: MovieReviewsResponse['results'];
  isLoading: boolean;
  isLoadingMore: boolean;
  isError: boolean;
  totalPages: number;
  isReachingEnd: boolean;
  loadMore: () => void;
}

export function useMovieDetails(movieId: string): UseMovieDetailsReturn {
  // Fetch movie details with credits
  const {
    data: movie,
    error: movieError,
    isLoading: isMovieLoading,
  } = useSWR<MovieDetailAndCreditResponse>(
    getMovieDetailsKey(movieId, ['credits']),
    fetcher,
  );

  // Fetch paginated reviews
  const {
    data: reviewsData,
    error: reviewsError,
    isLoading: isReviewsLoading,
    size,
    setSize,
  } = useSWRInfinite<MovieReviewsResponse>(
    (pageIndex) => getMovieReviewsKey(movieId, pageIndex),
    fetcher,
  );

  const reviews = reviewsData?.flatMap((page) => page.results) ?? [];
  const totalPages = reviewsData?.[0]?.total_pages ?? 1;
  const isLoadingMore = isReviewsLoading && size > 1;
  const isReachingEnd = size >= totalPages;
  const isInitialLoading = isMovieLoading || (isReviewsLoading && size === 1);

  return {
    movie,
    reviews,
    isLoading: isInitialLoading,
    isLoadingMore,
    isError: Boolean(movieError || reviewsError),
    totalPages,
    isReachingEnd,
    loadMore: () => !isReachingEnd && setSize(size + 1),
  };
}
