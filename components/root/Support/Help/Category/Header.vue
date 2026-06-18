<template>
  <div class="flex items-center gap-4 mb-8">
    <div :class="['w-14 h-14 rounded-xl flex items-center justify-center', category?.iconBg]">
      <component :is="iconComponent" class="w-7 h-7 text-white" />
    </div>
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ category?.title }}</h1>
      <p class="text-gray-600 dark:text-gray-400">{{ category?.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IconUser } from '@tabler/icons-vue';
import * as TablerIcons from '@tabler/icons-vue';

const props = defineProps<{
  category: any;
}>();

const iconComponent = computed(() => {
  const iconName = props.category?.icon;
  if (!iconName) return IconUser;
  return (TablerIcons as any)[iconName] || IconUser;
});
</script>
