<template>
  <div class="text-center py-12">
    <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
      <IconCircleX class="w-12 h-12 text-red-600 dark:text-red-400" />
    </div>
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      Lien invalide
    </h2>
    <p class="text-gray-600 dark:text-gray-400 mb-6">
      {{ tokenError }}
    </p>
    <NuxtLink to="/auth/login"
      class="inline-flex items-center gap-2 px-6 py-3 bg-secondary-600 hover:bg-secondary-700 text-white font-medium rounded-xl transition-all">
      <IconLogin class="w-5 h-5" />
      Retour à la connexion
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { IconCircleX, IconLogin } from '@tabler/icons-vue';

defineProps<{
  tokenError: string;
}>();
</script>
