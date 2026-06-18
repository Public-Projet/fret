<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">
    <RootPricingHomeHero :is-annual="isAnnual" @update:is-annual="isAnnual = $event" />
    <RootPricingHomePlans :is-annual="isAnnual" />
    <RootPricingHomeFaq />
    <RootPricingHomeCta />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

definePageMeta({
  layout: 'guest'
});

const isAnnual = ref(true);

useHead({
  title: 'Tarification',
  meta: [
    { name: 'description', content: 'Découvrez nos offres et tarifs transparents pour les transporteurs et expéditeurs.' },
    { name: 'robots', content: 'index, follow' }
  ]
});
</script>
