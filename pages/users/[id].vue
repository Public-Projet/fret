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
                  <span class="block text-2xl font-black text-secondary-600">{{ user.rating || '0.0' }}</span>
                  <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Note</span>
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

        <div v-if="user.role === 'carrier'"
          class="bg-blue-50 dark:bg-blue-900/10 p-8 rounded-3xl border border-blue-100 dark:border-blue-900/20">
          <div class="flex items-center mb-6">
            <IconTruck class="w-6 h-6 text-blue-600 mr-3" />
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Services de Transport</h2>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Ce transporteur propose des trajets réguliers et des services de logistique. Vous pouvez consulter ses
            disponibilités actuelles pour réserver une place.
          </p>
          <NuxtLink to="/avail" class="btn btn-primary">Voir ses disponibilités</NuxtLink>
        </div>

        <!-- Rating Section -->
        <div v-if="canRate" class="mt-8">
          <RatingForm :targetId="user.id" :targetRole="user.role" @success="handleRatingSuccess" />
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
  IconStarFilled, IconCircleCheck, IconTruck, IconStar
} from '@tabler/icons-vue';
import RatingForm from '~/components/profile/RatingForm.vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();

const user = ref<any>(null);
const loading = ref(true);
const error = ref('');

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

const handleRatingSuccess = (data: { rating: number, reviewsCount: number }) => {
  if (user.value) {
    user.value.rating = data.rating;
    user.value.reviewsCount = data.reviewsCount;
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
