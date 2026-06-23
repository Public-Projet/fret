<template>
  <div
    class="relative overflow-hidden bg-white/60 dark:bg-gray-800/40 backdrop-blur-md rounded-3xl border border-gray-100 dark:border-gray-700/50 p-12 md:p-16 text-center shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in zoom-in-95 duration-500"
  >
    <!-- Background glows -->
    <div class="absolute -top-24 -left-24 w-48 h-48 bg-red-400/10 dark:bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
    <div class="absolute -bottom-24 -right-24 w-48 h-48 bg-red-400/10 dark:bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

    <div class="relative z-10">
      <!-- Icon with custom animation -->
      <div 
        class="w-20 h-20 bg-gradient-to-tr from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-100/30 dark:border-red-800/30 shadow-inner"
      >
        <IconAlertCircle class="w-10 h-10 text-red-500/80 dark:text-red-400/80 animate-pulse duration-1000" />
      </div>

      <!-- Title with elegant gradient text -->
      <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent mb-3">
        Utilisateur introuvable
      </h3>

      <!-- Descriptive subtext -->
      <p class="text-base text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">
        Le profil de l'utilisateur que vous recherchez n'existe pas ou a été désactivé.
      </p>

      <!-- Action buttons -->
      <div class="flex justify-center">
        <NuxtLink
          to="/users"
          class="group/btn inline-flex items-center gap-2 px-6 py-3 bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300 dark:hover:bg-primary-900/50 border border-primary-100/50 dark:border-primary-800/50 rounded-xl font-semibold shadow-sm hover:bg-primary-100 active:scale-95 transition-all duration-300"
        >
          <IconArrowLeft class="w-4 h-4 transform group-hover/btn:-translate-x-0.5 transition-transform" />
          Retour à l'annuaire
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconAlertCircle, IconArrowLeft } from '@tabler/icons-vue';
</script>
