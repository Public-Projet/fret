<template>
  <div
    class="mt-12 p-6 bg-gradient-to-r from-primary-500 to-blue-600 dark:from-primary-600 dark:to-blue-700 rounded-2xl text-center">
    <h3 class="text-xl font-bold text-white mb-2">Besoin d'aide supplémentaire ?</h3>
    <p class="text-blue-100 mb-4">Notre équipe support est là pour vous aider 24h/24, 7j/7.</p>
    <NuxtLink to="/h/contact"
      class="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-xl font-bold hover:bg-gray-100 transition-colors">
      <IconMail class="w-5 h-5" />
      Contacter le support
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { IconMail } from '@tabler/icons-vue';
</script>
