<template>
  <nav class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
    <NuxtLink to="/support/help" class="hover:text-primary-600 dark:hover:text-primary-400">Centre d'aide</NuxtLink>
    <IconChevronRight class="w-4 h-4" />
    <span class="text-gray-900 dark:text-white font-medium">{{ categoryTitle }}</span>
  </nav>
</template>

<script setup lang="ts">
import { IconChevronRight } from '@tabler/icons-vue';

defineProps<{
  categoryTitle: string | undefined;
}>();
</script>
