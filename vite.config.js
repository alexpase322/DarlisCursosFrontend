import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'isotipo.ico'],
      injectRegister: 'auto',
      devOptions: {
        // Habilita SW también en `npm run dev` para poder probar la instalación.
        enabled: true,
        type: 'module'
      },
      manifest: {
        name: 'Arquitecta de tu Propio Éxito',
        short_name: 'Arquitecta',
        description: 'Membresía y cursos de negocio digital para mamás. Estrategia, mentalidad y tecnología para crear ingresos sin descuidar a tu familia.',
        theme_color: '#905361',
        background_color: '#F7F2EF',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/dashboard',
        lang: 'es',
        categories: ['education', 'business', 'productivity'],
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-maskable-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff2}'],
        maximumFileSizeToCacheInBytes: 12 * 1024 * 1024
      }
    })
  ],
})
