import * as stylex from '@stylexjs/stylex';
import useSWRInfinite from 'swr/infinite';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { spacing, fontSize, colors, radius } from '../../styles/tokens.stylex';
import placeholderPoster from '../../assets/placeholder-poster.svg';
import { fetcher, getKey } from '../../services/movie';
import type { MovieResponse } from '../../types/movie';
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
      '@media (max-width: ${breakpoint.md}px)': spacing.base,
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
    ':hover': {
      transform: 'scale(1.02)',
    },
  },
  moviePoster: {
    width: '100%',
    height: 'auto',
    aspectRatio: '2/3',
    objectFit: 'cover',
    backgroundColor: colors.lightGray,
  },
  placeholderContainer: {
    width: '100%',
    aspectRatio: '2/3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGray,
    color: colors.gray,
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
    color: colors.gray,
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    padding: spacing.lg,
  },
  loadingMessage: {
    textAlign: 'center',
    padding: spacing.lg,
    color: colors.white,
  },
  noResults: {
    textAlign: 'center',
    padding: spacing.lg,
    color: colors.gray,
  },
});

export default function Home() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const loader = useRef<HTMLDivElement>(null);

  const { data, error, isLoading, size, setSize, isValidating } =
    useSWRInfinite<MovieResponse>(
      (pageIndex, previousPageData) =>
        getKey(pageIndex, previousPageData, searchQuery),
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
        <div {...stylex.props(styles.errorMessage)}>
          Error loading movies. Please try again.
        </div>
      )}

      {/* Results */}
      {movies.length > 0 && (
        <div {...stylex.props(styles.movieGrid)}>
          {movies.map((movie) => (
            <div key={movie.id} {...stylex.props(styles.movieCard)}>
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
            </div>
          ))}
        </div>
      )}

      {/* Loading More Indicator */}
      <div ref={loader} {...stylex.props(styles.loadingMessage)}>
        {isLoadingMore ? 'Loading more...' : ''}
      </div>

      {/* No Results */}
      {isEmpty && searchQuery && (
        <div {...stylex.props(styles.noResults)}>
          No movies found for "{searchQuery}"
        </div>
      )}
    </div>
  );
}
