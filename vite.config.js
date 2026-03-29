import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import Sitemap from 'vite-plugin-sitemap'
import fs from 'fs'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    Sitemap({
      hostname: 'https://ingvarsoloma.dev',
      dynamicRoutes: fs.existsSync('./sitemap-routes.json') 
        ? JSON.parse(fs.readFileSync('./sitemap-routes.json', 'utf-8')) 
        : ['/', '/blog'],
      exclude: ['/admin']
    })
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router-dom/')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/firebase/')) {
            return 'firebase-vendor';
          }
          if (id.includes('node_modules/react-syntax-highlighter/')) {
            return 'syntax-highlighter';
          }
          if (id.includes('node_modules/react-markdown/')) {
            return 'markdown-vendor';
          }
        }
      }
    }
  }
})

