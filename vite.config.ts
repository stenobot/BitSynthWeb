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
          // {
          //   src: '/bitsynth-icon-144x144.png',
          //   sizes: '144x144',
          //   type: 'image/png',
          // },
          // {
          //   src: '/bitsynth-icon-192x192.png',
          //   sizes: '192x192',
          //   type: 'image/png',
          // },
          // {
          //   src: '/bitsynth-icon-256x256.png',
          //   sizes: '256x256',
          //   type: 'image/png',
          // },
          // {
          //   src: '/bitsynth-icon-384x384.png',
          //   sizes: '384x384',
          //   type: 'image/png',
          // },
          // {
          //   src: '/bitsynth-icon-512x512.png',
          //   sizes: '512x512',
          //   type: 'image/png',
          // },
          // {
          //   src: '/bitsynth-icon-512x512.png',
          //   sizes: '512x512',
          //   type: 'image/png',
          //   purpose: 'any maskable', // Required for adaptive icons on Android
          // },
          // {
          //   src: '/bitsynth-icon-1024x1024.png',
          //   sizes: '1024x1024',
          //   type: 'image/png',
          // },
          {
            src: 'bitsynth-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
    }),
  ],
  base: '/',
})
