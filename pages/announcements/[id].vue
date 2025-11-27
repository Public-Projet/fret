<template>
  <div class="container-custom py-8">
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="!announcement" class="text-center py-12">
      <p class="text-lg text-gray-500">Annonce non trouvée</p>
      <NuxtLink to="/announcements" class="btn btn-primary mt-4">Retour aux annonces</NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Détails principaux -->
      <div class="lg:col-span-2 space-y-6">
        <div class="card p-6">
          <div class="flex justify-between items-start mb-4">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ announcement.title }}</h1>
            <span :class="getStatusClass(announcement.status)">
              {{ getStatusLabel(announcement.status) }}
            </span>
          </div>

          <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <div class="flex items-center">
              <CalendarIcon class="w-4 h-4 mr-1" />
              Publié le {{ formatDate(announcement.createdAt) }}
            </div>
            <div class="flex items-center">
              <MapPinIcon class="w-4 h-4 mr-1" />
              {{ announcement.distance }} km
            </div>
          </div>

          <!-- Trajet -->
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 mb-6">
            <div class="relative pl-8 border-l-2 border-dashed border-gray-300 dark:border-gray-600 space-y-8">
              <!-- Départ -->
              <div class="relative">
                <div
                  class="absolute -left-[39px] top-0 w-5 h-5 rounded-full border-4 border-white dark:border-gray-800 bg-primary-600">
                </div>
                <div>
                  <p class="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">
                    Enlèvement</p>
                  <p class="font-medium text-gray-900 dark:text-white text-lg">{{ announcement.origin.city }} ({{
                    announcement.origin.postalCode }})</p>
                  <p class="text-gray-600 dark:text-gray-400">{{ announcement.origin.address }}</p>
                  <p class="text-sm text-gray-500 mt-1">Le {{ formatDate(announcement.pickupDate) }}</p>
                </div>
              </div>

              <!-- Arrivée -->
              <div class="relative">
                <div
                  class="absolute -left-[39px] top-0 w-5 h-5 rounded-full border-4 border-white dark:border-gray-800 bg-secondary-600">
                </div>
                <div>
                  <p
                    class="text-xs font-semibold text-secondary-600 dark:text-secondary-400 uppercase tracking-wider mb-1">
                    Livraison</p>
                  <p class="font-medium text-gray-900 dark:text-white text-lg">{{ announcement.destination.city }} ({{
                    announcement.destination.postalCode }})</p>
                  <p class="text-gray-600 dark:text-gray-400">{{ announcement.destination.address }}</p>
                  <p class="text-sm text-gray-500 mt-1">Le {{ formatDate(announcement.deliveryDate) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Caractéristiques -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
              <CubeIcon class="w-6 h-6 mx-auto text-gray-400 mb-2" />
              <p class="text-xs text-gray-500 uppercase">Type</p>
              <p class="font-semibold text-gray-900 dark:text-white">{{ announcement.cargoType }}</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
              <ScaleIcon class="w-6 h-6 mx-auto text-gray-400 mb-2" />
              <p class="text-xs text-gray-500 uppercase">Poids</p>
              <p class="font-semibold text-gray-900 dark:text-white">{{ announcement.weight }} kg</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
              <ArrowsPointingOutIcon class="w-6 h-6 mx-auto text-gray-400 mb-2" />
              <p class="text-xs text-gray-500 uppercase">Volume</p>
              <p class="font-semibold text-gray-900 dark:text-white">{{ announcement.volume }} m³</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
              <CurrencyEuroIcon class="w-6 h-6 mx-auto text-gray-400 mb-2" />
              <p class="text-xs text-gray-500 uppercase">Budget</p>
              <p class="font-semibold text-primary-600">{{ announcement.budget }}FCFA</p>
            </div>
          </div>

          <!-- Description -->
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ announcement.description }}</p>
          </div>
        </div>

        <!-- Offres (visible pour le créateur) -->
        <div v-if="isCreator" class="card p-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Offres reçues</h2>
          <div v-if="offers.length === 0" class="text-center py-8 text-gray-500">
            Aucune offre pour le moment.
          </div>
          <div v-else class="space-y-4">
            <div v-for="offer in offers" :key="offer.id"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div class="flex justify-between items-start mb-2">
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    {{ offer.carrier?.firstName[0] }}
                  </div>
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">{{ offer.carrier?.company }}</p>
                    <div class="flex items-center text-xs text-gray-500">
                      <StarIcon class="w-3 h-3 text-yellow-400 mr-1" />
                      {{ offer.carrier?.rating }} ({{ offer.carrier?.reviewCount }})
                    </div>
                  </div>
                </div>
                <span class="font-bold text-lg text-primary-600">{{ offer.price }}FCFA</span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{{ offer.message }}</p>
              <div class="flex justify-end space-x-2">
                <button @click="contactCarrier(offer.carrierId)" class="btn btn-ghost btn-sm">Discuter</button>
                <button v-if="offer.status === 'pending'" @click="acceptOffer(offer.id)"
                  class="btn btn-primary btn-sm">Accepter</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Profil Chargeur -->
        <div class="card p-6">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">À propos du chargeur</h3>
          <div class="flex items-center space-x-3 mb-4">
            <div
              class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-xl">
              {{ announcement.user?.firstName[0] }}
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ announcement.user?.company ||
                announcement.user?.firstName }}</p>
              <div class="flex items-center text-sm text-gray-500">
                <StarIcon class="w-4 h-4 text-yellow-400 mr-1" />
                {{ announcement.user?.rating }} ({{ announcement.user?.reviewCount }} avis)
              </div>
            </div>
          </div>
          <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div class="flex items-center">
              <CheckBadgeIcon class="w-4 h-4 text-green-500 mr-2" />
              Identité vérifiée
            </div>
            <div class="flex items-center">
              <ClockIcon class="w-4 h-4 text-gray-400 mr-2" />
              Membre depuis {{ new Date(announcement.user?.createdAt || '').getFullYear() }}
            </div>
          </div>
        </div>

        <!-- Actions Transporteur -->
        <div v-if="isCarrier && announcement.status === 'pending'" class="card p-6">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Faire une offre</h3>
          <form @submit.prevent="submitOffer" class="space-y-4">
            <div>
              <label class="label">Votre prix (FCFA)</label>
              <input v-model.number="offerForm.price" type="number" required class="input" />
            </div>
            <div>
              <label class="label">Message</label>
              <textarea v-model="offerForm.message" rows="3" required class="input"
                placeholder="Détails de votre offre..."></textarea>
            </div>
            <button type="submit" class="btn btn-primary w-full" :disabled="submitting">
              {{ submitting ? 'Envoi...' : 'Envoyer l\'offre' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import {
  CalendarIcon,
  MapPinIcon,
  CubeIcon,
  ScaleIcon,
  ArrowsPointingOutIcon,
  CurrencyEuroIcon,
  StarIcon,
  CheckBadgeIcon,
  ClockIcon
} from '@heroicons/vue/24/outline';
import { useAnnouncementStore } from '~/stores/announcement';
import { useAuthStore } from '~/stores/auth';
import { useMessagingStore } from '~/stores/messaging';

const route = useRoute();
const router = useRouter();
const announcementStore = useAnnouncementStore();
const authStore = useAuthStore();
const messagingStore = useMessagingStore();

const announcementId = route.params.id as string;
const submitting = ref(false);

const announcement = computed(() => announcementStore.currentAnnouncement);
const loading = computed(() => announcementStore.loading);
const currentUser = computed(() => authStore.currentUser);
const isCreator = computed(() => currentUser.value?.id === announcement.value?.userId);
const isCarrier = computed(() => authStore.isCarrier);

const offers = computed(() => messagingStore.offersByAnnouncement(announcementId));

const offerForm = reactive({
  price: undefined as number | undefined,
  message: '',
});

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    negotiating: 'En négociation',
    accepted: 'Accepté',
    completed: 'Terminé',
    cancelled: 'Annulé'
  };
  return labels[status] || status;
};

const getStatusClass = (status: string) => {
  const baseClass = 'badge';
  switch (status) {
    case 'pending': return `${baseClass} badge-info`;
    case 'negotiating': return `${baseClass} badge-warning`;
    case 'accepted': return `${baseClass} badge-success`;
    case 'completed': return `${baseClass} badge-neutral`;
    case 'cancelled': return `${baseClass} badge-danger`;
    default: return `${baseClass} badge-neutral`;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const submitOffer = async () => {
  if (!currentUser.value || !offerForm.price) return;

  submitting.value = true;
  try {
    const result = await messagingStore.createOffer({
      announcementId,
      carrierId: currentUser.value.id,
      carrier: currentUser.value,
      price: offerForm.price,
      message: offerForm.message,
    });

    if (result.success) {
      offerForm.price = undefined;
      offerForm.message = '';
      alert('Offre envoyée avec succès !');
    }
  } finally {
    submitting.value = false;
  }
};

const contactCarrier = async (carrierId: string) => {
  if (!currentUser.value) return;

  const result = await messagingStore.getOrCreateConversation(
    announcementId,
    [currentUser.value.id, carrierId]
  );

  if (result.success && result.conversation) {
    router.push(`/messages/${result.conversation.id}`);
  }
};

const acceptOffer = async (offerId: string) => {
  await messagingStore.acceptOffer(offerId);
  await announcementStore.updateStatus(announcementId, 'accepted');
};

onMounted(() => {
  announcementStore.fetchAnnouncementById(announcementId);
});
</script>
