<template>
  <div class="py-6 flex flex-col items-center animate-fade-in">
    <div
      class="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-500 mb-6 border border-red-100 dark:border-red-800/30"
    >
      <IconCircleX class="w-12 h-12" />
    </div>
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Paiement non finalisé</h2>
    <p class="text-gray-600 dark:text-gray-300 text-sm mb-6">
      {{ message || "Le paiement n'a pas pu être validé ou a été annulé." }}
    </p>
    <div class="flex flex-col sm:flex-row gap-4 w-full">
      <NuxtLink
        to="/pricing"
        class="btn btn-outline border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700/50 w-full sm:w-1/2 rounded-xl py-3 font-semibold"
      >
        Réessayer
      </NuxtLink>
      <NuxtLink to="/app" class="btn btn-primary w-full sm:w-1/2 rounded-xl py-3 font-semibold">
        Mon espace
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconCircleX } from '@tabler/icons-vue';

defineProps<{
  message?: string;
}>();
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
