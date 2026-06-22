<template>
  <div class="py-12">
    <div
      class="w-16 h-16 mx-auto mb-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
      <IconLoader2 class="w-8 h-8 text-primary-600 dark:text-primary-400 animate-spin" />
    </div>
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      Vérification en cours...
    </h2>
    <p class="text-gray-600 dark:text-gray-400">
      Veuillez patienter pendant que nous vérifions votre email.
    </p>
  </div>
</template>

<script setup lang="ts">
import { IconLoader2 } from '@tabler/icons-vue';
</script>
