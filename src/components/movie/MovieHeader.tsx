import * as stylex from '@stylexjs/stylex';
import type { MovieDetailAndCreditResponse } from '../../types/movie';
import { colors, spacing, fontSize, radius } from '../../styles/tokens.stylex';
import PlusIcon from '../../assets/icons/plus.svg';
import CheckIcon from '../../assets/icons/check.svg';
import { useState } from 'react';
import { toast } from 'sonner';
import { addToWatchList } from '../../services/firebase';

interface MovieHeaderProps {
  movie: MovieDetailAndCreditResponse;
}

const spin = stylex.keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

const styles = stylex.create({
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xl,
    marginBottom: spacing['2xl'],
    '@media (min-width: 768px)': {
      display: 'grid',
      gridTemplateColumns: '300px 1fr',
    },
  },
  poster: {
    width: '100%',
    maxWidth: '300px',
    marginInline: 'auto',
    borderRadius: radius.md,
    aspectRatio: '2/3',
    objectFit: 'cover',
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.lg,
  },
  title: {
    fontSize: '1.75rem',
    '@media (min-width: 768px)': {
      fontSize: '2.5rem',
    },
  },
  tagline: {
    fontSize: fontSize.lg,
    color: colors.gray400,
    fontStyle: 'italic',
    marginBottom: spacing.base,
  },
  metaInfo: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.md,
    color: colors.gray400,
    fontSize: fontSize.sm,
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: `${spacing.xs} ${spacing.sm}`,
    backgroundColor: colors.gray800,
    borderRadius: radius.full,
  },
  ratingScore: {
    color: colors.primary,
    fontWeight: '600',
  },
  overview: {
    fontSize: fontSize.base,
    lineHeight: 1.6,
    color: colors.gray400,
  },
  directorName: {
    color: colors.gray400,
  },
  posterContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: '300px',
    marginInline: 'auto',
  },
  bookmarkButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '40px',
    height: '60px',
    backgroundColor: colors.gray800Alpha,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    color: colors.gray200,
    transition: 'all 0.2s ease',
    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)',
    ':hover:enabled': {
      backgroundColor: colors.gray700,
    },
  },
  bookmarkIcon: {
    width: '20px',
    height: '20px',
    filter: 'brightness(0) invert(1)',
  },
  successIcon: {
    width: '20px',
    height: '20px',
    filter: 'brightness(0)',
  },
  loadingIndicator: {
    width: '20px',
    height: '20px',
    border: '2px solid transparent',
    borderTopColor: colors.white,
    borderRightColor: colors.white,
    borderRadius: '50%',
    animation: `${spin} 0.8s linear infinite`,
  },
  loadingState: {
    backgroundColor: colors.gray700,
    cursor: 'default',
  },
  successState: {
    backgroundColor: colors.secondary,
    cursor: 'default',
  },
});

export function MovieHeader({ movie }: MovieHeaderProps) {
  const director = movie.credits.crew.find(
    (person) => person.job === 'Director',
  );
  const userId = 'L76cAu6NoZG0yWuDX9CJ';
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToWatchList = async () => {
    setIsAdding(true);
    try {
      await addToWatchList(userId, movie.id);
      setIsAdded(true);
      toast.success('Added to watch list');
    } catch (error) {
      console.error('Failed to add movie:', error);
      toast.error('Failed to add movie');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div {...stylex.props(styles.header)}>
      <div {...stylex.props(styles.posterContainer)}>
        <button
          onClick={handleAddToWatchList}
          disabled={isAdding || isAdded}
          {...stylex.props(
            styles.bookmarkButton,
            isAdding && styles.loadingState,
            isAdded && styles.successState,
          )}
        >
          {isAdding ? (
            <div {...stylex.props(styles.loadingIndicator)} />
          ) : isAdded ? (
            <img
              src={CheckIcon}
              alt="Added to watchlist"
              {...stylex.props(styles.successIcon)}
            />
          ) : (
            <img
              src={PlusIcon}
              alt="Add to watchlist"
              {...stylex.props(styles.bookmarkIcon)}
            />
          )}
        </button>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          {...stylex.props(styles.poster)}
        />
      </div>
      <div {...stylex.props(styles.headerContent)}>
        <h1 {...stylex.props(styles.title)}>{movie.title}</h1>
        {movie.tagline && (
          <p {...stylex.props(styles.tagline)}>{movie.tagline}</p>
        )}
        <div {...stylex.props(styles.metaInfo)}>
          <span>{new Date(movie.release_date).getFullYear()}</span>
          <span>•</span>
          <span>{movie.runtime} min</span>
          <span>•</span>
          <span>{movie.genres.map((g) => g.name).join(', ')}</span>
          <div {...stylex.props(styles.rating)}>
            <span {...stylex.props(styles.ratingScore)}>
              {Math.round(movie.vote_average * 10)}
            </span>
            <span>User Score</span>
          </div>
        </div>
        {movie.overview && (
          <>
            <strong>Overview</strong>
            <p {...stylex.props(styles.overview)}>{movie.overview}</p>
          </>
        )}
        {director && (
          <>
            <strong>Director</strong>
            <p {...stylex.props(styles.directorName)}>{director.name}</p>
          </>
        )}
      </div>
    </div>
  );
}
