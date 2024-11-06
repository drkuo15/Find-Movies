import * as stylex from '@stylexjs/stylex';
import GlobalSearch from '../../features/global-search';
import { spacing } from '../../styles/tokens.stylex';

const styles = stylex.create({
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: `${spacing.lg} ${spacing.base}`,
  },
  searchWrapper: {
    width: '100%',
    maxWidth: '1200px',
    display: 'flex',
    justifyContent: 'center',
  },
});

export default function Header() {
  return (
    <header {...stylex.props(styles.header)}>
      <div {...stylex.props(styles.searchWrapper)}>
        <GlobalSearch />
      </div>
    </header>
  );
}
