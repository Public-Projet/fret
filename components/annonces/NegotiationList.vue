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
        class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
        <div class="flex flex-col md:flex-row justify-between gap-4">
          <!-- Left: User Info -->
          <div class="flex items-start gap-4">
            <div
              class="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center font-bold text-gray-600">
              {{ getUserName(proposal)[0] }}
            </div>
            <div>
              <p class="font-bold text-gray-900 dark:text-white">{{ getUserName(proposal) }}</p>
              <div class="flex items-center text-xs text-yellow-500 mt-0.5">
                <IconStarFilled class="w-3 h-3 mr-1" />
                <span>{{ getUserRating(proposal) }}</span>
              </div>
            </div>
          </div>

          <!-- Middle: Negotiation Data -->
          <div class="flex-1 space-y-2">
            <div class="flex flex-wrap gap-2">
              <span
                class="px-3 py-1 bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-black">
                {{ proposal.proposedPrice || proposal.price }} FCFA
              </span>
              <span v-if="proposal.proposedOrigin || proposal.proposedDestination"
                class="px-3 py-1 bg-secondary-50 dark:bg-secondary-900/40 text-secondary-700 dark:text-secondary-300 rounded-lg text-sm font-medium">
                {{ proposal.proposedOrigin?.city || 'Origine' }} → {{ proposal.proposedDestination?.city ||
                'Destination' }}
              </span>
            </div>
            <p v-if="proposal.notes || proposal.message"
              class="text-sm text-gray-600 dark:text-gray-400 italic bg-gray-100/50 dark:bg-gray-900/40 p-3 rounded-xl border-l-4 border-primary-400">
              "{{ proposal.notes || proposal.message }}"
            </p>
          </div>

          <!-- Right: Actions -->
          <div class="flex flex-col items-end gap-3 min-w-[150px]">
            <span :class="getStatusClass(proposal.status)" class="badge mb-2">
              {{ getStatusLabel(proposal.status) }}
            </span>

            <div v-if="proposal.status === 'pending'" class="flex gap-2 w-full">
              <button @click="handleReject(proposal.id)" :disabled="loading"
                class="flex-1 btn btn-outline btn-sm text-red-600 hover:bg-red-50 py-2">
                Refuser
              </button>
              <button @click="handleAccept(proposal.id)" :disabled="loading" class="flex-1 btn btn-primary btn-sm py-2">
                Valider
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IconGavel, IconInbox, IconStarFilled } from '@tabler/icons-vue';
import { useAvailabilityStore } from '~/stores/availability';
import { useAnnouncementStore } from '~/stores/announcement';

const props = defineProps<{
  items: any[];
  type: 'avail' | 'offer' | 'fret';
}>();

const emit = defineEmits(['refresh']);

const availStore = useAvailabilityStore();
const fretStore = useAnnouncementStore();
const loading = ref(false);

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
      res = await fretStore.acceptOffer(id);
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
