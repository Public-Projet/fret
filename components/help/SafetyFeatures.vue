<template>
  <div class="space-y-8">
    <section v-for="feature in features" :key="feature.id" :class="[
      'p-6 rounded-2xl border transition-all duration-300',
      getColorClasses(feature.color || 'blue')
    ]">
      <div class="flex items-start gap-4">
        <div :class="[
          'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
          getIconBgClasses(feature.color || 'blue')
        ]">
          <component :is="getIcon(feature.icon)" class="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ feature.title }}</h2>
          <p class="text-gray-600 dark:text-gray-300">
            {{ feature.content }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import * as TablerIcons from '@tabler/icons-vue';
import type { SafetyItem } from '~/stores/siteContent';

defineProps<{
  features: SafetyItem[];
}>();

const getIcon = (iconName: string | undefined) => {
  if (!iconName) return TablerIcons.IconShield;
  return (TablerIcons as any)[iconName] || TablerIcons.IconShield;
};

const getColorClasses = (color: string) => {
  const mapping: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
    red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  };
  return mapping[color] || mapping.blue;
};

const getIconBgClasses = (color: string) => {
  const mapping: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
  };
  return mapping[color] || mapping.blue;
};
</script>
