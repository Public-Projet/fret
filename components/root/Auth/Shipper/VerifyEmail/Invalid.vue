<template>
  <div class="py-12">
    <div
      class="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
      <IconAlertTriangle class="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
    </div>
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      Lien invalide
    </h2>
    <p class="text-gray-600 dark:text-gray-400 mb-6">
      Le lien de vérification semble incomplet ou invalide.
    </p>
    <button @click="emit('resend')"
      class="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-primary-500/30">
      <IconMail class="w-5 h-5" />
      Renvoyer le lien
    </button>
  </div>
</template>

<script setup lang="ts">
import { IconAlertTriangle, IconMail } from '@tabler/icons-vue';

const emit = defineEmits<{
  (e: 'resend'): void;
}>();
</script>
