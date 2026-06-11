<template>
  <!-- Hero Section -->
  <div class="relative z-10 pt-16 pb-10 px-4 text-center">
    <div class="max-w-3xl mx-auto">
      <!-- Badge -->
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6
        bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800/50">
        <span class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span>
        Document Légal
      </div>

      <h1 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
        {{ title }}
      </h1>

      <div v-if="lastUpdate" class="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <IconCalendar class="w-4 h-4" />
        <span>Dernière mise à jour : {{ formattedDate }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IconCalendar } from '@tabler/icons-vue';

const props = defineProps<{
  title: string;
  lastUpdate?: string;
}>();

const formattedDate = computed(() => {
  if (!props.lastUpdate) return '';
  try {
    return new Date(props.lastUpdate).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return props.lastUpdate;
  }
});
</script>
