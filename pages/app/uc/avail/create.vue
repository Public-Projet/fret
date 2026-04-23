<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 pb-20 pt-10">
    <div class="container-custom">
      <div class="max-w-3xl mx-auto">
        <div class="mb-10">
          <NuxtLink to="/app/uc/avail"
            class="inline-flex items-center text-gray-400 hover:text-primary-600 font-bold mb-6 transition-all group">
            <div
              class="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mr-3 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 transition-colors">
              <IconArrowLeft class="w-4 h-4" />
            </div>
            Retour aux disponibilités
          </NuxtLink>
          <h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Publier une disponibilité</h1>
          <p class="text-gray-500 font-medium mt-2">Détaillez votre trajet pour attirer les meilleurs chargeurs</p>
        </div>

        <form @submit.prevent="submitAvailability" class="space-y-8">
          <!-- Véhicule Selection -->
          <div
            class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-gray-700 p-8 shadow-xl shadow-gray-200/50 dark:shadow-none">
            <h2 class="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center">
              <div
                class="p-3 bg-secondary-50 dark:bg-secondary-900/30 rounded-2xl text-secondary-600 mr-4 shadow-inner">
                <IconTruck class="w-6 h-6" />
              </div>
              Véhicule et Options
            </h2>

            <div v-if="error"
              class="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 text-red-600 rounded-2xl text-sm font-bold flex items-center">
              <IconAlertCircle class="w-5 h-5 mr-3" />
              {{ error }}
            </div>

            <div class="space-y-6">
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Choix du
                  véhicule</label>
                <div v-if="loadingVehicles"
                  class="flex items-center p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <IconLoader2 class="w-5 h-5 animate-spin mr-3 text-secondary-600" />
                  <span class="text-sm font-bold text-gray-500">Récupération de votre flotte...</span>
                </div>
                <div v-else-if="vehicles.length === 0"
                  class="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800/50">
                  <p class="text-amber-700 dark:text-amber-400 font-bold mb-4">Vous n'avez pas encore enregistré de
                    véhicule.</p>
                  <NuxtLink to="/app/uc/vehicles"
                    class="inline-flex px-6 py-2 bg-amber-600 text-white rounded-xl text-sm font-black hover:bg-amber-700 transition-all">
                    Ajouter un véhicule
                  </NuxtLink>
                </div>
                <div v-else class="relative group">
                  <select v-model="form.vehicleId" required
                    class="w-full bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-gray-900 dark:text-white font-bold appearance-none focus:ring-4 focus:ring-secondary-500/10 focus:border-secondary-500 transition-all">
                    <option value="" disabled>Sélectionner un véhicule actif...</option>
                    <option v-for="v in vehicles" :key="v.id" :value="v.id">
                      {{ v.brand }} {{ v.model }} ({{ v.licensePlate }}) - {{ v.type }}
                    </option>
                  </select>
                  <IconChevronDown
                    class="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none group-hover:text-secondary-600 transition-colors" />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Tarif
                    souhaité (FCFA)</label>
                  <div class="relative">
                    <input v-model.number="form.price" type="number"
                      class="w-full bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-gray-900 dark:text-white font-bold focus:ring-4 focus:ring-secondary-500/10 focus:border-secondary-500 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
                      placeholder="Ex: 150000" />
                    <IconCurrencyEuro class="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                  </div>
                </div>
                <div>
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Capacité
                    Max (Demandes)</label>
                  <input v-model.number="form.maxRequests" type="number"
                    class="w-full bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-gray-900 dark:text-white font-bold focus:ring-4 focus:ring-secondary-500/10 focus:border-secondary-500 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
                    placeholder="Ex: 5" />
                </div>
              </div>
            </div>
          </div>

          <!-- Trajet et Dates -->
          <div
            class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-gray-700 p-8 shadow-xl shadow-gray-200/50 dark:shadow-none">
            <h2 class="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center">
              <div class="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-2xl text-primary-600 mr-4 shadow-inner">
                <IconMapPin class="w-6 h-6" />
              </div>
              Itinéraire et Planning
            </h2>

            <div class="space-y-10">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Départ
                    prévu</label>
                  <div class="relative">
                    <input v-model="form.startDate" type="datetime-local" required
                      class="w-full bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-gray-900 dark:text-white font-bold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all" />
                  </div>
                </div>
                <div>
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Fin du
                    trajet</label>
                  <div class="relative">
                    <input v-model="form.endDate" type="datetime-local" required
                      class="w-full bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800 rounded-2xl px-6 py-4 text-gray-900 dark:text-white font-bold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all" />
                  </div>
                </div>
              </div>

              <div class="space-y-10">
                <div
                  class="p-8 bg-gray-50/50 dark:bg-gray-900/30 rounded-[2rem] border border-gray-100 dark:border-gray-800 relative group transition-all hover:border-emerald-200">
                  <div class="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-emerald-500 rounded-full"></div>
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 px-1">Point
                    d'origine (Départ)</label>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input v-model="form.origin.city" type="text" required
                      class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none"
                      placeholder="Ville (Ex: Cotonou)" />
                    <input v-model="form.origin.country" type="text"
                      class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none"
                      placeholder="Pays (Bénin)" />
                  </div>
                  <input v-model="form.origin.address" type="text"
                    class="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none"
                    placeholder="Adresse ou Point précis (Optionnel)" />
                </div>

                <div
                  class="p-8 bg-gray-50/50 dark:bg-gray-900/30 rounded-[2rem] border border-gray-100 dark:border-gray-800 relative group transition-all hover:border-red-200">
                  <div class="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-red-400 rounded-full"></div>
                  <div class="flex justify-between items-center mb-6 px-1">
                    <label
                      class="block text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Destination
                      finale (Arrivée)</label>
                    <span
                      class="text-[10px] font-black text-gray-400 bg-white dark:bg-gray-800 px-2 py-0.5 rounded-lg border border-gray-100 dark:border-gray-700 uppercase tracking-widest">Optionnel</span>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input v-model="form.destination.city" type="text"
                      class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-bold focus:ring-4 focus:ring-red-400/10 focus:border-red-400 outline-none"
                      placeholder="Ville (Laissez vide si flexible)" />
                    <input v-model="form.destination.country" type="text"
                      class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white font-bold focus:ring-4 focus:ring-red-400/10 focus:border-red-400 outline-none"
                      placeholder="Pays" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row justify-end gap-4 pt-4">
            <button type="button" @click="$router.back()"
              class="px-10 py-4 text-gray-500 dark:text-gray-400 font-bold hover:text-gray-700 dark:hover:text-white transition-colors order-2 sm:order-1">
              Annuler
            </button>
            <button type="submit" :disabled="submitting"
              class="px-12 py-4 bg-primary-600 text-white font-black rounded-2xl hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 order-1 sm:order-2 flex items-center justify-center">
              <IconLoader2 v-if="submitting" class="w-5 h-5 animate-spin mr-3" />
              {{ submitting ? 'Publication en cours...' : 'Lancer ma disponibilité' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCarAvailabilityStore } from '~/stores/carAvailability';
import { useCarVehiclesStore } from '~/stores/carVehicles';
import { IconArrowLeft, IconMapPin, IconTruck, IconLoader2, IconChevronDown, IconCurrencyEuro, IconAlertCircle } from '@tabler/icons-vue';

const router = useRouter();
const availabilityStore = useCarAvailabilityStore();
const carVehicleStore = useCarVehiclesStore();

const vehicles = computed(() => carVehicleStore.vehicles);
const loadingVehicles = computed(() => carVehicleStore.vehiclesLoading);
const submitting = ref(false);
const error = ref('');

onMounted(async () => {
  await carVehicleStore.fetchCarVehicles();
});

const form = reactive({
  vehicleId: '',
  price: undefined as number | undefined,
  maxRequests: undefined as number | undefined,
  startDate: '',
  endDate: '',
  origin: {
    address: '',
    city: '',
    country: 'Bénin',
  },
  destination: {
    address: '',
    city: '',
    country: '',
  },
});

const submitAvailability = async () => {
  if (!form.vehicleId) {
    error.value = 'Veuillez sélectionner un véhicule';
    return;
  }

  if (new Date(form.startDate) >= new Date(form.endDate)) {
    error.value = 'La date de début doit être avant la date de fin';
    return;
  }

  const now = new Date();
  if (new Date(form.startDate) < now) {
    error.value = 'La date de début ne peut pas être dans le passé';
    return;
  }

  submitting.value = true;
  error.value = '';

  const result = await availabilityStore.addCarAvailability({
    vehicleId: form.vehicleId,
    price: form.price,
    maxRequests: form.maxRequests,
    startDate: form.startDate,
    endDate: form.endDate,
    origin: {
      city: form.origin.city,
      country: form.origin.country,
      address: form.origin.address
    },
    destination: form.destination.city ? {
      city: form.destination.city,
      country: form.destination.country,
      address: form.destination.address
    } : undefined
  });

  submitting.value = false;

  if (result.success) {
    router.push('/app/uc/avail');
  } else {
    error.value = typeof result.error === 'string' ? result.error : 'Une erreur est survenue';
  }
};

useHead({
  title: 'Déclarer une disponibilité',
  meta: [
    { name: 'description', content: 'Déclarez rapidement un véhicule disponible sur Bourse de Fret.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
