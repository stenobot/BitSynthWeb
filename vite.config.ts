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
        'vite.svg',
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
        description: '8-bit synthesizer',
        theme_color: '#1a1a1a',
        background_color: '#1a1a1a',
        display: 'standalone',
        orientation: 'any',
        icons: [
          {
            src: 'vite.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
    }),
  ],
  base: '/',
})
