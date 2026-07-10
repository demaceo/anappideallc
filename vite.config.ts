import { defineConfig } from 'vitest/config'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  build: {
    rolldownOptions: {
      output: {
        // Split the rarely-changing framework code into its own chunk so it
        // stays cached across deploys instead of being invalidated whenever
        // app code changes.
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              test: /[\\/]node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/,
            },
            {
              // GSAP + plugins are lazy-imported (progressive enhancement), so
              // keep them in a separate cached chunk out of the app bundle.
              name: 'gsap-vendor',
              test: /[\\/]node_modules[\\/]gsap[\\/]/,
            },
          ],
        },
      },
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
})
