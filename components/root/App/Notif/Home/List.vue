<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
  >
    <!-- Chargement -->
    <RootAppNotifHomeLoader v-if="isLoading && notifications.length === 0" />

    <!-- Liste des notifications -->
    <RootAppNotifHomeContent
      v-else-if="notifications.length > 0"
      :notifications="notifications"
      @mark-as-read="markAsRead"
      @delete="deleteNotif"
    />

    <!-- Aucun élément -->
    <RootAppNotifHomeEmpty v-else />

    <!-- Charger plus -->
    <div
      v-if="notifications.length < total"
      class="p-6 border-t border-gray-100 dark:border-gray-700/50 text-center"
    >
      <button
        @click="loadMore"
        :disabled="isLoading"
        class="px-6 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all disabled:opacity-50"
      >
        {{ isLoading ? 'Chargement...' : 'Charger plus' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCmnNotificationStore } from '~/stores/cmnNotification';

const notificationStore = useCmnNotificationStore();

const notifications = computed(() => notificationStore.notifications);
const total = computed(() => notificationStore.total);
const page = computed(() => notificationStore.page);
const isLoading = computed(() => notificationStore.isLoading);

const markAsRead = (id: string) => notificationStore.getOneUserNotification(id);
const deleteNotif = (id: string) => notificationStore.deleteUserNotification(id);
const loadMore = () => notificationStore.fetchUserNotifications(page.value + 1);
</script>
