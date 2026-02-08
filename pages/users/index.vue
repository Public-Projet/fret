<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-secondary-600 to-secondary-800 text-white py-16">
      <div class="container-custom">
        <h1 class="text-3xl md:text-4xl font-bold mb-4">Annuaire des Utilisateurs</h1>
        <p class="text-secondary-100 text-lg max-w-2xl">
          Retrouvez tous les transporteurs et expéditeurs certifiés sur la plateforme.
        </p>
      </div>
    </div>

    <div class="container-custom -mt-10">
      <!-- Tabs & Search -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-100 dark:border-gray-700">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-xl w-fit">
            <button @click="activeTab = 'carrier'"
              :class="activeTab === 'carrier' ? 'bg-white dark:bg-gray-600 shadow-sm text-secondary-600 dark:text-white' : 'text-gray-500 hover:text-gray-700'"
              class="px-6 py-2 rounded-lg text-sm font-bold transition-all">
              Transporteurs
            </button>
            <button @click="activeTab = 'shipper'"
              :class="activeTab === 'shipper' ? 'bg-white dark:bg-gray-600 shadow-sm text-secondary-600 dark:text-white' : 'text-gray-500 hover:text-gray-700'"
              class="px-6 py-2 rounded-lg text-sm font-bold transition-all">
              Expéditeurs
            </button>
          </div>

          <div class="relative flex-1 max-w-md">
            <IconSearch class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input v-model="searchQuery" type="text"
              :placeholder="`Rechercher un ${activeTab === 'carrier' ? 'transporteur' : 'expéditeur'}...`"
              class="input pl-10 w-full" />
          </div>
        </div>
      </div>

      <!-- Content -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <IconLoader2 class="w-12 h-12 text-secondary-600 animate-spin mb-4" />
        <p class="text-gray-500">Chargement des utilisateurs...</p>
      </div>

      <div v-else-if="users.length === 0"
        class="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
        <IconUsers class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Aucun utilisateur trouvé</h3>
        <p class="text-gray-500">Essayez une autre recherche.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <NuxtLink v-for="user in users" :key="user.id" :to="`/users/${user.id}?role=${activeTab}`"
          class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group flex flex-col items-center text-center">

          <div class="relative mb-4">
            <div
              class="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden ring-4 ring-white dark:ring-gray-800 group-hover:ring-secondary-50 dark:group-hover:ring-secondary-900/10 transition-all">
              <img v-if="user.photoUrl" :src="user.photoUrl" class="w-full h-full object-cover" />
              <div v-else
                class="w-full h-full flex items-center justify-center text-2xl font-black text-gray-300 uppercase">
                {{ user.firstname[0] }}{{ user.lastname[0] }}
              </div>
            </div>
            <div v-if="user.kycStatus === 'verified'"
              class="absolute -right-1 -bottom-1 bg-green-500 text-white p-1 rounded-full border-2 border-white dark:border-gray-800"
              title="Vérifié">
              <IconShieldCheck class="w-4 h-4" />
            </div>
          </div>

          <h3 class="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-secondary-600 transition-colors">
            {{ user.firstname }} {{ user.lastname }}
          </h3>
          <p class="text-xs text-gray-500 mb-3">@{{ user.username }}</p>

          <div class="flex items-center space-x-1 mb-4">
            <template v-for="i in 5" :key="i">
              <IconStarFilled v-if="i <= Math.round(user.rating)" class="w-4 h-4 text-yellow-500" />
              <IconStar v-else class="w-4 h-4 text-gray-300" />
            </template>
            <span class="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">{{ user.rating || '0.0' }}</span>
            <span class="text-xs text-gray-400">({{ user.reviewsCount }})</span>
          </div>

          <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 h-10 italic">
            "{{ user.bio || 'Aucune biographie fournie.' }}"
          </p>

          <div class="mt-auto w-full pt-4 border-t border-gray-50 dark:border-gray-700 flex justify-center">
            <span class="text-xs font-bold uppercase tracking-wider text-secondary-500">Voir le profil</span>
          </div>
        </NuxtLink>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex justify-center space-x-2">
        <button @click="currentPage--" :disabled="currentPage === 1" class="btn btn-outline btn-sm">Précédent</button>
        <span class="flex items-center px-4 text-sm font-medium">{{ currentPage }} / {{ totalPages }}</span>
        <button @click="currentPage++" :disabled="currentPage === totalPages"
          class="btn btn-outline btn-sm">Suivant</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useUserStore } from '~/stores/user';
import {
  IconSearch, IconLoader2, IconUsers, IconStarFilled, IconStar,
  IconShieldCheck
} from '@tabler/icons-vue';

const userStore = useUserStore();
const activeTab = ref<'carrier' | 'shipper'>('carrier');
const searchQuery = ref('');
const currentPage = ref(1);
const limit = 12;

const loading = computed(() => userStore.loading);
const users = computed(() => activeTab.value === 'carrier' ? userStore.carriers : userStore.shippers);
const totalUsers = computed(() => activeTab.value === 'carrier' ? userStore.totalCarriers : userStore.totalShippers);
const totalPages = computed(() => Math.ceil(totalUsers.value / limit));

const fetchUsers = async () => {
  if (activeTab.value === 'carrier') {
    await userStore.fetchPublicCarriers({ page: currentPage.value, limit, search: searchQuery.value });
  } else {
    await userStore.fetchPublicShippers({ page: currentPage.value, limit, search: searchQuery.value });
  }
};

watch([activeTab, searchQuery], () => {
  currentPage.value = 1;
  fetchUsers();
});

watch(currentPage, () => {
  fetchUsers();
});

onMounted(() => {
  fetchUsers();
});

definePageMeta({ layout: 'guest' });
useHead({ title: 'Annuaire Utilisateurs - Bourse de Fret' });
</script>
