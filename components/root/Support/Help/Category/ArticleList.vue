<template>
  <div>
    <!-- Articles List -->
    <div class="space-y-4">
      <NuxtLink
        v-for="article in articles"
        :key="article.id"
        :to="`/support/help/${categorySlug}/${article.slug}`"
        class="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors group"
      >
        <div class="flex-1">
          <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
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
      <NuxtLink
        to="/support/help"
        class="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
      >
        <IconArrowLeft class="w-4 h-4" />
        Retour au centre d'aide
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconChevronRight, IconArrowLeft, IconFileOff } from '@tabler/icons-vue';

defineProps<{
  articles: any[];
  categorySlug: string;
}>();
</script>
