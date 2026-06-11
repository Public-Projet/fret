<template>
  <!-- Desktop Navigation -->
  <div
    class="hidden md:flex items-center bg-gray-100/50 dark:bg-white/5 rounded-2xl px-2 py-1.5 border border-gray-200/50 dark:border-white/5">
    <NuxtLink v-for="link in headerLinks" :key="link.to" :to="link.to"
      class="relative px-5 py-2 text-sm font-bold transition-all duration-300 rounded-xl group overflow-hidden" :class="[
        route.path === link.to.split('?')[0]
          ? 'text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800 shadow-sm'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
      ]">
      <span class="relative z-10 flex items-center gap-2">
        {{ link.label }}
        <span v-if="link.badge && link.badge > 0"
          class="bg-primary-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
          {{ link.badge }}
        </span>
      </span>
      <div v-if="route.path !== link.to.split('?')[0]"
        class="absolute inset-0 bg-gray-200/50 dark:bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

defineProps<{
  headerLinks: Array<{ label: string; to: string; badge?: number }>;
}>();
</script>
