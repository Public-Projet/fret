// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'FreightConnect - Plateforme de mise en relation',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Plateforme moderne de mise en relation entre chargeurs et transporteurs'
        }
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
