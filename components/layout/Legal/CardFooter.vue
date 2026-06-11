<template>
  <!-- Pied de page de la card -->
  <div class="px-8 md:px-12 py-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
    <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <IconLock class="w-4 h-4 text-green-500" />
      <span>Ce document est soumis au droit béninois</span>
    </div>
    <NuxtLink :to="backLinkTarget" class="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1 transition-colors">
      <component :is="backLinkIcon" class="w-4 h-4" />
      {{ backLinkLabel }}
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from '#app';
import { IconLock, IconHome, IconArrowLeft } from '@tabler/icons-vue';

const route = useRoute();

const backLinkTarget = computed(() => {
  const normalizedPath = route.path.replace(/\/$/, '');
  return normalizedPath === '/legal' ? '/' : '/legal';
});

const backLinkIcon = computed(() => {
  const normalizedPath = route.path.replace(/\/$/, '');
  return normalizedPath === '/legal' ? IconHome : IconArrowLeft;
});

const backLinkLabel = computed(() => {
  const normalizedPath = route.path.replace(/\/$/, '');
  return normalizedPath === '/legal' ? "Retour à l'accueil" : "Retour aux documents légaux";
});
</script>
