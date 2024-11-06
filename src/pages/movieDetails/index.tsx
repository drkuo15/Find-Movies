import * as stylex from '@stylexjs/stylex';
import { colors, spacing } from '../../styles/tokens.stylex';
import { useParams } from 'react-router-dom';
import { CastSection } from '../../components/movie/CastSection';
import { MovieHeader } from '../../components/movie/MovieHeader';
import { ReviewSection } from '../../components/movie/ReviewSection';
import Message from '../../components/message';
import { useMovieDetails } from '../../hooks/useMovieDetails';

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
    movie,
    reviews,
    isLoading,
    isLoadingMore,
    isError,
    totalPages,
    isReachingEnd,
    loadMore,
  } = useMovieDetails(movieId);

  if (isLoading) {
    return <Message variant="loading">Loading movie information...</Message>;
  }

  if (isError) {
    return (
      <Message variant="error">
        Failed to load movie details. Please try again later.
      </Message>
    );
  }

  if (!movie) return null;

  return (
    <div {...stylex.props(styles.container)}>
      <MovieHeader movie={movie} />
      <CastSection cast={movie.credits.cast} />
      <ReviewSection
        reviews={reviews}
        totalPages={totalPages}
        isLoadingMore={isLoadingMore}
        onLoadMore={loadMore}
        hasMore={!isReachingEnd}
      />
    </div>
  );
}

export default MovieDetails;
