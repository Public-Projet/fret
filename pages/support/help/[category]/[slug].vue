<template>
  <div class="container-custom py-12 max-w-4xl">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6 flex-wrap">
      <NuxtLink to="/support/help" class="hover:text-primary-600 dark:hover:text-primary-400">Centre d'aide</NuxtLink>
      <IconChevronRight class="w-4 h-4" />
      <NuxtLink :to="`/support/help/${categorySlug}`" class="hover:text-primary-600 dark:hover:text-primary-400">
        {{ category?.title }}
      </NuxtLink>
      <IconChevronRight class="w-4 h-4" />
      <span class="text-gray-900 dark:text-white font-medium truncate max-w-[200px]">{{ article?.title }}</span>
    </nav>

    <div class="card p-8 md:p-12" v-if="article">
      <!-- Article Header -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-4">
          <span :class="['px-3 py-1 text-xs font-medium rounded-full', categoryBadgeClass]">
            {{ category?.title }}
          </span>
          <span class="text-sm text-gray-400 flex items-center gap-1">
            <IconEye class="w-4 h-4" />
            {{ article.views.toLocaleString() }} vues
          </span>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">{{ article.title }}</h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">{{ article.excerpt }}</p>
      </div>

      <!-- Article Content -->
      <div class="prose dark:prose-invert max-w-none" v-html="renderedContent"></div>

      <!-- Article Footer -->
      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Mis à jour le {{ formatDate(article.updatedAt) }}
          </p>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-500 dark:text-gray-400">Cet article vous a-t-il été utile ?</span>
            <button @click="rateArticle('yes')"
              class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              <IconThumbUp class="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-green-600" />
            </button>
            <button @click="rateArticle('no')"
              class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
              <IconThumbDown class="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-red-600" />
            </button>
          </div>
        </div>
      </div>

      <!-- Related Articles -->
      <div class="mt-8" v-if="relatedArticles.length > 0">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Articles connexes</h3>
        <div class="space-y-3">
          <NuxtLink v-for="related in relatedArticles" :key="related.id"
            :to="`/support/help/${categorySlug}/${related.slug}`"
            class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
            <span class="text-gray-900 dark:text-white font-medium">{{ related.title }}</span>
            <IconChevronRight class="w-5 h-5 text-gray-400" />
          </NuxtLink>
        </div>
      </div>

      <!-- Back Link -->
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
import { IconChevronRight, IconArrowLeft, IconFileOff, IconEye, IconThumbUp, IconThumbDown, IconLoader2 } from '@tabler/icons-vue';
import { useSiteContentStore } from '~/stores/siteContent';

const route = useRoute();
const store = useSiteContentStore();
const articleSlug = route.params.slug as string;

onMounted(async () => {
  await store.fetchArticleBySlug(articleSlug);
  // Also ensuring help categories are loaded for related articles
  if (store.helpCategories.length === 0) {
    await store.fetchHelp();
  }
});

// Watch slug change for intra-navigation
watch(() => route.params.slug, async (newSlug) => {
  if (newSlug) await store.fetchArticleBySlug(newSlug as string);
});

const article = computed(() => store.currentArticle);
const category = computed(() => article.value?.category as any);
const categorySlug = computed(() => category.value?.slug || '');

const relatedArticles = computed(() => {
  if (!article.value || !category.value) return [];
  const catWithArticles = store.helpCategories.find(c => c.slug === categorySlug.value);
  if (!catWithArticles || !catWithArticles.articles) return [];

  return catWithArticles.articles
    .filter(a => a.id !== article.value?.id)
    .slice(0, 3);
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

// Simple markdown-like rendering (basic)
const renderedContent = computed(() => {
  if (!article.value) return '';

  let content = article.value.content
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">$1</h2>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')
    // Lists
    .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4 list-decimal">$2</li>')
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary-500 pl-4 py-2 my-4 bg-primary-50 dark:bg-primary-900/20 rounded-r-lg text-gray-700 dark:text-gray-300">$1</blockquote>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="text-gray-600 dark:text-gray-300 mb-4">')
    // Line breaks
    .replace(/\n/g, '<br>');

  return `<p class="text-gray-600 dark:text-gray-300 mb-4">${content}</p>`;
});

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

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
    { name: 'description', content: computed(() => article.value ? article.value.excerpt : 'Consultez cet article de notre centre d\'aide pour en savoir plus.') },
    { name: 'robots', content: 'index, follow' }
  ]
});
</script>
