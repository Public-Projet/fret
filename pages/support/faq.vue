<template>
  <div class="container-custom py-12 max-w-4xl">
    <div class="card p-8 md:p-12">
      <RootSupportFaqHeader />

      <!-- Loading State -->
      <RootSupportFaqLoading v-if="store.loading.faqs" />

      <template v-else>
        <RootSupportFaqCategories :categories="categories" :activeCategory="activeCategory"
          @update:activeCategory="activeCategory = $event" />
        <RootSupportFaqList :faqs="filteredFaqs" />
      </template>

      <RootSupportFaqContact />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePbcSiteContentStore } from '~/stores/pbcSiteContent';

const store = usePbcSiteContentStore();
const activeCategory = ref<any>('Toutes');

onMounted(() => {
  store.fetchFaqs();
  store.fetchFaqCategories();
});

const categories = computed(() => {
  if (store.faqCategories.length > 0) {
    return ['Toutes', ...store.faqCategories];
  }
  const cats = new Set(store.faqs.map(f => typeof f.category === 'string' ? f.category : (f.category as any).title));
  return ['Toutes', ...Array.from(cats)];
});

const filteredFaqs = computed(() => {
  if (activeCategory.value === 'Toutes') {
    return store.faqs;
  }

  if (typeof activeCategory.value === 'string') {
    return store.faqs.filter(faq => {
      const catName = typeof faq.category === 'string' ? faq.category : (faq.category as any).title;
      return catName === activeCategory.value;
    });
  }

  return store.faqs.filter(faq => {
    if (typeof faq.category === 'object' && faq.category !== null) {
      return (faq.category as any).id === activeCategory.value.id;
    }
    return false;
  });
});

useHead({
  title: 'Questions fréquente',
  meta: [
    { name: 'description', content: 'Trouvez des réponses rapides aux questions les plus fréquentes sur le fonctionnement de Bourse de Fret, les paiements et le transport.' },
    { name: 'robots', content: 'index, follow' }
  ]
});

definePageMeta({
  layout: 'guest'
});
</script>
