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
