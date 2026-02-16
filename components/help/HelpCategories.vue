<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
    <NuxtLink v-for="category in categories" :key="category.slug" :to="`/h/help/${category.slug}`"
      class="group p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all">
      <div :class="['w-12 h-12 rounded-xl flex items-center justify-center mb-4', category.iconBg]">
        <component :is="getIcon(category.icon)" class="w-6 h-6 text-white" />
      </div>
      <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">{{ category.title }}</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ category.description }}</p>
      <span class="text-sm text-primary-600 dark:text-primary-400 font-medium group-hover:underline">
        {{ category.articleCount }} articles →
      </span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import * as TablerIcons from '@tabler/icons-vue';

defineProps<{
  categories: any[];
}>();

const getIcon = (iconName: string) => {
  return (TablerIcons as any)[iconName] || TablerIcons.IconFolder;
};
</script>
