<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <LayoutDefaultHeaderBlock :menu-open="mobileMenuOpen" @toggle-menu="mobileMenuOpen = !mobileMenuOpen" />

    <div v-if="mobileMenuOpen" class="lg:hidden fixed inset-0 z-20 bg-gray-900/50 backdrop-blur-sm"
      @click="mobileMenuOpen = false"></div>
    <LayoutDefaultSidebarBlock mobile :open="mobileMenuOpen" @close="mobileMenuOpen = false" />

    <div class="flex flex-grow relative">
      <LayoutDefaultSidebarBlock :collapsed="isSidebarCollapsed"
        @toggle-collapse="isSidebarCollapsed = !isSidebarCollapsed" />

      <!-- Main Content -->
      <main
        class="flex-grow min-w-0 transition-opacity duration-300 bg-gray-50 dark:bg-gray-900 overflow-y-auto h-[calc(100vh-64px)]">
        <div class="container-custom py-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const mobileMenuOpen = ref(false);
const isSidebarCollapsed = ref(false);
</script>
