import * as stylex from '@stylexjs/stylex';

export const spacing = stylex.defineVars({
  none: '0',
  xs: '4px',
  sm: '8px',
  md: '12px',
  base: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
});

export const fontSize = stylex.defineVars({
  xs: '12px',
  sm: '14px',
  base: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
});

export const colors = stylex.defineVars({
  // Base
  white: '#ffffff',
  black: '#000000',
  gray: '#6b7280',
  lightGray: '#e5e5e5',

  // Theme colors
  primary: '#3b82f6',
  secondary: '#6b7280',
  error: '#ef4444',
});

export const radius = stylex.defineVars({
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  full: '9999px',
});
