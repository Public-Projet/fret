<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 pb-20 pt-10">
    <div class="container-custom">
      <!-- Back Link -->
      <NuxtLink to="/app/uc/vehicles"
        class="inline-flex items-center text-gray-400 hover:text-secondary-600 font-bold mb-8 transition-all group">
        <div class="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mr-3 group-hover:bg-secondary-50 dark:group-hover:bg-secondary-900/30 transition-colors">
          <IconArrowLeft class="w-5 h-5" />
        </div>
        Retour à ma flotte
      </NuxtLink>

      <div v-if="loading" class="flex flex-col items-center justify-center py-24">
        <div class="relative w-16 h-16 mb-6">
          <div class="absolute inset-0 border-4 border-secondary-100 dark:border-secondary-900/30 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-secondary-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p class="text-gray-500 font-bold">Chargement du véhicule...</p>
      </div>

      <div v-else-if="error"
        class="bg-red-50/80 dark:bg-red-900/20 backdrop-blur-xl border border-red-100 dark:border-red-800/50 p-12 rounded-[2.5rem] text-center max-w-2xl mx-auto shadow-xl">
        <div class="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-[1.5rem] flex items-center justify-center text-red-600 mx-auto mb-6">
          <IconAlertCircle class="w-10 h-10" />
        </div>
        <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-2">Une erreur est survenue</h3>
        <p class="text-red-600/70 font-medium mb-10">{{ error }}</p>
        <NuxtLink to="/app/uc/vehicles" class="inline-flex px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-500/20">
          Retour à la liste
        </NuxtLink>
      </div>

      <div v-else-if="vehicle" class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <!-- Main Info -->
        <div class="lg:col-span-2 space-y-8">
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-gray-700 p-8 lg:p-12 shadow-xl shadow-gray-200/50 dark:shadow-none">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
              <div class="flex items-center">
                <div
                  class="w-20 h-20 rounded-[1.5rem] bg-secondary-50 dark:bg-secondary-900/30 flex items-center justify-center text-secondary-600 shadow-inner mr-6">
                  <IconTruck class="w-10 h-10" />
                </div>
                <div>
                  <h1 class="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tight">{{ vehicle.brand }} {{ vehicle.model }}</h1>
                  <div class="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700 mt-2">
                    <span class="text-xs font-black text-gray-500 dark:text-gray-400 font-mono tracking-wider">{{ vehicle.licensePlate }}</span>
                  </div>
                </div>
              </div>
              <div class="flex flex-wrap gap-3 w-full md:w-auto">
                <button @click="openStatusModal" class="flex-1 md:flex-none px-5 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-all active:scale-95 flex items-center justify-center">
                  <IconRefresh class="w-4 h-4 mr-2" /> Statut
                </button>
                <button @click="openEditModal" class="flex-1 md:flex-none px-5 py-3 rounded-xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 active:scale-95 flex items-center justify-center">
                  <IconPencil class="w-4 h-4 mr-2" /> Modifier
                </button>
                <button @click="handleDelete"
                  class="flex-1 md:flex-none px-5 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 font-bold text-sm hover:bg-red-600 hover:text-white transition-all active:scale-95 flex items-center justify-center">
                  <IconTrash class="w-4 h-4 mr-2" /> Supprimer
                </button>
              </div>
            </div>

            <div
              class="grid grid-cols-1 sm:grid-cols-2 gap-10 border-t border-gray-50 dark:border-gray-700/50 pt-10">
              <div class="group">
                <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Type de véhicule</h3>
                <div class="flex items-center p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-800 group-hover:border-secondary-200 transition-all">
                  <IconTruck class="w-6 h-6 text-secondary-500 mr-4" />
                  <span class="text-lg font-black text-gray-900 dark:text-white capitalize">{{ vehicle.type }}</span>
                </div>
              </div>

              <div class="group">
                <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Statut opérationnel</h3>
                <div :class="['flex items-center p-4 rounded-2xl border transition-all', getStatusClass(vehicle.status)]">
                  <IconSettings class="w-6 h-6 mr-4" />
                  <span class="text-lg font-black tracking-tight">{{ formatStatus(vehicle.status) }}</span>
                </div>
              </div>

              <div class="group">
                <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Capacité de charge</h3>
                <div class="flex items-center p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-800 group-hover:border-secondary-200 transition-all">
                  <IconWeight class="w-6 h-6 text-secondary-500 mr-4" />
                  <span class="text-lg font-black text-gray-900 dark:text-white">{{ vehicle.capacity || '-' }} <span class="text-xs text-gray-400 uppercase ml-1">Tonnes</span></span>
                </div>
              </div>

              <div class="group">
                <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Volume utile</h3>
                <div class="flex items-center p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-800 group-hover:border-secondary-200 transition-all">
                  <IconPackage class="w-6 h-6 text-secondary-500 mr-4" />
                  <span class="text-lg font-black text-gray-900 dark:text-white">{{ vehicle.volume || '-' }} <span class="text-xs text-gray-400 uppercase ml-1">m³</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar / Availability & History -->
        <div class="space-y-8">
          <!-- Active Availability -->
          <div v-if="vehicle.availability"
            class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-gray-700 p-8 shadow-xl shadow-gray-200/50 dark:shadow-none relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -mr-16 -mt-16"></div>
            
            <div class="flex items-center justify-between mb-8 relative">
              <h3 class="font-black text-gray-900 dark:text-white tracking-tight">Disponibilité actuelle</h3>
              <span class="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 text-[10px] font-black uppercase tracking-wider border border-emerald-100 dark:border-emerald-800/50 shadow-sm">Active</span>
            </div>

            <div class="space-y-8 relative">
              <!-- Route -->
              <div class="flex items-start space-x-4">
                <div class="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600 shadow-inner">
                  <IconMapPin class="w-6 h-6" />
                </div>
                <div>
                  <p class="text-[10px] text-gray-400 uppercase tracking-widest font-black">Itinéraire</p>
                  <p class="text-lg font-black text-gray-900 dark:text-white mt-1 leading-tight">
                    {{ vehicle.availability.origin.city }}
                    <IconArrowRight class="w-4 h-4 text-primary-500 inline-block mx-1" />
                    <span class="text-primary-600">{{ vehicle.availability.destination?.city || 'Partout' }}</span>
                  </p>
                </div>
              </div>

              <!-- Dates -->
              <div class="flex items-start space-x-4">
                <div class="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-2xl text-purple-600 shadow-inner">
                  <IconCalendar class="w-6 h-6" />
                </div>
                <div>
                  <p class="text-[10px] text-gray-400 uppercase tracking-widest font-black">Période</p>
                  <p class="text-sm font-bold text-gray-900 dark:text-white mt-1">
                    Du {{ formatDateShort(vehicle.availability.startDate) }} au {{ formatDateShort(vehicle.availability.endDate) }}
                  </p>
                </div>
              </div>

              <!-- Price -->
              <div class="flex items-start space-x-4">
                <div class="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl text-emerald-600 shadow-inner">
                  <IconCurrencyEuro class="w-6 h-6" />
                </div>
                <div>
                  <p class="text-[10px] text-gray-400 uppercase tracking-widest font-black">Tarif estimé</p>
                  <p class="text-2xl font-black text-emerald-600 mt-1">
                    {{ vehicle.availability.price?.toLocaleString() || 'Sur devis' }} <span v-if="vehicle.availability.price" class="text-sm font-bold ml-1">FCFA</span>
                  </p>
                </div>
              </div>
            </div>

            <div class="mt-10 pt-8 border-t border-gray-50 dark:border-gray-700/50 relative">
              <NuxtLink :to="`/app/uc/avail/${vehicle.availability.id}`" 
                class="block w-full py-4 bg-gray-100 dark:bg-gray-700/50 hover:bg-secondary-600 hover:text-white text-gray-700 dark:text-gray-300 font-black rounded-2xl transition-all text-center active:scale-95">
                Gérer la disponibilité
              </NuxtLink>
            </div>
          </div>

          <!-- History -->
          <div v-if="vehicle.history && vehicle.history.length > 0"
            class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-gray-700 p-8 shadow-xl shadow-gray-200/50 dark:shadow-none">
            <h3 class="font-black text-gray-400 uppercase tracking-widest text-[10px] mb-6">Disponibilités passées</h3>
            <div class="space-y-6">
              <div v-for="item in vehicle.history" :key="item.id"
                class="flex flex-col border-b border-gray-50 dark:border-gray-700/50 pb-4 last:border-0 last:pb-0 hover:translate-x-1 transition-transform cursor-default">
                <div class="flex justify-between items-center mb-1">
                  <p class="text-sm font-black text-gray-900 dark:text-white">
                    {{ item.origin.city }} <IconArrowRight class="w-3 h-3 text-gray-400 inline mx-1" /> {{ item.destination?.city || 'Partout' }}
                  </p>
                  <span class="px-2 py-0.5 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-400 text-[8px] font-black uppercase tracking-wider border border-gray-100 dark:border-gray-600">
                    {{ item.status }}
                  </span>
                </div>
                <p class="text-[10px] text-gray-400 font-bold">
                  {{ formatDateShort(item.startDate) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Empty State Availability -->
          <div v-else-if="!vehicle.availability"
            class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-gray-700 p-8 text-center shadow-xl shadow-gray-200/50 dark:shadow-none">
            <div class="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-2xl flex items-center justify-center text-gray-300 mx-auto mb-4">
              <IconTruck class="w-8 h-8 opacity-30" />
            </div>
            <h3 class="text-lg font-black text-gray-900 dark:text-white mb-2">Aucune activité</h3>
            <p class="text-gray-500 text-sm font-medium mb-8">Ce véhicule est actuellement hors ligne. Publiez son trajet pour être visible.</p>
            <NuxtLink to="/app/uc/avail/create" 
              class="block w-full py-4 bg-secondary-600 text-white font-black rounded-2xl hover:bg-secondary-700 transition-all shadow-lg shadow-secondary-500/20 active:scale-95">
              Publier un trajet
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <ModalProfileVehicle :show="showModal" :vehicle="vehicle" :loading="modalLoading" :error="modalError"
      :success="modalSuccess" @close="closeModal" @submit="handleSubmit" />

    <!-- Status Modal -->
    <ModalProfileVehicleStatus :show="showStatusModal" :current-status="vehicle?.status || 'available'"
      :loading="statusLoading" :error="statusError" :success="statusSuccess" @close="showStatusModal = false"
      @submit="handleStatusChange" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCmnProfileStore } from '~/stores/cmnProfile';
import type { Vehicle, AddVehicleData } from '~/types';
import { 
  IconArrowLeft, IconTruck, IconPencil, IconTrash, 
  IconLoader2, IconRefresh, IconMapPin, IconCalendar, 
  IconCurrencyEuro, IconInfoCircle, IconAlertCircle,
  IconWeight, IconPackage, IconSettings, IconArrowRight
} from '@tabler/icons-vue';

const route = useRoute();
const router = useRouter();
const profileStore = useCmnProfileStore();

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

onMounted(async () => {
  await loadVehicle();
});

const loadVehicle = async () => {
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
    await loadVehicle();
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
    maintenance: 'En maintenance'
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

const formatDateShort = (dateString: string | number) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
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
    await loadVehicle();
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
useHead({
  title: 'Détails du véhicule',
  meta: [
    { name: 'description', content: 'Consultez et modifiez les détails de votre véhicule enregistré.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
