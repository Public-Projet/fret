<template>
  <div class="py-12">
    <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
      <IconCircleX class="w-12 h-12 text-red-600 dark:text-red-400" />
    </div>
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      Échec de la vérification
    </h2>
    <p class="text-gray-600 dark:text-gray-400 mb-6">
      {{ errorMessage }}
    </p>

    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <button @click="emit('resend')"
        class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary-600 hover:bg-secondary-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-secondary-500/30">
        <IconMail class="w-5 h-5" />
        Renvoyer le lien
      </button>
      <NuxtLink to="/auth/login"
        class="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
        <IconLogin class="w-5 h-5" />
        Connexion
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconCircleX, IconLogin, IconMail } from '@tabler/icons-vue';

defineProps<{
  errorMessage: string;
}>();

const emit = defineEmits<{
  (e: 'resend'): void;
}>();
</script>
