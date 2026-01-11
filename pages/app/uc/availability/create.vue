<template>
  <div class="container-custom py-8">
    <div class="max-w-2xl mx-auto">
      <div class="mb-6">
        <NuxtLink to="/app/uc/availability" class="text-sm text-gray-500 hover:text-gray-900 flex items-center mb-2">
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
              Véhicule et Capacité
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="label">Type de véhicule</label>
                <select v-model="form.vehicleType" required class="input">
                  <option value="">Sélectionner</option>
                  <option value="Camion 20T">Camion 20T</option>
                  <option value="Camion 10T">Camion 10T</option>
                  <option value="Camion frigorifique">Camion frigorifique</option>
                  <option value="Fourgon">Fourgon</option>
                  <option value="Plateau">Plateau</option>
                  <option value="Benne">Benne</option>
                </select>
              </div>
              <div>
                <label class="label">Prix au km (FCFA)</label>
                <input v-model.number="form.pricePerKm" type="number" required class="input" placeholder="Ex: 500" />
              </div>
              <div>
                <label class="label">Capacité (kg)</label>
                <input v-model.number="form.capacity" type="number" required class="input" placeholder="Ex: 20000" />
              </div>
              <div>
                <label class="label">Volume (m³)</label>
                <input v-model.number="form.volumeCapacity" type="number" required class="input" placeholder="Ex: 60" />
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
                <input v-model="form.availableFrom" type="datetime-local" required class="input" />
              </div>
              <div>
                <label class="label">Au</label>
                <input v-model="form.availableTo" type="datetime-local" required class="input" />
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
import { ref, reactive } from 'vue';
import { useAuthStore } from '~/stores/auth';
import type { Availability } from '~/types';
import { IconArrowLeft, IconMapPin, IconTruck } from '@tabler/icons-vue';

const authStore = useAuthStore();
const router = useRouter();
const submitting = ref(false);

// Note: In a real app we'd use a dedicated store for availabilities.
// Since one is not provided in context, I'll simulate or use a new one if I were to create it.
// For now I'll mock the submission.
// I'll update the 'mock.ts' later or assume there's a store method.
// Looking at 'stores/announcement' or 'messaging', there isn't an 'availability' store yet.
// I'll assume for this task I might need to create one, BUT the user asked to "create page for this action".
// I will simulate the action for now or check if I should create a store. 
// Given the user instructions "analyze data/mock.ts", let's see if I can add to it implicitly via a new store?
// Actually, `mockAvailabilities` exists in `mock.ts`.
// I will create `stores/availability.ts` after this if it doesn't exist, but first let's scaffold the page.

const form = reactive({
  vehicleType: '',
  capacity: undefined as number | undefined,
  volumeCapacity: undefined as number | undefined,
  pricePerKm: undefined as number | undefined,
  availableFrom: '',
  availableTo: '',
  origin: {
    address: '',
    city: '',
    postalCode: '',
    country: 'Bénin',
  },
  destination: {
    address: '',
    city: '',
    postalCode: '',
    country: '',
  },
});

const submitAvailability = async () => {
  submitting.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Availability published:", form);
    router.push('/app/uc/availability');
  } finally {
    submitting.value = false;
  }
};
</script>
