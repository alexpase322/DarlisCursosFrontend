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
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'isotipo.ico'],
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
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/, /^\/auth/, /^\/payment/, /^\/admin/, /^\/affiliate/],
        runtimeCaching: [
          {
            // Imágenes Cloudinary y otras CDNs externas
            urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cloudinary-images',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            // Llamadas al backend → red primero, fallback a caché si offline
            urlPattern: ({ url }) => ['/auth', '/users', '/courses', '/posts', '/chat', '/notifications', '/payment', '/affiliate', '/admin']
              .some(p => url.pathname.startsWith(p)),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ],
})
