import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import styleX from 'vite-plugin-stylex';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), styleX()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
