<template>
  <div>
    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">
      <IconFlame class="w-5 h-5 inline-block mr-2 text-orange-500" />
      Articles populaires
    </h2>
    <div class="space-y-4">
      <NuxtLink v-for="article in articles" :key="article.id" :to="getArticleLink(article)"
        class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors group">
        <div class="flex items-center gap-4">
          <IconArticle class="w-5 h-5 text-gray-400" />
          <div>
            <span
              class="text-gray-900 dark:text-white font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {{ article.title }}
            </span>
            <span class="text-xs text-gray-400 ml-2">{{ article.views.toLocaleString() }} vues</span>
          </div>
        </div>
        <IconChevronRight class="w-5 h-5 text-gray-400" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconFlame, IconArticle, IconChevronRight } from '@tabler/icons-vue';

defineProps<{
  articles: any[];
}>();
const getArticleLink = (article: any) => {
  const catSlug = typeof article.category === 'object' ? article.category.slug : (article.categorySlug || 'aide');
  return `/h/help/${catSlug}/${article.slug}`;
};
</script>
