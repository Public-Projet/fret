<template>
  <div class="container-custom py-8 min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
      <div>
        <h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Mes annonces</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Gérez et suivez vos demandes de transport en temps réel</p>
      </div>
      <NuxtLink to="/app/us/offers/create"
        class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-2xl font-bold transition-all hover:shadow-lg hover:shadow-primary-500/25 flex items-center justify-center group active:scale-95">
        <IconPlus class="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
        Créer une annonce
      </NuxtLink>
    </div>

    <!-- Filtres et Liste -->
    <div
      class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-white dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-100 dark:border-gray-700">
        <div class="flex space-x-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
          <button v-for="status in ['all', 'pending', 'negotiating', 'accepted', 'completed', 'cancelled']"
            :key="status" @click="currentFilter = status" :class="[
              'px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300',
              currentFilter === status
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50'
            ]">
            {{ getStatusLabel(status) }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="p-20 text-center">
        <div class="relative w-16 h-16 mx-auto">
          <div class="absolute inset-0 border-4 border-primary-100 dark:border-primary-900/30 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin">
          </div>
        </div>
        <p class="mt-4 text-gray-500 font-medium">Chargement de vos annonces...</p>
      </div>

      <div v-else-if="filteredAnnouncements.length === 0" class="p-20 text-center">
        <div
          class="mx-auto h-20 w-20 bg-gray-50 dark:bg-gray-700/50 rounded-3xl flex items-center justify-center text-gray-300 mb-6">
          <IconFileText class="w-10 h-10" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Aucune annonce trouvée</h3>
        <p class="mt-2 text-gray-500 dark:text-gray-400 max-w-sm mx-auto">Vous n'avez pas encore d'annonces
          correspondant à ce filtre.</p>
        <div v-if="currentFilter === 'all'" class="mt-8 px-4">
          <NuxtLink to="/app/us/offers/create"
            class="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black transition-all hover:shadow-xl hover:shadow-primary-500/30 active:scale-95 inline-flex items-center justify-center w-full sm:w-auto">
            Créer ma première annonce
          </NuxtLink>
        </div>
      </div>

      <div v-else class="divide-y divide-gray-100 dark:divide-gray-700">
        <div v-for="announcement in filteredAnnouncements" :key="announcement.id"
          class="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-all group">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-3 mb-3">
                <span :class="getStatusClass(announcement.status)">
                  {{ getStatusLabel(announcement.status) }}
                </span>
                <span class="text-xs font-medium text-gray-400 tabular-nums">ID: #{{ String(announcement.id ||
                  '').slice(0, 8) }}</span>
              </div>

              <h3
                class="text-xl font-black text-gray-900 dark:text-white mb-4 group-hover:text-primary-600 transition-colors">
                <NuxtLink :to="`/app/us/offers/${announcement.id}`">
                  {{ announcement.title }}
                </NuxtLink>
              </h3>

              <div class="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div
                  class="flex items-center bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
                  <IconMapPin class="w-4 h-4 mr-2 text-primary-500" />
                  <span class="font-bold text-gray-700 dark:text-gray-300 truncate">{{ announcement.origin.city
                  }}</span>
                  <IconArrowRight class="w-3 h-3 mx-2" />
                  <span class="font-bold text-gray-700 dark:text-gray-300 truncate">{{ announcement.destination.city
                  }}</span>
                </div>
                <div class="flex items-center px-1">
                  <IconCalendar class="w-4 h-4 mr-2 text-primary-500" />
                  <span>Enlèvement le <span class="font-bold text-gray-700 dark:text-gray-300">{{
                    formatDate(announcement.pickupDate) }}</span></span>
                </div>

                <!-- View Stats -->
                <div
                  class="flex items-center gap-3 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div class="flex items-center text-xs text-gray-600 dark:text-gray-400" title="Vues totales">
                    <IconEye class="w-4 h-4 mr-1.5 text-primary-500/70" />
                    <span class="font-bold">{{ announcement.views || 0 }}</span>
                  </div>
                  <div class="w-px h-3 bg-gray-300 dark:bg-gray-600"></div>
                  <div class="flex items-center text-xs text-gray-600 dark:text-gray-400"
                    title="Vues uniques (visiteurs différents)">
                    <IconUsers class="w-4 h-4 mr-1.5 text-primary-500/70" />
                    <span class="font-bold">{{ announcement.uniqueViews || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="flex items-center justify-between lg:flex-col lg:items-end lg:justify-center gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100 dark:border-gray-700">
              <div class="text-left lg:text-right">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Budget total</p>
                <p class="text-2xl font-black text-primary-600 leading-none">
                  {{ announcement.budget.toLocaleString() }} <span class="text-sm font-bold">FCFA</span>
                </p>
              </div>

              <div class="flex items-center gap-2">
                <NuxtLink :to="`/app/us/offers/${announcement.id}`"
                  class="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-primary-600 hover:text-white transition-all active:scale-90"
                  title="Voir détails">
                  <IconEye class="w-5 h-5" />
                </NuxtLink>
                <button v-if="announcement.status === 'pending'" @click="handleEdit(announcement)"
                  class="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                  title="Modifier">
                  <IconPencil class="w-5 h-5" />
                </button>
                <button v-if="announcement.status === 'pending'" @click="handleDelete(announcement.id)"
                  class="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-600 hover:text-white transition-all active:scale-90"
                  title="Supprimer">
                  <IconTrash class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ModalDashboardEditAnnounce v-if="showEditModal" :announcement="announcementToEdit" @close="showEditModal = false"
      @update="handleUpdate" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import { useShpAnnouncementStore } from '~/stores/shpAnnouncement';
import type { Announcement } from '~/types';
import { IconCalendar, IconFileText, IconMapPin, IconPencil, IconPlus, IconTrash, IconEye, IconUsers } from '@tabler/icons-vue';

const authStore = useCmnAuthStore();
const announcementStore = useShpAnnouncementStore();
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
    await announcementStore.deleteShpAnnouncement(id);
  }
};

const handleUpdate = async (updatedData: Partial<Announcement>) => {
  if (announcementToEdit.value) {
    await announcementStore.updateShpAnnouncement(announcementToEdit.value.id, updatedData);
    showEditModal.value = false;
    announcementToEdit.value = null;
  }
};

onMounted(() => {
  announcementStore.fetchShpAnnouncements();
});
useHead({
  title: 'Mes annonces de fret',
  meta: [
    { name: 'description', content: 'Gérez l\'ensemble de vos offres de fret sur Bourse de Fret.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
