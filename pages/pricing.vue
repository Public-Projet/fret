<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">
    <RootPricingHeroSection :is-annual="isAnnual" @update:is-annual="isAnnual = $event" />
    <RootPricingPlansSection :is-annual="isAnnual" />
    <RootPricingFaqSection />
    <RootPricingCtaSection />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

useHead({
  title: 'Tarification'
});

definePageMeta({
  layout: 'guest'
});

const isAnnual = ref(true);
</script>
