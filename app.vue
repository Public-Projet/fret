<template>
  <div class="min-h-screen bg-gray-50 font-body">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const heroImagePath = "https://assets.volvo.com/is/image/VolvoInformationTechnologyAB/Volvo-High-Capacity-Transport-1?wid=1024";
const baseUrl = "https://boursefret.netlify.app";

useHead({
  titleTemplate: '%s | Bourse de Fret Bénin',
  meta: [
    {
      key: 'description',
      name: 'description',
      content: 'Plateforme moderne de mise en relation entre chargeurs et transporteurs.'
    },

    // Open Graph (Facebook, LinkedIn)
    { property: 'og:title', content: 'Plateforme de mise en relation' },
    { property: 'og:description', content: 'Plateforme moderne de mise en relation entre chargeurs et transporteurs.' },
    { property: 'og:image', content: heroImagePath },
    { property: 'og:url', content: baseUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'fr_FR' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Plateforme de mise en relation' },
    { name: 'twitter:description', content: 'Plateforme moderne de mise en relation entre chargeurs et transporteurs.' },
    { name: 'twitter:image', content: heroImagePath },
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon.ico' },
    { rel: 'canonical', href: baseUrl }
  ]
});
</script>
