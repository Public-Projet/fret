<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 pt-12">
    <div class="container-custom">
      <NuxtLink to="/avail"
        class="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-8 transition-colors">
        <IconArrowLeft class="w-5 h-5 mr-2" />
        Retour aux disponibilités
      </NuxtLink>

      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <IconLoader2 class="w-12 h-12 text-primary-600 animate-spin mb-4" />
        <p class="text-gray-500">Chargement des détails...</p>
      </div>

      <div v-else-if="error"
        class="bg-red-50 dark:bg-red-900/20 p-8 text-center rounded-2xl border border-red-100 dark:border-red-900/30">
        <IconAlertCircle class="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p class="text-red-700 dark:text-red-400 font-medium">{{ error }}</p>
      </div>

      <div v-else-if="item" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Info -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
            <div class="flex flex-wrap justify-between items-start gap-4 mb-8">
              <div>
                <h1 class="text-2xl font-black text-gray-900 dark:text-white mb-2">Trajet : {{ item.origin.city }} → {{
                  item.destination?.city || 'Toutes destinations' }}</h1>
                <div class="flex items-center space-x-4">
                  <span class="badge" :class="{
                    'badge-success': item.status === 'active',
                    'badge-info': item.status === 'prolonged',
                    'badge-warning': item.status === 'full'
                  }">{{ getStatusLabel(item.status) }}</span>
                  <span class="text-sm text-gray-500">ID: {{ item.id }}</span>
                </div>
              </div>
              <div class="text-right">
                <p class="text-3xl font-black text-primary-600">{{ item.price ? item.price + ' FCFA' : 'Prix sur devis'
                }}</p>
                <p class="text-sm text-gray-400 italic">Tarif indicatif</p>
              </div>
            </div>

            <!-- Route Visual -->
            <div class="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-8 mb-8">
              <div
                class="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative text-center md:text-left">
                <div class="flex-1 w-full md:w-auto">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Départ</p>
                  <p class="text-xl font-bold text-gray-900 dark:text-white">{{ item.origin.city }}, {{
                    item.origin.country }}</p>
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
        </div>

        <!-- Sidebar Actions -->
        <div class="space-y-6">
          <div
            class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 sticky top-24">
            <h3 class="font-bold text-gray-900 dark:text-white mb-6">Réserver cette place</h3>

            <div class="space-y-6">
              <div v-if="!isShipper"
                class="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-900/30 text-center">
                <p class="text-sm text-primary-700 dark:text-primary-300 mb-4">
                  Vous devez être connecté en tant qu'expéditeur pour réserver.
                </p>
                <NuxtLink to="/auth/login" class="btn btn-primary btn-sm w-full">Se connecter</NuxtLink>
              </div>

              <div v-else class="space-y-4">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Notes pour le transporteur
                    (optionnel)</label>
                  <textarea v-model="notes" rows="3" class="input" placeholder="Détails de votre fret..."></textarea>
                </div>

                <button @click="handleEnroll" :disabled="enrolling" class="btn btn-primary w-full py-4 rounded-xl">
                  <IconLoader2 v-if="enrolling" class="w-5 h-5 animate-spin mr-2" />
                  S'inscrire à ce trajet
                </button>

                <p v-if="enrollError" class="text-xs text-red-500 text-center">{{ enrollError }}</p>
                <p v-if="enrollSuccess" class="text-xs text-green-500 text-center">Inscription réussie ! Redirection...
                </p>
              </div>

              <hr class="border-gray-100 dark:border-gray-700" />

              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Demandes actuelles</span>
                <span class="font-bold text-gray-900 dark:text-white">{{ item.currentRequests }} / {{ item.maxRequests
                  || '∞' }}</span>
              </div>
            </div>
          </div>

          <!-- Safety Guidelines -->
          <div class="p-6 bg-secondary-50 dark:bg-secondary-900/20 rounded-2xl border border-secondary-100">
            <h4 class="font-bold text-secondary-900 dark:text-secondary-100 mb-2 flex items-center">
              <IconShieldCheck class="w-4 h-4 mr-2" />
              Guide Sécurité
            </h4>
            <p class="text-xs text-secondary-700 dark:text-secondary-300 leading-relaxed">
              Ne payez jamais la totalité avant le chargement. Utilisez notre plateforme pour sécuriser vos échanges.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAvailabilityStore } from '~/stores/availability';
import { useAuthStore } from '~/stores/auth';
import {
  IconArrowLeft, IconLoader2, IconAlertCircle, IconTruck,
  IconShieldCheck
} from '@tabler/icons-vue';

const route = useRoute();
const router = useRouter();
const availabilityStore = useAvailabilityStore();
const authStore = useAuthStore();

const item = ref<any>(null);
const loading = ref(true);
const error = ref('');
const notes = ref('');
const enrolling = ref(false);
const enrollError = ref('');
const enrollSuccess = ref(false);

const isShipper = computed(() => authStore.isShipper);

onMounted(async () => {
  const result = await availabilityStore.fetchPublicAvailability(route.params.id as string);
  loading.value = false;
  if (result.success) {
    item.value = result.availability;
  } else {
    error.value = "Impossible de charger les détails de cette disponibilité.";
  }
});

const handleEnroll = async () => {
  enrolling.value = true;
  enrollError.value = '';

  const result = await availabilityStore.enrollAvailability(item.value.id, notes.value);
  enrolling.value = false;

  if (result.success) {
    enrollSuccess.value = true;
    setTimeout(() => {
      router.push('/app/us/avail');
    }, 1500);
  } else {
    enrollError.value = result.error || 'Erreur lors de l\'inscription.';
  }
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: 'Actif',
    full: 'Complet',
    expired: 'Expiré',
    prolonged: 'Prolongé'
  };
  return labels[status] || status;
};

const formatDateFull = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

definePageMeta({ layout: 'guest' });
useHead({ title: 'Détails Disponibilité - Bourse de Fret' });
</script>
