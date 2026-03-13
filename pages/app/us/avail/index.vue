<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 pb-20 pt-10">
    <div class="container-custom">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Mes Souscriptions</h1>
          <p class="text-gray-500 font-medium mt-1 text-sm lg:text-base">Suivez vos réservations sur les trajets des transporteurs</p>
        </div>
        <NuxtLink to="/app/us/avail/market" 
          class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-2xl font-bold transition-all hover:shadow-lg hover:shadow-primary-500/25 flex items-center justify-center group active:scale-95">
          <IconSearch class="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
          Trouver des trajets
        </NuxtLink>
      </div>

      <!-- Stats Bar -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-3xl border border-white dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none transition-all hover:translate-y-1">
          <div class="flex items-center space-x-5">
            <div class="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-2xl text-amber-600 shadow-inner">
              <IconLoader2 class="w-7 h-7" />
            </div>
            <div>
              <p class="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">En attente</p>
              <p class="text-3xl font-black text-gray-900 dark:text-white leading-none">{{ pendingCount }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-3xl border border-white dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none transition-all hover:translate-y-1">
          <div class="flex items-center space-x-5">
            <div class="p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl text-emerald-600 shadow-inner">
              <IconCheck class="w-7 h-7" />
            </div>
            <div>
              <p class="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Confirmées</p>
              <p class="text-3xl font-black text-gray-900 dark:text-white leading-none">{{ confirmedCount }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-3xl border border-white dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none transition-all hover:translate-y-1">
          <div class="flex items-center space-x-5">
            <div class="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-2xl text-primary-600 shadow-inner">
              <IconHistory class="w-7 h-7" />
            </div>
            <div>
              <p class="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total</p>
              <p class="text-3xl font-black text-gray-900 dark:text-white leading-none">{{ enrollments.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- List -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-24">
        <div class="relative w-16 h-16 mb-6">
          <div class="absolute inset-0 border-4 border-primary-100 dark:border-primary-900/30 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p class="text-gray-500 font-bold">Chargement de vos inscriptions...</p>
      </div>

      <div v-else-if="enrollments.length === 0"
        class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2.5rem] p-16 text-center border-2 border-dashed border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none">
        <div class="w-24 h-24 bg-gray-50 dark:bg-gray-700/50 rounded-[2rem] flex items-center justify-center text-gray-300 mx-auto mb-6">
          <IconTicketOff class="w-12 h-12" />
        </div>
        <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">Aucune inscription active</h3>
        <p class="text-gray-500 mb-10 max-w-sm mx-auto font-medium">Vous n'avez pas encore souscrit à des trajets de transporteurs. Explorez le marché pour trouver votre bonheur.</p>
        <NuxtLink to="/app/us/avail/market" 
          class="inline-flex px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black transition-all hover:shadow-xl hover:shadow-primary-500/30 active:scale-95">
          Explorer le marché
        </NuxtLink>
      </div>

      <div v-else class="space-y-6">
        <div v-for="enrollment in enrollments" :key="enrollment.id"
          class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-white dark:border-gray-700 p-6 lg:p-8 flex flex-col md:flex-row items-center gap-8 group hover:border-primary-200 dark:hover:border-primary-800 transition-all shadow-xl shadow-gray-200/50 dark:shadow-none hover:shadow-2xl">

          <!-- Route Info -->
          <div class="flex-1 min-w-0 w-full">
            <div class="flex flex-wrap items-center gap-3 mb-4">
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trajet #{{ enrollment.availability?.id.slice(0, 6) }}</span>
              <span :class="['px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider', getStatusClass(enrollment)]">
                {{ getStatusLabel(enrollment) }}
              </span>
            </div>
            
            <div class="flex items-center gap-4 group-hover:translate-x-1 transition-transform">
              <div class="flex-1">
                <p class="text-lg lg:text-2xl font-black text-gray-900 dark:text-white flex items-center flex-wrap gap-x-3">
                  <span class="truncate">{{ enrollment.availability?.origin?.city }}</span>
                  <IconArrowRight class="w-5 h-5 text-primary-500 flex-shrink-0" />
                  <span class="truncate text-primary-600">{{ enrollment.availability?.destination?.city || 'Libre' }}</span>
                </p>
                <div class="flex items-center mt-2 text-gray-500 font-bold text-sm">
                  <IconCalendar class="w-4 h-4 mr-2 text-primary-400" />
                  {{ formatDate(enrollment.availability?.startDate) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Price & Contact -->
          <div
            class="flex flex-col items-center md:items-end md:px-10 md:border-x border-gray-100 dark:border-gray-700 w-full md:w-auto py-4 md:py-0">
            <p class="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
              {{ enrollment.availability?.price?.toLocaleString() || '-' }}
              <span class="text-sm font-bold ml-1 text-gray-400">FCFA</span>
            </p>
            <p class="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">Budget proposé</p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3 w-full md:w-auto shrink-0">
            <NuxtLink :to="`/annonces/${enrollment.availability?.id}?type=avail`" 
              class="flex-1 md:flex-none px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center">
              Détails
            </NuxtLink>
            <NuxtLink :to="`/app/messages`" 
              class="flex-1 md:flex-none px-6 py-3 rounded-xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 transition-all hover:shadow-lg hover:shadow-primary-500/25 flex items-center justify-center group active:scale-95">
              <IconMessage class="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" /> Chat
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

const pendingCount = computed(() => enrollments.value.filter(e => e.status === 'pending' || e.status === 'countered').length);
const confirmedCount = computed(() => enrollments.value.filter(e => e.status === 'confirmed' || e.status === 'accepted').length);

const getStatusLabel = (enrollment: any) => {
  if (enrollment.status === 'pending' || enrollment.status === 'countered') {
    return enrollment.lastProposedBy === 'carrier' ? 'Contre-offre reçue (Action requise)' : 'En attente transporteur';
  }
  const labels: Record<string, string> = {
    accepted: 'Contrat Validé',
    confirmed: 'Confirmé',
    cancelled: 'Annulé',
    rejected: 'Refusé'
  };
  return labels[enrollment.status] || enrollment.status;
};

const getStatusClass = (enrollment: any) => {
  if (enrollment.status === 'pending' || enrollment.status === 'countered') {
    return enrollment.lastProposedBy === 'carrier' ? 'badge-primary' : 'badge-warning';
  }
  if (['confirmed', 'accepted'].includes(enrollment.status)) return 'badge-success';
  if (['cancelled', 'rejected'].includes(enrollment.status)) return 'badge-error';
  return 'badge-neutral';
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
useHead({
  title: 'Mes Inscriptions',
  meta: [
    { name: 'description', content: 'Retrouvez toutes vos inscriptions aux différentes disponibilités.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
