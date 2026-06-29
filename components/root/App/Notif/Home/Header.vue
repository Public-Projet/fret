<template>
  <div class="flex justify-between items-center mb-8">
    <div>
      <h1 class="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Centre de Notifications</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">Gérez vos alertes et notifications système.</p>
    </div>
    <button v-if="unreadCount > 0" @click="markAllRead"
      class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary-500/20">
      Tout marquer comme lu
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCmnNotificationStore } from '~/stores/cmnNotification';

const notificationStore = useCmnNotificationStore();
const unreadCount = computed(() => notificationStore.unreadCount);

const markAllRead = () => notificationStore.markNotificationAsRead();
</script>
