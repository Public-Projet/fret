<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
    <!-- Banner Header -->
    <div class="h-48 bg-gradient-to-r from-primary-600 to-secondary-600 relative">
      <div class="absolute inset-0 bg-black/10"></div>
    </div>

    <div class="container-custom -mt-20 relative z-10">
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="p-6 md:p-8">
          <div class="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-20 mb-6">
            <div
              class="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-white shadow-md flex items-center justify-center overflow-hidden">
              <div v-if="user?.firstName"
                class="w-full h-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-4xl font-bold text-primary-600 dark:text-primary-400">
                {{ user.firstName[0] }}
              </div>
            </div>
            <div class="mt-4 md:mt-0 md:ml-6 flex-1 text-center md:text-left">
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ user?.firstName }} {{ user?.lastName }}
              </h1>
              <div class="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 capitalize">
                  {{ user?.role === 'shipper' ? 'Chargeur' : 'Transporteur' }}
                </span>
                <span v-if="user?.verified"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <IconBadge class="w-4 h-4 mr-1" /> Vérifié
                </span>
              </div>
            </div>
            <div class="mt-6 md:mt-0 flex space-x-3">
              <button class="btn btn-outline flex items-center">
                <IconSettings class="w-5 h-5 mr-2" />
                Paramètres
              </button>
              <button class="btn btn-primary flex items-center">
                <IconEdit class="w-5 h-5 mr-2" />
                Éditer
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <!-- Sidebar Stats & Info -->
            <div class="space-y-6">
              <div class="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <IconInfoCircle class="w-5 h-5 mr-2 text-primary-600" />
                  Informations
                </h3>
                <ul class="space-y-4 text-sm">
                  <li class="flex items-start">
                    <IconBuildingStore class="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <span class="block text-xs text-gray-500 uppercase tracking-wide">Entreprise</span>
                      <span class="font-medium text-gray-900 dark:text-white">{{ user?.company }}</span>
                    </div>
                  </li>
                  <li class="flex items-start">
                    <IconMail class="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <span class="block text-xs text-gray-500 uppercase tracking-wide">Email</span>
                      <span class="font-medium text-gray-900 dark:text-white">{{ user?.email }}</span>
                    </div>
                  </li>
                  <li class="flex items-start">
                    <IconPhone class="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <span class="block text-xs text-gray-500 uppercase tracking-wide">Téléphone</span>
                      <span class="font-medium text-gray-900 dark:text-white">{{ user?.phone }}</span>
                    </div>
                  </li>
                  <li class="flex items-start">
                    <IconCalendar class="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <span class="block text-xs text-gray-500 uppercase tracking-wide">Membre depuis</span>
                      <span class="font-medium text-gray-900 dark:text-white">{{ formatDate(user?.createdAt) }}</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div class="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <IconFileCertificate class="w-5 h-5 mr-2 text-primary-600" />
                  Documents
                </h3>
                <div class="space-y-3">
                  <div v-for="doc in ['Kbis', 'Assurance', 'Identité']" :key="doc"
                    class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center">
                      <IconFileCheck class="w-5 h-5 text-green-500 mr-2" />
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ doc }}</span>
                    </div>
                    <span
                      class="text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded">Validé</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Main Content: Stats & Reviews -->
            <div class="md:col-span-2 space-y-8">
              <!-- Stats Cards -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div class="bg-primary-50 dark:bg-primary-900/10 p-4 rounded-xl text-center">
                  <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ user?.rating }}</div>
                  <div class="text-xs text-gray-600 dark:text-gray-400 uppercase font-medium mt-1">Note Moyenne</div>
                </div>
                <div class="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl text-center">
                  <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ user?.reviewCount }}</div>
                  <div class="text-xs text-gray-600 dark:text-gray-400 uppercase font-medium mt-1">Avis</div>
                </div>
                <div class="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl text-center">
                  <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">100%</div>
                  <div class="text-xs text-gray-600 dark:text-gray-400 uppercase font-medium mt-1">Réponse</div>
                </div>
                <div class="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl text-center">
                  <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">2h</div>
                  <div class="text-xs text-gray-600 dark:text-gray-400 uppercase font-medium mt-1">Délai moyen</div>
                </div>
              </div>

              <!-- Reviews Section -->
              <div>
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">Avis clients</h3>
                  <div class="flex items-center space-x-1 text-sm text-gray-500">
                    <IconStarFilled class="w-4 h-4 text-yellow-400" />
                    <span class="font-bold text-gray-900 dark:text-white">{{ user?.rating }}</span>
                    <span>sur 5</span>
                  </div>
                </div>

                <div v-if="reviews.length === 0"
                  class="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                  <IconMessageOff class="w-12 h-12 mx-auto text-gray-300 mb-2" />
                  <p class="text-gray-500">Aucun avis reçu pour le moment.</p>
                </div>

                <div v-else class="space-y-4">
                  <div v-for="review in reviews" :key="review.id"
                    class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition hover:shadow-md">
                    <div class="flex justify-between items-start mb-3">
                      <div class="flex items-center space-x-3">
                        <div
                          class="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">
                          {{ review.fromUser?.firstName[0] }}
                        </div>
                        <div>
                          <h4 class="font-bold text-gray-900 dark:text-white">{{ review.fromUser?.firstName }} {{
                            review.fromUser?.lastName }}</h4>
                          <p class="text-xs text-gray-500">{{ formatDate(review.createdAt) }}</p>
                        </div>
                      </div>
                      <div class="flex text-yellow-400">
                        <IconStarFilled v-for="i in 5" :key="i" class="w-4 h-4"
                          :class="i <= review.rating ? 'opacity-100' : 'opacity-30'" />
                      </div>
                    </div>
                    <p class="text-gray-600 dark:text-gray-300 leading-relaxed">{{ review.comment }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useReviewStore } from '~/stores/review';
import {
  IconBadge, IconBuildingStore, IconCalendar, IconEdit, IconFileCertificate, IconFileCheck,
  IconInfoCircle, IconMail, IconMessageOff, IconPhone, IconSettings, IconStarFilled
} from '@tabler/icons-vue';

const authStore = useAuthStore();
const reviewStore = useReviewStore();

const user = computed(() => authStore.currentUser);
const reviews = computed(() => user.value ? reviewStore.userReviews(user.value.id) : []);

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>
