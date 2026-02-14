<template>
  <div class="container-custom py-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Bienvenue, {{ currentUser?.firstName }}</h1>
        <p class="text-gray-600 dark:text-gray-400">Tableau de bord Chargeur</p>
      </div>
      <div class="flex space-x-4 mt-4 md:mt-0">
        <NuxtLink to="/app/us/offers" class="btn btn-outline flex items-center justify-center">
          <IconList class="w-5 h-5 mr-2" />
          Mes annonces
        </NuxtLink>
        <NuxtLink to="/app/us/offers/create" class="btn btn-primary flex items-center justify-center">
          <IconPlus class="w-5 h-5 mr-2" />
          Créer une annonce
        </NuxtLink>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="card p-6 flex items-center space-x-4">
        <div class="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          <IconFileText class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Annonces actives</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ activeAnnouncementsCount }}</p>
        </div>
      </div>
      <div class="card p-6 flex items-center space-x-4">
        <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
          <IconMessage class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">En négociation</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ negotiatingCount }}</p>
        </div>
      </div>
      <div class="card p-6 flex items-center space-x-4">
        <div class="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
          <IconCircleCheck class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Terminées</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ completedCount }}</p>
        </div>
      </div>
      <div class="card p-6 flex items-center space-x-4">
        <div class="p-3 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
          <IconCurrencyEuro class="w-6 h-6" />
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Budget total</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalBudget }}FCFA</p>
        </div>
      </div>
    </div>

    <!-- Recent Activity / Quick View (Optional, but good for a dashboard) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activité récente</h2>
        <div v-if="recentAnnouncements.length === 0" class="text-gray-500 text-center py-4">
          Aucune activité récente.
        </div>
        <div v-else class="space-y-4">
          <div v-for="announcement in recentAnnouncements" :key="announcement.id"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ announcement.title }}</p>
              <p class="text-xs text-gray-500">{{ formatDate(announcement.createdAt) }}</p>
            </div>
            <NuxtLink :to="`/annonces/${announcement.id}?type=offer`" class="text-primary-600 text-sm font-medium">Voir
            </NuxtLink>
          </div>
          <NuxtLink to="/annonces?tab=fret" class="block text-center text-primary-600 text-sm mt-4 hover:underline">
            Voir toutes mes annonces</NuxtLink>
        </div>
      </div>

      <!-- Placeholder for Notifications or other widgets -->
      <div class="card p-6 flex flex-col items-center justify-center text-center">
        <IconRocket class="w-12 h-12 text-primary-200 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Boostez vos expéditions</h3>
        <p class="text-gray-500 dark:text-gray-400 mt-2">Créez une nouvelle annonce pour trouver rapidement un
          transporteur.</p>
        <NuxtLink to="/app/us/offers/create" class="btn btn-primary mt-4">Nouvelle annonce</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useAnnouncementStore } from '~/stores/announcement';
import { IconCircleCheck, IconCurrencyEuro, IconFileText, IconMessage, IconPlus, IconList, IconRocket } from '@tabler/icons-vue';

const authStore = useAuthStore();
const announcementStore = useAnnouncementStore();

const loading = computed(() => announcementStore.loading);
const currentUser = computed(() => authStore.currentUser);

const myAnnouncements = computed(() => {
  if (!currentUser.value) return [];
  return announcementStore.userAnnouncements(currentUser.value.id);
});

// Stats
const activeAnnouncementsCount = computed(() =>
  myAnnouncements.value.filter(a => ['pending', 'negotiating'].includes(a.status)).length
);

const negotiatingCount = computed(() =>
  myAnnouncements.value.filter(a => a.status === 'negotiating').length
);

const completedCount = computed(() =>
  myAnnouncements.value.filter(a => a.status === 'completed').length
);

const totalBudget = computed(() =>
  myAnnouncements.value.reduce((sum, a) => sum + a.budget, 0)
);

const recentAnnouncements = computed(() => {
  return [...myAnnouncements.value]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  });
};

onMounted(() => {
  announcementStore.fetchMyAnnouncements();
});
</script>
