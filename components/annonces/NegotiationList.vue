<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
    <div
      class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/20">
      <h3 class="font-black text-gray-900 dark:text-white flex items-center">
        <IconGavel class="w-5 h-5 mr-2 text-primary-600" />
        {{ type === 'avail' ? 'Propositions reçues' : 'Offres reçues' }}
        <span class="ml-2 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">
          {{ items?.length || 0 }}
        </span>
      </h3>
    </div>

    <div v-if="!items || items.length === 0" class="p-12 text-center">
      <IconInbox class="w-12 h-12 text-gray-200 mx-auto mb-4" />
      <p class="text-gray-500 text-sm">Aucune proposition pour le moment.</p>
    </div>

    <div v-else class="divide-y divide-gray-100 dark:divide-gray-700">
      <div v-for="proposal in items" :key="proposal.id"
        class="p-4 md:p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">

        <!-- Header: User and Status -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 md:w-12 md:h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 shrink-0">
              {{ getUserName(proposal)[0] }}
            </div>
            <div>
              <p class="font-bold text-gray-900 dark:text-white leading-tight">{{ getUserName(proposal) }}</p>
              <div class="flex items-center text-xs text-yellow-500 mt-1">
                <IconStarFilled class="w-3.5 h-3.5 mr-1" />
                <span>{{ getUserRating(proposal) }}</span>
              </div>
            </div>
          </div>
          <span :class="getStatusClass(proposal.status)" class="badge shrink-0 text-xs md:text-sm">
            {{ getStatusLabel(proposal.status) }}
          </span>
        </div>

        <!-- Body: Proposal Details -->
        <div class="bg-gray-50 dark:bg-gray-900/30 rounded-2xl p-4 space-y-3">
          <div class="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div
              class="flex w-fit items-center text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/40 px-3 py-1.5 rounded-xl font-black text-lg">
              <IconCash class="w-5 h-5 mr-1" />
              {{ proposal.proposedPrice || proposal.price }} FCFA
            </div>

            <div v-if="proposal.proposedOrigin || proposal.proposedDestination"
              class="flex w-fit items-center text-secondary-700 dark:text-secondary-300 bg-secondary-50 dark:bg-secondary-900/40 px-3 py-1.5 rounded-xl font-medium text-sm">
              <IconMapPin class="w-4 h-4 mr-1 shrink-0" />
              <span class="truncate">{{ proposal.proposedOrigin?.city || 'Origine' }} &rarr; {{
                proposal.proposedDestination?.city || 'Destination' }}</span>
            </div>
          </div>

          <div v-if="proposal.notes || proposal.message"
            class="text-sm text-gray-600 dark:text-gray-400 italic bg-white dark:bg-gray-800 p-3 rounded-xl border-l-4 border-primary-400 shadow-sm">
            "{{ proposal.notes || proposal.message }}"
          </div>

          <div v-if="proposal.contractPath">
            <a :href="`${backendUrl}/api/v1/public/contracts/download/${proposal.contractPath.split('/').pop().replace('.pdf', '')}`"
              target="_blank"
              class="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-semibold transition-colors">
              <IconFileDownload class="w-4 h-4 mr-2" />
              Télécharger le contrat
            </a>
          </div>
        </div>

        <!-- Footer: Actions -->
        <div v-if="proposal.status === 'pending'"
          class="flex flex-col sm:flex-row items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
          <template v-if="canRespond(proposal)">
            <button @click="handleReject(proposal.id)" :disabled="loading"
              class="w-full sm:w-auto flex-1 btn btn-outline border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 py-2.5">
              Refuser
            </button>
            <button @click="$emit('counter', proposal)" :disabled="loading"
              class="w-full sm:w-auto flex-1 btn btn-secondary py-2.5">
              Contre-proposer
            </button>
            <button @click="handleAccept(proposal.id)" :disabled="loading"
              class="w-full sm:w-auto flex-1 btn btn-primary py-2.5 shadow-md shadow-primary-500/20">
              Valider l'offre
            </button>
          </template>
          <template v-else>
            <div
              class="flex-1 w-full text-sm text-gray-500 dark:text-gray-400 italic flex items-center justify-center sm:justify-start mb-2 sm:mb-0">
              <IconClock class="w-4 h-4 mr-1.5" /> En attente de leur réponse...
            </div>
            <button @click="$emit('counter', proposal)" :disabled="loading"
              class="w-full sm:w-auto btn btn-outline py-2.5">
              Modifier ma proposition
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { IconGavel, IconInbox, IconStarFilled, IconFileDownload, IconMapPin, IconCash, IconClock } from '@tabler/icons-vue';
import { useAvailabilityStore } from '~/stores/availability';
import { useShpAnnouncementStore } from '~/stores/shpAnnouncement';
import { useAuthStore } from '~/stores/auth';

const props = defineProps<{
  items: any[];
  type: 'avail' | 'offer' | 'fret';
}>();

const emit = defineEmits(['refresh', 'counter']);

const availStore = useAvailabilityStore();
const fretStore = useShpAnnouncementStore();
const authStore = useAuthStore();
const loading = ref(false);

const backendUrl = '';

const canRespond = (proposal: any) => {
  if (!authStore.isAuthenticated) return false;

  // I can respond if the last proposal was NOT by my role.
  if (authStore.isCarrier) {
    return proposal.lastProposedBy === 'shipper';
  } else if (authStore.isShipper) {
    return proposal.lastProposedBy === 'carrier';
  }

  return false;
};

const getUserName = (proposal: any) => {
  const user = proposal.shipper || proposal.carrier;
  if (!user) return 'Utilisateur';
  if (user.company) return user.company;
  return (user.firstname || '') + ' ' + (user.lastname || '');
};

const getUserRating = (proposal: any) => {
  const user = proposal.shipper || proposal.carrier;
  return user?.rating || '0.0';
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    accepted: 'Accepté',
    confirmed: 'Confirmé',
    rejected: 'Refusé',
    cancelled: 'Annulé',
    countered: 'Contre-offre'
  };
  return labels[status] || status;
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'accepted':
    case 'confirmed': return 'badge-success';
    case 'pending': return 'badge-info';
    case 'rejected':
    case 'cancelled': return 'badge-danger';
    case 'countered': return 'badge-warning';
    default: return 'badge-neutral';
  }
};

const handleAccept = async (id: string) => {
  if (!confirm('Voulez-vous vraiment accepter cette proposition ?')) return;

  loading.value = true;
  try {
    let res;
    if (props.type === 'avail') {
      res = await availStore.acceptBooking(id);
    } else {
      res = await fretStore.acceptShpOffer(id);
    }

    if (res.success) {
      emit('refresh');
    } else {
      alert(res.error || 'Erreur lors de l\'acceptation');
    }
  } finally {
    loading.value = false;
  }
};

const handleReject = async (id: string) => {
  if (!confirm('Voulez-vous vraiment refuser cette proposition ?')) return;

  loading.value = true;
  try {
    let res;
    if (props.type === 'avail') {
      res = await availStore.rejectBooking(id);
    } else {
      res = await fretStore.rejectOffer(id);
    }

    if (res.success) {
      emit('refresh');
    } else {
      alert(res.error || 'Erreur lors du refus');
    }
  } finally {
    loading.value = false;
  }
};
</script>
