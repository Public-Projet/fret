<template>
  <div class="container-custom py-12 max-w-4xl">
    <div class="card p-8 md:p-12">
      <HelpSafetyHeader />

      <!-- Loading State -->
      <div v-if="store.loading.safetyItems" class="flex flex-col items-center justify-center py-20 gap-4">
        <div class="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-500 animate-pulse">Chargement des informations de sécurité...</p>
      </div>

      <div v-else class="prose dark:prose-invert max-w-none space-y-8">
        <HelpSafetyFeatures :features="features" />
        <HelpSafetyTips :tips="tips" />
        <HelpSafetyReport />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useSiteContentStore } from '~/stores/siteContent';

const store = useSiteContentStore();

onMounted(() => {
  store.fetchSafetyItems();
});

const features = computed(() => store.safetyItems.filter(i => i.type === 'feature'));
const tips = computed(() => store.safetyItems.filter(i => i.type === 'tip'));

useHead({
  title: 'Sécurité & Confiance'
});

definePageMeta({
  layout: 'guest'
});
</script>
