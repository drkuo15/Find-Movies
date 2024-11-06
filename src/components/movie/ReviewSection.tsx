import { MovieReview } from '../../types/movie';
import * as stylex from '@stylexjs/stylex';
import { colors, radius, spacing, fontSize } from '../../styles/tokens.stylex';
import Message from '../message';
const styles = stylex.create({
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    marginBottom: spacing.lg,
    color: colors.white,
  },
  reviewSection: {
    marginTop: spacing['2xl'],
  },
  reviewCard: {
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    '@media (min-width: 768px)': {
      padding: spacing.xl,
    },
  },
  reviewHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.md,
    '@media (min-width: 768px)': {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginBottom: spacing.lg,
    },
  },
  reviewAvatar: {
    width: '40px',
    height: '40px',
    '@media (min-width: 768px)': {
      width: '48px',
      height: '48px',
    },
  },
  reviewAuthorInfo: {
    flex: 1,
  },
  reviewAuthorName: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  reviewMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    color: colors.gray400,
    fontSize: fontSize.sm,
  },
  reviewRating: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    color: colors.primary,
    fontWeight: '600',
  },
  reviewContent: {
    fontSize: fontSize.base,
    lineHeight: 1.6,
    color: colors.gray400,
    whiteSpace: 'pre-line',
  },
  loadMoreButton: {
    width: '100%',
    padding: `${spacing.md} ${spacing.xl}`,
    backgroundColor: colors.gray800,
    color: colors.white,
    border: 'none',
    borderRadius: radius.md,
    fontSize: fontSize.base,
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: colors.gray700,
    },
    ':disabled': {
      backgroundColor: colors.gray900,
      color: colors.gray500,
      cursor: 'not-allowed',
    },
  },
});

interface ReviewSectionProps {
  reviews: MovieReview[];
  totalPages: number;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
}

export function ReviewSection({
  reviews,
  isLoadingMore,
  onLoadMore,
  hasMore,
}: ReviewSectionProps) {
  return (
    <div {...stylex.props(styles.reviewSection)}>
      <h2 {...stylex.props(styles.sectionTitle)}>Reviews</h2>
      {reviews.length > 0 ? (
        <>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
          {hasMore && (
            <button
              {...stylex.props(styles.loadMoreButton)}
              onClick={onLoadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? 'Loading...' : 'Load More Reviews'}
            </button>
          )}
        </>
      ) : (
        <Message variant="info">No reviews yet.</Message>
      )}
    </div>
  );
}

interface ReviewCardProps {
  review: MovieReview;
}

function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div {...stylex.props(styles.reviewCard)}>
      <div {...stylex.props(styles.reviewHeader)}>
        <img
          src={
            review.author_details.avatar_path
              ? `https://image.tmdb.org/t/p/w45${review.author_details.avatar_path}`
              : '/default-avatar.png'
          }
          alt={review.author}
          {...stylex.props(styles.reviewAvatar)}
          loading="lazy"
        />
        <div {...stylex.props(styles.reviewAuthorInfo)}>
          <p {...stylex.props(styles.reviewAuthorName)}>{review.author}</p>
          <div {...stylex.props(styles.reviewMeta)}>
            <span>{formatDate(review.created_at)}</span>
            {review.author_details.rating && (
              <>
                <span>•</span>
                <div {...stylex.props(styles.reviewRating)}>
                  ★ {review.author_details.rating.toFixed(1)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <p {...stylex.props(styles.reviewContent)}>{review.content}</p>
    </div>
  );
}
