<template>
  <div class="relative group">
    <div class="card p-8 hover:scale-105 transition-transform duration-300 relative overflow-hidden">
      <!-- Numéro en arrière-plan -->
      <div class="absolute top-4 right-4 text-8xl font-black opacity-50 text-opacity-10">{{ number }}</div>

      <div class="relative z-10">
        <div
          :class="['w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:rotate-6 transition-transform', gradientClass]">
          <component :is="icon" class="w-10 h-10 text-white" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {{ title }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
          {{ description }}
        </p>
        <div class="mt-6 flex items-center font-semibold" :class="[timeClass]">
          <span>{{ highlight }}</span>
          <component :is="highlightIcon" class="w-5 h-5 ml-2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  number: string | number;
  icon: any;
  title: string;
  description: string;
  highlight: string;
  highlightIcon: any;
  gradientClass: string;
  timeClass: string;
}>();
</script>
