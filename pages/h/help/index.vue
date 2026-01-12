<template>
  <div class="container-custom py-12 max-w-4xl">
    <div class="card p-8 md:p-12">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Centre d'aide</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        Trouvez rapidement les réponses à vos questions sur Bourse de Fret Bénin.
      </p>

      <!-- Search -->
      <div class="relative mb-12">
        <IconSearch class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input v-model="searchQuery" type="text" placeholder="Rechercher dans l'aide..."
          class="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
      </div>

      <!-- Search Results -->
      <div v-if="searchQuery && searchResults.length > 0" class="mb-12">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Résultats de recherche ({{ searchResults.length }})
        </h2>
        <div class="space-y-3">
          <NuxtLink v-for="article in searchResults" :key="article.id"
            :to="`/h/help/${article.categorySlug}/${article.slug}`"
            class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
            <div>
              <span class="text-gray-900 dark:text-white font-medium">{{ article.title }}</span>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ article.excerpt }}</p>
            </div>
            <IconChevronRight class="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
          </NuxtLink>
        </div>
      </div>

      <!-- No Search Results -->
      <div v-else-if="searchQuery && searchResults.length === 0" class="mb-12 text-center py-8">
        <IconSearchOff class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 dark:text-gray-400">Aucun résultat pour "{{ searchQuery }}"</p>
      </div>

      <!-- Categories -->
      <div v-if="!searchQuery" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <NuxtLink v-for="category in categoriesWithCount" :key="category.slug" :to="`/h/help/${category.slug}`"
          class="group p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all">
          <div :class="['w-12 h-12 rounded-xl flex items-center justify-center mb-4', category.iconBg]">
            <component :is="iconMap[category.icon]" class="w-6 h-6 text-white" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">{{ category.title }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ category.description }}</p>
          <span class="text-sm text-primary-600 dark:text-primary-400 font-medium group-hover:underline">
            {{ category.articleCount }} articles →
          </span>
        </NuxtLink>
      </div>

      <!-- Popular Articles -->
      <div v-if="!searchQuery">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">
          <IconFlame class="w-5 h-5 inline-block mr-2 text-orange-500" />
          Articles populaires
        </h2>
        <div class="space-y-4">
          <NuxtLink v-for="article in popularArticles" :key="article.id"
            :to="`/h/help/${article.categorySlug}/${article.slug}`"
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

      <!-- Contact Support -->
      <div
        class="mt-12 p-6 bg-gradient-to-r from-primary-500 to-blue-600 dark:from-primary-600 dark:to-blue-700 rounded-2xl text-center">
        <h3 class="text-xl font-bold text-white mb-2">Besoin d'aide supplémentaire ?</h3>
        <p class="text-blue-100 mb-4">Notre équipe support est là pour vous aider 24h/24, 7j/7.</p>
        <NuxtLink to="/h/contact"
          class="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-xl font-bold hover:bg-gray-100 transition-colors">
          <IconMail class="w-5 h-5" />
          Contacter le support
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  IconSearch, IconSearchOff, IconArticle, IconChevronRight, IconMail, IconFlame,
  IconTruck, IconUser, IconCreditCard, IconShieldCheck, IconSettings, IconMessageCircle
} from '@tabler/icons-vue';
import { helpCategories, getPopularArticles, getArticleCountByCategory, searchArticles } from '~/data/help-articles';

useHead({
  title: 'Centre d\'aide'
});

definePageMeta({
  layout: 'guest'
});

const searchQuery = ref('');

const iconMap: Record<string, any> = {
  IconUser,
  IconTruck,
  IconCreditCard,
  IconShieldCheck,
  IconSettings,
  IconMessageCircle
};

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
</script>
