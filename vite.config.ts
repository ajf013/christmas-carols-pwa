import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'apple-touch-icon.png',
        'og-image.jpg',
        'mother_of_perpetual_help.jpg',
        'robots.txt',
        'sitemap.xml',
        'icons/*.png',
      ],
      manifest: {
        name: 'Christmas Carols Lyrics',
        short_name: 'Carol Lyrics',
        description: 'Offline Christmas Carol Lyrics Book with Tamil & English Transliteration',
        theme_color: '#0A0D14',
        background_color: '#0A0D14',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg,json}'],
        navigateFallback: '/index.html'
      }
    })
  ]
});
