<template>
  <div class="lg:col-span-2">
    <div class="text-left max-w-3xl">
      <!-- Badge animé -->
      <div
        class="inline-flex items-center space-x-2 bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-full px-6 py-3 mb-8 animate-fade-in">
        <IconSparkles class="w-5 h-5 text-yellow-300 dark:text-yellow-400" />
        <span class="text-xs text-white dark:text-gray-200 font-medium">
          La plateforme n°1 du transport au Bénin</span>
      </div>

      <!-- Titre principal -->
      <h1 class="text-4xl sm:text-5xl md:text-7xl font-black text-white dark:text-gray-100 mb-6 leading-tight">
        Révolutionnez votre
        <span
          class="inline lg:block lg:mt-2 bg-gradient-to-r from-green-400 via-green-300 to-green-200 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-300 bg-clip-text text-transparent">
          logistique de transport
        </span>
      </h1>

      <!-- Sous-titre -->
      <p class="text-xl md:text-2xl text-blue-100 dark:text-gray-300 mb-12 leading-relaxed max-w-2xl">
        Connectez-vous instantanément avec des milliers de transporteurs qualifiés.
        Economisez jusqu'à 40% sur vos coûts de transport.
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 mb-12 lg:mb-16">
        <NuxtLink v-for="(btn, index) in ctaButtons" :key="index" :to="btn.to" :class="[
          'group relative px-6 py-4 lg:px-8 rounded-xl font-bold text-lg shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center sm:justify-start space-x-3',
          btn.baseClass,
          btn.hoverClass
        ]">
          <component :is="btn.icon" :class="['w-6 h-6 transition-transform', btn.iconHoverClass]" />
          <span>{{ btn.label }}</span>
          <IconArrowRight class="w-5 h-5 group-hover:translate-x-2 transition-transform" />
        </NuxtLink>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 max-w-2xl">
        <UiStatCard :value="shippers" label="Chargeurs actifs" />
        <UiStatCard :value="carriers" label="Transporteurs" />
        <UiStatCard :value="deliveries" label="Transports réussis" suffix="k+" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IconArrowRight, IconSparkles, IconTruck, IconUsersGroup } from '@tabler/icons-vue';

const shippers = ref(0);
const carriers = ref(0);
const deliveries = ref(0);

const ctaButtons = [
  {
    to: '/auth/register?role=shipper',
    label: 'Je suis chargeur',
    icon: IconTruck,
    baseClass: 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 dark:border dark:border-gray-700',
    hoverClass: 'hover:shadow-green-500/50 dark:hover:shadow-emerald-500/30',
    iconHoverClass: 'group-hover:rotate-12'
  },
  {
    to: '/auth/register?role=carrier',
    label: 'Je suis transporteur',
    icon: IconUsersGroup,
    baseClass: 'bg-green-500 dark:bg-emerald-600 text-white',
    hoverClass: 'hover:shadow-green-400/50 dark:hover:shadow-emerald-400/40',
    iconHoverClass: 'group-hover:scale-110'
  }
];

const animateValue = (target: any, start: number, end: number, duration: number) => {
  const startTime = performance.now();

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    target.value = Math.floor(start + (end - start) * progress);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

onMounted(() => {
  setTimeout(() => {
    animateValue(shippers, 0, 5247, 2000);
    animateValue(carriers, 0, 12389, 2000);
    animateValue(deliveries, 0, 847, 2000);
  }, 500);
});
</script>
