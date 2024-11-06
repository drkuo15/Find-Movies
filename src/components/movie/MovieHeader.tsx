import * as stylex from '@stylexjs/stylex';
import type { MovieDetailAndCreditResponse } from '../../types/movie';
import { colors, spacing, fontSize, radius } from '../../styles/tokens.stylex';

interface MovieHeaderProps {
  movie: MovieDetailAndCreditResponse;
}

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
});

export function MovieHeader({ movie }: MovieHeaderProps) {
  const director = movie.credits.crew.find(
    (person) => person.job === 'Director',
  );

  return (
    <div {...stylex.props(styles.header)}>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        {...stylex.props(styles.poster)}
      />
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
