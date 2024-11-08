import * as stylex from '@stylexjs/stylex';
import useSWRInfinite from 'swr/infinite';
import { useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { spacing, fontSize, colors, radius } from '../../styles/tokens.stylex';
import placeholderPoster from '../../assets/placeholder-poster.svg';
import { fetcher, getMovieSearchKey } from '../../services/tmdb';
import type { MovieListResponse } from '../../types/movie';
import Message from '../../components/message';

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  movieGrid: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(auto-fill, minmax(200px, 1fr))',
      '@media (max-width: 768px)': 'repeat(auto-fill, minmax(150px, 1fr))',
      '@media (max-width: 480px)': 'repeat(auto-fill, minmax(120px, 1fr))',
    },
    gap: {
      default: spacing.lg,
      '@media (max-width: 768px)': spacing.base,
      '@media (max-width: 480px)': spacing.sm,
    },
    width: '100%',
  },
  movieCard: {
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.white,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s ease-in-out',
    color: 'inherit',
    ':hover': {
      transform: 'scale(1.02)',
      color: 'inherit',
    },
  },
  moviePoster: {
    width: '100%',
    height: 'auto',
    aspectRatio: '2/3',
    objectFit: 'cover',
    backgroundColor: colors.gray200,
  },
  placeholderContainer: {
    width: '100%',
    aspectRatio: '2/3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray200,
    color: colors.gray400,
  },
  placeholderIcon: {
    width: '40%',
    height: '40%',
    opacity: 0.5,
  },
  movieInfo: {
    padding: spacing.md,
  },
  movieTitle: {
    fontSize: {
      default: fontSize.base,
      '@media (max-width: 768px)': fontSize.sm,
    },
    fontWeight: '600',
    marginBottom: spacing.xs,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  movieDate: {
    fontSize: {
      default: fontSize.sm,
      '@media (max-width: 768px)': fontSize.xs,
    },
    color: colors.gray400,
  },
});

export default function Home() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const loader = useRef<HTMLDivElement>(null);

  const { data, error, isLoading, size, setSize, isValidating } =
    useSWRInfinite<MovieListResponse>(
      (pageIndex, previousPageData) =>
        getMovieSearchKey(pageIndex, previousPageData, searchQuery),
      fetcher,
    );

  // Pagination-related logic
  const movies = data ? data.flatMap((page) => page.results) : [];
  const isLoadingInitialPage = isLoading;
  const isLoadingNextPage =
    size > 1 && data && typeof data[size - 1] === 'undefined';
  const isLoadingMore = isLoadingInitialPage || isLoadingNextPage;
  const isEmpty = data?.[0]?.results.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.total_pages <= size);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isReachingEnd &&
          !isLoadingMore &&
          !isValidating
        ) {
          setSize((prev) => prev + 1);
        }
      },
      { threshold: 1.0 },
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => observer.disconnect();
  }, [isReachingEnd, isLoadingMore, isValidating, setSize]);

  return (
    <div {...stylex.props(styles.container)}>
      {/* Error State */}
      {error && (
        <Message variant="error">
          Error loading movies. Please try again.
        </Message>
      )}

      {/* Results */}
      {movies.length > 0 && (
        <div {...stylex.props(styles.movieGrid)}>
          {movies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              {...stylex.props(styles.movieCard)}
            >
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  {...stylex.props(styles.moviePoster)}
                  loading="lazy"
                />
              ) : (
                <div {...stylex.props(styles.placeholderContainer)}>
                  <img
                    src={placeholderPoster}
                    alt="No poster available"
                    {...stylex.props(styles.placeholderIcon)}
                  />
                </div>
              )}
              <div {...stylex.props(styles.movieInfo)}>
                <h3 {...stylex.props(styles.movieTitle)}>{movie.title}</h3>
                <p {...stylex.props(styles.movieDate)}>{movie.release_date}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Loading More Indicator */}
      <div ref={loader}>
        {isLoadingMore && <Message variant="loading">Loading more...</Message>}
      </div>

      {/* No Results */}
      {isEmpty && searchQuery && (
        <Message variant="info">No movies found for "{searchQuery}"</Message>
      )}
    </div>
  );
}
