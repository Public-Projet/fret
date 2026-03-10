<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
    <div class="container-custom py-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <IconTruck class="w-8 h-8 mr-3 text-secondary-600" />
            Mes Véhicules
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">Gérez votre flotte de véhicules</p>
        </div>
        <button @click="openAddModal" class="btn btn-secondary flex items-center shadow-lg">
          <IconPlus class="w-5 h-5 mr-2" />
          Ajouter un véhicule
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="vehiclesLoading && vehicles.length === 0" class="flex justify-center py-12">
        <IconLoader2 class="w-10 h-10 animate-spin text-secondary-600" />
      </div>

      <!-- Empty State -->
      <div v-else-if="vehicles.length === 0"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
        <div class="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <IconTruck class="w-10 h-10 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Aucun véhicule</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Vous n'avez pas encore ajouté de véhicule à votre flotte. Ajoutez-en un pour commencer à recevoir des offres
          de fret.
        </p>
        <button @click="openAddModal" class="btn btn-secondary">
          Ajouter mon premier véhicule
        </button>
      </div>

      <!-- Vehicles Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="vehicle in vehicles" :key="vehicle.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow group relative">

          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <div
                class="w-12 h-12 rounded-xl bg-secondary-50 dark:bg-secondary-900/20 flex items-center justify-center text-secondary-600 dark:text-secondary-400">
                <IconTruck class="w-6 h-6" />
              </div>
              <div class="flex space-x-2">
                <button @click="openEditModal(vehicle)"
                  class="p-2 text-gray-400 hover:text-secondary-600 dark:hover:text-secondary-400 transition-colors bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-900/30"
                  title="Modifier">
                  <IconPencil class="w-4 h-4" />
                </button>
                <button @click="handleDelete(vehicle.id)"
                  class="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
                  title="Supprimer">
                  <IconTrash class="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">{{ vehicle.brand }} {{ vehicle.model }}
            </h3>
            <p
              class="text-sm font-mono bg-gray-100 dark:bg-gray-700/50 inline-block px-2 py-1 rounded text-gray-600 dark:text-gray-300 mb-4">
              {{ vehicle.licensePlate }}
            </p>

            <div
              class="space-y-3 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4">
              <div class="flex justify-between">
                <span>Type</span>
                <span class="font-medium capitalize">{{ vehicle.type }}</span>
              </div>
              <div class="flex justify-between">
                <span>Capacité</span>
                <span class="font-medium">{{ vehicle.capacity || '-' }} T</span>
              </div>
              <div class="flex justify-between">
                <span>Volume</span>
                <span class="font-medium">{{ vehicle.volume || '-' }} m³</span>
              </div>
              <div class="flex justify-between items-center pt-2">
                <span>Statut</span>
                <span class="badge text-xs" :class="{
                  'badge-success': vehicle.status === 'available',
                  'badge-warning': vehicle.status === 'in_transit',
                  'badge-error': vehicle.status === 'maintenance'
                }">
                  {{ formatStatus(vehicle.status) }}
                </span>
              </div>
            </div>

            <NuxtLink :to="`/app/uc/vehicles/${vehicle.id}`"
              class="mt-6 block w-full text-center py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-sm font-medium">
              Voir détails
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Vehicle Modal -->
    <ModalProfileVehicle :show="showModal" :vehicle="selectedVehicle" :loading="modalLoading" :error="modalError"
      :success="modalSuccess" @close="closeModal" @submit="handleSubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useProfileStore } from '~/stores/profile';
import type { Vehicle, AddVehicleData } from '~/types';
import { IconTruck, IconPlus, IconLoader2, IconPencil, IconTrash } from '@tabler/icons-vue';

const profileStore = useProfileStore();
const vehicles = computed(() => profileStore.vehicles);
const vehiclesLoading = computed(() => profileStore.vehiclesLoading);

const showModal = ref(false);
const selectedVehicle = ref<Vehicle | null>(null);
const modalLoading = ref(false);
const modalError = ref('');
const modalSuccess = ref('');

onMounted(async () => {
  await profileStore.fetchVehicles();
});

const formatStatus = (status: string) => {
  const map: Record<string, string> = {
    available: 'Disponible',
    in_transit: 'En transit',
    maintenance: 'Maintenance'
  };
  return map[status] || status;
};

const openAddModal = () => {
  selectedVehicle.value = null;
  modalError.value = '';
  modalSuccess.value = '';
  showModal.value = true;
};

const openEditModal = (vehicle: Vehicle) => {
  selectedVehicle.value = vehicle;
  modalError.value = '';
  modalSuccess.value = '';
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  setTimeout(() => {
    selectedVehicle.value = null;
    modalError.value = '';
    modalSuccess.value = '';
  }, 300);
};

const handleSubmit = async (data: AddVehicleData) => {
  modalLoading.value = true;
  modalError.value = '';
  modalSuccess.value = '';

  let result;
  if (selectedVehicle.value) {
    result = await profileStore.updateVehicle(selectedVehicle.value.id, data);
  } else {
    result = await profileStore.addVehicle(data);
  }

  modalLoading.value = false;

  if (result.success) {
    modalSuccess.value = result.message || (selectedVehicle.value ? 'Véhicule modifié !' : 'Véhicule ajouté !');
    setTimeout(() => {
      closeModal();
    }, 1500);
  } else {
    modalError.value = result.error || 'Une erreur est survenue';
  }
};

const handleDelete = async (id: string) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) return;
  await profileStore.deleteVehicle(id);
};

definePageMeta({ layout: 'default' });
useHead({
  title: 'Mes Véhicules',
  meta: [
    { name: 'description', content: 'Gérez l\'ensemble de votre flotte de véhicules sur Bourse de Fret.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
