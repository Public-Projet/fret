<template>
  <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
    <div>
      <h1 class="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white leading-tight">
        Bienvenue, <span class="text-primary-600 dark:text-primary-400">{{ currentUser?.firstName || 'Chargeur'
          }}</span>
      </h1>
      <p class="text-lg text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        Tableau de bord Chargeur
      </p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
      <NuxtLink to="/app/us/avail"
        class="btn-outline flex items-center justify-center py-3 px-4 rounded-2xl font-bold text-sm">
        <IconTicket class="w-5 h-5 mr-2" />
        Souscriptions
      </NuxtLink>
      <NuxtLink to="/app/us/offers"
        class="btn-outline flex items-center justify-center py-3 px-4 rounded-2xl font-bold text-sm">
        <IconList class="w-5 h-5 mr-2" />
        Mes annonces
      </NuxtLink>
      <NuxtLink to="/app/us/offers/create"
        class="btn-primary flex items-center justify-center py-3 px-6 rounded-2xl font-bold text-sm shadow-lg shadow-primary-500/20 active:scale-95 transition-all">
        <IconPlus class="w-5 h-5 mr-2" />
        Nouvelle annonce
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconTicket, IconList, IconPlus } from '@tabler/icons-vue';

defineProps<{
  currentUser: any;
}>();
</script>
