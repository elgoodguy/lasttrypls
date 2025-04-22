import { defineConfig } from 'tsup';
import postcssPlugin from 'esbuild-postcss';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  outDir: 'dist',
  platform: 'browser',
  target: 'es2020',
  esbuildPlugins: [postcssPlugin()],
  esbuildOptions(options) {
    options.banner = {
      js: '"use esm";'
    }
  }
}); 