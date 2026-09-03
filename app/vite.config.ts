import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const appRoot = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(appRoot, '..');

export default defineConfig({
  // Project API key is a public phc_ token; expose only POSTHOG_TOKEN / POSTHOG_HOST.
  envPrefix: ['VITE_', 'POSTHOG_TOKEN', 'POSTHOG_HOST'],
  plugins: [react(), tailwindcss()],
  server: {
    fs: {
      allow: [appRoot, path.join(repoRoot, 'docs')],
    },
  },
});
