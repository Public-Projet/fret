<template>
  <div class="mt-12 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl text-center">
    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Vous n'avez pas trouvé votre réponse ?</h3>
    <p class="text-gray-600 dark:text-gray-400 mb-4">Notre équipe est disponible pour répondre à toutes vos questions.
    </p>
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <NuxtLink to="/support/help"
        class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
        <IconHelp class="w-5 h-5" />
        Centre d'aide
      </NuxtLink>
      <NuxtLink to="/support/contact"
        class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors">
        <IconMail class="w-5 h-5" />
        Nous contacter
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconHelp, IconMail } from '@tabler/icons-vue';
</script>
