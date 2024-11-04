import * as stylex from '@stylexjs/stylex';
import { spacing } from '../../styles/tokens.stylex';
const styles = stylex.create({
  layout: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: `0 ${spacing.base}`,
  },
  main: {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
});

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div {...stylex.props(styles.layout)}>
      <main {...stylex.props(styles.main)}>{children}</main>
    </div>
  );
}
