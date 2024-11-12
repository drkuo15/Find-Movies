import * as stylex from '@stylexjs/stylex';
import { Link } from 'react-router-dom';
import GlobalSearch from '../../features/globalSearch';
import LoginButton from '../button/loginButton';
import { spacing } from '../../styles/tokens.stylex';
import Logo from '../../../favicon.svg';
const styles = stylex.create({
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: `${spacing.lg}`,
    gap: spacing.lg,
  },
  logoContainer: {
    cursor: 'pointer',
    ':hover': {
      transform: 'translateY(-1px)',
    },
  },
  logo: {
    width: '48px',
    height: '48px',
  },
});

export default function Header() {
  return (
    <header {...stylex.props(styles.header)}>
      <Link to="/" {...stylex.props(styles.logoContainer)}>
        <img src={Logo} alt="Find Movie Logo" {...stylex.props(styles.logo)} />
      </Link>
      <GlobalSearch />
      <LoginButton />
    </header>
  );
}
