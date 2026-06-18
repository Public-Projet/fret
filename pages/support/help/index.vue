<template>
  <div class="container-custom py-12 max-w-4xl">
    <div class="card p-8 md:p-12">
      <RootSupportHelpHomeHeader />
      <RootSupportHelpHomeSearch v-model="searchQuery" />

      <template v-if="searchQuery">
        <RootSupportHelpHomeSearchResults :results="searchResults" :query="searchQuery" />
      </template>

      <template v-else-if="store.loading.help">
        <!-- Loading State -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 mt-8">
          <div v-for="i in 6" :key="i" class="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3">
            <UiAppSkeleton type="square" width="48px" height="48px" />
            <UiAppSkeleton type="heading" width="60%" />
            <UiAppSkeleton type="text" :count="2" gap="2" />
          </div>
        </div>
      </template>

      <template v-else>
        <RootSupportHelpHomeCategories :categories="categoriesWithCount" />
        <RootSupportHelpHomePopular :articles="popularArticles" />
        <RootSupportHelpHomeContact />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePbcSiteContentStore } from '~/stores/pbcSiteContent';

const store = usePbcSiteContentStore();
const searchQuery = ref('');

onMounted(() => {
  store.fetchHelp();
});

const categoriesWithCount = computed(() => {
  return store.helpCategories.map(cat => ({
    ...cat,
    articleCount: cat.articles?.length || 0
  }));
});

const popularArticles = computed(() => {
  const allArticles = store.helpCategories.flatMap(c => c.articles || []);
  return [...allArticles]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);
});

const searchResults = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < 2) return [];
  const query = searchQuery.value.toLowerCase();
  const allArticles = store.helpCategories.flatMap(c => c.articles || []);
  return allArticles.filter(a =>
    a.title.toLowerCase().includes(query) ||
    a.excerpt.toLowerCase().includes(query)
  );
});

useHead({
  title: 'Centre d\'aide',
  meta: [
    { name: 'description', content: 'Besoin d\'aide ? Trouvez des articles, des guides et des tutoriels pour utiliser au mieux la plateforme Bourse de Fret.' },
    { name: 'robots', content: 'index, follow' }
  ]
});

definePageMeta({
  layout: 'guest'
});
</script>
