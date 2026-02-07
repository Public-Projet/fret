<template>
  <div class="overflow-hidden">
    <HomeHeroSection />
    <HomeTrustBar />
    <HomeHowItWorks />
    <HomeAdvantagesSection />
    <HomeTestimonialsSection />
    <HomeCtaSection />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'guest'
});

useHead({
  title: 'Révolutionnez votre logistique de transport',
  meta: [
    {
      name: 'description',
      content: 'Connectez-vous instantanément avec des milliers de transporteurs qualifiés. Economisez jusqu\'à 40% sur vos coûts de transport. La plateforme n°1 en France.'
    }
  ]
});
</script>
