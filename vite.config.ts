import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'fonts/Early GameBoy.ttf',
        'images/**/*',
        'bitsynth-icon.svg',
      ],
      workbox: {
        globPatterns: [
          '**/*.{js,css,html,svg,png,ttf,woff,woff2}',
          'samples/*.ogg',
        ],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      manifest: {
        name: 'BitSynth',
        short_name: 'BitSynth',
        description: 'An 8-bit mobile synthesizer',
        theme_color: '#80b027',
        background_color: '#1a1a1a',
        display: 'standalone',
        orientation: 'any',
        icons: [
          {
            src: '/icons/logo-144x144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: '/icons/logo-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/logo-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: '/icons/logo-384x384.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: '/icons/logo-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/logo-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable', // Required for adaptive icons on Android
          },
          {
            src: '/icons/logo-1024x1024.png',
            sizes: '1024x1024',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  base: '/',
})
