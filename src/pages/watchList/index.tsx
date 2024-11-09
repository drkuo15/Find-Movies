import Message from '../../components/message';
import { useWatchList } from '../../hooks/useWatchList';
import * as stylex from '@stylexjs/stylex';
import { colors, spacing, fontSize, radius } from '../../styles/tokens.stylex';
import placeholderPoster from '../../assets/placeholder-poster.svg';
import { useState } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface SortOrder {
  direction: 'asc' | 'desc';
}

const styles = stylex.create({
  watchList: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.lg,
    color: colors.white,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize['2xl'],
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  },
  count: {
    backgroundColor: colors.gray700,
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: radius.full,
    fontSize: fontSize.sm,
  },
  filters: {
    display: 'flex',
    gap: spacing.md,
    alignItems: 'center',
  },
  movieCard: {
    display: 'flex',
    gap: spacing.base,
    backgroundColor: colors.gray800,
    borderRadius: radius.md,
    overflow: 'hidden',
    height: '200px',
  },
  poster: {
    width: '120px',
    height: '200px',
    objectFit: 'cover',
  },
  movieInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  movieTitle: {
    fontSize: fontSize.xl,
    fontWeight: '500',
    color: colors.white,
    cursor: 'pointer',
    ':hover': {
      color: colors.gray200,
    },
  },
  movieDate: {
    color: colors.gray400,
    fontSize: fontSize.sm,
  },
  movieOverview: {
    color: colors.gray300,
    fontSize: fontSize.base,
    overflow: 'hidden',
    display: '-webkit-box',
    '-webkit-line-clamp': '3',
    '-webkit-box-orient': 'vertical',
    textOverflow: 'ellipsis',
    lineHeight: '1.5',
  },
  actions: {
    display: 'flex',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    color: colors.gray400,
    fontSize: fontSize.base,
    cursor: 'pointer',
    ':hover': {
      color: colors.white,
    },
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
  posterLink: {
    cursor: 'pointer',
  },
});

export default function WatchList() {
  const userId = 'L76cAu6NoZG0yWuDX9CJ';
  const [sortOrder, setSortOrder] = useState<SortOrder>({ direction: 'desc' });
  const { moviesToWatch, isLoading, isError, removeMovie } =
    useWatchList(userId);
  const [isRemoving, setIsRemoving] = useState<Record<number, boolean>>({});

  if (isError) {
    return <Message variant="error">Failed to load watch list</Message>;
  }

  if (isLoading) {
    return <Message variant="loading">Loading watch list...</Message>;
  }

  const sortedMovies = moviesToWatch?.slice().sort((a, b) => {
    return sortOrder.direction === 'desc'
      ? b.addedAt.toMillis() - a.addedAt.toMillis()
      : a.addedAt.toMillis() - b.addedAt.toMillis();
  });

  const toggleSortOrder = () => {
    setSortOrder((prev) => ({
      direction: prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const handleRemove = async (movieId: number) => {
    setIsRemoving((prev) => ({ ...prev, [movieId]: true }));
    try {
      await removeMovie(movieId);
      toast.success('Movie removed from watchlist');
    } catch (error) {
      console.error('Failed to remove movie:', error);
      toast.error('Failed to remove movie');
    } finally {
      setIsRemoving((prev) => ({ ...prev, [movieId]: false }));
    }
  };

  return (
    <div {...stylex.props(styles.watchList)}>
      <div {...stylex.props(styles.header)}>
        <h1 {...stylex.props(styles.title)}>
          My Watchlist&nbsp;
          <span {...stylex.props(styles.count)}>
            {moviesToWatch?.length || 0}
          </span>
        </h1>
        <div {...stylex.props(styles.filters)}>
          <span>Filter by: Date Added</span>
          <button
            onClick={toggleSortOrder}
            {...stylex.props(styles.actionButton)}
          >
            Order: {sortOrder.direction === 'desc' ? '↓' : '↑'}
          </button>
        </div>
      </div>

      {sortedMovies?.map((movie) => (
        <div key={movie.id} {...stylex.props(styles.movieCard)}>
          <Link to={`/movie/${movie.id}`} {...stylex.props(styles.posterLink)}>
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                {...stylex.props(styles.poster)}
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
          </Link>
          <div {...stylex.props(styles.movieInfo)}>
            <Link to={`/movie/${movie.id}`}>
              <h2 {...stylex.props(styles.movieTitle)}>{movie.title}</h2>
            </Link>
            <span {...stylex.props(styles.movieDate)}>
              {movie.release_date}
            </span>
            <p {...stylex.props(styles.movieOverview)}>{movie.overview}</p>
            <div {...stylex.props(styles.actions)}>
              <button
                {...stylex.props(styles.actionButton)}
                onClick={() => handleRemove(movie.id)}
                disabled={isRemoving[movie.id]}
              >
                {isRemoving[movie.id] ? 'Removing...' : '✕ Remove'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
