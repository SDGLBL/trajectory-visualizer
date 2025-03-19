import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), viteTsconfigPaths()],
  server: {
    port: 12000,
    host: '0.0.0.0',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    allowedHosts: [
      'work-1-qjqiqpoatugkbywt.prod-runtime.all-hands.dev',
      'work-2-qjqiqpoatugkbywt.prod-runtime.all-hands.dev',
      'localhost'
    ],
    cors: true,
  },
  build: {
    outDir: 'build',
  },
});