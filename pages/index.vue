<template>
  <div class="overflow-hidden">
    <RootHomeHeroSection />
    <RootHomeTrustBar />
    <RootHomeHowItWorks />
    <RootHomeAdvantagesSection />
    <RootHomeTestimonialsSection />
    <RootHomeCtaSection />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'guest'
});

useHead({
  title: 'Révolutionnez votre logistique de transport',
  meta: [
    { name: 'description', content: 'Connectez-vous instantanément avec des milliers de transporteurs qualifiés. Economisez jusqu\'à 40% sur vos coûts de transport.' },
    { name: 'robots', content: 'index, follow' }
  ]
});
</script>
