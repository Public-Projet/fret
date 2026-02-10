<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">
    <PricingHeroSection :is-annual="isAnnual" @update:is-annual="isAnnual = $event" />
    <PricingPlansSection :is-annual="isAnnual" />
    <PricingFaqSection />
    <PricingCtaSection />
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
