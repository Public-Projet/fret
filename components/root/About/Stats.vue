<template>
  <section class="section bg-white dark:bg-gray-800">
    <div class="container-custom">
      <div class="text-center mb-10 lg:mb-16">
        <UiGradientBadge text="Nos Chiffres" variant="green" />
        <h2 class="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
          Bourse de Fret en chiffres
        </h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <div v-for="stat in STATS" :key="stat.label" :class="['text-center p-6 lg:p-8 rounded-3xl', stat.bgClass]">
          <div :class="['text-4xl md:text-6xl font-black mb-2', stat.textClass]">
            {{ animatedStats[stat.key].toLocaleString() }}{{ stat.suffix }}
          </div>
          <p class="text-gray-600 dark:text-gray-300 font-semibold text-sm md:text-base">{{ stat.label }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';

const STATS = [
  {
    key: 'shippers' as const,
    label: 'Chargeurs actifs',
    targetValue: 247,
    suffix: '+',
    animated: true,
    bgClass: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600',
    textClass: 'text-blue-600 dark:text-blue-400'
  },
  {
    key: 'carriers' as const,
    label: 'Transporteurs',
    targetValue: 389,
    suffix: '+',
    animated: true,
    bgClass: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-600',
    textClass: 'text-green-600 dark:text-green-400'
  },
  {
    key: 'deliveries' as const,
    label: 'Transports réussis',
    targetValue: 3,
    suffix: 'k+',
    animated: true,
    bgClass: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600',
    textClass: 'text-blue-600 dark:text-blue-400'
  },
  {
    key: 'satisfaction' as const,
    label: 'Satisfaction client',
    targetValue: 98,
    suffix: '%',
    animated: true,
    bgClass: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-600',
    textClass: 'text-green-600 dark:text-green-400'
  }
];

const animatedStats = reactive({
  shippers: 0,
  carriers: 0,
  deliveries: 0,
  satisfaction: 0
});

const animateValue = (key: keyof typeof animatedStats, end: number, duration: number) => {
  const startTime = performance.now();

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    animatedStats[key] = Math.floor(end * progress);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

onMounted(() => {
  setTimeout(() => {
    STATS.forEach(stat => {
      animateValue(stat.key, stat.targetValue, 2000);
    });
  }, 500);
});
</script>
