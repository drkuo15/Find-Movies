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
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray800Alpha: 'rgba(31, 41, 55, 0.75)',
  gray900: '#111827',

  // Theme colors
  primary: '#3b82f6',
  secondary: '#F4C518',
  error: '#ef4444',
});

export const radius = stylex.defineVars({
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  full: '9999px',
});
