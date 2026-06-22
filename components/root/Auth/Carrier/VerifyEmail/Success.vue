<template>
  <div class="py-12">
    <div
      class="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
      <IconCircleCheck class="w-12 h-12 text-green-600 dark:text-green-400" />
    </div>
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      Email vérifié avec succès !
    </h2>
    <p class="text-gray-600 dark:text-gray-400 mb-6">
      {{ successMessage }}
    </p>
    <NuxtLink to="/auth/login"
      class="inline-flex items-center gap-2 px-6 py-3 bg-secondary-600 hover:bg-secondary-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-secondary-500/30">
      <IconLogin class="w-5 h-5" />
      Se connecter en tant que Transporteur
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { IconCircleCheck, IconLogin } from '@tabler/icons-vue';

defineProps<{
  successMessage: string;
}>();
</script>
