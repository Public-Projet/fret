<template>
  <div>
    <!-- Chargement -->
    <RootAppNotifDetailLoader v-if="isLoading" />

    <!-- Contenu de la notification -->
    <RootAppNotifDetailContent
      v-else-if="notification"
      :notification="notification"
    />

    <!-- Notification introuvable -->
    <RootAppNotifDetailNotFound v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCmnNotificationStore } from '~/stores/cmnNotification';

const route = useRoute();
const notificationStore = useCmnNotificationStore();
const id = route.params.id as string;

const isLoading = ref(true);
const notification = computed(() =>
  notificationStore.notifications.find(n => String(n.id) === String(id))
);

onMounted(async () => {
  isLoading.value = true;
  await notificationStore.getOneUserNotification(id);
  isLoading.value = false;
});
</script>
