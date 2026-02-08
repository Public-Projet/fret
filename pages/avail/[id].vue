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
                  <span class="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center">
                    Proposé par
                    <NuxtLink :to="`/users/${item.carrier?.id}?role=carrier`"
                      class="ml-1 text-primary-600 hover:underline">
                      {{ isOwner ? 'Vous' : (item.carrier?.firstname + ' ' + item.carrier?.lastname) }}
                    </NuxtLink>
                  </span>
                  <div class="flex items-center text-yellow-500">
                    <IconStarFilled v-for="i in 5" :key="i"
                      :class="i <= Math.round(item.carrier?.rating || 0) ? 'text-yellow-500' : 'text-gray-200'"
                      class="w-4 h-4" />
                    <span class="text-xs font-bold text-gray-500 ml-1">({{ item.carrier?.rating || '0.0' }})</span>
                  </div>
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
              <!-- Carrier View: Restriction -->
              <div v-if="isCarrier"
                class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/30">
                <div v-if="isOwner" class="text-center">
                  <IconInfoCircle class="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p class="text-sm font-bold text-amber-700 dark:text-amber-400">C'est votre offre</p>
                  <p class="text-xs text-amber-600 mt-1">Vous pouvez gérer cette disponibilité depuis votre tableau de
                    bord.</p>
                  <NuxtLink :to="`/app/uc/avail/${item.id}`" class="btn btn-outline btn-primary btn-sm w-full mt-4">
                    Gérer</NuxtLink>
                </div>
                <div v-else class="text-center">
                  <IconAlertCircle class="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p class="text-sm text-amber-700 dark:text-amber-400">
                    En tant que transporteur, vous ne pouvez pas souscrire aux disponibilités d'autres transporteurs.
                  </p>
                </div>
              </div>

              <!-- Guest View -->
              <div v-else-if="!isAuthenticated"
                class="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-900/30 text-center">
                <p class="text-sm text-primary-700 dark:text-primary-300 mb-4">
                  Vous devez être connecté en tant qu'expéditeur pour réserver.
                </p>
                <NuxtLink to="/auth/login" class="btn btn-primary btn-sm w-full">Se connecter</NuxtLink>
              </div>

              <!-- Shipper View -->
              <div v-else-if="isShipper" class="space-y-4">
                <div v-if="alreadyEnrolled"
                  class="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 text-center">
                  <IconCheck class="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p class="text-sm font-bold text-green-700">Vous vous êtes déjà inscrit pour cette offre</p>
                  <p class="text-xs text-green-600 mt-1">Votre demande est en cours de traitement par le transporteur.
                  </p>
                  <NuxtLink to="/app/us/avail" class="btn btn-success btn-sm w-full mt-4 text-white">Voir mes
                    inscriptions</NuxtLink>
                </div>
                <template v-else>
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Notes pour le transporteur
                      (optionnel)</label>
                    <textarea v-model="notes" rows="3" class="input" placeholder="Détails de votre fret..."></textarea>
                  </div>

                  <button @click="handleEnroll"
                    :disabled="enrolling || item.status === 'full' || item.status === 'expired'"
                    class="btn btn-primary w-full py-4 rounded-xl">
                    <IconLoader2 v-if="enrolling" class="w-5 h-5 animate-spin mr-2" />
                    {{ item.status === 'full' ? 'Complet' :
                      (item.status === 'expired' ? 'Expiré' : 'S\'inscrire à ce trajet') }}
                  </button>
                </template>

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

          <!-- Rating Section for Shipper -->
          <div v-if="isShipper"
            class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
            <h3 class="font-bold text-gray-900 dark:text-white mb-6">Notez ce transporteur</h3>

            <div v-if="ratingSuccess" class="text-center py-4">
              <IconCheck class="w-10 h-10 text-green-500 mx-auto mb-2" />
              <p class="text-sm font-bold text-green-700">Merci pour votre avis !</p>
            </div>
            <div v-else class="space-y-4">
              <div class="flex justify-center space-x-2">
                <button v-for="i in 5" :key="i" @click="ratingScore = i"
                  class="focus:outline-none transition-transform hover:scale-110">
                  <IconStarFilled v-if="i <= ratingScore" class="w-8 h-8 text-yellow-500" />
                  <IconStar v-else class="w-8 h-8 text-gray-300 hover:text-yellow-200" />
                </button>
              </div>

              <textarea v-model="ratingComment" rows="2" class="input text-sm"
                placeholder="Un petit commentaire ? (optionnel)"></textarea>

              <button @click="submitRating" :disabled="ratingLoading || ratingScore === 0"
                class="btn btn-secondary btn-sm w-full">
                <IconLoader2 v-if="ratingLoading" class="w-4 h-4 animate-spin mr-2" />
                Envoyer ma note
              </button>

              <p v-if="ratingError" class="text-xs text-red-500 text-center">{{ ratingError }}</p>
            </div>
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
  IconShieldCheck, IconCheck, IconInfoCircle, IconStarFilled, IconStar
} from '@tabler/icons-vue';
import { useUserStore } from '~/stores/user';

const route = useRoute();
const router = useRouter();
const availabilityStore = useAvailabilityStore();
const authStore = useAuthStore();
const userStore = useUserStore();

const item = ref<any>(null);
const loading = ref(true);
const error = ref('');
const notes = ref('');
const enrolling = ref(false);
const enrollError = ref('');
const enrollSuccess = ref(false);

// Rating state
const ratingScore = ref(0);
const ratingComment = ref('');
const ratingLoading = ref(false);
const ratingError = ref('');
const ratingSuccess = ref(false);

const isAuthenticated = computed(() => authStore.isAuthenticated);
const isShipper = computed(() => authStore.isShipper);
const isCarrier = computed(() => authStore.isCarrier);
const isOwner = computed(() => isCarrier.value && item.value?.carrier?.id === authStore.currentUser?.id);
const alreadyEnrolled = computed(() => availabilityStore.isEnrolled(route.params.id as string));

onMounted(async () => {
  const result = await availabilityStore.fetchPublicAvailability(route.params.id as string);
  loading.value = false;
  if (result.success) {
    item.value = result.availability;

    // If shipper, fetch their enrollments to check if already enrolled
    if (isShipper.value) {
      await availabilityStore.fetchShipperEnrollments();
    }
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

const submitRating = async () => {
  if (ratingScore.value === 0) {
    ratingError.value = "Veuillez sélectionner une note.";
    return;
  }

  ratingLoading.value = true;
  ratingError.value = '';

  const result = await userStore.rateCarrier(item.value.carrier.id, ratingScore.value, ratingComment.value);
  ratingLoading.value = false;

  if (result.success && result.data) {
    ratingSuccess.value = true;
    item.value.carrier.rating = result.data.rating;
    item.value.carrier.reviewsCount = result.data.reviewsCount;
  } else {
    ratingError.value = result.error?.message || "Erreur lors de l'enregistrement de la note.";
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
