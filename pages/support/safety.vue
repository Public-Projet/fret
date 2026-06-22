<template>
  <div class="container-custom py-12 max-w-4xl">
    <div class="card p-8 md:p-12">
      <RootSupportSafetyHeader />

      <!-- Loading State -->
      <RootSupportSafetyLoading v-if="store.loading.safetyItems" />

      <div v-else class="prose dark:prose-invert max-w-none space-y-8">
        <RootSupportSafetyFeatures :features="features" />
        <RootSupportSafetyTips :tips="tips" />
        <RootSupportSafetyReport />
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
