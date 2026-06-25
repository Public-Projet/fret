<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div
      class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
      <UiAppSkeleton :loading="loading" type="text" class="h-8 w-16 mx-auto mb-1">
        <span class="text-3xl font-bold text-slate-800 dark:text-white mb-1">{{ announcements }}</span>
      </UiAppSkeleton>
      <span class="text-xs text-slate-500 uppercase font-medium">Annonces</span>
    </div>
    <div
      class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
      <UiAppSkeleton :loading="loading" type="text" class="h-8 w-16 mx-auto mb-1">
        <span class="text-3xl font-bold text-green-600 mb-1">{{ reliability }}</span>
      </UiAppSkeleton>
      <span class="text-xs text-slate-500 uppercase font-medium">Fiabilité</span>
    </div>
    <div
      class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
      <UiAppSkeleton :loading="loading" type="text" class="h-8 w-20 mx-auto mb-1">
        <div class="flex items-center text-yellow-500 mb-1">
          <span class="text-3xl font-bold">{{ rating }}</span>
          <IconStarFilled class="w-6 h-6 ml-1" />
        </div>
      </UiAppSkeleton>
      <span class="text-xs text-slate-500 uppercase font-medium">Note</span>
    </div>
    <div
      class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
      <UiAppSkeleton :loading="loading" type="text" class="h-8 w-16 mx-auto mb-1">
        <span class="text-3xl font-bold text-blue-600 mb-1">{{ payment }}</span>
      </UiAppSkeleton>
      <span class="text-xs text-slate-500 uppercase font-medium">Paiement</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconStarFilled } from '@tabler/icons-vue';

withDefaults(defineProps<{
  announcements?: number | string;
  reliability?: number | string;
  rating?: number | string;
  payment?: number | string;
  loading?: boolean;
}>(), {
  announcements: 0,
  reliability: '-',
  rating: '-',
  payment: '-',
  loading: false
});
</script>
