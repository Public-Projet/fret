<template>
  <div class="overflow-hidden">
    <HeroSection />
    <TrustBar />
    <HowItWorks />
    <AdvantagesSection />
    <TestimonialsSection />
    <CtaSection />
  </div>
</template>

<script setup lang="ts">
import HeroSection from '~/components/home/HeroSection.vue';
import TrustBar from '~/components/home/TrustBar.vue';
import HowItWorks from '~/components/home/HowItWorks.vue';
import AdvantagesSection from '~/components/home/AdvantagesSection.vue';
import TestimonialsSection from '~/components/home/TestimonialsSection.vue';
import CtaSection from '~/components/home/CtaSection.vue';

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
