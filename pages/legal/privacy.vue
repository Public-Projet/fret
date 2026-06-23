<template>
  <NuxtLayout name="legal" :title="content?.title || 'Politique de confidentialité'" :last-update="content?.lastUpdated">
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
  content.value = await contentStore.fetchLegalBySlug('privacy');
  loading.value = false;
});

useHead({
  title: 'Politique de confidentialité',
  meta: [
    { name: 'description', content: 'Consultez notre politique de confidentialité pour comprendre comment nous protégeons et gérons vos données personnelles.' },
    { name: 'robots', content: 'index, follow' }
  ]
});

definePageMeta({
  layout: false
});
</script>
