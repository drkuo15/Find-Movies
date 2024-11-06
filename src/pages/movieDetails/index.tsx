import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import * as stylex from '@stylexjs/stylex';
import {
  fetcher,
  getMovieDetailsAndCreditsUrl,
  getMovieReviewsKey,
} from '../../services/movie';
import type {
  MovieDetailAndCreditResponse,
  MovieReviewsResponse,
} from '../../types/movie';
import { colors, spacing } from '../../styles/tokens.stylex';
import { useParams } from 'react-router-dom';
import { CastSection } from '../../components/movie/CastSection';
import { MovieHeader } from '../../components/movie/MovieHeader';
import { ReviewSection } from '../../components/movie/ReviewSection';
import Message from '../../components/message';

const styles = stylex.create({
  container: {
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    padding: spacing.md,
    color: colors.white,
    '@media (min-width: 768px)': {
      padding: spacing.xl,
    },
  },
});

function MovieDetails() {
  const { id: movieId = '' } = useParams<{ id: string }>();

  const {
    data: movie,
    error: movieError,
    isLoading: isMovieLoading,
  } = useSWR<MovieDetailAndCreditResponse>(
    getMovieDetailsAndCreditsUrl(movieId),
    fetcher,
  );

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

  // Pagination-related logic
  const reviews = reviewsData
    ? reviewsData.flatMap((page) => page.results)
    : [];
  const totalPages = reviewsData?.[0]?.total_pages ?? 1;
  const isLoadingMore = isReviewsLoading && size > 1;
  const isReachingEnd = size >= totalPages;

  function handleLoadMore() {
    if (!isReachingEnd) {
      setSize(size + 1);
    }
  }

  // Handle initial loading state
  const isInitialLoading = isMovieLoading || (isReviewsLoading && size === 1);
  if (isInitialLoading) {
    return <Message variant="loading">Loading movie information...</Message>;
  }

  // Handle errors from either request
  if (movieError || reviewsError) {
    return (
      <Message variant="error">
        {movieError
          ? 'Failed to load movie details. Please try again later.'
          : 'Failed to load reviews. Please try again later.'}
      </Message>
    );
  }

  // Wait for all data to be available
  if (!movie || !reviewsData) return null;

  return (
    <div {...stylex.props(styles.container)}>
      <MovieHeader movie={movie} />
      <CastSection cast={movie.credits.cast} />
      <ReviewSection
        reviews={reviews}
        totalPages={totalPages}
        isLoadingMore={isLoadingMore}
        onLoadMore={handleLoadMore}
        hasMore={!isReachingEnd}
      />
    </div>
  );
}

export default MovieDetails;
