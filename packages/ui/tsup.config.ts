import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', '@repo/api-client'],
  outDir: 'dist',
  treeshake: true,
  minify: true,
  metafile: true,
  keepNames: true,
  platform: 'browser',
  target: 'es2020'
}); 