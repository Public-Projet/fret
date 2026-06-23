<template>
  <div
    class="relative overflow-hidden bg-white/60 dark:bg-gray-800/40 backdrop-blur-md rounded-3xl border border-gray-100 dark:border-gray-700/50 p-12 md:p-16 text-center shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in zoom-in-95 duration-500">
    <!-- Background glows for modern rich aesthetics -->
    <div
      class="absolute -top-24 -left-24 w-48 h-48 bg-primary-400/10 dark:bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
    <div
      class="absolute -bottom-24 -right-24 w-48 h-48 bg-primary-400/10 dark:bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

    <div class="relative z-10">
      <!-- Icon Container with pulse effect -->
      <div
        class="w-20 h-20 bg-gradient-to-tr from-primary-50 to-primary-100/50 dark:from-primary-950/30 dark:to-primary-900/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary-100/30 dark:border-primary-800/30 shadow-inner">
        <IconFileAlert class="w-10 h-10 text-primary-500/80 dark:text-primary-400/80 animate-pulse duration-1000" />
      </div>

      <!-- Title with elegant gradient text -->
      <h3
        class="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent mb-3">
        Contenu non disponible
      </h3>

      <!-- Descriptive subtext -->
      <p class="text-base text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">
        Le document légal que vous tentez de consulter n'est pas accessible pour le moment.
      </p>

      <!-- Action buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <NuxtLink to="/legal"
          class="group/btn inline-flex items-center gap-2 px-6 py-3 bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300 dark:hover:bg-primary-900/50 border border-primary-100/50 dark:border-primary-800/50 rounded-xl font-semibold shadow-sm hover:bg-primary-100 active:scale-95 transition-all duration-300">
          <IconArrowLeft class="w-4 h-4 transform group-hover/btn:-translate-x-0.5 transition-transform" />
          Retour aux documents légaux
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconFileAlert, IconArrowLeft } from '@tabler/icons-vue';
</script>
