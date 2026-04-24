<template>
  <div class="container-custom py-12 max-w-4xl">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
      <NuxtLink to="/support/help" class="hover:text-primary-600 dark:hover:text-primary-400">Centre d'aide</NuxtLink>
      <IconChevronRight class="w-4 h-4" />
      <span class="text-gray-900 dark:text-white font-medium">{{ category?.title }}</span>
    </nav>

    <div class="card p-8 md:p-12">
      <!-- Category Header -->
      <div class="flex items-center gap-4 mb-8">
        <div :class="['w-14 h-14 rounded-xl flex items-center justify-center', category?.iconBg]">
          <component :is="iconComponent" class="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ category?.title }}</h1>
          <p class="text-gray-600 dark:text-gray-400">{{ category?.description }}</p>
        </div>
      </div>

      <!-- Articles List -->
      <div class="space-y-4">
        <NuxtLink v-for="article in articles" :key="article.id" :to="`/support/help/${categorySlug}/${article.slug}`"
          class="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors group">
          <div class="flex-1">
            <h3
              class="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {{ article.title }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ article.excerpt }}</p>
          </div>
          <div class="flex items-center gap-4 ml-4">
            <span class="text-xs text-gray-400 hidden sm:block">{{ article.views.toLocaleString() }} vues</span>
            <IconChevronRight class="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
          </div>
        </NuxtLink>
      </div>

      <!-- Empty State -->
      <div v-if="articles.length === 0" class="text-center py-12">
        <IconFileOff class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 dark:text-gray-400">Aucun article dans cette catégorie.</p>
      </div>

      <!-- Back Link -->
      <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
        <NuxtLink to="/support/help"
          class="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline">
          <IconArrowLeft class="w-4 h-4" />
          Retour au centre d'aide
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { IconChevronRight, IconArrowLeft, IconFileOff, IconUser } from '@tabler/icons-vue';
import * as TablerIcons from '@tabler/icons-vue';
import { usePbcSiteContentStore } from '~/stores/pbcSiteContent';

const route = useRoute();
const store = usePbcSiteContentStore();
const categorySlug = route.params.category as string;

onMounted(() => {
  store.fetchHelp();
});

const category = computed(() => {
  return store.helpCategories.find(c => c.slug === categorySlug);
});

const articles = computed(() => {
  return category.value?.articles || [];
});

const iconComponent = computed(() => {
  const iconName = category.value?.icon;
  if (!iconName) return IconUser;
  return (TablerIcons as any)[iconName] || IconUser;
});

useHead({
  title: computed(() => `${category.value?.title || 'Catégorie'} - Centre d'aide`),
  meta: [
    { name: 'description', content: computed(() => category.value ? `Parcourez les articles d'aide pour la catégorie ${category.value.title}. Trouvez des guides et des solutions.` : 'Explorez les catégories de notre centre d\'aide.') },
    { name: 'robots', content: 'index, follow' }
  ]
});

definePageMeta({
  layout: 'guest'
});
</script>
