import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      // No desenvolvimento, o React usa /chat e /pedidos
      // e o Vite encaminha as requisicoes para o FastAPI.
      '/chat': 'http://127.0.0.1:8000',
      '/pedidos': 'http://127.0.0.1:8000',
    },
  },
});
