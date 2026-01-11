<template>
  <div class="container-custom py-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Mes disponibilités</h1>
        <p class="text-gray-600 dark:text-gray-400">Gérez vos créneaux et véhicules disponibles</p>
      </div>
      <NuxtLink to="/app/uc/availability/create" class="btn btn-primary mt-4 md:mt-0 flex items-center justify-center">
        <IconPlus class="w-5 h-5 mr-2" />
        Publier une disponibilité
      </NuxtLink>
    </div>

    <!-- Filtres (Simples pour l'instant) -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="availabilities.length === 0" class="card p-12 text-center">
      <IconTruck class="w-16 h-16 mx-auto text-gray-300 mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Aucune disponibilité publiée</h3>
      <p class="text-gray-500 dark:text-gray-400 mt-2">Publiez vos trajets pour être visible des chargeurs.</p>
      <NuxtLink to="/app/uc/availability/create" class="btn btn-primary mt-6">
        Publier maintenant
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 gap-4">
      <div v-for="item in availabilities" :key="item.id"
        class="card p-6 flex flex-col md:flex-row justify-between gap-4">
        <div class="flex-1">
          <div class="flex items-center mb-2">
            <h3 class="font-bold text-lg text-gray-900 dark:text-white mr-2">{{ item.vehicleType }}</h3>
            <span class="badge badge-success">Actif</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600 dark:text-gray-400">
            <div class="flex items-center">
              <IconCalendar class="w-4 h-4 mr-2" />
              {{ formatDate(item.availableFrom) }} - {{ formatDate(item.availableTo) }}
            </div>
            <div class="flex items-center">
              <IconMapPin class="w-4 h-4 mr-2" />
              {{ item.origin.city }} <span v-if="item.destination?.city">→ {{ item.destination?.city }}</span> <span
                v-else>(Tout trajet)</span>
            </div>
            <div class="flex items-center">
              <IconWeight class="w-4 h-4 mr-2" />
              {{ item.capacity }}kg / {{ item.volumeCapacity }}m³
            </div>
            <div class="flex items-center">
              <IconCurrencyEuro class="w-4 h-4 mr-2" />
              {{ item.pricePerKm }} FCFA/km
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button class="btn btn-outline text-red-600 hover:bg-red-50 border-red-200">Supprimer</button>
          <button class="btn btn-outline">Modifier</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
// import { useAvailabilityStore } from '~/stores/availability'; // To be created
import { IconCalendar, IconMapPin, IconPlus, IconTruck, IconWeight, IconCurrencyEuro } from '@tabler/icons-vue';
import { mockAvailabilities } from '~/data/mock'; // Fallback for now

const authStore = useAuthStore();
const currentUser = computed(() => authStore.currentUser);
const loading = ref(false);

const availabilities = computed(() => {
  // Temporary Mock Logic until Store is ready
  if (!currentUser.value) return [];
  // Return mock items that match carrier ID, or just all for demo if current user has no logic yet in mock
  return mockAvailabilities.filter(a => a.carrierId === currentUser.value?.id || a.carrierId === '4' || a.carrierId === '2');
  // Just showing some data for the 'connected' user if they happen to be ID 2 or 4 or 5
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  });
};

onMounted(() => {
  // Fetch availabilities
});
</script>
