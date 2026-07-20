<template>
  <div class="py-20 text-center px-4">
    <div class="w-20 h-20 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
      <IconBellOff class="w-10 h-10 text-gray-400" />
    </div>
    <h3 class="text-lg font-bold text-gray-900 dark:text-white">Aucune notification</h3>
    <p class="text-gray-500 dark:text-gray-400 mt-2 max-w-xs mx-auto">
      Vous n'avez pas encore reçu de notifications. Elles apparaîtront ici quand vous en aurez.
    </p>
  </div>
</template>

<script setup lang="ts">
import { IconBellOff } from '@tabler/icons-vue';
</script>
