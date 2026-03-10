<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <div class="mb-8 flex items-center gap-4">
      <NuxtLink to="/app/notifications"
        class="p-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:text-primary-600 transition-colors">
        <IconArrowLeft class="w-5 h-5" />
      </NuxtLink>
      <div>
        <h1 class="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Détails de la Notification</h1>
      </div>
    </div>

    <div v-if="isLoading" class="py-20 flex justify-center">
      <IconLoader2 class="w-10 h-10 text-primary-600 animate-spin" />
    </div>

    <div v-else-if="notification"
      class="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden p-8 scale-in">
      <div class="flex flex-col md:flex-row gap-8">
        <div class="flex-shrink-0">
          <div class="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3"
            :class="getPriorityClass(notification.priority)">
            <IconInfoCircle v-if="notification.priority === 'low' || notification.priority === 'normal'"
              class="w-10 h-10" />
            <IconAlertTriangle v-else-if="notification.priority === 'high'" class="w-10 h-10" />
            <IconAlertCircle v-else class="w-10 h-10" />
          </div>
        </div>

        <div class="flex-1">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h2 class="text-2xl font-black text-gray-900 dark:text-white mb-1">{{ notification.title }}</h2>
              <p class="text-sm font-medium text-gray-400 dark:text-gray-500">{{ formatDate(notification.createdAt) }}
              </p>
            </div>
            <div v-if="notification.status === 'unread'"
              class="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-[10px] font-bold rounded-full uppercase tracking-widest">
              Nouveau
            </div>
          </div>

          <div class="prose dark:prose-invert max-w-none">
            <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {{ notification.content }}
            </p>
          </div>

          <div class="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700/50 flex flex-wrap gap-4">
            <button @click="handleDelete"
              class="px-6 py-3 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-2xl text-sm font-bold hover:bg-red-100 transition-colors flex items-center gap-2">
              <IconTrash class="w-4 h-4" />
              Supprimer cette notification
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="py-20 text-center">
      <div class="w-20 h-20 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
        <IconSearchOff class="w-10 h-10 text-gray-400" />
      </div>
      <h3 class="text-xl font-bold text-gray-900 dark:text-white">Notification introuvable</h3>
      <p class="text-gray-500 dark:text-gray-400 mt-2">Cette notification a peut-être été supprimée ou vous n'y avez pas
        accès.</p>
      <NuxtLink to="/app/notifications" class="mt-8 inline-block text-primary-600 font-bold">Retour aux notifications
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotificationStore } from '~/stores/notification';
import { IconArrowLeft, IconInfoCircle, IconAlertTriangle, IconAlertCircle, IconLoader2, IconTrash, IconSearchOff } from '@tabler/icons-vue';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

definePageMeta({
  layout: 'default'
});

const route = useRoute();
const router = useRouter();
const notificationStore = useNotificationStore();
const id = route.params.id as string;

const notification = computed(() => notificationStore.notifications.find(n => String(n.id) === String(id)));
const isLoading = ref(true);

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'low': return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
    case 'high': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
    case 'urgent': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
    default: return 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400';
  }
};

const formatDate = (timestamp?: number) => {
  if (!timestamp) return '';
  return format(new Date(timestamp), 'dd MMMM yyyy, HH:mm', { locale: fr });
};

const handleDelete = async () => {
  if (confirm('Voulez-vous vraiment supprimer cette notification ?')) {
    await notificationStore.deleteNotification(id);
    router.push('/app/notifications');
  }
};

onMounted(async () => {
  isLoading.value = true;
  // If not found in current list, try to fetch (the get-one marks as read on server)
  await notificationStore.markAsRead(id);
  isLoading.value = false;
});
useHead({
  title: 'Détails de la notification',
  meta: [
    { name: 'description', content: 'Consultez les détails de votre notification sur Bourse de Fret.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>

<style scoped>
.scale-in {
  animation: scaleIn 0.3s ease-out;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
