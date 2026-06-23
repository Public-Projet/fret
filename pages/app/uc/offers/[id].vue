<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 pb-20 pt-10">
    <div class="container-custom">

      <!-- Back nav -->
      <NuxtLink to="/app/uc/offers"
        class="inline-flex items-center text-gray-400 hover:text-primary-600 font-bold transition-all group mb-10">
        <div
          class="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mr-3 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 transition-colors">
          <IconArrowLeft class="w-5 h-5" />
        </div>
        Retour à mes offres
      </NuxtLink>

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-24">
        <div class="relative w-16 h-16 mb-6">
          <div class="absolute inset-0 border-4 border-primary-100 dark:border-primary-900/30 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin">
          </div>
        </div>
        <p class="text-gray-500 font-bold">Chargement de l'offre...</p>
      </div>

      <!-- Not found -->
      <div v-else-if="!offer" class="max-w-xl mx-auto py-16 px-6 text-center animate-in fade-in zoom-in duration-500">
        <div
          class="bg-white dark:bg-gray-800 rounded-[40px] p-12 shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 relative overflow-hidden">
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-primary-50 dark:bg-primary-900/10 rounded-full blur-3xl">
          </div>
          <div class="relative">
            <div
              class="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
              <IconSearch :size="48" class="text-gray-400 dark:text-gray-500" />
            </div>
            <h2 class="text-3xl font-black text-gray-900 dark:text-white mb-4">Offre introuvable</h2>
            <p class="text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
              L'offre demandée n'existe pas ou n'est plus disponible.
            </p>
            <NuxtLink to="/app/uc/offers"
              class="btn btn-primary px-8 py-4 rounded-2xl shadow-xl shadow-primary-500/20 flex items-center justify-center w-full sm:w-auto">
              <IconArrowLeft class="w-5 h-5 mr-2" />
              Retour à mes offres
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

        <!-- Main panel -->
        <div class="lg:col-span-2 space-y-8">

          <!-- Offer Header -->
          <div
            class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-gray-700 p-8 shadow-xl shadow-gray-200/50 dark:shadow-none relative overflow-hidden">
            <div class="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-3xl -mr-32 -mt-32"></div>
            <div class="relative">
              <div class="flex flex-wrap items-center gap-3 mb-4">
                <span :class="getStatusClass(offer.status)" class="badge">{{ getStatusLabel(offer.status) }}</span>
                <span class="text-xs font-bold text-gray-400 tabular-nums">Offre #{{ String(offer.id).slice(0, 8)
                }}</span>
              </div>

              <h1 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
                {{ offer.announcement?.title || 'Annonce supprimée' }}
              </h1>
              <p v-if="offer.message" class="text-gray-500 dark:text-gray-400 italic text-sm mb-6 line-clamp-3">
                "{{ offer.message }}"
              </p>

              <!-- Price + Date -->
              <div class="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <div>
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Votre prix proposé</p>
                  <p class="text-3xl font-black text-primary-600 leading-none">
                    {{ offer.price?.toLocaleString() }} <span class="text-sm font-bold text-gray-500">FCFA</span>
                  </p>
                </div>
                <div>
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Soumis le</p>
                  <p class="font-bold text-gray-700 dark:text-gray-300">{{ formatDate(offer.createdAt) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Negotiation history -->
          <div
            class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-gray-700 p-8 shadow-xl shadow-gray-200/50 dark:shadow-none">
            <h2 class="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center">
              <div
                class="p-3 bg-secondary-50 dark:bg-secondary-900/30 rounded-2xl text-secondary-600 mr-4 shadow-inner">
                <IconGavel class="w-5 h-5" />
              </div>
              Suivi de la négociation
            </h2>
            <CommonNegotiationList :items="[offer]" type="offer" @refresh="refreshData"
              @counter="startCounterNegotiation" />
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">

          <!-- Announcement details -->
          <div
            class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-gray-700 p-8 shadow-xl shadow-gray-200/50 dark:shadow-none">
            <h3 class="font-black text-gray-900 dark:text-white text-sm uppercase tracking-widest mb-6">Détails de
              l'annonce</h3>

            <div v-if="offer.announcement" class="space-y-5">
              <!-- Route -->
              <div class="relative pl-6 border-l-2 border-gray-100 dark:border-gray-700/50 space-y-5">
                <div class="relative">
                  <div
                    class="absolute -left-[25px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-primary-500">
                  </div>
                  <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Départ</p>
                  <p class="font-bold text-gray-900 dark:text-white">{{ offer.announcement.origin?.city }}</p>
                  <p v-if="offer.announcement.pickupDate" class="text-sm text-gray-400">{{
                    formatDate(offer.announcement.pickupDate) }}</p>
                </div>
                <div class="relative">
                  <div
                    class="absolute -left-[25px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-secondary-500">
                  </div>
                  <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Arrivée</p>
                  <p class="font-bold text-gray-900 dark:text-white">{{ offer.announcement.destination?.city }}</p>
                  <p v-if="offer.announcement.deliveryDate" class="text-sm text-gray-400">{{
                    formatDate(offer.announcement.deliveryDate) }}</p>
                </div>
              </div>

              <!-- Details grid -->
              <div class="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Marchandise</span>
                  <span class="font-bold text-gray-900 dark:text-white capitalize">{{ offer.announcement.cargoType
                    }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Poids</span>
                  <span class="font-bold text-gray-900 dark:text-white">{{ offer.announcement.weight }} kg</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Volume</span>
                  <span class="font-bold text-gray-900 dark:text-white">{{ offer.announcement.volume }} m³</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Budget expéditeur</span>
                  <span class="font-bold text-primary-600">{{ offer.announcement.budget?.toLocaleString() }} FCFA</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Messaging CTA -->
          <div
            class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-gray-700 p-6 shadow-xl shadow-gray-200/50 dark:shadow-none text-center">
            <IconMessage class="w-10 h-10 text-primary-500 mx-auto mb-3" />
            <p class="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Discutez directement avec l'expéditeur
            </p>
            <NuxtLink to="/app/messages"
              class="btn btn-primary w-full py-3 rounded-2xl flex items-center justify-center">
              <IconMessage class="w-4 h-4 mr-2" />
              Ouvrir la messagerie
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Counter-proposal modal -->
    <ModalNegotiationModal v-if="showNegotiationModal && offer"
      :targetId="String(offer.announcementId || offer.announcement?.id || '')" :dataType="'announcement'"
      :originalPrice="offer.announcement?.budget" :originalOrigin="offer.announcement?.origin"
      :originalDestination="offer.announcement?.destination" :initial-data="selectedProposalForCounter"
      @close="closeNegotiationModal" @success="handleNegotiationSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCarAnnouncementStore } from '~/stores/carAnnouncement';
import { IconArrowLeft, IconSearch, IconGavel, IconMessage } from '@tabler/icons-vue';

const route = useRoute();
const carStore = useCarAnnouncementStore();

const offerId = route.params.id as string;
const loading = ref(true);
const showNegotiationModal = ref(false);
const selectedProposalForCounter = ref<any>(null);

// Find the offer from store (data loaded once from API)
const offer = computed(() => carStore.offers.find((o: any) => String(o.id) === offerId) || null);

const refreshData = async () => {
  await carStore.fetchCarOffers();
};

onMounted(async () => {
  await refreshData();
  loading.value = false;
});

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

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    negotiating: 'En négociation',
    accepted: 'Acceptée',
    completed: 'Terminée',
    rejected: 'Refusée',
    cancelled: 'Annulée'
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
    case 'rejected':
    case 'cancelled': return `${baseClass} badge-danger`;
    default: return `${baseClass} badge-neutral`;
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

definePageMeta({ layout: 'default' });
useHead({
  title: computed(() => offer.value?.announcement?.title ? `Offre – ${offer.value.announcement.title}` : 'Détails de l\'offre'),
  meta: [
    { name: 'description', content: 'Consultez et gérez les détails de votre offre de transport soumise.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
