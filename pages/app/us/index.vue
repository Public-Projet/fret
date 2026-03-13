<template>
  <div class="container-custom py-6 lg:py-10">
    <!-- Header Section -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
      <div>
        <h1 class="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white leading-tight">
          Bienvenue, <span class="text-primary-600 dark:text-primary-400">{{ currentUser?.firstName }}</span>
        </h1>
        <p class="text-lg text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Tableau de bord Chargeur
        </p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
        <NuxtLink to="/app/us/avail" class="btn-outline flex items-center justify-center py-3 px-4 rounded-2xl font-bold text-sm">
          <IconTicket class="w-5 h-5 mr-2" />
          Souscriptions
        </NuxtLink>
        <NuxtLink to="/app/us/offers" class="btn-outline flex items-center justify-center py-3 px-4 rounded-2xl font-bold text-sm">
          <IconList class="w-5 h-5 mr-2" />
          Mes annonces
        </NuxtLink>
        <NuxtLink to="/app/us/offers/create" class="btn-primary flex items-center justify-center py-3 px-6 rounded-2xl font-bold text-sm shadow-lg shadow-primary-500/20 active:scale-95 transition-all">
          <IconPlus class="w-5 h-5 mr-2" />
          Nouvelle annonce
        </NuxtLink>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10">
      <div class="group bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-[2rem] shadow-xl shadow-blue-500/20 relative overflow-hidden transition-all hover:scale-[1.02]">
        <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
          <IconFileText class="w-24 h-24" />
        </div>
        <IconFileText class="w-8 h-8 text-white/90 mb-4" />
        <div>
          <p class="text-xs lg:text-sm font-bold text-blue-100 uppercase tracking-wider mb-1">Annonces actives</p>
          <p class="text-3xl lg:text-4xl font-black text-white">{{ activeAnnouncementsCount }}</p>
        </div>
      </div>

      <div class="group bg-gradient-to-br from-amber-400 to-orange-600 p-6 rounded-[2rem] shadow-xl shadow-amber-500/20 relative overflow-hidden transition-all hover:scale-[1.02]">
        <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
          <IconMessage class="w-24 h-24" />
        </div>
        <IconMessage class="w-8 h-8 text-white/90 mb-4" />
        <div>
          <p class="text-xs lg:text-sm font-bold text-amber-50/90 uppercase tracking-wider mb-1">Négociations</p>
          <p class="text-3xl lg:text-4xl font-black text-white">{{ negotiatingCount }}</p>
        </div>
      </div>

      <div class="group bg-gradient-to-br from-emerald-500 to-teal-700 p-6 rounded-[2rem] shadow-xl shadow-green-500/20 relative overflow-hidden transition-all hover:scale-[1.02]">
        <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
          <IconCircleCheck class="w-24 h-24" />
        </div>
        <IconCircleCheck class="w-8 h-8 text-white/90 mb-4" />
        <div>
          <p class="text-xs lg:text-sm font-bold text-emerald-50/90 uppercase tracking-wider mb-1">Chargements</p>
          <p class="text-3xl lg:text-4xl font-black text-white">{{ completedCount }}</p>
        </div>
      </div>

      <div class="group bg-gradient-to-br from-indigo-500 to-purple-700 p-6 rounded-[2rem] shadow-xl shadow-indigo-500/20 relative overflow-hidden transition-all hover:scale-[1.02]">
        <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
          <IconCurrencyEuro class="w-24 h-24" />
        </div>
        <IconCurrencyEuro class="w-8 h-8 text-white/90 mb-4" />
        <div>
          <p class="text-xs lg:text-sm font-bold text-indigo-50/90 uppercase tracking-wider mb-1">Budget total</p>
          <p class="text-2xl lg:text-3xl font-black text-white leading-tight">{{ totalBudget.toLocaleString() }} <span class="text-sm">FCFA</span></p>
        </div>
      </div>
    </div>

    <!-- Recent Activity / Quick View -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
      <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-[2rem] p-6 lg:p-8 shadow-xl border border-gray-100 dark:border-gray-700/50">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-black text-gray-900 dark:text-white">Activité récente</h2>
          <NuxtLink to="/app/us/offers" class="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">Voir tout →</NuxtLink>
        </div>
        
        <div v-if="recentAnnouncements.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
          <div class="w-20 h-20 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
            <IconFileText class="w-10 h-10 text-gray-300 dark:text-gray-600" />
          </div>
          <p class="text-gray-500 dark:text-gray-400 font-medium">Aucune activité récente pour le moment.</p>
        </div>
        
        <div v-else class="space-y-4">
          <div v-for="announcement in recentAnnouncements" :key="announcement.id"
            class="group flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm">
                <IconPackage class="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <p class="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{{ announcement.title }}</p>
                <p class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{{ formatDate(announcement.createdAt) }}</p>
              </div>
            </div>
            <NuxtLink :to="`/annonces/${announcement.id}?type=offer`" 
              class="px-4 py-2 bg-white dark:bg-gray-800 rounded-xl text-xs font-black text-primary-600 border border-primary-100 dark:border-primary-900/30 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
              VOIR
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Quick Action Card -->
      <div class="bg-gradient-to-br from-gray-900 to-slate-800 dark:from-slate-900 dark:to-black rounded-[2rem] p-8 text-center relative overflow-hidden shadow-2xl">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent)]"></div>
        <div class="relative z-10 flex flex-col items-center">
          <div class="w-20 h-20 bg-primary-500/20 rounded-[2rem] flex items-center justify-center mb-6 rotate-12 group-hover:rotate-0 transition-transform">
            <IconRocket class="w-10 h-10 text-primary-400 shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
          </div>
          <h3 class="text-2xl font-black text-white mb-3">Boostez vos transports</h3>
          <p class="text-slate-400 dark:text-gray-400 mb-8 leading-relaxed">
            Trouvez instantanément le transporteur idéal pour vos marchandises à travers tout le Bénin.
          </p>
          <NuxtLink to="/app/us/offers/create" 
            class="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black shadow-xl shadow-primary-900/20 active:scale-95 transition-all flex items-center justify-center gap-2">
            <IconPlus class="w-6 h-6" />
            CRÉER UNE ANNONCE
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useAnnouncementStore } from '~/stores/announcement';
import { IconCircleCheck, IconCurrencyEuro, IconFileText, IconMessage, IconPlus, IconList, IconRocket, IconTicket } from '@tabler/icons-vue';

const authStore = useAuthStore();
const announcementStore = useAnnouncementStore();

const loading = computed(() => announcementStore.loading);
const currentUser = computed(() => authStore.currentUser);

const myAnnouncements = computed(() => {
  if (!currentUser.value) return [];
  return announcementStore.userAnnouncements(currentUser.value.id);
});

// Stats
const activeAnnouncementsCount = computed(() =>
  myAnnouncements.value.filter(a => ['pending', 'negotiating'].includes(a.status)).length
);

const negotiatingCount = computed(() =>
  myAnnouncements.value.filter(a => a.status === 'negotiating').length
);

const completedCount = computed(() =>
  myAnnouncements.value.filter(a => a.status === 'completed').length
);

const totalBudget = computed(() =>
  myAnnouncements.value.reduce((sum, a) => sum + a.budget, 0)
);

const recentAnnouncements = computed(() => {
  return [...myAnnouncements.value]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  });
};

onMounted(() => {
  announcementStore.fetchMyAnnouncements();
});
useHead({
  title: 'Tableau de bord Expéditeur',
  meta: [
    { name: 'description', content: 'Accédez à votre tableau de bord expéditeur sur Bourse de Fret.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
