import { defineConfig } from 'tsup'

export default defineConfig({
  entry: { preset: 'src/preset.ts' },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: false,
  target: 'es2020',
})
