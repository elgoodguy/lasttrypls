/// <reference types="vite/client" />
/// <reference types="node" />

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file from root directory (../../.env)
  const env = loadEnv(mode, path.resolve(__dirname, '../../'), '');
  
  // Debug log
  console.log('Environment Mode:', mode);
  console.log('Env loading path:', path.resolve(__dirname, '../../'));
  console.log('VITE_SUPABASE_URL exists:', !!env.VITE_SUPABASE_URL);
  console.log('VITE_SUPABASE_ANON_KEY exists:', !!env.VITE_SUPABASE_ANON_KEY);

  return {
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
    // Define environment variables
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(env.VITE_GOOGLE_MAPS_API_KEY),
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
      exclude: [],
      force: true
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
        // Improve HMR configuration
        overlay: true,
        clientPort: 5173,
        timeout: 5000
      }
    }
  };
});
