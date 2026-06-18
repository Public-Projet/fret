<template>
  <div class="container-custom py-12 max-w-4xl">
    <div class="card p-8 md:p-12">
      <RootHelpSafetyHeader />

      <!-- Loading State -->
      <div v-if="store.loading.safetyItems" class="flex flex-col items-center justify-center py-20 gap-4">
        <div class="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-500 animate-pulse">Chargement des informations de sécurité...</p>
      </div>

      <div v-else class="prose dark:prose-invert max-w-none space-y-8">
        <RootHelpSafetyFeatures :features="features" />
        <RootHelpSafetyTips :tips="tips" />
        <RootHelpSafetyReport />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { usePbcSiteContentStore } from '~/stores/pbcSiteContent';

const store = usePbcSiteContentStore();

onMounted(() => {
  store.fetchSafetyItems();
});

const features = computed(() => store.safetyItems.filter(i => i.type === 'feature'));
const tips = computed(() => store.safetyItems.filter(i => i.type === 'tip'));

useHead({
  title: 'Sécurité et confiance',
  meta: [
    { name: 'description', content: 'Apprenez comment nous assurons la sécurité de vos transactions et de vos données sur Bourse de Fret pour une expérience sans risque.' },
    { name: 'robots', content: 'index, follow' }
  ]
});

definePageMeta({
  layout: 'guest'
});
</script>
