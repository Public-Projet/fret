<template>
  <div
    class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200 relative selection:bg-primary-500 selection:text-white">
    <!-- Background Decorator -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div
        class="absolute top-0 left-0 w-full h-full bg-[url('/img/grid-pattern.svg')] opacity-[0.03] dark:opacity-[0.02]">
      </div>
      <div
        class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2">
      </div>
      <div
        class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2">
      </div>
    </div>

    <Header class="relative z-10" />
    <main class="flex-grow relative z-10">
      <slot />
    </main>
    <Footer class="relative z-10" />
  </div>
</template>

<script setup lang="ts">
import Header from '~/components/layout/Header.vue';
import Footer from '~/components/layout/Footer.vue';
import { useThemeStore } from '~/stores/theme';

const themeStore = useThemeStore();

onMounted(() => {
  themeStore.restoreTheme();
});
</script>
