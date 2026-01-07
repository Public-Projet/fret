<template>
  <div class="container-custom py-8">
    <div class="max-w-4xl mx-auto">
      <!-- En-tête Profil -->
      <div class="card p-8 mb-8">
        <div class="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div
            class="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-3xl">
            {{ user?.firstName[0] }}
          </div>
          <div class="flex-1 text-center md:text-left">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ user?.firstName }} {{ user?.lastName }}</h1>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-2">{{ user?.company }}</p>
            <div class="flex items-center justify-center md:justify-start space-x-4 text-sm text-gray-500">
              <div class="flex items-center">
                <IconStarFilled class="w-5 h-5 text-yellow-400 mr-1" />
                <span class="font-medium text-gray-900 dark:text-white mr-1">{{ user?.rating }}</span>
                <span>({{ user?.reviewCount }} avis)</span>
              </div>
              <div class="flex items-center">
                <IconBadge class="w-5 h-5 text-green-500 mr-1" />
                <span>Vérifié</span>
              </div>
            </div>
          </div>
          <button class="btn btn-outline">Modifier le profil</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Informations -->
        <div class="md:col-span-1 space-y-6">
          <div class="card p-6">
            <h2 class="font-bold text-gray-900 dark:text-white mb-4">Informations</h2>
            <div class="space-y-3 text-sm">
              <div>
                <p class="text-gray-500">Email</p>
                <p class="font-medium text-gray-900 dark:text-white">{{ user?.email }}</p>
              </div>
              <div>
                <p class="text-gray-500">Téléphone</p>
                <p class="font-medium text-gray-900 dark:text-white">{{ user?.phone }}</p>
              </div>
              <div>
                <p class="text-gray-500">Membre depuis</p>
                <p class="font-medium text-gray-900 dark:text-white">{{ formatDate(user?.createdAt) }}</p>
              </div>
              <div>
                <p class="text-gray-500">Rôle</p>
                <p class="font-medium text-gray-900 dark:text-white capitalize">{{ user?.role === 'shipper' ? 'Chargeur'
                  : 'Transporteur' }}</p>
              </div>
            </div>
          </div>

          <div class="card p-6">
            <h2 class="font-bold text-gray-900 dark:text-white mb-4">Documents</h2>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div class="flex items-center">
                  <IconFile class="w-5 h-5 text-gray-400 mr-2" />
                  <span class="text-sm font-medium">Kbis</span>
                </div>
                <IconCircleCheck class="w-5 h-5 text-green-500" />
              </div>
              <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div class="flex items-center">
                  <IconFile class="w-5 h-5 text-gray-400 mr-2" />
                  <span class="text-sm font-medium">Assurance</span>
                </div>
                <IconCircleCheck class="w-5 h-5 text-green-500" />
              </div>
              <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div class="flex items-center">
                  <IconFile class="w-5 h-5 text-gray-400 mr-2" />
                  <span class="text-sm font-medium">Identité</span>
                </div>
                <IconCircleCheck class="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        <!-- Avis et Historique -->
        <div class="md:col-span-2 space-y-6">
          <div class="card p-6">
            <h2 class="font-bold text-gray-900 dark:text-white mb-6">Derniers avis</h2>

            <div v-if="reviews.length === 0" class="text-center py-8 text-gray-500">
              Aucun avis pour le moment.
            </div>

            <div v-else class="space-y-6">
              <div v-for="review in reviews" :key="review.id"
                class="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                <div class="flex justify-between items-start mb-2">
                  <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold">
                      {{ review.fromUser?.firstName[0] }}
                    </div>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">{{ review.fromUser?.firstName }} {{
                        review.fromUser?.lastName }}</p>
                      <p class="text-xs text-gray-500">{{ formatDate(review.createdAt) }}</p>
                    </div>
                  </div>
                  <div class="flex">
                    <IconStar v-for="i in 5" :key="i" class="w-4 h-4"
                      :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'" />
                  </div>
                </div>
                <p class="text-gray-600 dark:text-gray-400 text-sm">{{ review.comment }}</p>
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
import { IconBadge, IconCircleCheck, IconFile, IconStar, IconStarFilled } from '@tabler/icons-vue';

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
