<template>
  <section class="mt-8 p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Signaler un problème</h2>
    <p class="mb-4 text-gray-600 dark:text-gray-300">
      Si vous remarquez un comportement suspect, une arnaque potentielle ou tout autre problème de sécurité,
      contactez-nous immédiatement.
    </p>
    <NuxtLink to="/support/contact"
      class="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors">
      <IconAlertCircle class="w-5 h-5" />
      Signaler un problème
    </NuxtLink>
  </section>
</template>

<script setup lang="ts">
import { IconAlertCircle } from '@tabler/icons-vue';
</script>
