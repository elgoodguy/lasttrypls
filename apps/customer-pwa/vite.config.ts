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
    },
  },
  optimizeDeps: {
    include: ['@repo/types', '@repo/api-client', '@repo/hooks', '@repo/ui'],
    exclude: ['i18next']
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/]
    }
  },
  json: {
    stringify: true,
  },
});
