<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <h3 class="font-bold text-gray-900 dark:text-white mb-6">Activité Récente</h3>
    <UiAppSkeleton :loading="loading" type="table-row" :count="2" gap="4">
      <div class="text-center py-8">
        <IconHistory class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p class="text-gray-500 dark:text-gray-400">Aucune activité récente</p>
      </div>
    </UiAppSkeleton>
  </div>
</template>

<script setup lang="ts">
import { IconHistory } from '@tabler/icons-vue';

defineProps<{
  loading?: boolean;
}>();
</script>
