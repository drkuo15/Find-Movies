'use client';

import * as stylex from '@stylexjs/stylex';
import { colors, spacing, fontSize } from '../../styles/tokens.stylex';
import { type ReactNode } from 'react';

// Define variants and their corresponding styles
const styles = stylex.create({
  base: {
    textAlign: 'center',
    padding: spacing.lg,
    fontSize: fontSize.lg,
  },
  error: {
    color: colors.error,
  },
  loading: {
    color: colors.white,
  },
  info: {
    color: colors.gray400,
  },
});

interface MessageProps {
  variant?: 'error' | 'loading' | 'info';
  children: ReactNode;
}

export default function Message({ variant = 'info', children }: MessageProps) {
  return <div {...stylex.props(styles.base, styles[variant])}>{children}</div>;
}
