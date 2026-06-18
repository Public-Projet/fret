<template>
  <div class="container-custom py-12 max-w-4xl">
    <RootSupportHelpCategoryBreadcrumb :category-title="category?.title" />
    <div class="card p-8 md:p-12">
      <RootSupportHelpCategoryHeader :category="category" />
      <RootSupportHelpCategoryArticleList :articles="articles" :category-slug="categorySlug" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { usePbcSiteContentStore } from '~/stores/pbcSiteContent';

const route = useRoute();
const store = usePbcSiteContentStore();
const categorySlug = route.params.category as string;

onMounted(() => {
  store.fetchHelp();
});

const category = computed(() => store.helpCategories.find(c => c.slug === categorySlug));
const articles = computed(() => category.value?.articles || []);

useHead({
  title: computed(() => `${category.value?.title || 'Catégorie'} - Centre d'aide`),
  meta: [
    {
      name: 'description',
      content: computed(() =>
        category.value
          ? `Parcourez les articles d'aide pour la catégorie ${category.value.title}. Trouvez des guides et des solutions.`
          : "Explorez les catégories de notre centre d'aide."
      )
    },
    { name: 'robots', content: 'index, follow' }
  ]
});

definePageMeta({
  layout: 'guest'
});
</script>
