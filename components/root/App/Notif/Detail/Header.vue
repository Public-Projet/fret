<template>
  <div class="mb-8 flex items-center gap-4">
    <NuxtLink to="/app/notifications"
      class="p-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:text-primary-600 transition-colors">
      <IconArrowLeft class="w-5 h-5" />
    </NuxtLink>
    <div>
      <h1 class="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Détails de la Notification</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconArrowLeft } from '@tabler/icons-vue';
</script>
