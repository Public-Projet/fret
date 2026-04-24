<template>
  <div class="space-y-8">
    <NuxtLink to="/annonces"
      class="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-8 transition-colors">
      <IconArrowLeft class="w-5 h-5 mr-2" />
      Retour au marché
    </NuxtLink>

    <div class="space-y-8">
      <!-- Main Info -->
      <div
        class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 lg:p-8">
        <div class="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
          <div class="flex-1">
            <h1 class="text-xl md:text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-3 leading-tight">
              Trajet : {{ item.origin?.city }} → {{ item.destination?.city || 'Toutes destinations' }}
            </h1>
            <div class="flex flex-wrap items-center gap-3">
              <span class="badge" :class="getStatusBadgeClass(item.status)">{{ getStatusLabel(item.status)
              }}</span>
              <span class="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center">
                Proposé par
                <NuxtLink :to="`/users/${item.carrier?.id}?role=carrier`" class="ml-1 text-primary-600 hover:underline">
                  {{ isOwner ? 'Vous' :
                    ((item.carrier?.firstname || item.carrier?.lastname) ? (item.carrier.firstname + ' ' +
                      item.carrier.lastname) : 'Transporteur') }}
                </NuxtLink>
              </span>
              <div class="flex items-center text-yellow-500">
                <template v-for="i in 5" :key="i">
                  <IconStarFilled v-if="i <= Math.round(item.carrier?.rating || 0)" class="w-4 h-4" />
                  <IconStar v-else class="w-4 h-4 text-gray-200" />
                </template>
                <span class="text-xs font-bold text-gray-500 ml-1">({{ item.carrier?.rating || '0.0' }})</span>
              </div>
            </div>
          </div>
          <div
            class="w-full lg:w-auto flex flex-row lg:flex-col justify-between items-end lg:text-right border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100 dark:border-gray-700">
            <div>
              <p class="text-2xl md:text-3xl font-black text-primary-600">
                {{ item.price ? item.price + ' FCFA' : 'Prix sur devis' }}</p>
              <p class="text-sm text-gray-400 italic">Tarif indicatif</p>
            </div>
            <div class="flex items-center justify-end gap-3 text-sm text-gray-500">
              <div class="flex items-center" title="Vues totales">
                <IconEye class="w-4 h-4 mr-1 text-primary-500/70" />
                <span class="font-bold">{{ item.views || 0 }}</span>
              </div>
              <div class="flex items-center" title="Vues uniques">
                <IconUsers class="w-4 h-4 mr-1 text-primary-500/70" />
                <span class="font-bold">{{ item.uniqueViews || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Route Visual -->
        <div class="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-8 mb-8">
          <div
            class="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative text-center md:text-left">
            <div class="flex-1 w-full md:w-auto">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Départ</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">{{ item.origin?.city }}, {{
                item.origin?.country }}</p>
              <p class="text-sm text-gray-500">{{ formatDateFull(item.startDate) }}</p>
            </div>
            <div class="flex flex-col items-center justify-center">
              <IconTruck class="w-8 h-8 text-primary-600 mb-2" />
              <div class="w-24 md:w-32 h-0.5 border-t-2 border-dashed border-primary-200 dark:border-primary-800">
              </div>
            </div>
            <div class="flex-1 w-full md:w-auto md:text-right">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Arrivée</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">{{ item.destination?.city || 'Ouvert' }}
              </p>
              <p class="text-sm text-gray-500">{{ formatDateFull(item.endDate) }}</p>
            </div>
          </div>
        </div>

        <!-- Vehicle Details -->
        <div>
          <h3 class="font-bold text-gray-900 dark:text-white mb-4">Informations Véhicule</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div class="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <p class="text-xs text-gray-400 uppercase mb-1">Type</p>
              <p class="font-bold capitalize">{{ item.vehicle?.type }}</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <p class="text-xs text-gray-400 uppercase mb-1">Capacité</p>
              <p class="font-bold">{{ item.vehicle?.capacity || '-' }} kg</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <p class="text-xs text-gray-400 uppercase mb-1">Volume</p>
              <p class="font-bold">{{ item.vehicle?.volume || '-' }} m³</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <p class="text-xs text-gray-400 uppercase mb-1">Marque</p>
              <p class="font-bold">{{ item.vehicle?.brand || '-' }}</p>
            </div>
          </div>
        </div>

      </div>

      <!-- Actions (Moved from Sidebar) -->
      <div
        class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 lg:p-8">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Actions & Informations</h3>
        <div v-if="isOwner" class="space-y-3">
          <p class="text-sm text-gray-500 italic">Vous êtes le propriétaire de cette disponibilité.</p>
        </div>
        <div v-else-if="authStore.isShipper" class="space-y-4">
          <button v-if="!alreadyEnrolled" @click="$emit('enroll')" class="btn btn-primary w-full py-4 rounded-2xl">
            S'inscrire sur le trajet
          </button>
          <div v-else class="space-y-4">
            <div class="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/20">
              <p class="text-blue-700 dark:text-blue-400 font-bold flex items-center mb-4">
                <IconCheck class="w-5 h-5 mr-2" />
                {{ getMyEnrollmentStatusText() }}
              </p>
              <div v-if="myEnrollment" class="mt-4 border-t border-blue-200 dark:border-blue-800/50 pt-4">
                <AnnoncesNegotiationList :items="[myEnrollment]" type="avail" @refresh="$emit('refresh')"
                  @counter="$emit('counter', $event)" />
              </div>
            </div>
          </div>
          <button class="btn btn-outline w-full py-4 rounded-2xl">
            Contacter le transporteur
          </button>

          <!-- Rating Action -->
          <button v-if="canRate" @click="$emit('showRatingModal')" class="btn btn-secondary btn-sm w-full rounded-xl">
            Noter ce transporteur
          </button>
        </div>
        <div v-else class="text-center p-8 bg-gray-50 dark:bg-gray-900/50 rounded-2xl max-w-sm mx-auto">
          <IconUser class="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p class="text-sm text-gray-500">Connectez-vous en tant qu'expéditeur pour réserver.</p>
          <NuxtLink to="/auth/login" class="btn btn-primary mt-4">Connexion</NuxtLink>
        </div>
      </div>
    </div>
    <!-- Negotiations (Owner only) -->
    <div v-if="isOwner" class="mt-8 flex flex-col gap-4">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white px-2">Tableau de Bord des Négociations</h3>
      <AnnoncesNegotiationList :items="item.bookings" type="avail" @refresh="$emit('refresh')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IconArrowLeft, IconStarFilled, IconStar, IconTruck, IconCheck, IconUser, IconEye, IconUsers } from '@tabler/icons-vue';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import { usePbcAvailabilityStore } from '~/stores/pbcAvailability';

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
const pbcAvailStore = usePbcAvailabilityStore();
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

const formatDateFull = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>
