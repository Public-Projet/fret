<template>
  <LegalPageLayout :title="content?.title || 'Mentions légales'" :last-update="content?.lastUpdated">
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
import { usePbcSiteContentStore } from '~/stores/pbcSiteContent';

const contentStore = usePbcSiteContentStore();
const loading = ref(true);
const content = ref<any>(null);

onMounted(async () => {
  content.value = await contentStore.fetchLegalBySlug('mention');
  loading.value = false;
});

useHead({
  title: 'Mentions légales',
  meta: [
    { name: 'description', content: 'Consultez les mentions légales de Bourse de Fret. Informations sur l\'éditeur, l\'hébergeur et la propriété intellectuelle.' },
    { name: 'robots', content: 'index, follow' }
  ]
});

definePageMeta({
  layout: 'guest'
});
</script>
