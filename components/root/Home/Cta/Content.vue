<template>
  <div class="container-custom relative z-10 text-center py-10 lg:py-24">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-3xl md:text-6xl font-black text-white dark:text-gray-100 mb-6 leading-tight">
        Prêt à transformer votre
        <span
          class="block bg-gradient-to-r from-green-400 via-green-300 to-green-200 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-300 bg-clip-text text-transparent">logistique
          ?</span>
      </h2>
      <p class="text-lg md:text-2xl text-blue-100 dark:text-gray-300 mb-10 lg:mb-12 max-w-2xl mx-auto px-4">
        Rejoignez des utilisateurs qui ont déjà optimisé leur transport avec Bourse de Fret Bénin
      </p>

      <div class="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center items-center mb-12 px-4">
        <NuxtLink v-for="(btn, index) in ctaButtons" :key="index" :to="btn.to" :class="btn.class">
          <span>{{ btn.label }}</span>
          <IconArrowRight v-if="btn.hasArrow" class="w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </NuxtLink>
      </div>

      <!-- Mini features -->
      <div
        class="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 lg:gap-8 text-white dark:text-gray-300">
        <div v-for="(feature, index) in miniFeatures" :key="index" class="flex items-center space-x-2">
          <IconCircleCheck class="w-5 h-5 lg:w-6 lg:h-6 dark:text-emerald-400" />
          <span class="font-semibold text-sm lg:text-base">{{ feature.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconArrowRight, IconCircleCheck } from '@tabler/icons-vue';

const ctaButtons = [
  {
    to: '/auth/register',
    label: 'Créer un compte gratuit',
    class: 'w-full sm:w-auto group px-8 py-4 lg:px-10 lg:py-5 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-2xl font-black text-lg lg:text-xl shadow-2xl hover:shadow-white/30 dark:hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3 dark:border dark:border-gray-700',
    hasArrow: true
  },
  {
    to: '/annonces?tab=fret',
    label: 'Voir les annonces',
    class: 'w-full sm:w-auto px-8 py-4 lg:px-10 lg:py-5 border-2 lg:border-4 border-white dark:border-gray-600 text-white dark:text-gray-200 rounded-2xl font-black text-lg lg:text-xl hover:bg-white hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-emerald-400 transition-all duration-300 hover:scale-105',
    hasArrow: false
  }
];

const miniFeatures = [
  { label: 'Sans engagement' },
  { label: 'Inscription gratuite' },
  { label: 'Support 24/7' }
];
</script>
