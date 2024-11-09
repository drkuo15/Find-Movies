import useSWR from 'swr';
import { fetchWatchList, removeFromWatchList } from '../services/firebase';
import { fetcher, getMovieDetailsKey } from '../services/tmdb';
import type { MovieDetailResponse, WatchListMovie } from '../types/movie';

export function useWatchList(userId: string) {
  // Fetch watch list movieIDs from Firebase
  const CACHE_KEY = userId ? `watchList-${userId}` : null;
  const {
    data: watchListData,
    isLoading: isWatchListLoading,
    error: watchListError,
    mutate,
  } = useSWR(CACHE_KEY, () => fetchWatchList(userId));

  // Fetch movie details for each movie in watch list
  const {
    data: movieData,
    isLoading: isMoviesLoading,
    error: moviesError,
  } = useSWR(
    watchListData
      ? Object.keys(watchListData).map((movieId) => getMovieDetailsKey(movieId))
      : null,
    async (urls) => {
      const movies = await Promise.all(
        urls.map((url) => fetcher<MovieDetailResponse>(url)),
      );
      // Combine movie details with watch list timestamps
      return movies.map(
        (movie) =>
          ({
            ...movie,
            addedAt: watchListData?.[movie.id].addedAt,
          }) as WatchListMovie,
      );
    },
  );

  const removeMovie = async (movieId: number) => {
    await removeFromWatchList(userId, movieId);

    // Update the cache to remove the movie
    mutate(
      (currentData) => {
        if (!currentData) return {};
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [movieId]: _, ...rest } = currentData;
        return rest;
      },
      false, //  don't revalidate with server
    );
  };

  return {
    moviesToWatch: movieData,
    isLoading: isWatchListLoading || isMoviesLoading,
    isError: Boolean(watchListError || moviesError),
    removeMovie,
  };
}
