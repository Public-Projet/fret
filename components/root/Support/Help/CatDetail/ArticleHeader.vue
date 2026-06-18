<template>
  <div class="mb-8">
    <div class="flex items-center gap-3 mb-4">
      <span :class="['px-3 py-1 text-xs font-medium rounded-full', categoryBadgeClass]">
        {{ categoryTitle }}
      </span>
      <span class="text-sm text-gray-400 flex items-center gap-1">
        <IconEye class="w-4 h-4" />
        {{ views.toLocaleString() }} vues
      </span>
    </div>
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">{{ title }}</h1>
    <p class="text-lg text-gray-600 dark:text-gray-400">{{ excerpt }}</p>
  </div>
</template>

<script setup lang="ts">
import { IconEye } from '@tabler/icons-vue';

defineProps<{
  title: string;
  excerpt: string;
  views: number;
  categoryTitle: string | undefined;
  categoryBadgeClass: string;
}>();
</script>
