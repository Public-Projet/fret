// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

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
})
