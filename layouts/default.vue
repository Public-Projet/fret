<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <Header />
    <main class="flex-grow">
      <slot />
    </main>
    <Footer />
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
