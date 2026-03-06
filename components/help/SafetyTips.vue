<template>
  <section class="mt-8">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
      <IconAlertTriangle class="w-5 h-5 inline-block mr-2 text-yellow-500" />
      Conseils de sécurité
    </h2>
    <ul class="space-y-3 text-gray-600 dark:text-gray-300">
      <li v-for="tip in tips" :key="tip.id" class="flex items-start gap-3">
        <component :is="getIcon(tip.icon)" class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
        <span>{{ tip.content }}</span>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import * as TablerIcons from '@tabler/icons-vue';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-vue';
import type { SafetyItem } from '~/types';

defineProps<{
  tips: SafetyItem[];
}>();

const getIcon = (iconName: string | undefined) => {
  if (!iconName) return IconCheck;
  return (TablerIcons as any)[iconName] || IconCheck;
};
</script>
