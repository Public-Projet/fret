<template>
  <!-- Autres documents -->
  <div v-if="shouldShow && relatedLinks.length > 0" class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
    <NuxtLink v-for="link in relatedLinks" :key="link.to" :to="link.to"
      class="group flex items-center gap-3 p-4 rounded-2xl bg-white/70 dark:bg-gray-900/50 border border-gray-200/70 dark:border-gray-700/50 hover:border-primary-400/50 dark:hover:border-primary-600/40 hover:shadow-md transition-all duration-200 backdrop-blur-sm">
      <component :is="link.icon" class="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors flex-shrink-0" />
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{{ link.label }}</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from '#app';
import { IconFileText, IconEye, IconCookieMan, IconFileDescription } from '@tabler/icons-vue';

const route = useRoute();

const allLinks = [
  { to: '/legal/terms', label: "Conditions d'utilisation", icon: IconFileText },
  { to: '/legal/privacy', label: 'Confidentialité', icon: IconEye },
  { to: '/legal/cookies', label: 'Cookies', icon: IconCookieMan },
  { to: '/legal/mention', label: 'Mentions légales', icon: IconFileDescription },
];

const normalizedPath = computed(() => route.path.replace(/\/$/, ''));

const shouldShow = computed(() => {
  return normalizedPath.value !== '/legal';
});

const relatedLinks = computed(() => {
  return allLinks.filter(link => link.to !== normalizedPath.value);
});
</script>
