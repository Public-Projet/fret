<template>
  <div
    class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-200 relative selection:bg-primary-500 selection:text-white">

    <LayoutLegalBackground />
    <LayoutGuestHeader class="relative z-30" />
    <LayoutLegalHero :title="title" :last-update="lastUpdate" />

    <!-- Main Content -->
    <main class="flex-grow relative z-10 pb-20 px-4">
      <div class="max-w-3xl mx-auto">
        <!-- Navigation rapide (si des ancres sont définies) -->
        <div
          class="mb-6 p-4 rounded-2xl bg-white/70 dark:bg-gray-900/60 border border-gray-200/70 dark:border-gray-700/50 backdrop-blur-sm flex items-center gap-3">
          <IconShieldCheck class="w-5 h-5 text-primary-500 flex-shrink-0" />
          <p class="text-sm text-gray-600 dark:text-gray-400">
            En utilisant la plateforme <strong class="text-gray-900 dark:text-white">Bourse de Fret</strong>, vous
            acceptez les présentes dispositions.
          </p>
        </div>

        <!-- Card de contenu principale -->
        <div
          class="bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-gray-200/60 dark:border-gray-700/50 shadow-xl shadow-gray-200/50 dark:shadow-black/20 overflow-hidden">
          <!-- Barre décorative en haut -->
          <div class="h-1 w-full bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500"></div>

          <div class="p-8 md:p-12">
            <div
              class="prose dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:leading-relaxed">
              <slot />
            </div>
          </div>

          <LayoutLegalCardFooter />
        </div>

        <LayoutLegalRelatedLinks />
      </div>
    </main>

    <LayoutGuestFooter class="relative z-0" />
  </div>
</template>

<script setup lang="ts">
import { IconShieldCheck } from '@tabler/icons-vue';
import { useFrtThemeStore } from '~/stores/frtTheme';

defineProps<{
  title: string;
  lastUpdate?: string;
}>();

const themeStore = useFrtThemeStore();

onMounted(() => {
  themeStore.restoreTheme();
});
</script>
