<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 pt-12">
    <div class="container-custom">
      <button @click="router.back()"
        class="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-secondary-600 mb-8 transition-colors">
        <IconArrowLeft class="w-5 h-5 mr-2" />
        Retour
      </button>

      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <IconLoader2 class="w-12 h-12 text-secondary-600 animate-spin mb-4" />
        <p class="text-gray-500">Chargement du profil...</p>
      </div>

      <div v-else-if="error"
        class="bg-red-50 dark:bg-red-900/20 p-8 text-center rounded-2xl border border-red-100 dark:border-red-900/30">
        <IconAlertCircle class="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p class="text-red-700 dark:text-red-400 font-medium">{{ error }}</p>
      </div>

      <div v-else-if="user" class="max-w-4xl mx-auto">
        <!-- Profile Header Card -->
        <div
          class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
          <div class="h-32 bg-gradient-to-r from-secondary-500 to-secondary-700"></div>
          <div class="px-8 pb-8">
            <div class="relative flex flex-col md:flex-row md:items-end -mt-16 mb-6 gap-6">
              <div class="relative">
                <div class="w-32 h-32 rounded-3xl bg-white dark:bg-gray-700 p-2 shadow-lg">
                  <div class="w-full h-full rounded-2xl bg-gray-100 dark:bg-gray-600 overflow-hidden">
                    <img v-if="user.photoUrl" :src="user.photoUrl" class="w-full h-full object-cover" />
                    <div v-else
                      class="w-full h-full flex items-center justify-center text-4xl font-black text-gray-300 uppercase">
                      {{ user.firstname[0] }}
                    </div>
                  </div>
                </div>
                <div v-if="user.kycStatus === 'verified'"
                  class="absolute -right-2 -bottom-2 bg-green-500 text-white p-1.5 rounded-full border-4 border-white dark:border-gray-800"
                  title="Utilisateur certifié">
                  <IconShieldCheck class="w-5 h-5" />
                </div>
              </div>

              <div class="flex-1">
                <div class="flex flex-wrap items-center gap-3 mb-2">
                  <h1 class="text-3xl font-black text-gray-900 dark:text-white">{{ user.firstname }} {{ user.lastname }}
                  </h1>
                  <span class="badge badge-secondary uppercase tracking-widest text-[10px]">{{ user.role === 'carrier' ?
                    'Transporteur' : 'Expéditeur' }}</span>
                </div>
                <p class="text-gray-500 font-medium">@{{ user.username }}</p>
              </div>

              <div class="flex items-center space-x-2 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl">
                <div class="text-center px-4">
                  <div class="flex items-center text-yellow-500 mb-1">
                    <template v-for="i in 5" :key="i">
                      <IconStarFilled v-if="i <= Math.round(user.rating || 0)" class="w-3 h-3" />
                      <IconStar v-else class="w-3 h-3 text-gray-200" />
                    </template>
                  </div>
                  <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Note ({{ user.rating ||
                    '0.0' }})</span>
                </div>
                <div class="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
                <div class="text-center px-4">
                  <span class="block text-2xl font-black text-gray-900 dark:text-white">{{ user.reviewsCount }}</span>
                  <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avis</span>
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <div>
                <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">À propos</h3>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed italic">
                  "{{ user.bio || 'Cet utilisateur n\'a pas encore rédigé de biographie.' }}"
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-center p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl">
                  <div class="p-2 bg-white dark:bg-gray-800 rounded-xl mr-4 shadow-sm">
                    <IconCircleCheck class="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut KYC</p>
                    <p class="text-sm font-bold capitalize">{{ user.kycStatus === 'verified' ? 'Certifié' : 'En cours'
                    }}</p>
                  </div>
                </div>
                <div class="flex items-center p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl">
                  <div class="p-2 bg-white dark:bg-gray-800 rounded-xl mr-4 shadow-sm">
                    <IconStarFilled class="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Réputation</p>
                    <p class="text-sm font-bold">{{ user.rating >= 4 ? 'Excellente' : (user.rating >= 3 ? 'Bonne' :
                      'Standard') }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Role Specific Section: Carrier Availabilities -->
        <div v-if="user.role === 'carrier'" class="space-y-6 mb-8">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <IconTruck class="w-6 h-6 text-blue-600 mr-3" />
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">Ses Disponibilités</h2>
            </div>
            <NuxtLink :to="`/annonces?tab=avail&userId=${user.id}`" class="text-sm text-primary-600 hover:underline">
              Voir tout</NuxtLink>
          </div>

          <div v-if="user.availabilities && user.availabilities.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="item in user.availabilities.slice(0, 4)" :key="item.id"
              class="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div class="flex justify-between items-start mb-2">
                <span class="text-xs font-bold text-primary-600">{{ item.origin.city }} → {{ item.destination?.city ||
                  'Bénin' }}</span>
                <span class="text-xs font-black">{{ item.price }} FCFA</span>
              </div>
              <div class="flex items-center text-[10px] text-gray-500 gap-3">
                <span class="flex items-center">
                  <IconCalendar class="w-3 h-3 mr-1" /> {{ formatDate(item.startDate) }}
                </span>
                <span class="flex items-center">
                  <IconTruck class="w-3 h-3 mr-1" /> {{ item.vehicle?.type }}
                </span>
              </div>
              <NuxtLink :to="`/annonces/${item.id}?type=avail`" class="btn btn-ghost btn-xs w-full mt-3 rounded-lg">
                Détails</NuxtLink>
            </div>
          </div>
          <div v-else
            class="bg-blue-50 dark:bg-blue-900/10 p-8 rounded-3xl border border-blue-100 dark:border-blue-900/20 text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">Ce transporteur n'a pas de trajets planifiés pour le
              moment.</p>
          </div>
        </div>

        <!-- Role Specific Section: Shipper Offers -->
        <div v-else-if="user.role === 'shipper'" class="space-y-6 mb-8">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <IconPackage class="w-6 h-6 text-orange-600 mr-3" />
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">Ses Annonces Fret</h2>
            </div>
            <NuxtLink :to="`/annonces?tab=fret&userId=${user.id}`" class="text-sm text-primary-600 hover:underline">Voir
              tout
            </NuxtLink>
          </div>

          <div v-if="user.offers && user.offers.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="item in user.offers.slice(0, 4)" :key="item.id"
              class="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div class="flex justify-between items-start mb-2">
                <span class="text-xs font-bold text-orange-600">{{ item.availability?.origin?.city }} → {{
                  item.availability?.destination?.city || 'Bénin' }}</span>
                <span class="text-xs font-black">{{ item.availability?.price || '-' }} FCFA</span>
              </div>
              <p class="text-[10px] font-bold text-gray-900 dark:text-white truncate mb-2">Offre pour {{
                item.availability?.vehicle?.type || 'Transport' }}</p>
              <div class="flex items-center text-[10px] text-gray-500 gap-3">
                <span class="flex items-center">
                  <IconCalendar class="w-3 h-3 mr-1" /> {{ formatDate(item.createdAt) }}
                </span>
                <span class="flex items-center">
                  <IconPackage class="w-3 h-3 mr-1" /> {{ item.status }}
                </span>
              </div>
              <NuxtLink :to="`/annonces/${item.availability?.id}?type=avail`"
                class="btn btn-ghost btn-xs w-full mt-3 rounded-lg">Détails</NuxtLink>
            </div>
          </div>
          <div v-else
            class="bg-orange-50 dark:bg-orange-900/10 p-8 rounded-3xl border border-orange-100 dark:border-orange-900/20 text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">Cet expéditeur n'a pas d'annonces actives pour le
              moment.</p>
          </div>
        </div>

        <!-- Rating Section -->
        <div v-if="canRate" class="mt-8 flex justify-center">
          <button @click="showRatingModal = true"
            class="btn btn-secondary w-full md:w-auto px-8 rounded-xl shadow-lg shadow-secondary-500/20">
            <IconStarFilled class="w-5 h-5 mr-2" />
            {{ ratingLabel }}
          </button>
        </div>
      </div>
    </div>

    <!-- Rating Modal -->
    <div v-if="showRatingModal"
      class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
      @click.self="showRatingModal = false">
      <div class="w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div class="relative">
          <button @click="showRatingModal = false"
            class="absolute -top-12 right-0 text-white hover:text-secondary-400 transition-colors flex items-center text-xs font-black uppercase tracking-widest">
            Fermer
            <IconX class="ml-2 w-5 h-5" />
          </button>
          <RatingForm :targetId="user.id" :targetRole="user.role" :initialData="user.myReview"
            @success="handleRatingSuccess" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '~/stores/user';
import { useAuthStore } from '~/stores/auth';
import {
  IconArrowLeft, IconLoader2, IconAlertCircle, IconShieldCheck,
  IconStarFilled, IconCircleCheck, IconTruck, IconStar, IconCalendar, IconPackage, IconX
} from '@tabler/icons-vue';
import RatingForm from '~/components/profile/RatingForm.vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();

const user = ref<any>(null);
const loading = ref(true);
const error = ref('');
const showRatingModal = ref(false);

const isOwnProfile = computed(() => {
  return authStore.user?.id === user.value?.id;
});

const canRate = computed(() => {
  if (!authStore.isAuthenticated || isOwnProfile.value || !user.value) return false;
  // Shippers rate Carriers, Carriers rate Shippers
  if (authStore.isShipper && user.value.role === 'carrier') return true;
  if (authStore.isCarrier && user.value.role === 'shipper') return true;
  return false;
});


const ratingLabel = computed(() => {
  if (user.value?.myReview) return 'Modifier ma note';
  return user.value?.role === 'carrier' ? 'Noter ce transporteur' : 'Noter cet expéditeur';
});

const formatDate = (date: string) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  });
};

const handleRatingSuccess = (data: { rating: number, reviewsCount: number, myReview: any }) => {
  if (user.value) {
    user.value.rating = data.rating;
    user.value.reviewsCount = data.reviewsCount;
    user.value.myReview = data.myReview;
    showRatingModal.value = false;
  }
};

onMounted(async () => {
  const id = route.params.id as string;
  const role = route.query.role as 'carrier' | 'shipper' || 'carrier';

  const result = await userStore.fetchPublicProfile(id, role);
  loading.value = false;

  if (result.success) {
    user.value = userStore.currentUserProfile;
  } else {
    error.value = "Impossible de charger le profil de cet utilisateur.";
  }
});

definePageMeta({ layout: 'guest' });
useHead({ title: 'Profil Utilisateur - Bourse de Fret' });
</script>
