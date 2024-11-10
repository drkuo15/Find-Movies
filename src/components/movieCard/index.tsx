import * as stylex from '@stylexjs/stylex';
import { Link } from 'react-router-dom';
import { spacing, fontSize, colors, radius } from '../../styles/tokens.stylex';
import type { WatchListMovie } from '../../types/movie';
import placeholderPoster from '../../assets/placeholder-poster.svg';

const styles = stylex.create({
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
});

interface MovieAction {
  label: string;
  loadingLabel: string;
  icon: string;
  onClick: () => void;
  isLoading: boolean;
}

interface MovieCardProps {
  movie: WatchListMovie;
  actions?: MovieAction[];
}

export default function MovieCard({ movie, actions }: MovieCardProps) {
  return (
    <div {...stylex.props(styles.movieCard)}>
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
        <span {...stylex.props(styles.movieDate)}>{movie.release_date}</span>
        <p {...stylex.props(styles.movieOverview)}>{movie.overview}</p>
        {actions && actions.length > 0 && (
          <div {...stylex.props(styles.actions)}>
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                disabled={action.isLoading}
                {...stylex.props(styles.actionButton)}
              >
                {action.icon && <span>{action.icon}</span>}
                {action.isLoading ? action.loadingLabel : action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
