import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import legacy from "vite-plugin-legacy";
import paths from "vite-tsconfig-paths";

export default defineConfig({

  plugins: [
    paths(),
    react({
      babel: {
        parserOpts: {
          plugins: ['decorators-legacy', 'classProperties']
        }
      }
    }),
    legacy({
      targets: [
        '> 0.5%',
        'last 2 versions',
        'Firefox ESR',
        'not dead',
      ],
      polyfills: [
        // Empty by default
      ],
      ignoreBrowserslistConfig: false,
      corejs: false,
    }),
  ]
});
