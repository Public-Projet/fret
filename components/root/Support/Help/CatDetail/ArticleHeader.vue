<template>
  <div class="relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden mb-10 shadow-sm border border-gray-100 dark:border-gray-700/50">
    <div class="absolute inset-0 bg-gradient-to-br from-primary-50/80 to-transparent dark:from-primary-900/20 dark:to-transparent pointer-events-none"></div>
    <div class="relative p-8 md:p-12">
      <div class="flex flex-wrap items-center gap-4 mb-6">
        <span :class="['px-4 py-1.5 text-sm font-semibold rounded-full shadow-sm', categoryBadgeClass]">
          {{ categoryTitle }}
        </span>
        <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-700/50">
          <div class="flex items-center gap-2" title="Vues totales">
            <IconEye class="w-4 h-4 text-primary-500" />
            <span class="font-medium">{{ (views || 0).toLocaleString() }} vues</span>
          </div>
          <span class="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></span>
          <div class="flex items-center gap-2" title="Visiteurs uniques">
            <IconUsers class="w-4 h-4 text-secondary-500" />
            <span class="font-medium">{{ (uniqueViews || 0).toLocaleString() }} uniques</span>
          </div>
        </div>
      </div>
      <h1 class="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">{{ title }}</h1>
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl font-medium">{{ excerpt }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconEye, IconUsers } from '@tabler/icons-vue';

defineProps<{
  title: string;
  excerpt: string;
  views: number;
  uniqueViews: number;
  categoryTitle: string | undefined;
  categoryBadgeClass: string;
}>();
</script>
