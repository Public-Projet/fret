<template>
  <NuxtLayout name="legal" :title="content?.title || 'Conditions d\'utilisation'" :last-update="content?.lastUpdated">
    <div class="space-y-8">
      <RootLegalDetailLoading v-if="loading" />

      <template v-else-if="content">
        <div v-for="(section, index) in content.sections" :key="index" class="space-y-3">
          <h2 v-if="section.title" class="text-xl font-bold text-gray-900 dark:text-white">{{ section.title }}</h2>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{{ section.paragraph }}</p>
        </div>
      </template>

      <RootLegalDetailEmpty v-else />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { usePbcSiteContentStore } from '~/stores/pbcSiteContent';

const contentStore = usePbcSiteContentStore();
const loading = ref(true);
const content = ref<any>(null);

onMounted(async () => {
  content.value = await contentStore.fetchLegalBySlug('terms');
  loading.value = false;
});

useHead({
  title: "Conditions d'utilisation",
  meta: [
    { name: 'description', content: "Lisez les conditions d'utilisation régissant l'accès et l'usage de la plateforme Bourse de Fret pour tous les utilisateurs." },
    { name: 'robots', content: 'index, follow' }
  ]
});

definePageMeta({
  layout: false
});
</script>
