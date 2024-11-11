import * as stylex from '@stylexjs/stylex';
import { useContext, useState } from 'react';
import {
  colors,
  radius,
  fontSize,
  spacing,
} from '../../../styles/tokens.stylex';
import { signIn, signOut } from '../../../services/firebase/auth';
import { toast } from 'sonner';
import { AuthContext } from '../../../contexts/AuthContext';
import defaultAvatar from '../../assets/default-avatar.svg';

const styles = stylex.create({
  button: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    borderRadius: radius.full,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray200,
    ':hover': {
      transform: 'translateY(-1px)',
    },
  },
  userImage: {
    width: '48px',
    height: '48px',
    borderRadius: radius.full,
    objectFit: 'cover',
  },
  defaultAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: radius.full,
    backgroundColor: colors.gray200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.gray600,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  dropdown: {
    position: 'absolute',
    top: '110%',
    right: '0',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: `${spacing.sm} 0`,
    minWidth: '150px',
    zIndex: 1,
  },
  dropdownItem: {
    padding: `${spacing.xs} ${spacing.base}`,
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    border: 'none',
    backgroundColor: 'transparent',
    ':hover': {
      backgroundColor: colors.gray200,
    },
  },
  buttonWrapper: {
    position: 'relative',
  },
});

export default function LoginButton() {
  const userInfo = useContext(AuthContext);
  const user = userInfo?.user;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Failed to sign in:', error);
      toast.error('Failed to sign in');
    }
  };

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  if (!user) {
    return (
      <button
        {...stylex.props(styles.button)}
        onClick={handleSignIn}
        type="button"
      >
        <img
          src={defaultAvatar}
          alt="user"
          {...stylex.props(styles.userImage)}
        />
      </button>
    );
  }

  return (
    <div {...stylex.props(styles.buttonWrapper)}>
      <button
        {...stylex.props(styles.button)}
        onClick={toggleDropdown}
        type="button"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'user'}
            {...stylex.props(styles.userImage)}
          />
        ) : (
          <div {...stylex.props(styles.defaultAvatar)}>
            {user.email?.[0].toUpperCase()}
          </div>
        )}
      </button>

      {isDropdownOpen && (
        <div {...stylex.props(styles.dropdown)}>
          <button
            {...stylex.props(styles.dropdownItem)}
            onClick={() => {
              signOut();
              setIsDropdownOpen(false);
            }}
            type="button"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
