<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
    <!-- Banner -->
    <div class="h-48 bg-gradient-to-r from-gray-800 to-gray-900 relative">
      <div class="absolute inset-0 bg-pattern opacity-10"></div>
    </div>

    <!-- Main Info -->
    <div class="px-8 pb-8 -mt-16 bg-white dark:bg-transparent relative">
      <div class="flex flex-col md:flex-row items-end gap-6 mb-6">
        <div class="w-32 h-32 rounded-3xl bg-white dark:bg-gray-800 p-1 shadow-lg">
          <div class="w-full h-full rounded-2xl overflow-hidden bg-gray-100">
            <img v-if="user.photoUrl" :src="user.photoUrl" class="w-full h-full object-cover" />
            <div v-else
              class="w-full h-full bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 flex items-center justify-center text-4xl font-bold uppercase">
              {{ getUserInitials(user) }}
            </div>
          </div>
        </div>
        <div class="flex-1 pb-2 text-center md:text-left">
          <h1 class="text-3xl font-black text-gray-900 dark:text-white mb-1">
            {{ user.company || (user.firstname + ' ' + user.lastname) }}
            <IconDiscountCheckFilled v-if="user.verified" class="inline w-6 h-6 text-blue-500 ml-1" />
          </h1>
          <p class="text-gray-500 font-medium mb-2">{{ user.role === 'carrier' ? 'Transporteur Professionnel' :
            'Expéditeur Vérifié' }}</p>
          <div class="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-600 dark:text-gray-400">
            <div v-if="user.location" class="flex items-center">
              <IconMapPin class="w-4 h-4 mr-1" />
              {{ user.location }}
            </div>
            <div class="flex items-center text-yellow-500">
              <IconStarFilled class="w-4 h-4 mr-1" />
              <span class="font-bold text-gray-900 dark:text-white">{{ user.rating }}</span>
              <span class="text-gray-400 ml-1">({{ user.reviewsCount }} avis)</span>
            </div>
            <div class="flex items-center">
              <IconCalendar class="w-4 h-4 mr-1" />
              Membre depuis {{ formatDate(user.createdAt) }}
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-3 w-full md:w-auto">
          <button v-if="!isMe" class="btn btn-primary w-full">
            Contacter
          </button>
          <button v-if="!isMe && canRate" @click="$emit('openRateModal')" class="btn btn-secondary w-full">
            {{ user.myReview ? 'Modifier mon avis' : 'Laisser un avis' }}
          </button>
        </div>
      </div>

      <div v-if="user.bio" class="max-w-3xl">
        <h3 class="font-bold text-gray-900 dark:text-white mb-2">À propos</h3>
        <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ user.bio }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconDiscountCheckFilled, IconMapPin, IconCalendar, IconStarFilled } from '@tabler/icons-vue';

defineProps<{
  user: any;
  isMe: boolean;
  canRate: boolean;
}>();

defineEmits<{
  (e: 'openRateModal'): void;
}>();

const getUserInitials = (user: any) => {
  if (user.company) return user.company.substring(0, 2);
  return (user.firstname?.[0] || '') + (user.lastname?.[0] || '');
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  });
};
</script>
