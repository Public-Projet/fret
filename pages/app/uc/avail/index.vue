<template>
  <div class="container-custom py-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Mes disponibilités</h1>
        <p class="text-gray-600 dark:text-gray-400">Gérez vos créneaux et véhicules disponibles</p>
      </div>
      <NuxtLink to="/app/uc/avail/create" class="btn btn-primary mt-4 md:mt-0 flex items-center justify-center">
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
      <NuxtLink to="/app/uc/avail/create" class="btn btn-primary mt-6">
        Publier maintenant
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 gap-4">
      <div v-for="item in availabilities" :key="item.id"
        class="card p-6 flex flex-col md:flex-row justify-between gap-4">
        <div class="flex-1">
          <div class="flex items-center mb-2">
            <h3 class="font-bold text-lg text-gray-900 dark:text-white mr-2">
              {{ item.vehicle?.brand }} {{ item.vehicle?.model }} {{ item.vehicle?.type ? `(${item.vehicle?.type})` : ''
              }}
            </h3>
            <span class="badge" :class="{
              'badge-success': item.status === 'active',
              'badge-warning': item.status === 'full',
              'badge-info': item.status === 'prolonged',
              'badge-error': item.status === 'expired'
            }">{{ getStatusLabel(item.status) }}</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600 dark:text-gray-400">
            <div class="flex items-center">
              <IconCalendar class="w-4 h-4 mr-2" />
              {{ formatDate(item.startDate) }} - {{ formatDate(item.endDate) }}
            </div>
            <div class="flex items-center">
              <IconMapPin class="w-4 h-4 mr-2" />
              {{ item.origin.city }} <span v-if="item.destination?.city">→ {{ item.destination?.city }}</span> <span
                v-else>(Tout trajet)</span>
            </div>
            <div class="flex items-center" v-if="item.vehicle">
              <IconWeight class="w-4 h-4 mr-2" />
              {{ item.vehicle.capacity || '-' }}T / {{ item.vehicle.volume || '-' }}m³
            </div>
            <div class="flex items-center" v-if="item.price">
              <IconCurrencyEuro class="w-4 h-4 mr-2" />
              {{ item.price }} FCFA
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <NuxtLink :to="`/app/uc/avail/${item.id}`" class="btn btn-outline hover:bg-gray-50">
            <IconEye class="w-4 h-4 mr-2" /> Détails
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useAvailabilityStore } from '~/stores/availability';
import { IconCalendar, IconMapPin, IconPlus, IconTruck, IconWeight, IconCurrencyEuro, IconEye } from '@tabler/icons-vue';

const authStore = useAuthStore();
const availabilityStore = useAvailabilityStore();

const availabilities = computed(() => availabilityStore.availabilities);
const loading = computed(() => availabilityStore.loading);

onMounted(() => {
  availabilityStore.fetchAvailabilities();
});

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: 'Actif',
    full: 'Complet',
    expired: 'Expiré',
    prolonged: 'Prolongé'
  };
  return labels[status] || status;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const handleDelete = async (id: string) => {
  if (!confirm('Voulez-vous vraiment supprimer cette disponibilité ?')) return;
  await availabilityStore.deleteAvailability(id);
};
useHead({
  title: 'Mes disponibilités',
  meta: [
    { name: 'description', content: 'Gérez vos véhicules disponibles sur Bourse de Fret.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
