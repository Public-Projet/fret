<template>
  <div class="container-custom py-8">
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="!announcement" class="text-center py-12">
      <p class="text-lg text-gray-500">Annonce non trouvée</p>
      <NuxtLink to="/app/us/offers" class="btn btn-primary mt-4">Retour aux annonces</NuxtLink>
    </div>

    <div v-else>
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <NuxtLink to="/app/us/offers" class="text-sm text-gray-500 hover:text-gray-900 flex items-center mb-2">
            <IconArrowLeft class="w-4 h-4 mr-1" />
            Retour à mes annonces
          </NuxtLink>
          <div class="flex items-center space-x-3">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ announcement.title }}</h1>
            <span :class="getStatusClass(announcement.status)">
              {{ getStatusLabel(announcement.status) }}
            </span>
          </div>
        </div>
        <div class="flex space-x-2 mt-4 md:mt-0">
          <button v-if="announcement.status === 'pending'" @click="handleEdit"
            class="btn btn-outline flex items-center">
            <IconPencil class="w-4 h-4 mr-2" />
            Modifier
          </button>
          <button v-if="['pending', 'negotiating'].includes(announcement.status)" @click="handleCancel"
            class="btn btn-outline text-red-600 border-red-200 hover:bg-red-50 flex items-center">
            <IconX class="w-4 h-4 mr-2" />
            Annuler
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content: Offers List -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <IconInbox class="w-5 h-5 mr-2 text-primary-600" />
              Offres reçues ({{ offers.length }})
            </h2>

            <div v-if="offers.length === 0"
              class="text-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
              <IconMailOpened class="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p class="text-gray-500">Aucune offre reçue pour le moment.</p>
              <p class="text-xs text-gray-400 mt-1">Les transporteurs intéressés apparaîtront ici.</p>
            </div>

            <div v-else class="space-y-4">
              <div v-for="offer in offers" :key="offer.id"
                class="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition-shadow relative overflow-hidden">

                <div v-if="offer.status === 'accepted'"
                  class="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  ACCEPTÉE
                </div>

                <div class="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                      <div
                        class="w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center font-bold text-primary-700 dark:text-primary-300">
                        {{ (offer.carrier?.firstName || offer.carrier?.company || 'U')[0] }}
                      </div>
                      <div>
                        <p class="font-bold text-gray-900 dark:text-white flex items-center">
                          {{ offer.carrier?.company || offer.carrier?.firstName || 'Transporteur' }}
                          <IconBadge v-if="offer.carrier?.verified" class="w-4 h-4 text-green-500 ml-1" />
                        </p>
                        <div class="flex items-center text-xs text-gray-500">
                          <IconStarFilled class="w-3 h-3 text-yellow-400 mr-1" />
                          {{ offer.carrier?.rating }} ({{ offer.carrier?.reviewCount }})
                        </div>
                      </div>
                    </div>
                    <p
                      class="text-gray-600 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg mt-2">
                      "{{ offer.message }}"
                    </p>
                  </div>

                  <div class="text-right min-w-[120px]">
                    <p class="text-sm text-gray-500">Prix proposé</p>
                    <p class="text-2xl font-bold text-primary-600">{{ offer.price }} FCFA</p>
                    <p class="text-xs text-gray-400 mt-1">{{ formatDate(offer.createdAt) }}</p>
                  </div>
                </div>

                <div class="mt-4 flex justify-end space-x-3 border-t border-gray-100 dark:border-gray-700 pt-4">
                  <button @click="viewCarrierProfile(offer.carrierId)" class="btn btn-ghost btn-sm">
                    Voir profil
                  </button>
                  <button @click="contactCarrier(offer.carrierId)" class="btn btn-outline btn-sm flex items-center">
                    <IconMessage class="w-4 h-4 mr-1" />
                    Discuter
                  </button>
                  <button v-if="offer.status === 'pending'" @click="acceptOffer(offer.id)"
                    class="btn btn-primary btn-sm flex items-center">
                    <IconCheck class="w-4 h-4 mr-1" />
                    Accepter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar: Details -->
        <div class="space-y-6">
          <div class="card p-6">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Détails du transport</h3>

            <!-- Trajet -->
            <div class="relative pl-6 border-l-2 border-gray-200 dark:border-gray-700 space-y-6 mb-6">
              <!-- Départ -->
              <div class="relative">
                <div class="absolute -left-[29px] top-0 w-4 h-4 rounded-full bg-white border-2 border-primary-600">
                </div>
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wide">Départ</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ announcement.origin.city }}</p>
                  <p class="text-sm text-gray-500">{{ formatDate(announcement.pickupDate) }}</p>
                </div>
              </div>
              <!-- Arrivée -->
              <div class="relative">
                <div class="absolute -left-[29px] top-0 w-4 h-4 rounded-full bg-white border-2 border-secondary-600">
                </div>
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wide">Arrivée</p>
                  <p class="font-medium text-gray-900 dark:text-white">{{ announcement.destination.city }}</p>
                  <p class="text-sm text-gray-500">{{ formatDate(announcement.deliveryDate) }}</p>
                </div>
              </div>
            </div>

            <div class="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Marchandise</span>
                <span class="font-medium text-gray-900 dark:text-white capitalize">{{ announcement.cargoType }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Poids</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ announcement.weight }} kg</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Volume</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ announcement.volume }} m³</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Vues (totales / uniques)</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ announcement.views || 0 }} / {{
                  announcement.uniqueViews || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ModalDashboardEditAnnounce v-if="showEditModal" :announcement="announcement" @close="showEditModal = false"
      @update="handleUpdate" />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useShpAnnouncementStore } from '~/stores/shpAnnouncement';
import { usePbcAnnouncementStore } from '~/stores/pbcAnnouncement';
import { useCmnMessagingStore } from '~/stores/cmnMessaging';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import { IconArrowLeft, IconPencil, IconX, IconInbox, IconMailOpened, IconStarFilled, IconCheck, IconMessage, IconBadge } from '@tabler/icons-vue';

const route = useRoute();
const router = useRouter();
const announcementStore = useShpAnnouncementStore();
const pbcAnnouncementStore = usePbcAnnouncementStore();
const messagingStore = useCmnMessagingStore();
const authStore = useCmnAuthStore();

const announcementId = route.params.id as string;
const showEditModal = ref(false);

const loading = computed(() => announcementStore.loading);
const announcement = computed(() => announcementStore.currentAnnouncement);
const offers = computed(() => announcementStore.offersByAnnouncement(announcementId));
const currentUser = computed(() => authStore.currentUser);

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
    month: 'short',
    year: 'numeric'
  });
};

const handleEdit = () => {
  showEditModal.value = true;
};

const handleCancel = async () => {
  if (confirm('Êtes-vous sûr de vouloir annuler cette annonce ?')) {
    await announcementStore.updateStatus(announcementId, 'cancelled');
  }
};

const handleUpdate = async (updatedData: any) => {
  await announcementStore.updateShpAnnouncement(announcementId, updatedData);
  showEditModal.value = false;
};

const contactCarrier = async (carrierId: string) => {
  if (!currentUser.value) return;
  const result = await messagingStore.getOrCreateUserConversation(announcementId, [currentUser.value.id, carrierId]);
  if (result.success && result.conversation) {
    router.push(`/app/messages/${result.conversation.id}`);
  }
};

const acceptOffer = async (offerId: string) => {
  if (confirm("Accepter cette offre ? Cela marquera l'annonce comme 'Acceptée'.")) {
    const res = await announcementStore.acceptShpOffer(offerId);
    if (res.success) {
      await announcementStore.updateStatus(announcementId, 'accepted');
    } else {
      alert(res.error || "Erreur lors de l'acceptation de l'offre");
    }
  }
};

const viewCarrierProfile = (carrierId: string) => {
  alert("Voir le profil du transporteur (Fonctionnalité à venir)");
};

onMounted(async () => {
  await pbcAnnouncementStore.getPublicAnnouncements(announcementId);
  await announcementStore.fetchShpOffersForAnnouncement(announcementId);
});
useHead({
  title: 'Détails de l\'offre',
  meta: [
    { name: 'description', content: 'Gérez les détails de votre offre de fret publiée.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
