import useSWR from 'swr';
import { fetchWatchList, removeFromWatchList } from '../services/firebase';
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
    mutate,
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

  const removeMovie = async (movieId: number) => {
    await removeFromWatchList(userId, movieId);

    mutate(
      (currentData) => {
        if (!currentData) return { userId, watchList: [] };
        return {
          ...currentData,
          watchList: currentData.watchList.filter((m) => m.movieId !== movieId),
        };
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
