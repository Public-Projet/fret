<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 pb-20 pt-10">
    <div class="container-custom">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center">
            <IconTruck class="w-10 h-10 mr-4 text-secondary-600 drop-shadow-sm" />
            Ma flotte de véhicules
          </h1>
          <p class="text-gray-500 font-medium mt-1 text-sm lg:text-base">
            Gérez et suivez l'état de vos véhicules en temps réel</p>
        </div>
        <button @click="openAddModal"
          class="bg-secondary-600 hover:bg-secondary-700 text-white px-8 py-4 rounded-2xl font-black transition-all hover:shadow-xl hover:shadow-secondary-500/30 flex items-center justify-center group active:scale-95 w-full md:w-auto">
          <IconPlus class="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
          Ajouter un véhicule
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="vehiclesLoading && vehicles.length === 0" class="flex flex-col items-center justify-center py-24">
        <div class="relative w-16 h-16 mb-6">
          <div class="absolute inset-0 border-4 border-secondary-100 dark:border-secondary-900/30 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-secondary-600 rounded-full border-t-transparent animate-spin">
          </div>
        </div>
        <p class="text-gray-500 font-bold">Chargement de votre flotte...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="vehicles.length === 0"
        class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2.5rem] p-16 text-center border-2 border-dashed border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none">
        <div
          class="w-24 h-24 bg-gray-50 dark:bg-gray-700/50 rounded-[2rem] flex items-center justify-center text-gray-300 mx-auto mb-6">
          <IconTruckOff class="w-12 h-12" />
        </div>
        <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">Aucun véhicule enregistré</h3>
        <p class="text-gray-500 mb-10 max-w-sm mx-auto font-medium">
          Vous n'avez pas encore ajouté de véhicule. Ajoutez-en un pour commencer à recevoir des offres de fret et
          publier vos disponibilités.
        </p>
        <button @click="openAddModal"
          class="inline-flex px-10 py-4 bg-secondary-600 hover:bg-secondary-700 text-white rounded-2xl font-black transition-all hover:shadow-xl hover:shadow-secondary-500/30 active:scale-95">
          Ajouter mon premier véhicule
        </button>
      </div>

      <!-- Vehicles Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="vehicle in vehicles" :key="vehicle.id"
          class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none p-8 flex flex-col group hover:border-secondary-200 dark:hover:border-secondary-800 transition-all hover:translate-y-[-4px] hover:shadow-2xl">

          <div class="flex justify-between items-start mb-6">
            <div
              class="p-4 bg-secondary-50 dark:bg-secondary-900/30 rounded-2xl text-secondary-600 shadow-inner group-hover:scale-110 transition-transform">
              <IconTruck class="w-8 h-8" />
            </div>
            <div class="flex space-x-2">
              <button @click="openEditModal(vehicle)"
                class="p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-gray-400 hover:text-secondary-600 hover:bg-secondary-50 dark:hover:bg-secondary-900/30 transition-all"
                title="Modifier">
                <IconPencil class="w-5 h-5" />
              </button>
              <button @click="handleDelete(vehicle.id)"
                class="p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
                title="Supprimer">
                <IconTrash class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div class="flex-1">
            <h3
              class="text-xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-secondary-600 transition-colors">
              {{ vehicle.brand }} {{ vehicle.model }}
            </h3>
            <div
              class="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700 mb-6">
              <span class="text-xs font-black text-gray-500 dark:text-gray-400 font-mono tracking-wider">{{
                vehicle.licensePlate }}</span>
            </div>

            <div class="space-y-4 border-t border-gray-50 dark:border-gray-700/50 pt-6">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Type</span>
                <span class="font-black text-gray-900 dark:text-white capitalize">{{ vehicle.type }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Capacité</span>
                <span class="font-black text-gray-900 dark:text-white">{{ vehicle.capacity || '-' }} <span
                    class="text-[10px] text-gray-400 uppercase">Tonnes</span></span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Statut</span>
                <span
                  :class="['px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm', getStatusClass(vehicle.status)]">
                  {{ formatStatus(vehicle.status) }}
                </span>
              </div>
            </div>
          </div>

          <NuxtLink :to="`/app/uc/vehicles/${vehicle.id}`"
            class="mt-8 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-black rounded-2xl hover:bg-secondary-600 hover:text-white transition-all text-center group-hover:shadow-lg group-hover:shadow-secondary-500/20 active:scale-95">
            Détails du véhicule
          </NuxtLink>
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
import { useCmnProfileStore } from '~/stores/cmnProfile';
import type { Vehicle, AddVehicleData } from '~/types';
import { IconTruck, IconPlus, IconLoader2, IconPencil, IconTrash, IconTruckOff } from '@tabler/icons-vue';

const profileStore = useCmnProfileStore();
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

const getStatusClass = (status: string) => {
  switch (status) {
    case 'available': return 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 border border-emerald-100 dark:border-emerald-800/50';
    case 'in_transit': return 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 border border-amber-100 dark:border-amber-800/50';
    case 'maintenance': return 'bg-red-50 dark:bg-red-900/30 text-red-600 border border-red-100 dark:border-red-800/50';
    default: return 'bg-gray-50 dark:bg-gray-900/30 text-gray-600 border border-gray-100 dark:border-gray-800/50';
  }
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
