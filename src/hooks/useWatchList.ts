import useSWR from 'swr';
import { fetchWatchList } from '../services/firebase';
import { fetcher, getMovieDetailsKey } from '../services/tmdb';
import type { MovieDetailResponse, WatchListMovie } from '../types/movie';

interface UseWatchListOptions {
  userId: string;
}

export function useWatchList({ userId }: UseWatchListOptions) {
  // Fetch watch list movieIDs from Firebase
  const CACHE_KEY = userId ? `watchList-${userId}` : null;
  const {
    data: watchListData,
    isLoading: isWatchListLoading,
    error: watchListError,
  } = useSWR(CACHE_KEY, () => fetchWatchList(userId));

  // Fetch movie details for each movie in watch list
  const {
    data: movieData,
    isLoading: isMoviesLoading,
    error: moviesError,
  } = useSWR(
    watchListData?.watchList
      ? watchListData.watchList.map((movie) =>
          getMovieDetailsKey(movie.movieId),
        )
      : null,
    async (urls) => {
      const movies = await Promise.all(
        urls.map((url) => fetcher<MovieDetailResponse>(url)),
      );

      // Combine movie details with watch list timestamps
      return movies.map(
        (movie, index) =>
          ({
            ...movie,
            addedAt: watchListData?.watchList[index].addedAt,
          }) as WatchListMovie,
      );
    },
  );

  return {
    moviesToWatch: movieData,
    isLoading: isWatchListLoading || isMoviesLoading,
    isError: Boolean(watchListError || moviesError),
  };
}
