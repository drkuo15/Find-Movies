import * as stylex from '@stylexjs/stylex';
import { Link } from 'react-router-dom';
import { colors, spacing, fontSize } from '../../styles/tokens.stylex';
import Message from '../../components/message';

const styles = stylex.create({
  link: {
    color: colors.primary,
    fontSize: fontSize.lg,
    textDecoration: 'none',
    textAlign: 'center',
    padding: spacing.base,
    transition: 'all 0.2s ease-in-out',
    ':hover': {
      color: colors.white,
    },
  },
});

export default function NotFound() {
  return (
    <>
      <Message variant="info">
        Oops! The page you're looking for doesn't exist.
      </Message>
      <Link to="/" {...stylex.props(styles.link)}>
        Return to Home
      </Link>
    </>
  );
}
