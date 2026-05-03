<template>
  <div class="container-custom py-8">
    <div v-if="loading" class="flex flex-col items-center justify-center py-24 animate-in fade-in duration-700">
      <div class="relative w-20 h-20">
        <div class="absolute inset-0 border-4 border-primary-100 dark:border-primary-900/30 rounded-full"></div>
        <div class="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p class="mt-6 text-gray-500 dark:text-gray-400 font-medium animate-pulse">Chargement de votre annonce...</p>
    </div>

    <div v-else-if="!announcement"
      class="max-w-xl mx-auto py-16 px-6 text-center animate-in fade-in zoom-in duration-500">
      <div
        class="bg-white dark:bg-gray-800 rounded-[40px] p-12 shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 relative overflow-hidden">
        <!-- Decorative background element -->
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-primary-50 dark:bg-primary-900/10 rounded-full blur-3xl">
        </div>

        <div class="relative">
          <div
            class="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <IconSearch :size="48" class="text-gray-400 dark:text-gray-500" />
          </div>

          <h2 class="text-3xl font-black text-gray-900 dark:text-white mb-4">Annonce Introuvable</h2>
          <p class="text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
            Désolé, nous ne parvenons pas à trouver cette annonce. Elle a peut-être été supprimée ou archivée.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink to="/app/us/offers"
              class="btn btn-primary px-8 py-4 rounded-2xl shadow-xl shadow-primary-500/20 flex items-center justify-center">
              <IconArrowLeft class="w-5 h-5 mr-2" />
              Retour à mes annonces
            </NuxtLink>
            <button @click="handleRetry"
              class="btn btn-outline px-8 py-4 rounded-2xl border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center">
              <IconRotateClockwise class="w-5 h-5 mr-2" />
              Réessayer
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <!-- Header -->
      <div
        class="flex flex-col md:flex-row md:items-center justify-between mb-8 animate-in slide-in-from-top-4 duration-500">
        <div>
          <NuxtLink to="/app/us/offers"
            class="group inline-flex items-center text-sm font-bold text-gray-500 hover:text-primary-600 mb-4 transition-colors">
            <IconArrowLeft class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour au tableau de bord
          </NuxtLink>
          <div class="flex flex-wrap items-center gap-4">
            <h1 class="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">{{
              announcement.title }}</h1>
            <span :class="getStatusClass(announcement.status)" class="badge-large">
              {{ getStatusLabel(announcement.status) }}
            </span>
          </div>
        </div>
        <div class="flex items-center gap-3 mt-6 md:mt-0">
          <button v-if="announcement.status === 'pending'" @click="handleEdit"
            class="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary-500 text-gray-700 dark:text-gray-200 shadow-sm rounded-xl py-3 px-5 flex items-center transition-all">
            <IconPencil class="w-5 h-5 mr-2 text-primary-500" />
            Modifier
          </button>
          <button v-if="['pending', 'negotiating'].includes(announcement.status)" @click="handleCancel"
            class="btn bg-white dark:bg-gray-800 border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 shadow-sm rounded-xl py-3 px-5 flex items-center transition-all">
            <IconX class="w-5 h-5 mr-2" />
            Annuler l'annonce
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
            <div class="animate-in fade-in slide-in-from-bottom-2">
              <AnnoncesNegotiationList :items="offers" type="offer" @refresh="refreshData"
                @counter="startCounterNegotiation" />
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

    <AnnoncesNegotiationModal v-if="showNegotiationModal" :targetId="announcementId" :dataType="'announcement'"
      :originalPrice="announcement?.budget" :originalOrigin="announcement?.origin"
      :originalDestination="announcement?.destination" :initial-data="selectedProposalForCounter"
      @close="closeNegotiationModal" @success="handleNegotiationSuccess" />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useShpAnnouncementStore } from '~/stores/shpAnnouncement';
import { useCmnMessagingStore } from '~/stores/cmnMessaging';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import { IconArrowLeft, IconPencil, IconX, IconInbox, IconMailOpened, IconStarFilled, IconCheck, IconMessage, IconBadge, IconSearch, IconRotateClockwise } from '@tabler/icons-vue';

const route = useRoute();
const router = useRouter();
const announcementStore = useShpAnnouncementStore();
const messagingStore = useCmnMessagingStore();
const authStore = useCmnAuthStore();

const announcementId = route.params.id as string;
const showEditModal = ref(false);
const showNegotiationModal = ref(false);
const selectedProposalForCounter = ref<any>(null);

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
  await refreshData();
};

const refreshData = async () => {
  await announcementStore.fetchShpAnnouncement(announcementId);
  await announcementStore.fetchShpOffersForAnnouncement(announcementId);
};

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

const handleRetry = () => {
  if (process.client) {
    window.location.reload();
  }
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

const viewCarrierProfile = (carrierId: string) => {
  alert("Voir le profil du transporteur (Fonctionnalité à venir)");
};

onMounted(async () => {
  await refreshData();
});
useHead({
  title: 'Détails de l\'offre',
  meta: [
    { name: 'description', content: 'Gérez les détails de votre offre de fret publiée.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
