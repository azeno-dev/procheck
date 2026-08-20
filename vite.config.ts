import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  optimizeDeps: {
    exclude: ['vue-demi']
  },
  build: {
    chunkSizeWarningLimit: 1600,
  },
  server: {
    port: 5173,
    proxy: {
      '/sameday': {
        target: 'https://api.sameday.ro',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/sameday/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Sameday proxy error:', err);
          });
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
