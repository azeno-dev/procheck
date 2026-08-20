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
      '^/sameday/*$': {
        target: 'https://api.sameday.ro/api/authenticate',
        changeOrigin: true,  
        rewrite: (path) => {
          console.log('path', path);
          return path.replace(/^\/sameday/, '')
        },
        configure: (proxy, options) => {
          
          console.log('options', options.target);

          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
            console.log('URL Request to the Target:', req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            console.log('URL Response to the Target:', req.url);
          });          
        }
      },      
      // '/sameday-auth': {
      //   target: 'https://api.sameday.ro/api/authenticate',
      //   changeOrigin: true,  
      //   rewrite: (path) => path.replace(/^\/sameday-auth/, '')
      // },
      '/sameday-status': {
        target: 'https://api.sameday.ro/api/status',
        changeOrigin: true,  
        rewrite: (path) => path.replace(/^\/sameday-auth/, '')
      }      
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
