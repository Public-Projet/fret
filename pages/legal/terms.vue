<template>
  <NuxtLayout name="legal" :title="content?.title || 'Conditions d\'utilisation'" :last-update="content?.lastUpdated">
    <div class="space-y-8">
      <template v-if="loading">
        <div v-for="i in 5" :key="i" class="space-y-3">
          <UiAppSkeleton :loading="true" type="heading" width="45%" height="22px" />
          <UiAppSkeleton :loading="true" type="text" :count="3" gap="2" />
        </div>
      </template>

      <template v-else-if="content">
        <div v-for="(section, index) in content.sections" :key="index" class="space-y-3">
          <h2 v-if="section.title" class="text-xl font-bold text-gray-900 dark:text-white">{{ section.title }}</h2>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{{ section.paragraph }}</p>
        </div>
      </template>

      <div v-else class="text-center py-12">
        <p class="text-gray-500">Contenu indisponible pour le moment.</p>
      </div>
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
