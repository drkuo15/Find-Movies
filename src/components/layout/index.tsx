import * as stylex from '@stylexjs/stylex';
import { spacing } from '../../styles/tokens.stylex';
import Header from '../header';

const styles = stylex.create({
  layout: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: `${spacing.lg} ${spacing.base}`,
  },
});

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div {...stylex.props(styles.layout)}>
      <Header />
      <main {...stylex.props(styles.main)}>{children}</main>
    </div>
  );
}
