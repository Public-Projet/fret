<template>
  <div class="divide-y divide-gray-100 dark:divide-gray-700/50">
    <div
      v-for="notif in notifications"
      :key="notif.id"
      class="p-6 transition-colors relative"
      :class="{ 'bg-primary-50/20 dark:bg-primary-900/5': notif.status === 'unread' }"
    >
      <div class="flex gap-4">
        <div class="flex-shrink-0 mt-1">
          <div
            class="w-12 h-12 rounded-2xl flex items-center justify-center transform transition-transform group-hover:scale-110"
            :class="getPriorityClass(notif.priority)"
          >
            <IconInfoCircle v-if="notif.priority === 'low' || notif.priority === 'normal'" class="w-6 h-6" />
            <IconAlertTriangle v-else-if="notif.priority === 'high'" class="w-6 h-6" />
            <IconAlertCircle v-else class="w-6 h-6" />
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-start mb-1">
            <NuxtLink
              :to="`/app/notifications/${notif.id}`"
              class="text-lg font-bold text-gray-900 dark:text-white hover:text-primary-600 transition-colors"
              :class="{ 'text-primary-600 dark:text-primary-400': notif.status === 'unread' }"
            >
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
            <button
              v-if="notif.status === 'unread'"
              @click="emit('markAsRead', notif.id)"
              class="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors"
            >
              Marquer comme lu
            </button>
            <button
              @click="emit('delete', notif.id)"
              class="text-sm font-bold text-red-500 hover:text-red-600 transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>

        <div
          v-if="notif.status === 'unread'"
          class="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-r-full"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconInfoCircle, IconAlertTriangle, IconAlertCircle } from '@tabler/icons-vue';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

defineProps<{
  notifications: any[];
}>();

const emit = defineEmits<{
  markAsRead: [id: string];
  delete: [id: string];
}>();

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
