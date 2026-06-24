<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-[2rem] p-6 lg:p-8 shadow-xl border border-gray-100 dark:border-gray-700/50">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-black text-gray-900 dark:text-white">Activité récente</h2>
      <NuxtLink to="/app/us/offers" class="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">
        Voir tout →</NuxtLink>
    </div>

    <div v-if="recentActivity.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
      <div class="w-20 h-20 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
        <IconFileText class="w-10 h-10 text-gray-300 dark:text-gray-600" />
      </div>
      <p class="text-gray-500 dark:text-gray-400 font-medium">Aucune activité récente pour le moment.</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="item in recentActivity" :key="item.type + '-' + item.id"
        class="group flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm">
            <IconTicket v-if="item.type === 'avail'" class="w-6 h-6 text-emerald-500" />
            <IconPackage v-else class="w-6 h-6 text-primary-500" />
          </div>
          <div>
            <p class="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{{
              item.title }}</p>
            <p class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {{ formatDate(item.createdAt) }}
              <span class="pl-2 border-l border-gray-200 dark:border-gray-700 ml-2 text-emerald-500"
                v-if="item.type === 'avail'">Souscription</span>
              <span class="pl-2 border-l border-gray-200 dark:border-gray-700 ml-2" v-else>Offre</span>
            </p>
          </div>
        </div>
        <NuxtLink :to="item.link"
          class="px-4 py-2 bg-white dark:bg-gray-800 rounded-xl text-xs font-black text-primary-600 border border-primary-100 dark:border-primary-900/30 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
          VOIR
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconFileText, IconTicket, IconPackage } from '@tabler/icons-vue';

defineProps<{
  recentActivity: any[];
}>();

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  });
};
</script>
