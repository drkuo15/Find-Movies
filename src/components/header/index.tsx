import * as stylex from '@stylexjs/stylex';
import GlobalSearch from '../../features/global-search';
import LoginButton from '../button/loginButton';
import { spacing } from '../../styles/tokens.stylex';

const styles = stylex.create({
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: `${spacing.lg}`,
    gap: spacing.lg,
  },
});

export default function Header() {
  return (
    <header {...stylex.props(styles.header)}>
      <GlobalSearch />
      <LoginButton />
    </header>
  );
}
