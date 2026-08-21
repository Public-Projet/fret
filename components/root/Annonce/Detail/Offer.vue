<template>
  <div class="space-y-8 max-w-7xl mx-auto">
    <!-- Navigation Back Link -->
    <div class="flex items-center justify-between">
      <NuxtLink to="/annonces"
        class="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/90 dark:bg-gray-800/90 border border-gray-200/80 dark:border-gray-700/80 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-300 dark:hover:border-primary-700 shadow-sm transition-all group">
        <IconArrowLeft
          class="w-4 h-4 text-gray-400 group-hover:-translate-x-1 group-hover:text-primary-600 transition-all" />
        <span class="font-semibold text-sm">Retour au marché</span>
      </NuxtLink>
    </div>

    <!-- Main Content Layout Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Main Column (2 cols) -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Hero Announcement Card -->
        <div
          class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-gray-700/70 relative overflow-hidden">
          <!-- Background Subtle Gradient Blob -->
          <div class="absolute -top-24 -right-24 w-60 h-60 bg-primary-500/5 rounded-full blur-3xl pointer-events-none">
          </div>

          <!-- Header Title & Status -->
          <div class="flex flex-col sm:flex-row justify-between items-start gap-4 mb-5">
            <h1 class="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
              {{ item.title }}
            </h1>
            <span :class="getStatusBadgeClass(item.status)"
              class="px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 tracking-wide uppercase shadow-sm">
              {{ getStatusLabel(item.status) }}
            </span>
          </div>

          <!-- Meta Information Badges -->
          <div
            class="flex flex-wrap items-center gap-y-2.5 gap-x-4 text-xs font-medium text-gray-500 dark:text-gray-400 mb-8 border-b border-gray-100 dark:border-gray-700/60 pb-5">
            <div
              class="flex items-center bg-gray-50 dark:bg-gray-900/50 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-700/50">
              <IconCalendar class="w-4 h-4 mr-1.5 text-primary-500" />
              <span>Publié le <strong class="text-gray-700 dark:text-gray-300">{{ formatDate(item.createdAt)
                  }}</strong></span>
            </div>

            <div v-if="item.distance"
              class="flex items-center bg-gray-50 dark:bg-gray-900/50 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-700/50">
              <IconMapPin class="w-4 h-4 mr-1.5 text-primary-500" />
              <span>Distance : <strong class="text-gray-700 dark:text-gray-300">{{ item.distance }} km</strong></span>
            </div>

            <div class="flex items-center gap-3 ml-auto">
              <div
                class="flex items-center bg-primary-50/70 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-3 py-1.5 rounded-xl border border-primary-100 dark:border-primary-800/40"
                title="Nombre total de vues">
                <IconEye class="w-4 h-4 mr-1 text-primary-500" />
                <span class="font-bold">{{ item.views || 0 }}</span>
                <span class="ml-1 text-[11px] opacity-80">vues</span>
              </div>
              <div
                class="flex items-center bg-blue-50/70 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-xl border border-blue-100 dark:border-blue-800/40"
                title="Nombre de visiteurs uniques">
                <IconUsers class="w-4 h-4 mr-1 text-blue-500" />
                <span class="font-bold">{{ item.uniqueViews || 0 }}</span>
                <span class="ml-1 text-[11px] opacity-80">uniques</span>
              </div>
            </div>
          </div>

          <!-- Trajet Timeline Visual Box -->
          <div
            class="bg-gradient-to-br from-gray-50 via-gray-50/80 to-gray-100/50 dark:from-gray-900/60 dark:via-gray-900/40 dark:to-gray-800/40 rounded-2xl p-6 lg:p-7 mb-8 border border-gray-100 dark:border-gray-700/50 relative">
            <div class="relative pl-8 border-l-2 border-dashed border-primary-300 dark:border-primary-700/60 space-y-8">
              <!-- Enlèvement (Origin) -->
              <div class="relative">
                <div
                  class="absolute -left-[41px] top-0 w-6 h-6 rounded-full border-4 border-white dark:border-gray-800 bg-primary-600 shadow-md shadow-primary-500/30 flex items-center justify-center">
                  <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span
                      class="text-xs font-black text-primary-600 dark:text-primary-400 uppercase tracking-wider">Enlèvement</span>
                    <span v-if="item.pickupDate"
                      class="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2.5 py-0.5 rounded-full border border-gray-200/60 dark:border-gray-700">
                      {{ formatDateFull(item.pickupDate) }}
                    </span>
                  </div>
                  <p class="font-bold text-gray-900 dark:text-white text-xl">
                    {{ item.origin?.city }} <span v-if="item.origin?.country"
                      class="text-sm font-medium text-gray-500">({{ item.origin?.country }})</span>
                  </p>
                  <p v-if="item.origin?.address" class="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{{
                    item.origin?.address }}</p>
                </div>
              </div>

              <!-- Livraison (Destination) -->
              <div class="relative">
                <div
                  class="absolute -left-[41px] top-0 w-6 h-6 rounded-full border-4 border-white dark:border-gray-800 bg-emerald-500 shadow-md shadow-emerald-500/30 flex items-center justify-center">
                  <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span
                      class="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Livraison</span>
                    <span v-if="item.deliveryDate"
                      class="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2.5 py-0.5 rounded-full border border-gray-200/60 dark:border-gray-700">
                      {{ formatDateFull(item.deliveryDate) }}
                    </span>
                  </div>
                  <p class="font-bold text-gray-900 dark:text-white text-xl">
                    {{ item.destination?.city }} <span v-if="item.destination?.country"
                      class="text-sm font-medium text-gray-500">({{ item.destination?.country }})</span>
                  </p>
                  <p v-if="item.destination?.address" class="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{{
                    item.destination?.address }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Caractéristiques (4-Grid Stat Cards) -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div
              class="p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/60 dark:to-gray-800/40 rounded-2xl text-center border border-gray-100 dark:border-gray-700/60 shadow-sm hover:border-primary-200 dark:hover:border-primary-800/50 transition-all">
              <div
                class="w-10 h-10 mx-auto mb-2 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                <IconCube class="w-5 h-5" />
              </div>
              <p class="text-[11px] text-gray-400 uppercase font-black tracking-wider mb-1">Marchandise</p>
              <p class="font-bold text-gray-900 dark:text-white capitalize truncate px-1">{{ item.cargoType || 'Fret' }}
              </p>
            </div>

            <div
              class="p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/60 dark:to-gray-800/40 rounded-2xl text-center border border-gray-100 dark:border-gray-700/60 shadow-sm hover:border-primary-200 dark:hover:border-primary-800/50 transition-all">
              <div
                class="w-10 h-10 mx-auto mb-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <IconScale class="w-5 h-5" />
              </div>
              <p class="text-[11px] text-gray-400 uppercase font-black tracking-wider mb-1">Poids</p>
              <p class="font-bold text-gray-900 dark:text-white">{{ item.weight ? `${item.weight} kg` : '-' }}</p>
            </div>

            <div
              class="p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/60 dark:to-gray-800/40 rounded-2xl text-center border border-gray-100 dark:border-gray-700/60 shadow-sm hover:border-primary-200 dark:hover:border-primary-800/50 transition-all">
              <div
                class="w-10 h-10 mx-auto mb-2 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <IconArrowsMaximize class="w-5 h-5" />
              </div>
              <p class="text-[11px] text-gray-400 uppercase font-black tracking-wider mb-1">Volume</p>
              <p class="font-bold text-gray-900 dark:text-white">{{ item.volume ? `${item.volume} m³` : '-' }}</p>
            </div>

            <div
              class="p-4 bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-gray-800/40 rounded-2xl text-center border border-emerald-100 dark:border-emerald-900/30 shadow-sm hover:border-emerald-300 dark:hover:border-emerald-800 transition-all">
              <div
                class="w-10 h-10 mx-auto mb-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <IconCurrencyEuro class="w-5 h-5" />
              </div>
              <p class="text-[11px] text-emerald-600/80 dark:text-emerald-400 uppercase font-black tracking-wider mb-1">
                Budget</p>
              <p class="font-extrabold text-emerald-600 dark:text-emerald-400 text-base">
                {{ item.budget ? formatPrice(item.budget) : 'Sur devis' }}
              </p>
            </div>
          </div>

          <!-- Description Block -->
          <div v-if="item.description" class="pt-4 border-t border-gray-100 dark:border-gray-700/60">
            <h3 class="font-bold text-gray-900 dark:text-white text-base mb-2">Description du besoin</h3>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line text-sm">{{ item.description
            }}</p>
          </div>
        </div>

        <!-- Owner's Negotiation Dashboard -->
        <div v-if="isOwner"
          class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-gray-700/70 space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-extrabold text-gray-900 dark:text-white">Tableau de Bord des Négociations</h3>
            <span
              class="px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold rounded-xl border border-primary-100 dark:border-primary-800">
              {{ item.offers?.length || 0 }} offre(s)
            </span>
          </div>
          <CommonNegotiationList :items="item.offers || []" type="offer" @refresh="$emit('refresh')"
            @counter="$emit('counter', $event)" />
        </div>
      </div>

      <!-- Right Column Sidebar (1 col) -->
      <div class="space-y-6">
        <!-- Expéditeur Profile Card -->
        <div
          class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 lg:p-7 shadow-sm border border-gray-100 dark:border-gray-700/70 space-y-6">
          <h3
            class="text-lg font-extrabold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700/60 pb-3">
            À propos de l'expéditeur
          </h3>

          <div class="flex items-center gap-4">
            <div
              class="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-md shadow-primary-500/20 shrink-0">
              {{ (item.shipper || item.user)?.firstname?.[0] || 'E' }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="font-bold text-gray-900 dark:text-white text-base truncate">
                {{ isOwner ? 'Vous' : ((item.shipper || item.user)?.company || ((item.shipper || item.user)?.firstname
                  || '') + ' ' + ((item.shipper || item.user)?.lastname || '')) }}
              </p>
              <div class="flex items-center text-sm mt-1">
                <div class="flex mr-2 text-amber-400">
                  <template v-for="i in 5" :key="i">
                    <IconStarFilled v-if="i <= Math.round((item.shipper || item.user)?.rating || 0)" class="w-4 h-4" />
                    <IconStar v-else class="w-4 h-4 text-gray-200 dark:text-gray-700" />
                  </template>
                </div>
                <span class="font-bold text-gray-800 dark:text-gray-200 text-xs">{{ (item.shipper || item.user)?.rating
                  || '0.0'
                }}</span>
                <span class="ml-1 text-xs text-gray-400">({{ (item.shipper || item.user)?.reviewsCount || (item.shipper
                  ||
                  item.user)?.reviewCount || 0 }})</span>
              </div>
            </div>
          </div>

          <div class="space-y-3 pt-2">
            <div
              class="flex items-center p-3 bg-emerald-50/80 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
              <IconShieldCheck class="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2.5 shrink-0" />
              <span class="text-xs font-bold text-emerald-800 dark:text-emerald-300">Compte Expéditeur vérifié</span>
            </div>

            <!-- Rating Action Button -->
            <button v-if="canRate" @click="$emit('showRatingModal')"
              class="w-full py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-700/70 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs transition-all flex items-center justify-center gap-2">
              <IconStar class="w-4 h-4 text-amber-500" />
              <span>{{ ratingLabel }}</span>
            </button>
          </div>
        </div>

        <!-- Carrier CTA Box (Faire une offre) -->
        <div v-if="authStore.isCarrier && item.status === 'pending' && !hasAlreadyOffered"
          class="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-6 lg:p-7 shadow-xl shadow-primary-600/20 text-white space-y-5">
          <div class="space-y-2">
            <h3 class="text-xl font-extrabold text-white">Proposer vos services</h3>
            <p class="text-primary-100 text-xs leading-relaxed font-medium">
              Soumettez votre tarif et vos conditions de transport à l'expéditeur dès maintenant.
            </p>
          </div>
          <button @click="$emit('enroll')"
            class="w-full py-3.5 px-4 rounded-2xl bg-white text-primary-700 hover:bg-primary-50 font-extrabold text-sm shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
            <span>Soumettre une offre</span>
          </button>
        </div>

        <!-- Carrier Ongoing Negotiation Card -->
        <div
          v-else-if="authStore.isCarrier && (item.status === 'pending' || item.status === 'negotiating') && hasAlreadyOffered"
          class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 lg:p-7 shadow-sm border border-gray-100 dark:border-gray-700/70 space-y-5">
          <div class="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700/60 pb-4">
            <div
              class="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
              <IconMessage class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900 dark:text-white">Négociation en cours</h3>
              <p class="text-xs text-gray-400">Votre offre a été transmise.</p>
            </div>
          </div>

          <div v-if="myOffer" class="animate-in fade-in duration-300">
            <CommonNegotiationList :items="[myOffer]" type="offer" @refresh="$emit('refresh')"
              @counter="$emit('counter', $event)" />
          </div>

          <NuxtLink to="/app/messages"
            class="w-full py-3 px-4 rounded-xl border border-amber-200 dark:border-amber-900/40 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 font-bold text-xs flex items-center justify-center gap-2 transition-all">
            <IconMessage class="w-4 h-4" />
            <span>Accéder à la messagerie</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IconArrowLeft, IconCalendar, IconMapPin, IconCube, IconScale, IconArrowsMaximize, IconCurrencyEuro, IconStarFilled, IconStar, IconShieldCheck, IconEye, IconUsers, IconMessage } from '@tabler/icons-vue';
import { useCmnAuthStore } from '~/stores/cmnAuth';

const props = defineProps<{
  item: any;
  isOwner: boolean;
  canRate: boolean;
  ratingLabel: string;
}>();

const emit = defineEmits<{
  (e: 'showRatingModal'): void;
  (e: 'enroll'): void;
  (e: 'refresh'): void;
  (e: 'counter', proposal: any): void;
}>();

const authStore = useCmnAuthStore();

const myOffer = computed(() => {
  if (!props.item?.offers || !authStore.currentUser) return null;
  return props.item.offers.find((o: any) => o.carrier === authStore.currentUser?.id || o.carrier?.id === authStore.currentUser?.id);
});

const hasAlreadyOffered = computed(() => !!myOffer.value);

const formatDate = (dateStr: string | number) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatDateFull = (dateStr: string | number) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatPrice = (val: number) => {
  if (!val) return 'Sur devis';
  return new Intl.NumberFormat('fr-FR').format(val) + ' FCFA';
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: 'Actif',
    full: 'Complet',
    expired: 'Expiré',
    prolonged: 'Prolongé',
    pending: 'En attente',
    accepted: 'Accepté',
    negotiating: 'En négociation'
  };
  return labels[status] || status;
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'active':
    case 'accepted': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
    case 'pending':
    case 'negotiating': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20';
    case 'full': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
    default: return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20';
  }
};
</script>
