<template>
  <div class="py-20 text-center">
    <div class="w-20 h-20 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
      <IconSearchOff class="w-10 h-10 text-gray-400" />
    </div>
    <h3 class="text-xl font-bold text-gray-900 dark:text-white">Notification introuvable</h3>
    <p class="text-gray-500 dark:text-gray-400 mt-2">Cette notification a peut-être été supprimée ou vous n'y avez pas
      accès.</p>
    <NuxtLink to="/app/notifications" class="mt-8 inline-block text-primary-600 font-bold">Retour aux notifications
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { IconSearchOff } from '@tabler/icons-vue';
</script>
