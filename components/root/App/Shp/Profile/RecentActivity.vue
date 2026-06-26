<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <h3 class="font-bold text-gray-900 dark:text-white mb-6">Activité Récente</h3>

    <!-- Chargement -->
    <div v-if="loading" class="space-y-4">
      <UiAppSkeleton v-for="i in 2" :key="i" :loading="true" type="table-row" />
    </div>

    <!-- Contenu -->
    <div v-else class="text-center py-8">
      <IconHistory class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
      <p class="text-gray-500 dark:text-gray-400">Aucune activité récente</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconHistory } from '@tabler/icons-vue';

defineProps<{
  loading?: boolean;
}>();
</script>
