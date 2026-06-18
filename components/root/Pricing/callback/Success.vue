<template>
  <div class="py-6 flex flex-col items-center animate-fade-in">
    <div
      class="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-500 mb-6 border border-green-100 dark:border-green-800/30"
    >
      <IconCircleCheck class="w-12 h-12" />
    </div>
    <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Paiement Réussi !</h2>
    <p class="text-gray-600 dark:text-gray-300 text-sm mb-6">
      Félicitations, votre abonnement <strong>Transporteur Pro</strong> est maintenant actif ! Vous allez être
      redirigé vers votre espace.
    </p>
    <span class="text-xs text-gray-400 dark:text-gray-500">Redirection automatique dans quelques secondes...</span>
    <NuxtLink
      to="/app"
      class="mt-6 btn btn-primary w-full rounded-xl py-3 font-semibold shadow-lg shadow-primary-500/20"
    >
      Accéder à mon espace
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { IconCircleCheck } from '@tabler/icons-vue';
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
