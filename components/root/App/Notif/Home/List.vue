<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">

    <!-- Chargement initial -->
    <div v-if="isLoading && notifications.length === 0" class="p-6 space-y-4">
      <UiAppSkeleton v-for="i in 4" :key="i" :loading="true" type="rectangle" height="7.5rem" radius="1.5rem" />
    </div>

    <!-- Aucun élément -->
    <div v-else-if="notifications.length === 0" class="py-20 text-center px-4">
      <div
        class="w-20 h-20 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
        <IconBellOff class="w-10 h-10 text-gray-400" />
      </div>
      <h3 class="text-lg font-bold text-gray-900 dark:text-white">Aucune notification</h3>
      <p class="text-gray-500 dark:text-gray-400 mt-2 max-w-xs mx-auto">
        Vous n'avez pas encore reçu de notifications. Elles apparaîtront ici quand vous en aurez.
      </p>
    </div>

    <!-- Liste des notifications -->
    <div v-else class="divide-y divide-gray-100 dark:divide-gray-700/50">
      <div v-for="notif in notifications" :key="notif.id" class="p-6 transition-colors relative"
        :class="{ 'bg-primary-50/20 dark:bg-primary-900/5': notif.status === 'unread' }">
        <div class="flex gap-4">
          <div class="flex-shrink-0 mt-1">
            <div
              class="w-12 h-12 rounded-2xl flex items-center justify-center transform transition-transform group-hover:scale-110"
              :class="getPriorityClass(notif.priority)">
              <IconInfoCircle v-if="notif.priority === 'low' || notif.priority === 'normal'" class="w-6 h-6" />
              <IconAlertTriangle v-else-if="notif.priority === 'high'" class="w-6 h-6" />
              <IconAlertCircle v-else class="w-6 h-6" />
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start mb-1">
              <NuxtLink :to="`/app/notifications/${notif.id}`"
                class="text-lg font-bold text-gray-900 dark:text-white hover:text-primary-600 transition-colors"
                :class="{ 'text-primary-600 dark:text-primary-400': notif.status === 'unread' }">
                {{ notif.title }}
              </NuxtLink>
              <span class="text-sm text-gray-400 dark:text-gray-500 font-medium">
                {{ formatDate(notif.createdAt) }}
              </span>
            </div>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              {{ notif.content }}
            </p>

            <div class="flex items-center gap-4">
              <button v-if="notif.status === 'unread'" @click="markAsRead(notif.id)"
                class="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">
                Marquer comme lu
              </button>
              <button @click="deleteNotif(notif.id)"
                class="text-sm font-bold text-red-500 hover:text-red-600 transition-colors">
                Supprimer
              </button>
            </div>
          </div>

          <div v-if="notif.status === 'unread'"
            class="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-r-full"></div>
        </div>
      </div>
    </div>

    <!-- Charger plus -->
    <div v-if="notifications.length < total" class="p-6 border-t border-gray-100 dark:border-gray-700/50 text-center">
      <button @click="loadMore" :disabled="isLoading"
        class="px-6 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all disabled:opacity-50">
        {{ isLoading ? 'Chargement...' : 'Charger plus' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCmnNotificationStore } from '~/stores/cmnNotification';
import {
  IconBellOff, IconInfoCircle, IconAlertTriangle,
  IconAlertCircle
} from '@tabler/icons-vue';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const notificationStore = useCmnNotificationStore();

const notifications = computed(() => notificationStore.notifications);
const total = computed(() => notificationStore.total);
const page = computed(() => notificationStore.page);
const isLoading = computed(() => notificationStore.isLoading);

const markAsRead = (id: string) => notificationStore.getOneUserNotification(id);
const deleteNotif = (id: string) => notificationStore.deleteUserNotification(id);
const loadMore = () => notificationStore.fetchUserNotifications(page.value + 1);

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'low': return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
    case 'high': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
    case 'urgent': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
    default: return 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400';
  }
};

const formatDate = (timestamp: number) => {
  return format(new Date(timestamp), 'dd MMMM yyyy, HH:mm', { locale: fr });
};
</script>
