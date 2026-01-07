<template>
  <div class="container-custom py-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Tableau de bord Chargeur</h1>
        <p class="text-gray-600 dark:text-gray-400">Gérez vos expéditions et suivez vos annonces</p>
      </div>
      <NuxtLink to="/offers/create" class="btn btn-primary mt-4 md:mt-0 flex items-center justify-center">
        <IconPlus class="w-5 h-5 mr-2" />
        Créer une annonce
      </NuxtLink>
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

    <!-- Filtres et Liste -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div
        class="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Mes annonces</h2>
        <div class="flex space-x-2 overflow-x-auto pb-2 sm:pb-0">
          <button v-for="status in ['all', 'pending', 'negotiating', 'accepted', 'completed', 'cancelled']"
            :key="status" @click="currentFilter = status" :class="[
              'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              currentFilter === status
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
            ]">
            {{ getStatusLabel(status) }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="p-12 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      </div>

      <div v-else-if="filteredAnnouncements.length === 0" class="p-12 text-center">
        <div class="mx-auto h-12 w-12 text-gray-400 mb-4">
          <IconFileText />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Aucune annonce trouvée</h3>
        <p class="mt-1 text-gray-500 dark:text-gray-400">Commencez par créer votre première annonce de transport.</p>
        <div class="mt-6">
          <NuxtLink to="/offers/create" class="btn btn-primary">
            Créer une annonce
          </NuxtLink>
        </div>
      </div>

      <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <div v-for="announcement in filteredAnnouncements" :key="announcement.id"
          class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center justify-between md:justify-start md:space-x-4 mb-2">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  <NuxtLink :to="`/offers/${announcement.id}`" class="hover:text-primary-600">
                    {{ announcement.title }}
                  </NuxtLink>
                </h3>
                <span :class="getStatusClass(announcement.status)">
                  {{ getStatusLabel(announcement.status) }}
                </span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-400">
                <div class="flex items-center space-x-2">
                  <IconMapPin class="w-4 h-4" />
                  <span>{{ announcement.origin.city }} → {{ announcement.destination.city }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <IconCalendar class="w-4 h-4" />
                  <span>{{ formatDate(announcement.pickupDate) }}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between md:justify-end space-x-4">
              <div class="text-right">
                <p class="text-sm text-gray-500 dark:text-gray-400">Budget</p>
                <p class="text-lg font-bold text-gray-900 dark:text-white">{{ announcement.budget }}FCFA</p>
              </div>
              <div class="flex space-x-2">
                <NuxtLink :to="`/offers/${announcement.id}`" class="btn btn-ghost p-2" title="Voir détails">
                  <IconEye class="w-5 h-5" />
                </NuxtLink>
                <button v-if="announcement.status === 'pending'" @click="handleEdit(announcement)"
                  class="btn btn-ghost p-2 text-blue-600 hover:bg-blue-50" title="Modifier">
                  <IconPencil class="w-5 h-5" />
                </button>
                <button v-if="announcement.status === 'pending'" @click="handleDelete(announcement.id)"
                  class="btn btn-ghost p-2 text-red-600 hover:bg-red-50" title="Annuler">
                  <IconTrash class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <EditAnnouncementModal v-if="showEditModal" :announcement="announcementToEdit" @close="showEditModal = false"
      @update="handleUpdate" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useAnnouncementStore } from '~/stores/announcement';
import type { Announcement } from '~/types';
import EditAnnouncementModal from '~/components/dashboard/EditAnnouncementModal.vue';
import { IconCalendar, IconCircleCheck, IconCurrencyEuro, IconEye, IconFileText, IconMapPin, IconMessage, IconPencil, IconPlus, IconTrash } from '@tabler/icons-vue';

const authStore = useAuthStore();
const announcementStore = useAnnouncementStore();
const currentFilter = ref('all');
const showEditModal = ref(false);
const announcementToEdit = ref<Announcement | null>(null);

const loading = computed(() => announcementStore.loading);
const currentUser = computed(() => authStore.currentUser);

const myAnnouncements = computed(() => {
  if (!currentUser.value) return [];
  return announcementStore.userAnnouncements(currentUser.value.id);
});

const filteredAnnouncements = computed(() => {
  if (currentFilter.value === 'all') return myAnnouncements.value;
  return myAnnouncements.value.filter(a => a.status === currentFilter.value);
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

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    all: 'Tous',
    pending: 'En attente',
    negotiating: 'En négociation',
    accepted: 'Accepté',
    completed: 'Terminé',
    cancelled: 'Annulé'
  };
  return labels[status] || status;
};

const getStatusClass = (status: string) => {
  const baseClass = 'badge';
  switch (status) {
    case 'pending': return `${baseClass} badge-info`;
    case 'negotiating': return `${baseClass} badge-warning`;
    case 'accepted': return `${baseClass} badge-success`;
    case 'completed': return `${baseClass} badge-neutral`;
    case 'cancelled': return `${baseClass} badge-danger`;
    default: return `${baseClass} badge-neutral`;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const handleEdit = (announcement: Announcement) => {
  announcementToEdit.value = announcement;
  showEditModal.value = true;
};

const handleDelete = async (id: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
    await announcementStore.deleteAnnouncement(id);
  }
};

const handleUpdate = async (updatedData: Partial<Announcement>) => {
  if (announcementToEdit.value) {
    await announcementStore.updateAnnouncement(announcementToEdit.value.id, updatedData);
    showEditModal.value = false;
    announcementToEdit.value = null;
  }
};

onMounted(() => {
  announcementStore.fetchAnnouncements();
});
</script>
