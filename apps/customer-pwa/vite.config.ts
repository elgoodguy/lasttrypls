/// <reference types="vite/client" />
/// <reference types="node" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@repo/types': path.resolve(__dirname, '../../packages/types/src'),
      '@repo/api-client': path.resolve(__dirname, '../../packages/api-client/src'),
      '@repo/hooks': path.resolve(__dirname, '../../packages/hooks/src'),
      '@repo/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@repo/i18n': path.resolve(__dirname, '../../packages/i18n/src/index.ts'),
    },
  },
  optimizeDeps: {
    include: [
      '@repo/types',
      '@repo/api-client',
      '@repo/hooks',
      '@repo/ui',
      '@repo/i18n',
      'i18next',
      'react-i18next',
      'i18next-browser-languagedetector'
    ],
    exclude: []
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/, /@repo\/i18n/]
    }
  },
  json: {
    stringify: true,
  },
  ssr: {
    noExternal: ['@repo/i18n']
  },
  server: {
    watch: {
      // Watch the i18n package for changes
      ignored: ['!**/node_modules/@repo/i18n/**'],
    },
    hmr: {
      // Force HMR for i18n package
      overlay: true,
      clientPort: 5173,
      timeout: 5000
    }
  }
});
