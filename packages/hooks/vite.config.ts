import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
// Comentamos temporalmente la importación de dts para evitar el error de resolución de './lib/async'
// import dts from 'vite-plugin-dts';

export default defineConfig(({ mode }) => {
  // Carga las variables de entorno desde el directorio raíz y local
  const env = {
    ...loadEnv(mode, process.cwd(), ''),
    ...loadEnv(mode, '../../', ''),
  };

  return {
    plugins: [
      react(),
      // Comentamos temporalmente el plugin dts para evitar errores de dependencias
      // dts({
      //   insertTypesEntry: true,
      // }),
    ],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: '@repo/hooks',
        fileName: format => `index.${format}.js`,
      },
      rollupOptions: {
        external: ['react', 'sonner'],
        output: {
          globals: {
            react: 'React',
            sonner: 'sonner',
          },
        },
      },
    },
    define: {
      'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(env.VITE_GOOGLE_MAPS_API_KEY),
    },
  };
});
