<template>
  <div class="container-custom py-12 max-w-5xl">
    <RootSupportHelpCatDetailBreadcrumb :category-slug="categorySlug" :category-title="category?.title"
      :article-title="article?.title" class="mb-6" />

    <div v-if="store.loading.article" class="animate-in fade-in duration-500">
      <!-- Skeleton Header -->
      <div
        class="relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden mb-10 shadow-sm border border-gray-100 dark:border-gray-700/50">
        <div class="relative p-8 md:p-12">
          <div class="flex flex-wrap items-center gap-4 mb-6">
            <UiAppSkeleton class="h-8 w-24 rounded-full" />
            <UiAppSkeleton class="h-8 w-40 rounded-full" />
          </div>
          <UiAppSkeleton class="h-12 md:h-14 w-3/4 mb-6 rounded-xl" />
          <UiAppSkeleton class="h-6 w-full max-w-3xl mb-2 rounded-lg" />
          <UiAppSkeleton class="h-6 w-2/3 rounded-lg" />
        </div>
      </div>
      <!-- Skeleton Content -->
      <div
        class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-8 md:p-12 mb-10">
        <div class="space-y-4">
          <UiAppSkeleton class="h-4 w-full rounded-md" />
          <UiAppSkeleton class="h-4 w-full rounded-md" />
          <UiAppSkeleton class="h-4 w-5/6 rounded-md" />
          <br>
          <UiAppSkeleton class="h-4 w-full rounded-md" />
          <UiAppSkeleton class="h-4 w-4/5 rounded-md" />
        </div>
      </div>
    </div>

    <div v-else-if="article" class="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <RootSupportHelpCatDetailArticleHeader :title="article.title" :excerpt="article.excerpt" :views="article.views"
        :uniqueViews="article.uniqueViews" :category-title="category?.title"
        :category-badge-class="categoryBadgeClass" />

      <div
        class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-8 md:p-12 mb-10">
        <RootSupportHelpCatDetailArticleContent :content="article.content" />
        <RootSupportHelpCatDetailArticleFooter :updated-at="article.updatedAt" :article="article" @rate="rateArticle" />
      </div>

      <RootSupportHelpCatDetailRelatedArticles :articles="relatedArticles" :category-slug="categorySlug"
        class="mb-10" />

      <div class="mt-8 text-center">
        <NuxtLink :to="`/support/help/${categorySlug}`"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <IconArrowLeft class="w-5 h-5" />
          Retour à {{ category?.title }}
        </NuxtLink>
      </div>
    </div>

    <!-- 404 State -->
    <div v-else
      class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-16 text-center animate-in fade-in zoom-in duration-500">
      <div class="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
        <IconFileOff class="w-12 h-12 text-gray-400" />
      </div>
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">Article introuvable</h2>
      <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">L'article que vous recherchez n'existe
        pas ou a été déplacé.</p>
      <NuxtLink to="/support/help"
        class="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 text-white rounded-2xl font-semibold hover:bg-primary-600 transition-all hover:shadow-lg hover:shadow-primary-500/25">
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

import { useToast } from 'vue-toastification';
const toast = useToast();

const rateArticle = async (action: 'like' | 'dislike') => {
  if (!article.value) return;
  try {
    const res = await store.rateArticle(article.value.slug, action);
    if (res?.success) {
      if (action === 'like') {
        toast.success('Merci pour votre retour ! 🎉');
      } else {
        toast.info('Nous allons améliorer cet article. Merci !');
      }
    }
  } catch (error) {
    toast.error("Une erreur est survenue lors de l'enregistrement de votre avis.");
  }
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
