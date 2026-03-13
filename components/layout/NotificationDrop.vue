<template>
  <div class="relative" ref="dropdownRef">
    <button @click="toggleDropdown"
      class="flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50 transition-colors relative">
      <IconBell class="w-5 h-5" />
      <span v-if="unreadCount > 0"
        class="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown Menu -->
    <Transition enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95 translate-y-2"
      enter-to-class="transform opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="transform opacity-100 scale-100 translate-y-0"
      leave-to-class="transform opacity-0 scale-95 translate-y-2">
      <div v-if="isOpen"
        class="fixed inset-x-4 top-20 sm:top-auto sm:absolute sm:right-0 sm:mt-2 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 origin-top sm:origin-top-right overflow-hidden z-50">
        <div
          class="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h3 class="text-sm font-bold text-gray-900 dark:text-white">Notifications</h3>
          <button v-if="unreadCount > 0" @click="markAllRead"
            class="text-xs text-primary-600 hover:text-primary-700 font-medium">
            Tout marquer comme lu
          </button>
        </div>

        <div class="max-h-[400px] overflow-y-auto">
          <div v-if="notifications.length === 0"
            class="py-12 flex flex-col items-center justify-center text-center px-4">
            <div class="w-12 h-12 bg-gray-100 dark:bg-gray-700/50 rounded-full flex items-center justify-center mb-3">
              <IconBellOff class="w-6 h-6 text-gray-400" />
            </div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">Aucune notification</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Vous êtes à jour !</p>
          </div>

          <div v-else class="divide-y divide-gray-100 dark:divide-gray-700/50">
            <div v-for="notif in notifications" :key="notif.id" @click="handleNotificationClick(notif)"
              class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer relative group"
              :class="{ 'bg-primary-50/30 dark:bg-primary-900/10': notif.status === 'unread' }">
              <div class="flex gap-3">
                <div class="flex-shrink-0 mt-1">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center"
                    :class="getPriorityClass(notif.priority)">
                    <IconInfoCircle v-if="notif.priority === 'low' || notif.priority === 'normal'" class="w-4 h-4" />
                    <IconAlertTriangle v-else-if="notif.priority === 'high'" class="w-4 h-4" />
                    <IconAlertCircle v-else class="w-4 h-4" />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start">
                    <p class="text-sm font-semibold text-gray-900 dark:text-white truncate"
                      :class="{ 'font-bold': notif.status === 'unread' }">
                      {{ notif.title }}
                    </p>
                    <span class="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap ml-2">
                      {{ formatTime(notif.createdAt) }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">
                    {{ notif.content }}
                  </p>
                </div>
                <div v-if="notif.status === 'unread'" class="flex-shrink-0 self-center">
                  <div class="w-2 h-2 bg-primary-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="px-4 py-2 border-t border-gray-100 dark:border-gray-700/50 text-center bg-gray-50/50 dark:bg-gray-800/50">
          <NuxtLink to="/app/notifications" @click="isOpen = false"
            class="text-xs font-semibold text-primary-600 hover:text-primary-700">
            Voir toutes les notifications
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useNotificationStore } from '~/stores/notification';
import { IconBell, IconBellOff, IconInfoCircle, IconAlertTriangle, IconAlertCircle } from '@tabler/icons-vue';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const notificationStore = useNotificationStore();
const router = useRouter();
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const notifications = computed(() => notificationStore.notifications.slice(0, 5));
const unreadCount = computed(() => notificationStore.unreadCount);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    notificationStore.fetchNotifications();
  }
};

const markAllRead = () => {
  notificationStore.markAllAsRead();
};

const handleNotificationClick = (notif: any) => {
  if (notif.status === 'unread') {
    notificationStore.markAsRead(notif.id);
  }
  isOpen.value = false;
  router.push(`/app/notifications/${notif.id}`);
};

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'low': return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
    case 'high': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
    case 'urgent': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
    default: return 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400';
  }
};

const formatTime = (timestamp: number) => {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: fr });
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  // Initial count fetch or interval
  notificationStore.fetchNotifications();
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
