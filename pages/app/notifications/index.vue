<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <RootAppNotifHomeHeader />
    <RootAppNotifHomeList />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCmnNotificationStore } from '~/stores/cmnNotification';

definePageMeta({
  layout: 'default'
});

const notificationStore = useCmnNotificationStore();

onMounted(() => {
  notificationStore.fetchUserNotifications(1);
});

useHead({
  title: 'Notifications',
  meta: [
    { name: 'description', content: 'Consultez toutes vos notifications sur Bourse de Fret.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
