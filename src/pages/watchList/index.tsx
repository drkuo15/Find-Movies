import Message from '../../components/message';
import { useWatchList } from '../../hooks/useWatchList';
import * as stylex from '@stylexjs/stylex';
import { colors, spacing, fontSize, radius } from '../../styles/tokens.stylex';
import { useState } from 'react';
import { toast } from 'sonner';
import MovieCard from '../../components/movieCard';
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
        <MovieCard
          key={movie.id}
          movie={movie}
          actions={[
            {
              label: 'Remove',
              loadingLabel: 'Removing...',
              icon: '✕',
              onClick: () => handleRemove(movie.id),
              isLoading: isRemoving[movie.id],
            },
          ]}
        />
      ))}
    </div>
  );
}
