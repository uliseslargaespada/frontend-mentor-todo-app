import { defineConfig } from 'vitest/config';
import react from "@vitejs/plugin-react";
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    clearMocks: true,
    setupFiles: ["./test/setupTests.js"]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@tests': path.resolve(__dirname, './src/tests'),
      '@utils': path.resolve(__dirname, './src/utils'),
      "@test": path.resolve(__dirname, './test'),
      "@providers": path.resolve(__dirname, './src/providers')
    }
  }
});
