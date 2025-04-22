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
      '@repo/i18n': path.resolve(__dirname, '../../packages/i18n/src'),
    },
    preserveSymlinks: true
  },
  optimizeDeps: {
    exclude: [
      '@repo/types',
      '@repo/api-client',
      '@repo/hooks',
      '@repo/ui',
      '@repo/i18n'
    ]
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/, /@repo\/ui/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      external: ['react', 'react-dom']
    }
  }
});
