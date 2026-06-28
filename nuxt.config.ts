// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: [
    ['nuxt-gtag', {
      id: 'G-YMC3DKW82S',
      enabled: true
    }],
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/google-fonts',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@vite-pwa/nuxt',
  ],

  colorMode: {
    classSuffix: '',
  },

  sitemap: {
    xslColumns: [
      { label: 'URL', width: '50%' },
      { label: 'Last Modified', select: 'sitemap:lastmod', width: '25%' },
      { label: 'Priority', select: 'sitemap:priority', width: '12.5%' },
      { label: 'Change Frequency', select: 'sitemap:changefreq', width: '12.5%' },
      { label: 'Hreflangs', select: 'count(xhtml:link)', width: '25%' },
    ],
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Bourse de Fret Bénin - Plateforme de mise en relation',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'author', content: 'AFR Bourse de Fret' },
        { name: 'keywords', content: 'transport, trasporteur, chargeur, Bénin, marchandise, camion, Véhicule, bourse, deplacé, deplacement, connexion, ensemble,facile, facilité' },
        { name: 'google-site-verification', content: 'OdKxHpVkBSxk0mj4vD4OTmZPdVi5pWzyCu4QPIMHy9A' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  runtimeConfig: {
    apiBaseUrl: process.env.API_URL,
    tokenEncryptionKey: process.env.TOKEN_ENCRYPTION_KEY,
    public: {}
  },

  googleFonts: {
    display: 'swap',
    families: {
      'Open+Sans': [100, 200, 300, 400, 500, 600, 700, 800, 900],
      'Changa+One': [400],
    }
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.js',
  },

  pinia: {
    storesDirs: ['./stores/**'],
  },


  typescript: {
    strict: true,
    typeCheck: true
  },

  ssr: false,

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Bourse de Fret Bénin - Plateforme de mise en relation',
      short_name: 'Bourse de Fret',
      description: 'Plateforme de mise en relation des chargeurs et transporteurs de marchandises',
      theme_color: '#020617',
      background_color: '#020617',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
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
          src: 'maskable-icon.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,json}'],
      cleanupOutdatedCaches: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'gstatic-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600,
    },
    devOptions: {
      enabled: false,
      type: 'classic',
    }
  },
})
