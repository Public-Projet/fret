<template>
  <div class="container-custom py-12 max-w-4xl">
    <div class="card p-8 md:p-12">
      <HelpHeader />
      <HelpSearch v-model="searchQuery" />

      <template v-if="searchQuery">
        <HelpSearchResults :results="searchResults" :query="searchQuery" />
      </template>

      <template v-else>
        <HelpCategories :categories="categoriesWithCount" />
        <HelpPopular :articles="popularArticles" />
        <HelpContact />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { helpCategories, getPopularArticles, getArticleCountByCategory, searchArticles } from '~/data/help-articles';

const searchQuery = ref('');

const categoriesWithCount = computed(() => {
  return helpCategories.map(cat => ({
    ...cat,
    articleCount: getArticleCountByCategory(cat.slug)
  }));
});

const popularArticles = computed(() => getPopularArticles(5));

const searchResults = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < 2) return [];
  return searchArticles(searchQuery.value);
});

useHead({
  title: 'Centre d\'aide'
});

definePageMeta({
  layout: 'guest'
});
</script>
