import * as stylex from '@stylexjs/stylex';
import { colors, radius, spacing, fontSize } from '../../styles/tokens.stylex';
import { MovieDetailAndCreditResponse } from '../../types/movie';
import Message from '../message';

interface CastSectionProps {
  cast: MovieDetailAndCreditResponse['credits']['cast'];
}

const styles = stylex.create({
  castSection: {
    marginTop: spacing['2xl'],
  },
  castContainer: {
    position: 'relative',
    width: '100%',
    paddingBottom: spacing.md,
  },
  castScroller: {
    display: 'flex',
    gap: spacing.md,
    padding: spacing.md,
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollSnapType: 'x mandatory',
    '::-webkit-scrollbar': {
      height: '8px',
    },
    '::-webkit-scrollbar-track': {
      backgroundColor: colors.gray900,
      borderRadius: radius.full,
    },
    '::-webkit-scrollbar-thumb': {
      backgroundColor: colors.gray700,
      borderRadius: radius.full,
      ':hover': {
        backgroundColor: colors.gray600,
      },
    },
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    marginBottom: spacing.lg,
    color: colors.white,
  },
  castCard: {
    flex: '0 0 140px',
    '@media (min-width: 768px)': {
      flex: '0 0 150px',
    },
    backgroundColor: colors.gray800,
    borderRadius: radius.md,
    overflow: 'hidden',
    scrollSnapAlign: 'start',
    transition: 'transform 0.2s ease',
    ':hover': {
      transform: 'translateY(-4px)',
    },
  },
  castImage: {
    width: '100%',
    height: '180px',
    '@media (min-width: 768px)': {
      height: '225px',
    },
    objectFit: 'cover',
    backgroundColor: colors.gray700,
  },
  castInfo: {
    padding: spacing.base,
  },
  castName: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.white,
    marginBottom: spacing.xs,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  castCharacter: {
    fontSize: fontSize.xs,
    color: colors.gray500,
    overflow: 'hidden',
    display: '-webkit-box',
    '-webkit-line-clamp': '2',
    '-webkit-box-orient': 'vertical',
    lineHeight: 1.2,
  },
  noImagePlaceholder: {
    width: '100%',
    height: '180px',
    '@media (min-width: 768px)': {
      height: '225px',
    },
    backgroundColor: colors.gray700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.gray500,
  },
});

export function CastSection({ cast }: CastSectionProps) {
  return (
    <div {...stylex.props(styles.castSection)}>
      <h2 {...stylex.props(styles.sectionTitle)}>Cast</h2>
      {cast.length > 0 ? (
        <div {...stylex.props(styles.castContainer)}>
          <div {...stylex.props(styles.castScroller)}>
            {cast.map((actor) => (
              <CastCard key={actor.id} actor={actor} />
            ))}
          </div>
        </div>
      ) : (
        <Message variant="info">No casts yet.</Message>
      )}
    </div>
  );
}

interface CastCardProps {
  actor: MovieDetailAndCreditResponse['credits']['cast'][0];
}

function CastCard({ actor }: CastCardProps) {
  return (
    <div {...stylex.props(styles.castCard)}>
      {actor.profile_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
          alt={actor.name}
          {...stylex.props(styles.castImage)}
          loading="lazy"
        />
      ) : (
        <div {...stylex.props(styles.noImagePlaceholder)}>No Image</div>
      )}
      <div {...stylex.props(styles.castInfo)}>
        <p {...stylex.props(styles.castName)}>{actor.name}</p>
        <p {...stylex.props(styles.castCharacter)}>{actor.character}</p>
      </div>
    </div>
  );
}
