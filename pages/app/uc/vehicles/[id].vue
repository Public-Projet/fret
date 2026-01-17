<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
    <div class="container-custom py-8">
      <!-- Back Link -->
      <NuxtLink to="/app/uc/vehicles"
        class="inline-flex items-center text-gray-500 hover:text-secondary-600 dark:text-gray-400 dark:hover:text-secondary-400 mb-6 transition-colors">
        <IconArrowLeft class="w-5 h-5 mr-1" />
        Retour à ma flotte
      </NuxtLink>

      <div v-if="loading" class="flex justify-center py-12">
        <IconLoader2 class="w-10 h-10 animate-spin text-secondary-600" />
      </div>

      <div v-else-if="error"
        class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-xl text-center">
        <p class="mb-4">{{ error }}</p>
        <NuxtLink to="/app/uc/vehicles" class="btn btn-outline btn-sm">Retour à la liste</NuxtLink>
      </div>

      <div v-else-if="vehicle" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Info -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div class="flex items-center">
                <div
                  class="w-16 h-16 rounded-2xl bg-secondary-50 dark:bg-secondary-900/20 flex items-center justify-center text-secondary-600 dark:text-secondary-400 mr-5">
                  <IconTruck class="w-8 h-8" />
                </div>
                <div>
                  <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ vehicle.brand }} {{ vehicle.model }}
                  </h1>
                  <p class="text-gray-500 dark:text-gray-400 font-mono mt-1">{{ vehicle.licensePlate }}</p>
                </div>
              </div>
              <div class="flex space-x-3">
                <button @click="openStatusModal" class="btn btn-outline btn-sm">
                  <IconRefresh class="w-4 h-4 mr-2" />
                  Statut
                </button>
                <button @click="openEditModal" class="btn btn-outline btn-sm">
                  <IconPencil class="w-4 h-4 mr-2" />
                  Modifier
                </button>
                <button @click="handleDelete"
                  class="btn btn-outline border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-900/50 dark:hover:bg-red-900/20 btn-sm">
                  <IconTrash class="w-4 h-4 mr-2" />
                  Supprimer
                </button>
              </div>
            </div>

            <div
              class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 border-t border-gray-100 dark:border-gray-700 pt-8">
              <div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Type</h3>
                <p class="text-lg font-medium text-gray-900 dark:text-white capitalize flex items-center">
                  {{ vehicle.type }}
                </p>
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Statut
                </h3>
                <span class="badge" :class="{
                  'badge-success': vehicle.status === 'available',
                  'badge-warning': vehicle.status === 'in_transit',
                  'badge-error': vehicle.status === 'maintenance'
                }">
                  {{ formatStatus(vehicle.status) }}
                </span>
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Capacité
                </h3>
                <p class="text-lg font-medium text-gray-900 dark:text-white">{{ vehicle.capacity || '-' }} Tonnes</p>
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Volume
                </h3>
                <p class="text-lg font-medium text-gray-900 dark:text-white">{{ vehicle.volume || '-' }} m³</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar / History (Placeholder for now) -->
        <div class="space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 class="font-bold text-gray-900 dark:text-white mb-4">Missions récentes</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm">Historique des missions pour ce véhicule.</p>
            <div class="mt-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center text-sm text-gray-500">
              Aucune mission récente
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <ProfileVehicleModal :show="showModal" :vehicle="vehicle" :loading="modalLoading" :error="modalError"
      :success="modalSuccess" @close="closeModal" @submit="handleSubmit" />

    <!-- Status Modal -->
    <VehicleStatusModal :show="showStatusModal" :current-status="vehicle?.status || 'available'"
      :loading="statusLoading" :error="statusError" :success="statusSuccess" @close="showStatusModal = false"
      @submit="handleStatusChange" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProfileStore, type Vehicle, type AddVehicleData } from '~/stores/profile';
import { IconArrowLeft, IconTruck, IconPencil, IconTrash, IconLoader2, IconRefresh } from '@tabler/icons-vue';
import ProfileVehicleModal from '~/components/profile/ProfileVehicleModal.vue';
import VehicleStatusModal from '~/components/profile/VehicleStatusModal.vue';

const route = useRoute();
const router = useRouter();
const profileStore = useProfileStore();

const vehicleId = route.params.id as string;
const vehicle = ref<Vehicle | null>(null);
const loading = ref(true);
const error = ref('');

// Status state
const statusLoading = ref(false);
const showStatusModal = ref(false);
const statusError = ref('');
const statusSuccess = ref('');

// Modal state
const showModal = ref(false);
const modalLoading = ref(false);
const modalError = ref('');
const modalSuccess = ref('');

// ... existing functions

onMounted(async () => {
  await loadVehicle();
});

const loadVehicle = async () => {
  // If loading for the first time
  if (!vehicle.value) loading.value = true;
  error.value = '';

  const result = await profileStore.fetchVehicle(vehicleId);
  if (result.success && result.vehicle) {
    vehicle.value = result.vehicle;
  } else {
    error.value = result.error || 'Impossible de charger le véhicule';
  }
  loading.value = false;
};

const openStatusModal = () => {
  statusError.value = '';
  statusSuccess.value = '';
  showStatusModal.value = true;
};

const handleStatusChange = async (newStatus: string) => {
  if (!vehicle.value) return;

  statusLoading.value = true;
  statusError.value = '';
  statusSuccess.value = '';

  const result = await profileStore.updateVehicleStatus(vehicleId, newStatus as 'available' | 'in_transit' | 'maintenance');

  statusLoading.value = false;

  if (result.success && result.vehicle) {
    vehicle.value = result.vehicle;
    statusSuccess.value = 'Statut mis à jour !';
    await loadVehicle(); // Ensure sync
    setTimeout(() => {
      showStatusModal.value = false;
    }, 1000);
  } else {
    statusError.value = result.error || 'Erreur lors de la mise à jour du statut';
  }
};


const formatStatus = (status: string) => {
  const map: Record<string, string> = {
    available: 'Disponible',
    in_transit: 'En transit',
    maintenance: 'Maintenance'
  };
  return map[status] || status;
};

const openEditModal = () => {
  modalError.value = '';
  modalSuccess.value = '';
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  setTimeout(() => {
    modalError.value = '';
    modalSuccess.value = '';
  }, 300);
};

const handleSubmit = async (data: AddVehicleData) => {
  modalLoading.value = true;
  modalError.value = '';
  modalSuccess.value = '';

  const result = await profileStore.updateVehicle(vehicleId, data);

  modalLoading.value = false;

  if (result.success) {
    modalSuccess.value = result.message || 'Véhicule mis à jour !';
    await loadVehicle(); // Reload to show updates
    setTimeout(() => {
      closeModal();
    }, 1500);
  } else {
    modalError.value = result.error || 'Une erreur est survenue';
  }
};

const handleDelete = async () => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) return;

  const result = await profileStore.deleteVehicle(vehicleId);
  if (result.success) {
    router.push('/app/uc/vehicles');
  } else {
    alert(result.error || 'Erreur lors de la suppression');
  }
};

definePageMeta({ layout: 'default' });
</script>
