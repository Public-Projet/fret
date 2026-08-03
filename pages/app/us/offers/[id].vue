<template>
  <div class="container-custom py-8">
    <!-- Skeleton Loading State -->
    <div v-if="loading" class="space-y-8 animate-in fade-in duration-500">
      <!-- Header Skeleton -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-3 flex-1">
          <UiAppSkeleton type="text" width="150px" height="16px" />
          <div class="flex items-center gap-3">
            <UiAppSkeleton type="heading" width="300px" height="36px" />
            <UiAppSkeleton type="text" width="100px" height="24px" class="rounded-full" />
          </div>
        </div>
        <div class="flex gap-3">
          <UiAppSkeleton type="text" width="120px" height="42px" class="rounded-xl" />
          <UiAppSkeleton type="text" width="120px" height="42px" class="rounded-xl" />
        </div>
      </div>

      <!-- Content Grid Skeleton -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main: Offers -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 space-y-4">
            <UiAppSkeleton type="heading" width="200px" height="24px" />
            <UiAppSkeleton type="text" :count="3" gap="3" />
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 space-y-4">
            <UiAppSkeleton type="heading" width="250px" height="24px" />
            <div class="space-y-4 mt-6">
              <UiAppSkeleton type="table-row" v-for="i in 2" :key="i" height="80px" />
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <UiAppSkeleton type="rectangle" height="100px" class="rounded-[2rem]" />
          <div class="space-y-6 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
            <UiAppSkeleton type="heading" width="150px" height="20px" />
            <div class="space-y-6 mt-6">
              <div class="border-l-2 border-gray-200 dark:border-gray-700 pl-6 space-y-6">
                <UiAppSkeleton type="text" width="100%" height="40px" />
                <UiAppSkeleton type="text" width="100%" height="40px" />
              </div>
              <div class="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <UiAppSkeleton type="text" v-for="i in 5" :key="i" height="20px" />
              </div>
            </div>
          </div>
        </div>
      </div>
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
          <!-- Description Card -->
          <div v-if="announcement.description" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700 p-6">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-3">Description de l'annonce</h3>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{{ announcement.description }}</p>
          </div>

          <!-- Offers Received -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <IconInbox class="w-5 h-5 mr-2 text-primary-600" />
              Offres reçues ({{ offers.length }})
            </h2>
            <div class="animate-in fade-in slide-in-from-bottom-2">
              <CommonNegotiationList :items="offers" type="offer" @refresh="refreshData"
                @counter="startCounterNegotiation" />
            </div>
          </div>
        </div>

        <!-- Sidebar: Details -->
        <div class="space-y-6">
          <!-- Budget Card -->
          <div class="bg-gradient-to-br from-primary-600 to-primary-800 text-white rounded-[2rem] p-6 shadow-lg shadow-primary-600/10">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-primary-200 uppercase tracking-widest">Budget proposé</span>
              <span v-if="announcement.distance && announcement.distance > 0" class="text-xs bg-white/20 px-2.5 py-1 rounded-full font-bold text-white">{{ announcement.distance }} km</span>
            </div>
            <p class="text-3xl font-black">
              {{ announcement.budget.toLocaleString() }} <span class="text-lg font-bold">FCFA</span>
            </p>
          </div>

          <!-- Detailed Transport Info -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/60 dark:border-gray-700 p-6 space-y-6">
            <h3 class="font-bold text-gray-900 dark:text-white flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-700/60">
              <IconMapPin class="w-5 h-5 text-primary-600" />
              Détails du transport
            </h3>

            <!-- Trajet détaillé -->
            <div class="relative pl-6 border-l-2 border-primary-100 dark:border-primary-900/40 space-y-6">
              <!-- Départ -->
              <div class="relative">
                <div class="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-primary-600 dark:bg-gray-800">
                </div>
                <div>
                  <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Départ</p>
                  <p class="font-bold text-gray-900 dark:text-white text-base">
                    {{ announcement.origin.city }}<span v-if="announcement.origin.country">, {{ announcement.origin.country }}</span>
                  </p>
                  <p v-if="announcement.origin.address" class="text-sm text-gray-500 mt-0.5">
                    {{ announcement.origin.address }}
                  </p>
                  <p class="text-xs text-gray-400 mt-1 flex items-center">
                    <IconCalendar class="w-3.5 h-3.5 mr-1 text-primary-500" />
                    Enlèvement : {{ formatDate(announcement.pickupDate) }}
                  </p>
                </div>
              </div>
              <!-- Arrivée -->
              <div class="relative">
                <div class="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-secondary-600 dark:bg-gray-800">
                </div>
                <div>
                  <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Arrivée</p>
                  <p class="font-bold text-gray-900 dark:text-white text-base">
                    {{ announcement.destination.city }}<span v-if="announcement.destination.country">, {{ announcement.destination.country }}</span>
                  </p>
                  <p v-if="announcement.destination.address" class="text-sm text-gray-500 mt-0.5">
                    {{ announcement.destination.address }}
                  </p>
                  <p class="text-xs text-gray-400 mt-1 flex items-center">
                    <IconCalendar class="w-3.5 h-3.5 mr-1 text-secondary-500" />
                    Livraison : {{ formatDate(announcement.deliveryDate) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Caractéristiques techniques de la marchandise -->
            <div class="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700/60 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">Marchandise</span>
                <span class="font-bold text-gray-900 dark:text-white capitalize">{{ announcement.cargoType }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Poids</span>
                <span class="font-bold text-gray-900 dark:text-white">{{ announcement.weight }} kg</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Volume</span>
                <span class="font-bold text-gray-900 dark:text-white">{{ announcement.volume }} m³</span>
              </div>
              <div v-if="announcement.distance && announcement.distance > 0" class="flex justify-between">
                <span class="text-gray-500">Distance estimée</span>
                <span class="font-bold text-gray-900 dark:text-white">{{ announcement.distance }} km</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Vues totales</span>
                <span class="font-bold text-gray-900 dark:text-white">{{ announcement.views || 0 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Vues uniques</span>
                <span class="font-bold text-gray-900 dark:text-white">{{ announcement.uniqueViews || 0 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Publiée le</span>
                <span class="font-bold text-gray-900 dark:text-white">{{ formatDate(announcement.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ModalDashboardEditAnnounce v-if="showEditModal" :announcement="announcement" :loading="isUpdating" @close="showEditModal = false"
      @update="handleUpdate" />

    <ModalAnnonceNegotiation v-if="showNegotiationModal" :targetId="announcementId" :dataType="'announcement'"
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
import { IconArrowLeft, IconPencil, IconX, IconInbox, IconMailOpened, IconStarFilled, IconCheck, IconMessage, IconBadge, IconSearch, IconRotateClockwise, IconCalendar, IconMapPin, IconArrowRight, IconEye, IconUsers } from '@tabler/icons-vue';

const route = useRoute();
const router = useRouter();
const announcementStore = useShpAnnouncementStore();
const messagingStore = useCmnMessagingStore();
const authStore = useCmnAuthStore();

const announcementId = route.params.id as string;
const showEditModal = ref(false);
const showNegotiationModal = ref(false);
const selectedProposalForCounter = ref<any>(null);
const isUpdating = ref(false);

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
  await refreshData(true);
};

const refreshData = async (forceSilent: boolean = false) => {
  await announcementStore.fetchShpAnnouncement(announcementId, forceSilent);
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
  isUpdating.value = true;
  try {
    await announcementStore.updateShpAnnouncement(announcementId, updatedData);
    showEditModal.value = false;
  } finally {
    isUpdating.value = false;
  }
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
