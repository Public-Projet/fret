<template>
  <div class="space-y-8 max-w-7xl mx-auto">
    <!-- Back Navigation Link -->
    <div class="flex items-center justify-between">
      <NuxtLink to="/annonces"
        class="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/90 dark:bg-gray-800/90 border border-gray-200/80 dark:border-gray-700/80 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-300 dark:hover:border-primary-700 shadow-sm transition-all group">
        <IconArrowLeft class="w-4 h-4 text-gray-400 group-hover:-translate-x-1 group-hover:text-primary-600 transition-all" />
        <span class="font-semibold text-sm">Retour au marché</span>
      </NuxtLink>
    </div>

    <div class="space-y-8">
      <!-- Main Hero Card -->
      <div
        class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/70 p-6 lg:p-8 relative overflow-hidden">
        <!-- Top Info Header -->
        <div class="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
          <div class="flex-1 space-y-3">
            <div class="flex flex-wrap items-center gap-3">
              <span class="px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 tracking-wide uppercase shadow-sm" :class="getStatusBadgeClass(item.status)">
                {{ getStatusLabel(item.status) }}
              </span>
              <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center">
                Proposé par
                <NuxtLink :to="`/users/${item.carrier?.id}?role=carrier`" class="ml-1 text-primary-600 dark:text-primary-400 font-bold hover:underline">
                  {{ isOwner ? 'Vous' : ((item.carrier?.firstname || item.carrier?.lastname) ? (item.carrier.firstname + ' ' + item.carrier.lastname) : 'Transporteur') }}
                </NuxtLink>
              </span>
              <div class="flex items-center text-amber-400 text-xs">
                <template v-for="i in 5" :key="i">
                  <IconStarFilled v-if="i <= Math.round(item.carrier?.rating || 0)" class="w-3.5 h-3.5" />
                  <IconStar v-else class="w-3.5 h-3.5 text-gray-200 dark:text-gray-700" />
                </template>
                <span class="text-xs font-bold text-gray-600 dark:text-gray-400 ml-1">({{ item.carrier?.rating || '0.0' }})</span>
              </div>
            </div>

            <h1 class="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
              Trajet : {{ item.origin?.city }} → {{ item.destination?.city || 'Toutes destinations' }}
            </h1>
          </div>

          <div
            class="w-full lg:w-auto flex flex-row lg:flex-col justify-between items-end lg:text-right border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100 dark:border-gray-700/60 gap-3">
            <div>
              <p class="text-2xl md:text-3xl font-black text-primary-600 dark:text-primary-400">
                {{ item.price ? formatPrice(item.price) : 'Prix sur devis' }}
              </p>
              <p class="text-xs text-gray-400 italic">Tarif indicatif proposé par le transporteur</p>
            </div>
            <div class="flex items-center justify-end gap-3 text-xs font-medium text-gray-500">
              <div class="flex items-center bg-primary-50/70 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-3 py-1.5 rounded-xl border border-primary-100 dark:border-primary-800/40" title="Vues totales">
                <IconEye class="w-4 h-4 mr-1 text-primary-500" />
                <span class="font-bold">{{ item.views || 0 }}</span>
                <span class="ml-1 text-[11px] opacity-80">vues</span>
              </div>
              <div class="flex items-center bg-blue-50/70 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-xl border border-blue-100 dark:border-blue-800/40" title="Vues uniques">
                <IconUsers class="w-4 h-4 mr-1 text-blue-500" />
                <span class="font-bold">{{ item.uniqueViews || 0 }}</span>
                <span class="ml-1 text-[11px] opacity-80">uniques</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Route Visual Box -->
        <div class="bg-gradient-to-br from-gray-50 via-gray-50/80 to-gray-100/50 dark:from-gray-900/60 dark:via-gray-900/40 dark:to-gray-800/40 rounded-2xl p-6 lg:p-8 mb-8 border border-gray-100 dark:border-gray-700/50">
          <div
            class="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative text-center md:text-left">
            <div class="flex-1 w-full md:w-auto">
              <p class="text-xs font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1">Départ</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">{{ item.origin?.city }}, {{ item.origin?.country }}</p>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">{{ formatDateFull(item.startDate) }}</p>
            </div>

            <div class="flex flex-col items-center justify-center">
              <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center shadow-sm mb-2">
                <IconTruck class="w-6 h-6" />
              </div>
              <div class="w-24 md:w-32 h-0.5 border-t-2 border-dashed border-primary-300 dark:border-primary-700"></div>
            </div>

            <div class="flex-1 w-full md:w-auto md:text-right">
              <p class="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Arrivée</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">{{ item.destination?.city || 'Toutes destinations' }}</p>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">{{ formatDateFull(item.endDate) }}</p>
            </div>
          </div>
        </div>

        <!-- Vehicle Details Grid -->
        <div>
          <h3 class="font-bold text-gray-900 dark:text-white mb-4 text-base">Informations du Véhicule</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="p-4 bg-gray-50/80 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-700/50">
              <p class="text-[11px] text-gray-400 uppercase font-black tracking-wider mb-1">Type</p>
              <p class="font-bold text-gray-900 dark:text-white capitalize truncate">{{ item.vehicle?.type || '-' }}</p>
            </div>
            <div class="p-4 bg-gray-50/80 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-700/50">
              <p class="text-[11px] text-gray-400 uppercase font-black tracking-wider mb-1">Capacité</p>
              <p class="font-bold text-gray-900 dark:text-white">{{ item.vehicle?.capacity ? `${item.vehicle.capacity} kg` : '-' }}</p>
            </div>
            <div class="p-4 bg-gray-50/80 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-700/50">
              <p class="text-[11px] text-gray-400 uppercase font-black tracking-wider mb-1">Volume</p>
              <p class="font-bold text-gray-900 dark:text-white">{{ item.vehicle?.volume ? `${item.vehicle.volume} m³` : '-' }}</p>
            </div>
            <div class="p-4 bg-gray-50/80 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-700/50">
              <p class="text-[11px] text-gray-400 uppercase font-black tracking-wider mb-1">Marque / Modèle</p>
              <p class="font-bold text-gray-900 dark:text-white truncate">{{ item.vehicle?.brand || '-' }} {{ item.vehicle?.model || '' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Card -->
      <div
        class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/70 p-6 lg:p-8">
        <h3 class="text-lg font-extrabold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700/60 pb-3">
          Actions & Inscription
        </h3>

        <div v-if="isOwner" class="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-700/50 text-center">
          <p class="text-sm font-semibold text-gray-600 dark:text-gray-300">Vous êtes le propriétaire de cette offre de transport.</p>
        </div>

        <div v-else-if="authStore.isShipper" class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div :class="[alreadyEnrolled ? 'lg:col-span-3' : 'lg:col-span-1']">
            <button v-if="!alreadyEnrolled" @click="$emit('enroll')"
              class="w-full py-4 px-6 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-extrabold text-sm shadow-md shadow-primary-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
              S'inscrire sur ce trajet
            </button>

            <div v-else class="space-y-4">
              <div
                class="bg-blue-50/80 dark:bg-blue-950/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                <p class="text-blue-700 dark:text-blue-400 font-extrabold text-sm flex items-center mb-3">
                  <IconCheck class="w-5 h-5 mr-2 text-blue-600" />
                  {{ getMyEnrollmentStatusText() }}
                </p>
                <div v-if="myEnrollment" class="mt-4 border-t border-blue-200/60 dark:border-blue-800/40 pt-4">
                  <CommonNegotiationList :items="[myEnrollment]" type="avail" @refresh="$emit('refresh')"
                    @counter="$emit('counter', $event)" />
                </div>
              </div>
            </div>
          </div>

          <NuxtLink to="/app/messages"
            class="py-4 px-6 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 text-center flex items-center justify-center gap-2 transition-all"
            :class="[alreadyEnrolled ? (canRate ? 'lg:col-span-2' : 'lg:col-span-3') : (canRate ? 'lg:col-span-1' : 'lg:col-span-2')]">
            <IconMessage class="w-4 h-4" />
            <span>Contacter le transporteur</span>
          </NuxtLink>

          <!-- Rating Action Button -->
          <button v-if="canRate" @click="$emit('showRatingModal')"
            class="py-4 px-6 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-bold text-sm hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2">
            <IconStar class="w-4 h-4 text-amber-500" />
            <span>Noter ce transporteur</span>
          </button>
        </div>

        <div v-else class="text-center p-8 bg-gray-50/80 dark:bg-gray-900/40 rounded-2xl max-w-sm mx-auto border border-gray-100 dark:border-gray-700/50 space-y-3">
          <IconUser class="w-10 h-10 mx-auto text-gray-400" />
          <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Connectez-vous en tant qu'expéditeur pour réserver ou négocier ce trajet.</p>
          <NuxtLink to="/auth/login" class="inline-flex items-center justify-center w-full py-3 rounded-xl bg-primary-600 text-white font-bold text-xs shadow-sm hover:bg-primary-700 transition-all">
            Connexion
          </NuxtLink>
        </div>
      </div>

      <!-- Negotiations (Owner only) -->
      <div v-if="isOwner" class="mt-8 space-y-4">
        <h3 class="text-xl font-extrabold text-gray-900 dark:text-white px-2">Tableau de Bord des Réservations</h3>
        <CommonNegotiationList :items="item.bookings || []" type="avail" @refresh="$emit('refresh')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IconArrowLeft, IconStarFilled, IconStar, IconTruck, IconCheck, IconUser, IconEye, IconUsers, IconMessage } from '@tabler/icons-vue';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import { useShpAvailabilityStore } from '~/stores/shpAvailability';

const props = defineProps<{
  item: any;
  isOwner: boolean;
  alreadyEnrolled: boolean;
  canRate: boolean;
}>();

defineEmits<{
  (e: 'enroll'): void;
  (e: 'showRatingModal'): void;
  (e: 'refresh'): void;
  (e: 'counter', proposal: any): void;
}>();

const authStore = useCmnAuthStore();
const shpAvailStore = useShpAvailabilityStore();

const getMyEnrollmentStatusText = () => {
  const enrollment = shpAvailStore.enrollments.find((e: any) => String(e.availability?.id) === String(props.item.id) || String(e.availability) === String(props.item.id));
  if (enrollment && ['accepted', 'confirmed'].includes(enrollment.status)) {
    return 'Contrat validé !';
  }
  return 'Proposition soumise';
};

const myEnrollment = computed(() => {
  return shpAvailStore.enrollments.find((e: any) => String(e.availability?.id) === String(props.item.id) || String(e.availability) === String(props.item.id));
});

const formatPrice = (val: number) => {
  if (!val) return 'Prix sur devis';
  return new Intl.NumberFormat('fr-FR').format(val) + ' FCFA';
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
    case 'accepted': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
    case 'pending': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20';
    case 'full': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
    default: return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20';
  }
};

const formatDateFull = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

