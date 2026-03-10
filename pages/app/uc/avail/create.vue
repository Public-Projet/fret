<template>
  <div class="container-custom py-8">
    <div class="max-w-2xl mx-auto">
      <div class="mb-6">
        <NuxtLink to="/app/uc/avail" class="text-sm text-gray-500 hover:text-gray-900 flex items-center mb-2">
          <IconArrowLeft class="w-4 h-4 mr-1" />
          Retour aux disponibilités
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Publier une disponibilité</h1>
        <p class="text-gray-600 dark:text-gray-400">Renseignez votre trajet et votre véhicule pour recevoir des offres.
        </p>
      </div>

      <div class="card p-6">
        <form @submit.prevent="submitAvailability">
          <!-- Véhicule -->
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <IconTruck class="w-5 h-5 mr-2 text-primary-600" />
              Véhicule et Options
            </h2>

            <div v-if="error" class="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{{ error }}</div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="label">Sélectionner un véhicule</label>
                <div v-if="loadingVehicles" class="flex items-center text-sm text-gray-500">
                  <IconLoader2 class="w-4 h-4 animate-spin mr-2" /> Chargement de vos véhicules...
                </div>
                <div v-else-if="vehicles.length === 0" class="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                  Vous n'avez aucun véhicule. <NuxtLink to="/app/uc/vehicles" class="underline font-medium">Ajoutez-en
                    un d'abord</NuxtLink>.
                </div>
                <select v-else v-model="form.vehicleId" required class="input">
                  <option value="" disabled>Choisir un véhicule...</option>
                  <option v-for="v in vehicles" :key="v.id" :value="v.id">
                    {{ v.brand }} {{ v.model }} ({{ v.licensePlate }}) - {{ v.type }}
                  </option>
                </select>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="label">Prix (FCFA) - Optionnel</label>
                  <input v-model.number="form.price" type="number" class="input" placeholder="Prix global ou au tour" />
                </div>
                <div>
                  <label class="label">Limite de demandes - Optionnel</label>
                  <input v-model.number="form.maxRequests" type="number" class="input" placeholder="Ex: 5" />
                  <p class="text-xs text-gray-500 mt-1">La disponibilité passera en "Complet" une fois atteinte.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Trajet et Dates -->
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <IconMapPin class="w-5 h-5 mr-2 text-primary-600" />
              Trajet et Dates
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="label">Disponible du</label>
                <input v-model="form.startDate" type="datetime-local" required class="input" />
              </div>
              <div>
                <label class="label">Au</label>
                <input v-model="form.endDate" type="datetime-local" required class="input" />
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="label">Ville de départ (Origine)</label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input v-model="form.origin.city" type="text" required class="input" placeholder="Ville" />
                  <input v-model="form.origin.country" type="text" class="input" placeholder="Pays (Ex: Bénin)" />
                </div>
                <input v-model="form.origin.address" type="text" class="input mt-2"
                  placeholder="Adresse précise (Optionnel)" />
              </div>

              <div>
                <label class="label">Ville d'arrivée (Destination - Optionnel)</label>
                <p class="text-xs text-gray-500 mb-2">Laissez vide si vous êtes flexible ou disponible pour toutes
                  destinations.</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input v-model="form.destination.city" type="text" class="input" placeholder="Ville" />
                  <input v-model="form.destination.country" type="text" class="input" placeholder="Pays" />
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
            <button type="button" @click="$router.back()" class="btn btn-ghost mr-2">Annuler</button>
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              {{ submitting ? 'Publication...' : 'Publier la disponibilité' }}
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
import { useAvailabilityStore } from '~/stores/availability';
import { useProfileStore } from '~/stores/profile';
import { IconArrowLeft, IconMapPin, IconTruck, IconLoader2 } from '@tabler/icons-vue';

const router = useRouter();
const availabilityStore = useAvailabilityStore();
const profileStore = useProfileStore();

const vehicles = computed(() => profileStore.vehicles);
const loadingVehicles = computed(() => profileStore.vehiclesLoading);
const submitting = ref(false);
const error = ref('');

onMounted(async () => {
  await profileStore.fetchVehicles();
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
  if (new Date(form.endDate) < now) {
    error.value = 'La date de fin ne peut pas être dans le passé';
    return;
  }

  submitting.value = true;
  error.value = '';

  const result = await availabilityStore.addAvailability({
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
