<template>
  <div class="space-y-8">
    <NuxtLink to="/annonces"
      class="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-8 transition-colors">
      <IconArrowLeft class="w-5 h-5 mr-2" />
      Retour au marché
    </NuxtLink>

    <div class="space-y-8">
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
            <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">{{ item.title }}</h1>
            <span :class="getStatusBadgeClass(item.status)" class="badge shrink-0">
              {{ getStatusLabel(item.status) }}
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-gray-500 dark:text-gray-400 mb-6 border-b border-gray-50 dark:border-gray-700 pb-4">
            <div class="flex items-center whitespace-nowrap" title="Date de publication">
              <IconCalendar class="w-4 h-4 mr-1 text-primary-500" />
              <span>Publié le {{ formatDate(item.createdAt) }}</span>
            </div>
            <div class="flex items-center whitespace-nowrap" title="Distance">
              <IconMapPin class="w-4 h-4 mr-1 text-primary-500" />
              <span>{{ item.distance }} km</span>
            </div>
            <div class="flex items-center whitespace-nowrap" title="Vues totales">
              <IconEye class="w-4 h-4 mr-1 text-primary-500" />
              <span class="font-bold">{{ item.views || 0 }}</span>
            </div>
            <div class="flex items-center whitespace-nowrap" title="Vues uniques">
              <IconUsers class="w-4 h-4 mr-1 text-primary-500" />
              <span class="font-bold">{{ item.uniqueViews || 0 }}</span>
            </div>
          </div>

          <!-- Trajet -->
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 mb-6">
            <div class="relative pl-8 border-l-2 border-dashed border-gray-300 dark:border-gray-600 space-y-8">
              <div class="relative">
                <div
                  class="absolute -left-[39px] top-0 w-5 h-5 rounded-full border-4 border-white dark:border-gray-800 bg-primary-600">
                </div>
                <div>
                  <p class="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">
                    Enlèvement</p>
                  <p class="font-medium text-gray-900 dark:text-white text-lg">
                    {{ item.origin?.city }} <span v-if="item.origin?.postalCode">({{ item.origin?.postalCode }})</span>
                  </p>
                  <p class="text-gray-600 dark:text-gray-400">{{ item.origin?.address }}</p>
                </div>
              </div>
              <div class="relative">
                <div
                  class="absolute -left-[39px] top-0 w-5 h-5 rounded-full border-4 border-white dark:border-gray-800 bg-secondary-600">
                </div>
                <div>
                  <p
                    class="text-xs font-semibold text-secondary-600 dark:text-secondary-400 uppercase tracking-wider mb-1">
                    Livraison</p>
                  <p class="font-medium text-gray-900 dark:text-white text-lg">
                    {{ item.destination?.city }} <span v-if="item.destination?.postalCode">({{ item.destination?.postalCode }})</span>
                  </p>
                  <p class="text-gray-600 dark:text-gray-400">{{ item.destination?.address }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Caractéristiques -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div class="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl text-center border border-gray-100 dark:border-gray-700 font-mono">
              <IconCube class="w-6 h-6 mx-auto text-primary-500 mb-2" />
              <p class="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Type</p>
              <p class="font-bold text-gray-900 dark:text-white capitalize truncate px-1">{{ item.cargoType }}</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl text-center border border-gray-100 dark:border-gray-700 font-mono">
              <IconScale class="w-6 h-6 mx-auto text-primary-500 mb-2" />
              <p class="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Poids</p>
              <p class="font-bold text-gray-900 dark:text-white">{{ item.weight }} kg</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl text-center border border-gray-100 dark:border-gray-700 font-mono">
              <IconArrowsMaximize class="w-6 h-6 mx-auto text-primary-500 mb-2" />
              <p class="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Volume</p>
              <p class="font-bold text-gray-900 dark:text-white">{{ item.volume }} m³</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl text-center border border-gray-100 dark:border-gray-700 font-mono">
              <IconCurrencyEuro class="w-6 h-6 mx-auto text-primary-500 mb-2" />
              <p class="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Budget</p>
              <p class="font-bold text-primary-600">{{ item.budget }} FCFA</p>
            </div>
          </div>

          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ item.description }}</p>
          </div>

      </div>

      <!-- Actions & Info (Moved from Sidebar) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">À propos de l'expéditeur</h3>
          <div class="flex items-center gap-4 mb-6">
            <div
              class="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-900/10 rounded-2xl flex items-center justify-center text-primary-600 font-black text-2xl uppercase border border-primary-200 dark:border-primary-800">
              {{ (item.shipper || item.user)?.firstName?.[0] || 'E' }}
            </div>
            <div>
              <p class="font-black text-gray-900 dark:text-white text-lg">
                {{ isOwner ? 'Vous' : ((item.shipper || item.user)?.company || (item.shipper || item.user)?.firstName + ' ' + ((item.shipper || item.user)?.lastName || '')) }}
              </p>
              <div class="flex items-center text-sm">
                <div class="flex mr-2 text-yellow-400">
                  <template v-for="i in 5" :key="i">
                    <IconStarFilled v-if="i <= Math.round((item.shipper || item.user)?.rating || 0)" class="w-4 h-4" />
                    <IconStar v-else class="w-4 h-4 text-gray-200" />
                  </template>
                </div>
                <span class="font-black text-gray-700 dark:text-gray-300">{{ (item.shipper || item.user)?.rating || '0.0' }}</span>
                <span class="ml-1 text-gray-500">({{ (item.shipper || item.user)?.reviewCount || 0 }} avis)</span>
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <div class="flex items-center p-3 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/20">
              <IconShieldCheck class="w-5 h-5 text-green-600 mr-2 shrink-0" />
              <span class="text-sm font-bold text-green-700 dark:text-green-400">Compte Expéditeur vérifié</span>
            </div>
 
            <!-- Rating Action -->
            <button v-if="canRate" @click="$emit('showRatingModal')" class="btn btn-secondary w-full rounded-xl py-3 mt-4 transition-all hover:scale-[1.02]">
              {{ ratingLabel }}
            </button>
          </div>
        </div>

        <div v-if="authStore.isCarrier && item.status === 'pending' && !hasAlreadyOffered"
          class="bg-white dark:bg-gray-800 rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Faire une offre</h3>
          <p class="text-gray-500 mb-6 font-medium">Proposez vos services pour ce transport et entamez la négociation avec l'expéditeur.</p>
          <button @click="$emit('enroll')" class="btn btn-primary w-full py-4 rounded-2xl shadow-md shadow-primary-500/20">
            Proposer mes services
          </button>
        </div>
        
        <div v-else-if="authStore.isCarrier && (item.status === 'pending' || item.status === 'negotiating') && hasAlreadyOffered"
          class="bg-white dark:bg-gray-800 rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center text-center">
          <div class="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconMessage class="w-8 h-8 text-amber-500" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Négociation en cours</h3>
          <p class="text-gray-500 mb-6 text-sm">Vous avez déjà fait une offre. Suivez vos messages pour la suite.</p>
          <NuxtLink to="/app/messages" class="btn btn-outline border-amber-200 text-amber-700 hover:bg-amber-50 w-full py-4 rounded-2xl">
            Voir mes messages
          </NuxtLink>
        </div>
      </div>

      <!-- Negotiations (Owner only) -->
      <div v-if="isOwner" class="mt-8 flex flex-col gap-4">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white px-2">Tableau de Bord des Négociations</h3>
        <AnnoncesNegotiationList :items="item.offers" type="offer" @refresh="$emit('refresh')" />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IconArrowLeft, IconCalendar, IconMapPin, IconCube, IconScale, IconArrowsMaximize, IconCurrencyEuro, IconStarFilled, IconStar, IconShieldCheck, IconEye, IconUsers, IconMessage } from '@tabler/icons-vue';
import { useAuthStore } from '~/stores/auth';

const props = defineProps<{
  item: any;
  isOwner: boolean;
  canRate: boolean;
  ratingLabel: string;
}>();

defineEmits<{
  (e: 'showRatingModal'): void;
  (e: 'enroll'): void;
  (e: 'refresh'): void;
}>();

const authStore = useAuthStore();

const hasAlreadyOffered = computed(() => {
  if (!props.item?.offers || !authStore.currentUser) return false;
  return props.item.offers.some((o: any) => o.carrier === authStore.currentUser?.id || o.carrier?.id === authStore.currentUser?.id);
});

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: 'Actif',
    full: 'Complet',
    expired: 'Expiré',
    prolonged: 'Prolongé',
    pending: 'En attente',
    accepted: 'Accepté'
  };
  return labels[status] || status;
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'active':
    case 'accepted': return 'badge-success';
    case 'pending': return 'badge-info';
    case 'full': return 'badge-warning';
    default: return 'badge-neutral';
  }
};
</script>
