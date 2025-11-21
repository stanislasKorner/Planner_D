import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Fix: Use '.' instead of process.cwd() to avoid TypeScript error when Node.js types are not fully loaded
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Cela permet au code "process.env.API_KEY" de fonctionner dans le navigateur
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});