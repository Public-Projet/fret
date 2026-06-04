<template>
  <section class="bg-gray-50 dark:bg-gray-900 py-12">
    <div class="container-custom">
      <p class="text-center text-gray-600 dark:text-gray-400 text-sm font-semibold mb-8 uppercase tracking-wider">
        Nos Partenaires de Confiance
      </p>

      <!-- Squelettes de chargement via AppSkeleton -->
      <div v-if="contentStore.loading.partners" class="flex flex-wrap justify-center items-center gap-10">
        <UiAppSkeleton v-for="i in 5" :key="i" :loading="true" type="rectangle" width="110px" height="40px" radius="8px"
          animation-type="shimmer" />
      </div>

      <!-- Partenaires chargés -->
      <div v-else-if="contentStore.partners.length > 0"
        class="flex flex-wrap mx-auto justify-center items-center gap-12 opacity-60">
        <div v-for="partner in contentStore.partners" :key="partner.id"
          class="transition-all duration-300 hover:opacity-100 grayscale hover:grayscale-0">
          <template v-if="partner.logo">
            <img :src="partner.logo" :alt="partner.name" class="h-10 w-auto object-contain max-w-[150px]" />
          </template>
          <div v-else class="text-2xl md:text-3xl font-black text-gray-400 uppercase tracking-tighter">
            {{ partner.name }}
          </div>
        </div>
      </div>

      <!-- Aucun partenaire après chargement : masquer la section -->
      <template v-else></template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { usePbcSiteContentStore } from '~/stores/pbcSiteContent';

const contentStore = usePbcSiteContentStore();

onMounted(() => {
  contentStore.fetchPartners();
});
</script>
