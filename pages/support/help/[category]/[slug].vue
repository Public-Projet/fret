<template>
  <div class="container-custom py-12 max-w-4xl">
    <RootSupportHelpCatDetailBreadcrumb :category-slug="categorySlug" :category-title="category?.title"
      :article-title="article?.title" />

    <div class="card p-8 md:p-12" v-if="article">
      <RootSupportHelpCatDetailArticleHeader :title="article.title" :excerpt="article.excerpt" :views="article.views"
        :category-title="category?.title" :category-badge-class="categoryBadgeClass" />
      <RootSupportHelpCatDetailArticleContent :content="article.content" />
      <RootSupportHelpCatDetailArticleFooter :updated-at="article.updatedAt" @rate="rateArticle" />
      <RootSupportHelpCatDetailRelatedArticles :articles="relatedArticles" :category-slug="categorySlug" />
      <div class="mt-8">
        <NuxtLink :to="`/support/help/${categorySlug}`"
          class="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline">
          <IconArrowLeft class="w-4 h-4" />
          Retour à {{ category?.title }}
        </NuxtLink>
      </div>
    </div>

    <!-- 404 State -->
    <div v-else class="card p-12 text-center">
      <IconFileOff class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Article introuvable</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">L'article que vous recherchez n'existe pas ou a été déplacé.</p>
      <NuxtLink to="/support/help"
        class="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors">
        Retour au centre d'aide
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { IconArrowLeft, IconFileOff } from '@tabler/icons-vue';
import { usePbcSiteContentStore } from '~/stores/pbcSiteContent';

const route = useRoute();
const store = usePbcSiteContentStore();
const articleSlug = route.params.slug as string;

onMounted(async () => {
  await store.fetchArticleBySlug(articleSlug);
  if (store.helpCategories.length === 0) {
    await store.fetchHelp();
  }
});

watch(() => route.params.slug, async (newSlug) => {
  if (newSlug) await store.fetchArticleBySlug(newSlug as string);
});

const article = computed(() => store.currentArticle);
const category = computed(() => article.value?.category as any);
const categorySlug = computed(() => category.value?.slug || '');

const relatedArticles = computed(() => {
  if (!article.value || !category.value) return [];
  const catWithArticles = store.helpCategories.find(c => c.slug === categorySlug.value);
  if (!catWithArticles?.articles) return [];
  return catWithArticles.articles.filter(a => a.id !== article.value?.id).slice(0, 3);
});

const categoryBadgeClass = computed(() => {
  const colors: Record<string, string> = {
    compte: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    annonces: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    paiements: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    securite: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    parametres: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
    communication: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
  };
  return colors[categorySlug.value] || colors.compte;
});

const hasRated = ref(false);
const rateArticle = (rating: 'yes' | 'no') => {
  if (hasRated.value) return;
  hasRated.value = true;
  alert(rating === 'yes' ? 'Merci pour votre retour ! 🎉' : 'Nous allons améliorer cet article. Merci !');
};

definePageMeta({
  layout: 'guest'
});

useHead({
  title: computed(() => `${article.value?.title || 'Article'} - Centre d'aide`),
  meta: [
    {
      name: 'description',
      content: computed(() =>
        article.value ? article.value.excerpt : "Consultez cet article de notre centre d'aide pour en savoir plus."
      )
    },
    { name: 'robots', content: 'index, follow' }
  ]
});
</script>
