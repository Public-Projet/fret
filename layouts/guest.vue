<template>
  <div
    class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200 relative selection:bg-primary-500 selection:text-white">
    <LayoutGuestBackground />

    <LayoutGuestHeader class="relative z-30" />
    <main class="flex-grow relative z-10">
      <slot />
    </main>
    <LayoutGuestFooter class="relative z-0" />
  </div>
</template>

<script setup lang="ts">
import { useFrtThemeStore } from '~/stores/frtTheme';

const themeStore = useFrtThemeStore();

onMounted(() => {
  themeStore.restoreTheme();
});
</script>
