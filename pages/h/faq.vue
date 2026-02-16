<template>
  <div class="container-custom py-12 max-w-4xl">
    <div class="card p-8 md:p-12">
      <HelpFaqHeader />

      <!-- Loading State -->
      <div v-if="store.loading.faqs" class="flex flex-col items-center justify-center py-20 gap-4">
        <div class="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-500 animate-pulse">Chargement de la foire aux questions...</p>
      </div>

      <template v-else>
        <HelpFaqCategories :categories="categories" :activeCategory="activeCategory"
          @update:activeCategory="activeCategory = $event" />
        <HelpFaqList :faqs="filteredFaqs" />

      </template>

      <HelpFaqContact />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useSiteContentStore } from '~/stores/siteContent';

const store = useSiteContentStore();
const activeCategory = ref('Toutes');

onMounted(() => {
  store.fetchFaqs();
});

const categories = computed(() => {
  const cats = new Set(store.faqs.map(f => f.category));
  return ['Toutes', ...Array.from(cats)];
});

const filteredFaqs = computed(() => {
  if (activeCategory.value === 'Toutes') {
    return store.faqs;
  }
  return store.faqs.filter(faq => faq.category === activeCategory.value);
});

useHead({
  title: 'FAQ'
});

definePageMeta({
  layout: 'guest'
});
</script>
