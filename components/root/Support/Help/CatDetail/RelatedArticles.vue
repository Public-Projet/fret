<template>
  <div class="mt-8" v-if="articles.length > 0">
    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Articles connexes</h3>
    <div class="space-y-3">
      <NuxtLink
        v-for="article in articles"
        :key="article.id"
        :to="`/support/help/${categorySlug}/${article.slug}`"
        class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
      >
        <span class="text-gray-900 dark:text-white font-medium">{{ article.title }}</span>
        <IconChevronRight class="w-5 h-5 text-gray-400" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconChevronRight } from '@tabler/icons-vue';

defineProps<{
  articles: any[];
  categorySlug: string;
}>();
</script>
