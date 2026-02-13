<template>
  <section v-if="contentStore.loading.partners || contentStore.partners.length > 0"
    class="bg-gray-50 dark:bg-gray-900 py-12">
    <div class="container-custom">
      <p class="text-center text-gray-600 dark:text-gray-400 text-sm font-semibold mb-8 uppercase tracking-wider">
        Ils nous font confiance
      </p>

      <div v-if="contentStore.loading.partners" class="flex justify-center items-center py-4">
        <div class="animate-pulse flex space-x-12 opacity-30">
          <div v-for="i in 3" :key="i" class="h-8 w-24 bg-gray-400 rounded"></div>
        </div>
      </div>

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
    </div>
  </section>
</template>

<script setup lang="ts">
import { useSiteContentStore } from '~/stores/siteContent';

const contentStore = useSiteContentStore();

onMounted(() => {
  contentStore.fetchPartners();
});
</script>
