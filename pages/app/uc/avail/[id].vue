<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 pb-20 pt-10">
    <div class="container-custom">
      <!-- Header/Nav -->
      <div class="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <NuxtLink to="/app/uc/avail"
          class="inline-flex items-center text-gray-400 hover:text-primary-600 font-bold transition-all group">
          <div
            class="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mr-3 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 transition-colors">
            <IconArrowLeft class="w-5 h-5" />
          </div>
          Retour aux disponibilités
        </NuxtLink>
        <div v-if="availability" class="flex gap-3 w-full sm:w-auto">
          <button @click="toggleEditMode"
            class="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-50 transition-all active:scale-95 flex items-center justify-center shadow-sm">
            <IconPencil class="w-4 h-4 mr-2 text-primary-500" /> {{ isEditing ? 'Annuler' : 'Modifier' }}
          </button>
          <button @click="handleDelete"
            class="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 font-bold text-sm hover:bg-red-600 hover:text-white transition-all active:scale-95 flex items-center justify-center">
            <IconTrash class="w-4 h-4 mr-2" /> Supprimer
          </button>
        </div>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center py-24">
        <div class="relative w-16 h-16 mb-6">
          <div class="absolute inset-0 border-4 border-primary-100 dark:border-primary-900/30 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin">
          </div>
        </div>
        <p class="text-gray-500 font-bold">Chargement de la disponibilité...</p>
      </div>

      <div v-else-if="error"
        class="bg-red-50/80 dark:bg-red-900/20 backdrop-blur-xl border border-red-100 dark:border-red-800/50 p-12 rounded-[2.5rem] text-center max-w-2xl mx-auto shadow-xl">
        <div
          class="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-[1.5rem] flex items-center justify-center text-red-600 mx-auto mb-6">
          <IconAlertCircle class="w-10 h-10" />
        </div>
        <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-2">Impossible d'afficher ce trajet</h3>
        <p class="text-red-600/70 font-medium mb-10">{{ error }}</p>
        <NuxtLink to="/app/uc/avail"
          class="inline-flex px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg active:scale-95">
          Retour à la liste
        </NuxtLink>
      </div>

      <!-- View Mode -->
      <div v-else-if="availability && !isEditing" class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div class="lg:col-span-2 space-y-10">
          <div
            class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-gray-700 p-8 lg:p-12 shadow-xl shadow-gray-200/50 dark:shadow-none relative overflow-hidden">
            <div class="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-3xl -mr-32 -mt-32"></div>

            <div class="flex flex-col md:flex-row justify-between items-start mb-10 gap-6 relative">
              <div>
                <div class="flex items-center gap-3 mb-4">
                  <div class="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-2xl text-primary-600 shadow-inner">
                    <IconTruck class="w-8 h-8" />
                  </div>
                  <div>
                    <h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                      {{ availability.vehicle?.brand }} {{ availability.vehicle?.model }}
                    </h1>
                    <p class="text-gray-400 font-bold text-sm tracking-wide">{{ availability.vehicle?.licensePlate }}
                    </p>
                  </div>
                </div>
                <span
                  :class="['px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm', getStatusClass(availability.status)]">
                  {{ getStatusLabel(availability.status) }}
                </span>
              </div>
              <div
                class="md:text-right bg-primary-50/50 dark:bg-primary-900/20 p-6 rounded-3xl border border-primary-100 dark:border-primary-900/30">
                <p class="text-3xl font-black text-primary-600 tracking-tight">{{ availability.price?.toLocaleString()
                  || '-' }} <span class="text-xs text-gray-500 font-black uppercase ml-1">FCFA</span></p>
                <div v-if="availability.maxRequests" class="mt-2 flex items-center justify-end gap-2">
                  <div class="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div class="h-full bg-primary-500 rounded-full"
                      :style="{ width: `${(availability.currentRequests / availability.maxRequests) * 100}%` }"></div>
                  </div>
                  <span class="text-[10px] font-black uppercase tracking-widest"
                    :class="availability.currentRequests >= availability.maxRequests ? 'text-red-600' : 'text-gray-500'">
                    {{ availability.currentRequests }} / {{ availability.maxRequests }} Demandes
                  </span>
                </div>
                <div class="mt-4 flex items-center justify-end gap-3 text-sm text-gray-500">
                  <div class="flex items-center" title="Vues totales">
                    <IconEye class="w-4 h-4 mr-1 text-primary-500/70" />
                    <span class="font-bold">{{ availability.views || 0 }}</span>
                  </div>
                  <div class="flex items-center" title="Vues uniques">
                    <IconUser class="w-4 h-4 mr-1 text-primary-500/70" />
                    <span class="font-bold">{{ availability.uniqueViews || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-50 dark:border-gray-700/50 pt-10 relative">
              <div class="space-y-8">
                <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Détails de l'itinéraire
                </h3>

                <div class="relative pl-10 space-y-12">
                  <div
                    class="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-gray-800 border-l-2 border-dashed border-gray-200 dark:border-gray-700">
                  </div>

                  <div class="relative group">
                    <div
                      class="absolute -left-10 top-0 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 border-4 border-white dark:border-gray-800 shadow-sm flex items-center justify-center">
                      <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    </div>
                    <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Point de départ</p>
                    <p class="text-xl font-black text-gray-900 dark:text-white leading-tight">{{
                      availability.origin.city }}</p>
                    <p class="text-xs font-bold text-gray-500">{{ availability.origin.country }}</p>
                  </div>

                  <div class="relative group">
                    <div
                      class="absolute -left-10 top-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/50 border-4 border-white dark:border-gray-800 shadow-sm flex items-center justify-center">
                      <div class="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    </div>
                    <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Point d'arrivée</p>
                    <p class="text-xl font-black text-gray-900 dark:text-white leading-tight">{{
                      availability.destination?.city || 'Toute destination' }}</p>
                    <p v-if="availability.destination" class="text-xs font-bold text-gray-500">{{
                      availability.destination.country }}</p>
                  </div>
                </div>
              </div>

              <div class="space-y-8">
                <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Planning temporel</h3>

                <div class="space-y-6">
                  <div
                    class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <IconCalendar class="w-6 h-6 text-primary-500" />
                    <div>
                      <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest">Date de début</p>
                      <p class="font-black text-gray-900 dark:text-white">{{ formatDate(availability.startDate) }}</p>
                    </div>
                  </div>
                  <div
                    class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <IconCalendar class="w-6 h-6 text-secondary-500" />
                    <div>
                      <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest">Date de fin</p>
                      <p class="font-black text-gray-900 dark:text-white">{{ formatDate(availability.endDate) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Negotiations -->
          <div
            class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-gray-700 p-8 lg:p-12 shadow-xl shadow-gray-200/50 dark:shadow-none">
            <h2 class="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center">
              <div
                class="p-3 bg-secondary-50 dark:bg-secondary-900/30 rounded-2xl text-secondary-600 mr-4 shadow-inner">
                <IconUsers class="w-6 h-6" />
              </div>
              Propositions des chargeurs ({{ availability.bookings?.length || 0 }})
            </h2>
            <AnnoncesNegotiationList :items="availability.bookings || []" type="avail" @refresh="loadAvailability"
              @counter="startCounterNegotiation" />
          </div>
        </div>
      </div>

      <!-- Edit Mode -->
      <div v-else-if="availability && isEditing" class="max-w-3xl mx-auto">
        <div
          class="bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 dark:border-gray-700">
          <h2 class="text-2xl font-black text-gray-900 dark:text-white mb-10 tracking-tight">Modifier la disponibilité
          </h2>

          <form @submit.prevent="handleUpdate" class="space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Début du
                  trajet</label>
                <input v-model="form.startDate" type="datetime-local"
                  class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 text-gray-900 dark:text-white font-bold"
                  required />
              </div>
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Fin du
                  trajet</label>
                <input v-model="form.endDate" type="datetime-local"
                  class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 text-gray-900 dark:text-white font-bold"
                  required />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Prix
                  global (FCFA)</label>
                <input v-model.number="form.price" type="number"
                  class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 text-gray-900 dark:text-white font-bold" />
              </div>
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Limite de
                  demandes</label>
                <input v-model.number="form.maxRequests" type="number"
                  class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 text-gray-900 dark:text-white font-bold" />
              </div>
            </div>

            <div class="space-y-8">
              <div
                class="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 relative">
                <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-emerald-500 rounded-full"></div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Point de départ
                  (Origine)</label>
                <div class="grid grid-cols-2 gap-3">
                  <input v-model="form.origin.city" type="text" required
                    class="bg-white dark:bg-gray-800 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold"
                    placeholder="Ville" />
                  <input v-model="form.origin.country" type="text"
                    class="bg-white dark:bg-gray-800 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold"
                    placeholder="Pays" />
                </div>
              </div>
              <div
                class="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 relative">
                <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-red-400 rounded-full"></div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Arrivée
                  (Destination)</label>
                <div class="grid grid-cols-2 gap-3">
                  <input v-model="form.destination.city" type="text"
                    class="bg-white dark:bg-gray-800 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold"
                    placeholder="Ville" />
                  <input v-model="form.destination.country" type="text"
                    class="bg-white dark:bg-gray-800 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold"
                    placeholder="Pays" />
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-8 border-t border-gray-100">
              <button type="button" @click="toggleEditMode"
                class="px-8 py-3 text-gray-400 font-bold hover:text-gray-600">Annuler</button>
              <button type="submit"
                class="px-10 py-3 bg-primary-600 text-white font-black rounded-xl hover:bg-primary-700 shadow-lg active:scale-95 transition-all flex items-center justify-center"
                :disabled="submitting">
                <IconLoader2 v-if="submitting" class="w-4 h-4 animate-spin mr-2" />
                Mettre à jour
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Negotiation Modal -->
    <AnnoncesNegotiationModal v-if="showNegotiationModal" :targetId="id" :dataType="'avail'"
      :originalPrice="availability?.price" :originalOrigin="availability?.origin"
      :originalDestination="availability?.destination" :initial-data="selectedProposalForCounter"
      @close="closeNegotiationModal" @success="handleNegotiationSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAvailabilityStore, type Availability } from '~/stores/availability';
import { IconArrowLeft, IconPencil, IconTrash, IconLoader2, IconCalendar, IconUsers, IconAlertCircle, IconEye, IconUser } from '@tabler/icons-vue';

const route = useRoute();
const router = useRouter();
const store = useAvailabilityStore();
const id = route.params.id as string;

const availability = ref<Availability | null>(null);
const loading = ref(true);
const error = ref('');
const isEditing = ref(false);
const submitting = ref(false);
const showNegotiationModal = ref(false);
const selectedProposalForCounter = ref<any>(null);
const negotiating = ref(false);

const startCounterNegotiation = (proposal: any) => {
  selectedProposalForCounter.value = proposal;
  showNegotiationModal.value = true;
};

const closeNegotiationModal = () => {
  showNegotiationModal.value = false;
  selectedProposalForCounter.value = null;
};

const handleNegotiationSuccess = async () => {
  showNegotiationModal.value = false;
  selectedProposalForCounter.value = null;
  await loadAvailability();
};

const form = reactive({
  startDate: '',
  endDate: '',
  price: undefined as number | undefined,
  maxRequests: undefined as number | undefined,
  origin: { city: '', country: '' },
  destination: { city: '', country: '' }
});

onMounted(async () => {
  await loadAvailability();
});

const loadAvailability = async () => {
  loading.value = true;
  const result = await store.fetchAvailability(id);
  if (result.success && result.availability) {
    availability.value = result.availability;
  } else {
    if (typeof result.error === 'object' && result.error !== null) {
      error.value = result.error.message || 'Impossible de charger la disponibilité';
    } else {
      error.value = result.error || 'Impossible de charger la disponibilité';
    }
  }
  loading.value = false;
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: 'Actif',
    full: 'Complet',
    expired: 'Expiré',
    prolonged: 'Prolongé'
  };
  return labels[status] || status;
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'active': return 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 border-emerald-100 dark:border-emerald-800/50';
    case 'full': return 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 border-amber-100 dark:border-amber-800/50';
    case 'expired': return 'bg-gray-100 dark:bg-gray-700 text-gray-500 border-gray-200 dark:border-gray-600';
    case 'prolonged': return 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 border-blue-100 dark:border-blue-800/50';
    default: return 'bg-gray-50 dark:bg-gray-900/30 text-gray-600 border-gray-100 dark:border-gray-800/50';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

const formatInputDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset() * 60000;
  const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
  return localISOTime;
};

const toggleEditMode = () => {
  if (!availability.value) return;

  if (!isEditing.value) {
    form.startDate = formatInputDate(availability.value.startDate);
    form.endDate = formatInputDate(availability.value.endDate);
    form.price = availability.value.price;
    form.maxRequests = availability.value.maxRequests;
    form.origin = { ...availability.value.origin };
    form.destination = availability.value.destination ? { ...availability.value.destination } : { city: '', country: '' };
  }

  isEditing.value = !isEditing.value;
};

const handleUpdate = async () => {
  if (new Date(form.startDate) >= new Date(form.endDate)) {
    alert('La date de début doit être avant la date de fin');
    return;
  }

  submitting.value = true;

  const payload = {
    startDate: form.startDate,
    endDate: form.endDate,
    price: form.price,
    maxRequests: form.maxRequests,
    origin: form.origin,
    destination: form.destination.city ? form.destination : undefined
  };

  const result = await store.updateAvailability(id, payload);

  if (result.success && result.availability) {
    availability.value = result.availability;
    isEditing.value = false;
  } else {
    alert(result.error || 'Erreur lors de la mise à jour');
  }

  submitting.value = false;
};

const handleDelete = async () => {
  if (!confirm('Supprimer cette disponibilité ?')) return;
  const result = await store.deleteAvailability(id);
  if (result.success) {
    router.push('/app/uc/avail');
  } else {
    alert(result.error);
  }
};

definePageMeta({ layout: 'default' });
useHead({
  title: 'Détails de la disponibilité',
  meta: [
    { name: 'description', content: 'Consultez les détails de votre disponibilité de véhicule.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
