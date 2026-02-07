<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 pt-8">
    <div class="container-custom">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 class="text-2xl font-black text-gray-900 dark:text-white">Mes Souscriptions</h1>
          <p class="text-gray-500">Suivez vos inscriptions aux trajets des transporteurs.</p>
        </div>
        <NuxtLink to="/app/us/avail/market" class="btn btn-primary">
          <IconSearch class="w-5 h-5 mr-2" />
          Trouver des trajets
        </NuxtLink>
      </div>

      <!-- Stats Bar -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div class="flex items-center space-x-4">
            <div class="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl text-yellow-600">
              <IconLoader2 class="w-6 h-6" />
            </div>
            <div>
              <p class="text-sm text-gray-500">En attente</p>
              <p class="text-2xl font-black">{{ pendingCount }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div class="flex items-center space-x-4">
            <div class="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl text-green-600">
              <IconCheck class="w-6 h-6" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Confirmées</p>
              <p class="text-2xl font-black">{{ confirmedCount }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div class="flex items-center space-x-4">
            <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-600">
              <IconHistory class="w-6 h-6" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Total</p>
              <p class="text-2xl font-black">{{ enrollments.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- List -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <IconLoader2 class="w-12 h-12 text-primary-600 animate-spin mb-4" />
        <p class="text-gray-500">Chargement de vos inscriptions...</p>
      </div>

      <div v-else-if="enrollments.length === 0"
        class="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center border border-dashed border-gray-200 dark:border-gray-700">
        <IconTicketOff class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Aucune inscription active</h3>
        <p class="text-gray-500 mb-8 max-w-sm mx-auto">Vous n'avez pas encore souscrit à des trajets de transporteurs.
        </p>
        <NuxtLink to="/app/us/avail/market" class="btn btn-primary">Explorer le marché</NuxtLink>
      </div>

      <div v-else class="space-y-4">
        <div v-for="enrollment in enrollments" :key="enrollment.id"
          class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-primary-200 transition-all shadow-sm">

          <!-- Route Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-2 mb-2">
              <span class="text-xs font-bold text-gray-400">ID: {{ enrollment.availability?.id }}</span>
              <span :class="['badge badge-sm', getStatusClass(enrollment.status)]">{{ getStatusLabel(enrollment.status)
              }}</span>
            </div>
            <div class="flex items-center space-x-3">
              <p class="font-black text-lg text-gray-900 dark:text-white truncate">
                {{ enrollment.availability?.origin?.city }}
                <IconArrowRight class="inline-block w-4 h-4 mx-2 text-gray-400" />
                {{ enrollment.availability?.destination?.city || 'Ouvert' }}
              </p>
            </div>
            <p class="text-sm text-gray-500 mt-1">
              {{ formatDate(enrollment.availability?.startDate) }}
            </p>
          </div>

          <!-- Price & Contact -->
          <div
            class="flex flex-col items-center md:items-end md:px-8 border-y md:border-y-0 md:border-x border-gray-50 dark:border-gray-700 py-4 md:py-0">
            <p class="text-xl font-black text-primary-600">{{ enrollment.availability?.price || '-' }} FCFA</p>
            <p class="text-xs text-gray-400 uppercase tracking-tighter">Budget indicatif</p>
          </div>

          <!-- Actions -->
          <div class="flex space-x-2">
            <NuxtLink :to="`/avail/${enrollment.availability?.id}`" class="btn btn-ghost btn-sm">
              Détails
            </NuxtLink>
            <NuxtLink :to="`/app/messages`" class="btn btn-outline btn-primary btn-sm">
              <IconMessage class="w-4 h-4 mr-1" /> Message
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAvailabilityStore } from '~/stores/availability';
import {
  IconSearch, IconLoader2, IconCheck, IconHistory,
  IconTicketOff, IconArrowRight, IconMessage
} from '@tabler/icons-vue';

const availabilityStore = useAvailabilityStore();
const loading = computed(() => availabilityStore.loading);
const enrollments = computed(() => availabilityStore.enrollments);

const pendingCount = computed(() => enrollments.value.filter(e => e.status === 'pending').length);
const confirmedCount = computed(() => enrollments.value.filter(e => e.status === 'confirmed').length);

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmé',
    cancelled: 'Annulé'
  };
  return labels[status] || status;
};

const getStatusClass = (status: string) => {
  return {
    'badge-warning': status === 'pending',
    'badge-success': status === 'confirmed',
    'badge-error': status === 'cancelled'
  };
};

const formatDate = (date: string) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

onMounted(async () => {
  await availabilityStore.fetchShipperEnrollments();
});

definePageMeta({ layout: 'default' });
useHead({ title: 'Mes Inscriptions - Bourse de Fret' });
</script>
