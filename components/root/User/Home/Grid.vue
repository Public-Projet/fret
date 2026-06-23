<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    <NuxtLink v-for="user in items" :key="user.id" :to="`/users/${user.id}?role=${user.role}`"
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all group text-center block">

      <div class="relative w-20 h-20 mx-auto mb-4">
        <div
          class="w-20 h-20 rounded-full overflow-hidden bg-gray-100 ring-4 ring-white dark:ring-gray-800 shadow-sm mx-auto">
          <img v-if="user.photoUrl" :src="user.photoUrl" class="w-full h-full object-cover" />
          <div v-else
            class="w-full h-full bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 flex items-center justify-center text-2xl font-bold uppercase">
            {{ getUserInitials(user) }}
          </div>
        </div>
        <div v-if="user.verified"
          class="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full text-white flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
          <IconCheck class="w-3.5 h-3.5" stroke-width="3" />
        </div>
      </div>

      <h3 class="font-bold text-gray-900 dark:text-white text-lg truncate mb-1">
        {{ user.company || (user.firstname + ' ' + user.lastname) }}
      </h3>
      <p class="text-xs text-gray-500 uppercase tracking-widest font-bold mb-3">
        {{ user.role === 'carrier' ? 'Transporteur' : 'Expéditeur' }}
      </p>

      <div class="flex items-center justify-center space-x-1 mb-4">
        <div class="flex text-yellow-400">
          <component :is="getStarIcon(i, user.rating)" v-for="i in 5" :key="i" class="w-4 h-4" />
        </div>
        <span class="text-sm font-bold text-gray-600 dark:text-gray-400 ml-1">{{ user.rating }}</span>
        <span class="text-xs text-gray-400">({{ user.reviewsCount }})</span>
      </div>

      <div class="flex flex-wrap gap-2 justify-center mb-4">
        <span v-if="user.location" class="badge badge-neutral text-xs">
          <IconMapPin class="w-3 h-3 mr-1" />
          {{ user.location }}
        </span>
        <span v-if="user.role === 'carrier' && user.vehicleCount" class="badge badge-neutral text-xs">
          <IconTruck class="w-3 h-3 mr-1" />
          {{ user.vehicleCount }} vhl.
        </span>
      </div>

      <span
        class="btn btn-outline btn-sm w-full rounded-xl group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-colors">
        Voir le profil
      </span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { IconCheck, IconMapPin, IconTruck, IconStarFilled, IconStar, IconStarHalfFilled } from '@tabler/icons-vue';

defineProps<{
  items: any[];
}>();

const getUserInitials = (user: any) => {
  if (user.company) return user.company.substring(0, 2);
  return (user.firstname?.[0] || '') + (user.lastname?.[0] || '');
};

const getStarIcon = (index: number, rating: number) => {
  if (index <= rating) return IconStarFilled;
  if (index - 0.5 <= rating) return IconStarHalfFilled;
  return IconStar;
};
</script>
