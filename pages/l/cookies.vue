<template>
  <LegalPageLayout :title="content?.title || 'Politique de cookies'" :last-update="content?.lastUpdated">
    <div v-if="loading" class="animate-pulse space-y-4">
      <div v-for="i in 5" :key="i" class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
    </div>
    <div v-else-if="content" class="space-y-8">
      <div v-for="(section, index) in content.sections" :key="index" class="space-y-3">
        <h2 v-if="section.title" class="text-xl font-bold text-gray-900 dark:text-white">{{ section.title }}</h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{{ section.paragraph }}</p>
      </div>
    </div>
    <div v-else class="text-center py-12">
      <p class="text-gray-500">Contenu indisponible pour le moment.</p>
    </div>
  </LegalPageLayout>
</template>

<script setup lang="ts">
import { useSiteContentStore } from '~/stores/siteContent';

const contentStore = useSiteContentStore();
const loading = ref(true);
const content = ref<any>(null);

onMounted(async () => {
  content.value = await contentStore.fetchLegalBySlug('cookies');
  loading.value = false;
});

useHead({
  title: 'Politique de cookies'
});

definePageMeta({
  layout: 'guest'
});
</script>
