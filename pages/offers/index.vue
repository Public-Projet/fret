<template>
  <div class="container-custom py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Trouver du fret</h1>

      <!-- Filtres -->
      <div class="card p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="label">Ville de départ</label>
            <input v-model="filters.originCity" type="text" class="input" placeholder="Ex: Cotonou" />
          </div>
          <div>
            <label class="label">Ville d'arrivée</label>
            <input v-model="filters.destinationCity" type="text" class="input" placeholder="Ex: Abomey" />
          </div>
          <div>
            <label class="label">Type de marchandise</label>
            <select v-model="filters.cargoType" class="input">
              <option value="">Tous</option>
              <option value="palettes">Palettes</option>
              <option value="vrac">Vrac</option>
              <option value="conteneur">Conteneur</option>
              <option value="frigorifique">Frigorifique</option>
              <option value="dangereux">Dangereux</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div>
            <label class="label">Budget min (FCFA)</label>
            <input v-model.number="filters.minBudget" type="number" class="input" placeholder="0" />
          </div>
        </div>
        <div class="flex justify-end mt-4 space-x-2">
          <button @click="resetFilters" class="btn btn-ghost">Réinitialiser</button>
          <button @click="applyFilters" class="btn btn-primary">Rechercher</button>
        </div>
      </div>
    </div>

    <!-- Liste -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="announcements.length === 0" class="text-center py-12">
      <p class="text-lg text-gray-500 dark:text-gray-400">Aucune annonce ne correspond à vos critères.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnnouncementCard v-for="announcement in announcements" :key="announcement.id" :announcement="announcement" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAnnouncementStore } from '~/stores/announcement';
import AnnouncementCard from '~/components/announcement/AnnouncementCard.vue';
import type { AnnouncementFilters } from '~/types';

const announcementStore = useAnnouncementStore();

definePageMeta({
  layout: 'guest'
});

const filters = ref<AnnouncementFilters>({
  originCity: '',
  destinationCity: '',
  cargoType: undefined,
  minBudget: undefined,
});

const loading = computed(() => announcementStore.loading);
const announcements = computed(() => announcementStore.filteredAnnouncements);

const applyFilters = () => {
  announcementStore.setFilters({ ...filters.value });
};

const resetFilters = () => {
  filters.value = {
    originCity: '',
    destinationCity: '',
    cargoType: undefined,
    minBudget: undefined,
  };
  announcementStore.resetFilters();
};

onMounted(() => {
  announcementStore.fetchAnnouncements();
});

useHead({
  title: 'Trouver du fret',
});
</script>
