<template>
  <div class="container-custom py-8">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Bienvenue, {{ currentUser?.firstName }}
    </h1>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div v-for="stat in stats" :key="stat.label" class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-1">{{ stat.value }}</p>
          </div>
          <div :class="`p-3 rounded-full ${stat.colorClass}`">
            <component :is="stat.icon" class="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions rapides</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <NuxtLink v-for="action in quickActions" :key="action.label" :to="action.to"
        class="card p-6 hover:shadow-md transition-shadow cursor-pointer group">
        <div class="flex items-center space-x-4">
          <div
            class="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
            <component :is="action.icon" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">{{ action.label }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ action.description }}</p>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useAnnouncementStore } from '~/stores/announcement';
import { IconCurrencyEuro, IconFileText, IconMessage, IconPlus, IconTruck } from '@tabler/icons-vue';

const authStore = useAuthStore();
const announcementStore = useAnnouncementStore();

const currentUser = computed(() => authStore.currentUser);
const isShipper = computed(() => authStore.isShipper);

// Mock stats - in real app would come from store/API
const stats = computed(() => {
  if (isShipper.value) {
    return [
      { label: 'Annonces actives', value: '12', icon: IconFileText, colorClass: 'bg-blue-100 text-blue-600' },
      { label: 'En cours', value: '3', icon: IconTruck, colorClass: 'bg-green-100 text-green-600' },
      { label: 'Dépenses ce mois', value: '2.4kFCFA', icon: IconCurrencyEuro, colorClass: 'bg-purple-100 text-purple-600' },
    ];
  } else {
    return [
      { label: 'Trajets disponibles', value: '45', icon: IconFileText, colorClass: 'bg-blue-100 text-blue-600' },
      { label: 'Mes trajets', value: '5', icon: IconTruck, colorClass: 'bg-green-100 text-green-600' },
      { label: 'Revenus ce mois', value: '3.8kFCFA', icon: IconCurrencyEuro, colorClass: 'bg-purple-100 text-purple-600' },
    ];
  }
});

const quickActions = computed(() => {
  if (isShipper.value) {
    return [
      { label: 'Nouvelle annonce', description: 'Publier une demande de transport', icon: IconPlus, to: '/offers/create' },
      { label: 'Mes annonces', description: 'Gérer vos expéditions', icon: IconFileText, to: '/app' },
      { label: 'Messages', description: 'Voir vos conversations', icon: IconMessage, to: '/app/messages' },
    ];
  } else {
    return [
      { label: 'Trouver du fret', description: 'Parcourir les annonces disponibles', icon: IconPlus, to: '/offers' },
      { label: 'Mes trajets', description: 'Gérer vos transports en cours', icon: IconTruck, to: '/app/uc' },
      { label: 'Messages', description: 'Voir vos conversations', icon: IconMessage, to: '/app/messages' },
    ];
  }
});
</script>
