import * as stylex from '@stylexjs/stylex';
import searchIcon from '../../assets/search.svg';
import { spacing, fontSize, colors, radius } from '../../styles/tokens.stylex';

const styles = stylex.create({
  searchContainer: {
    width: '100%',
    maxWidth: '700px',
    height: '48px',
    position: 'relative',
    marginBottom: spacing.lg,
  },
  searchInput: {
    height: '48px',
    padding: `0 ${spacing['2xl']}`,
    width: '100%',
    borderRadius: radius.full,
    border: 'none',
    fontSize: fontSize.sm,
    position: 'relative',
    outline: 'none',
    color: colors.black,
    '::placeholder': {
      color: colors.gray,
    },
  },
  searchIcon: {
    position: 'absolute',
    top: '50%',
    left: '24px',
    transform: 'translateY(-50%)',
    zIndex: 1,
    width: '16px',
    height: '16px',
  },
});

interface SearchProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Search({ placeholder, value, onChange }: SearchProps) {
  return (
    <div {...stylex.props(styles.searchContainer)}>
      <img
        src={searchIcon}
        alt="searchIcon"
        {...stylex.props(styles.searchIcon)}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...stylex.props(styles.searchInput)}
      />
    </div>
  );
}
