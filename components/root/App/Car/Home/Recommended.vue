<template>
  <div class="space-y-6">
    <h2 class="text-xl font-black text-gray-900 dark:text-white">Pour vous</h2>

    <div class="space-y-4">
      <div v-for="announcement in recommendedAnnouncements" :key="announcement.id"
        class="group bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all relative overflow-hidden">
        <div
          class="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150">
        </div>

        <div class="relative z-10">
          <h3 class="font-black text-gray-900 dark:text-white line-clamp-1 mb-4 text-lg">
            {{ announcement.title }}
          </h3>

          <div class="flex items-center gap-3 mb-6 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
            <div class="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm">
              <IconMapPin class="w-4 h-4 text-primary-500" />
            </div>
            <div class="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              {{ announcement.origin?.city || 'Bénin' }} → {{ announcement.destination?.city || 'Libre' }}
            </div>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-xl font-black text-primary-600">{{ announcement.budget?.toLocaleString() || '0' }} <span
                class="text-xs">FCFA</span></span>
            <NuxtLink :to="`/annonces/${announcement.id}?type=offer`"
              class="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 hover:bg-primary-500 active:scale-90 transition-all">
              →
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- View More Card -->
      <NuxtLink to="/annonces?tab=fret"
        class="block p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[2rem] text-center hover:border-primary-500 transition-all group">
        <p class="text-gray-500 font-bold group-hover:text-primary-600">Voir toutes les annonces de fret</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconMapPin } from '@tabler/icons-vue';

defineProps<{
  recommendedAnnouncements: any[];
}>();
</script>
