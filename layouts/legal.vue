<template>
  <div
    class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-200 relative selection:bg-primary-500 selection:text-white">

    <!-- Background Decorators -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-0 w-full h-full bg-[url('/img/grid-pattern.svg')] opacity-[0.03] dark:opacity-[0.02]"></div>
      <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/8 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3"></div>
      <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-500/8 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
    </div>

    <LayoutGuestHeader class="relative z-30" />

    <!-- Hero Section -->
    <div class="relative z-10 pt-16 pb-10 px-4 text-center">
      <div class="max-w-3xl mx-auto">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6
          bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800/50">
          <span class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span>
          Document Légal
        </div>

        <h1 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
          {{ title }}
        </h1>

        <div v-if="lastUpdate" class="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <IconCalendar class="w-4 h-4" />
          <span>Dernière mise à jour : {{ formattedDate }}</span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-grow relative z-10 pb-20 px-4">
      <div class="max-w-3xl mx-auto">
        <!-- Navigation rapide (si des ancres sont définies) -->
        <div class="mb-6 p-4 rounded-2xl bg-white/70 dark:bg-gray-900/60 border border-gray-200/70 dark:border-gray-700/50 backdrop-blur-sm flex items-center gap-3">
          <IconShieldCheck class="w-5 h-5 text-primary-500 flex-shrink-0" />
          <p class="text-sm text-gray-600 dark:text-gray-400">
            En utilisant la plateforme <strong class="text-gray-900 dark:text-white">Bourse de Fret</strong>, vous acceptez les présentes dispositions.
          </p>
        </div>

        <!-- Card de contenu principale -->
        <div class="bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-gray-200/60 dark:border-gray-700/50 shadow-xl shadow-gray-200/50 dark:shadow-black/20 overflow-hidden">
          <!-- Barre décorative en haut -->
          <div class="h-1 w-full bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500"></div>

          <div class="p-8 md:p-12">
            <div class="prose dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:leading-relaxed">
              <slot />
            </div>
          </div>

          <!-- Pied de page de la card -->
          <div class="px-8 md:px-12 py-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <IconLock class="w-4 h-4 text-green-500" />
              <span>Ce document est soumis au droit béninois</span>
            </div>
            <NuxtLink to="/" class="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1 transition-colors">
              <IconHome class="w-4 h-4" />
              Retour à l'accueil
            </NuxtLink>
          </div>
        </div>

        <!-- Autres documents -->
        <div class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NuxtLink v-for="link in relatedLinks" :key="link.to" :to="link.to"
            class="group flex items-center gap-3 p-4 rounded-2xl bg-white/70 dark:bg-gray-900/50 border border-gray-200/70 dark:border-gray-700/50 hover:border-primary-400/50 dark:hover:border-primary-600/40 hover:shadow-md transition-all duration-200 backdrop-blur-sm">
            <component :is="link.icon" class="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors flex-shrink-0" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{{ link.label }}</span>
          </NuxtLink>
        </div>
      </div>
    </main>

    <LayoutGuestFooter class="relative z-0" />
  </div>
</template>

<script setup lang="ts">
import { IconCalendar, IconShieldCheck, IconLock, IconHome, IconFileText, IconCookieMan, IconEye, IconFileDescription } from '@tabler/icons-vue';
import { useFrtThemeStore } from '~/stores/frtTheme';

const props = defineProps<{
  title: string;
  lastUpdate?: string;
}>();

const themeStore = useFrtThemeStore();

onMounted(() => {
  themeStore.restoreTheme();
});

const formattedDate = computed(() => {
  if (!props.lastUpdate) return '';
  try {
    return new Date(props.lastUpdate).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return props.lastUpdate;
  }
});

const relatedLinks = [
  { to: '/legal/terms', label: "Conditions d'utilisation", icon: IconFileText },
  { to: '/legal/privacy', label: 'Confidentialité', icon: IconEye },
  { to: '/legal/cookies', label: 'Cookies', icon: IconCookieMan },
];
</script>
