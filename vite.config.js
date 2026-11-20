import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      // Hanya aset statis yang di-cache service worker. Data GAS tetap di
      // TanStack Query (memori tab) agar tidak menyimpan data siswa persisten.
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Wali Kelas Digital',
        short_name: 'WaliKelas',
        description: 'Sistem Monitoring Siswa Presisi',
        theme_color: '#005a30',
        background_color: '#f8fafc',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        // Pisahkan vendor berat agar tidak masuk chunk utama.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('recharts') || id.includes('d3-') || id.includes('victory-vendor')) return 'charts';
          if (id.includes('/xlsx/')) return 'excel';
          if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('dompurify') || id.includes('fflate')) return 'pdf';
          if (id.includes('@tanstack')) return 'query';
          if (id.includes('react-dom') || id.includes('/react/') || id.includes('react-router') || id.includes('scheduler')) return 'react-vendor';
        },
      },
    },
  },
})
