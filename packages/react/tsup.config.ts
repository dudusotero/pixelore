import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    tokens: 'src/tokens/index.ts',
    hooks: 'src/hooks/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  // Explicit tsconfig so tsup's dts generator doesn't drift if the auto-discovery
  // picks up a sibling config.
  tsconfig: 'tsconfig.json',
  // Bundlers strip module-level directives during bundling. We mark client
  // components with a per-file "use client" directive in source instead.
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom', 'motion'],
})
