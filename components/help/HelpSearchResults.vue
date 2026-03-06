<template>
  <div v-if="results.length > 0" class="mb-12">
    <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
      Résultats de recherche ({{ results.length }})
    </h2>
    <div class="space-y-3">
      <NuxtLink v-for="article in results" :key="article.id" :to="getArticleLink(article)"
        class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
        <div>
          <span class="text-gray-900 dark:text-white font-medium">{{ article.title }}</span>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ article.excerpt }}</p>
        </div>
        <IconChevronRight class="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
      </NuxtLink>
    </div>
  </div>

  <div v-else class="mb-12 text-center py-8">
    <IconSearchOff class="w-12 h-12 text-gray-400 mx-auto mb-4" />
    <p class="text-gray-500 dark:text-gray-400">Aucun résultat pour "{{ query }}"</p>
  </div>
</template>

<script setup lang="ts">
import { IconChevronRight, IconSearchOff } from '@tabler/icons-vue';

defineProps<{
  results: any[];
  query: string;
}>();
const getArticleLink = (article: any) => {
  const catSlug = typeof article.category === 'object' ? article.category.slug : (article.categorySlug || 'aide');
  return `/support/help/${catSlug}/${article.slug}`;
};
</script>
