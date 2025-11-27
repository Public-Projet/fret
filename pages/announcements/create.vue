<template>
  <div class="container-custom py-8">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Créer une nouvelle annonce</h1>
      
      <div class="card p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Informations générales -->
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informations générales</h2>
            <div class="space-y-4">
              <div>
                <label class="label">Titre de l'annonce</label>
                <input v-model="form.title" type="text" required class="input" placeholder="Ex: Transport de palettes Cotonou - Porto-Novo" />
              </div>
              <div>
                <label class="label">Description détaillée</label>
                <textarea v-model="form.description" rows="4" required class="input" placeholder="Décrivez votre marchandise et vos besoins spécifiques..."></textarea>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="label">Type de marchandise</label>
                  <select v-model="form.cargoType" required class="input">
                    <option value="palettes">Palettes</option>
                    <option value="vrac">Vrac</option>
                    <option value="conteneur">Conteneur</option>
                    <option value="frigorifique">Frigorifique</option>
                    <option value="dangereux">Dangereux</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label class="label">Budget estimatif (FCFA)</label>
                  <input v-model.number="form.budget" type="number" required class="input" placeholder="0" />
                </div>
              </div>
            </div>
          </div>

          <hr class="border-gray-200 dark:border-gray-700" />

          <!-- Trajet -->
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trajet</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Départ -->
              <div class="space-y-4">
                <h3 class="font-medium text-gray-700 dark:text-gray-300">Point de départ</h3>
                <div>
                  <label class="label">Adresse</label>
                  <input v-model="form.origin.address" type="text" required class="input" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="label">Ville</label>
                    <input v-model="form.origin.city" type="text" required class="input" />
                  </div>
                  <div>
                    <label class="label">Code postal</label>
                    <input v-model="form.origin.postalCode" type="text" required class="input" />
                  </div>
                </div>
                <div>
                  <label class="label">Date d'enlèvement</label>
                  <input v-model="form.pickupDate" type="datetime-local" required class="input" />
                </div>
              </div>

              <!-- Arrivée -->
              <div class="space-y-4">
                <h3 class="font-medium text-gray-700 dark:text-gray-300">Point d'arrivée</h3>
                <div>
                  <label class="label">Adresse</label>
                  <input v-model="form.destination.address" type="text" required class="input" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="label">Ville</label>
                    <input v-model="form.destination.city" type="text" required class="input" />
                  </div>
                  <div>
                    <label class="label">Code postal</label>
                    <input v-model="form.destination.postalCode" type="text" required class="input" />
                  </div>
                </div>
                <div>
                  <label class="label">Date de livraison souhaitée</label>
                  <input v-model="form.deliveryDate" type="datetime-local" required class="input" />
                </div>
              </div>
            </div>
          </div>

          <hr class="border-gray-200 dark:border-gray-700" />

          <!-- Dimensions -->
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dimensions & Poids</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="label">Poids total (kg)</label>
                <input v-model.number="form.weight" type="number" required class="input" />
              </div>
              <div>
                <label class="label">Volume (m³)</label>
                <input v-model.number="form.volume" type="number" required class="input" />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-4 pt-4">
            <button type="button" @click="$router.back()" class="btn btn-ghost">Annuler</button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading">Création...</span>
              <span v-else>Publier l'annonce</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAnnouncementStore } from '~/stores/announcement';
import { useAuthStore } from '~/stores/auth';
import type { CargoType } from '~/types';

definePageMeta({
  middleware: ['auth']
});

const router = useRouter();
const announcementStore = useAnnouncementStore();
const authStore = useAuthStore();

const loading = ref(false);

const form = reactive({
  title: '',
  description: '',
  cargoType: 'palettes' as CargoType,
  budget: undefined as number | undefined,
  weight: undefined as number | undefined,
  volume: undefined as number | undefined,
  origin: {
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
  },
  destination: {
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
  },
  pickupDate: '',
  deliveryDate: '',
});

const handleSubmit = async () => {
  if (!authStore.currentUser) return;
  
  loading.value = true;
  try {
    const result = await announcementStore.createAnnouncement({
      ...form,
      userId: authStore.currentUser.id,
      user: authStore.currentUser,
      budget: form.budget || 0,
      weight: form.weight || 0,
      volume: form.volume || 0,
      distance: Math.floor(Math.random() * 800) + 50, // Simulation distance
    });

    if (result.success) {
      router.push('/dashboard/shipper');
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>
