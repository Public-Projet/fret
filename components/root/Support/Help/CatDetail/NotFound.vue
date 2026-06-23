<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-16 text-center animate-in fade-in zoom-in duration-500"
  >
    <div class="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
      <IconFileOff class="w-12 h-12 text-gray-400" />
    </div>
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">Article introuvable</h2>
    <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
      L'article que vous recherchez n'existe pas ou a été déplacé.
    </p>
    <NuxtLink
      to="/support/help"
      class="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 text-white rounded-2xl font-semibold hover:bg-primary-600 transition-all hover:shadow-lg hover:shadow-primary-500/25"
    >
      Retour au centre d'aide
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { IconFileOff } from '@tabler/icons-vue';
</script>
