import useSWR from 'swr';
import {
  fetchWatchList,
  removeFromWatchList,
  addToWatchList,
} from '../services/firebase/firestore';
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
    mutate();
  };

  const addMovie = async (movieId: number) => {
    await addToWatchList(userId, movieId);
    mutate();
  };

  return {
    moviesToWatch: movieData,
    isLoading: isWatchListLoading || isMoviesLoading,
    isError: Boolean(watchListError || moviesError),
    removeMovie,
    addMovie,
    userWatchList: watchListData,
  };
}
