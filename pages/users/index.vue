<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
    <!-- Hero Section -->
    <UsersHeroSection />

    <div class="container-custom -mt-10">
      <!-- Tabs & Search -->
      <UsersFilters :active-tab="activeTab" :search-query="searchQuery" @update:active-tab="activeTab = $event"
        @update:search-query="searchQuery = $event" @search="handleSearch" />

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <IconLoader2 class="w-12 h-12 text-primary-600 animate-spin mb-4" />
        <p class="text-gray-500">Chargement de l'annuaire...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredUsers.length === 0"
        class="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
        <IconTruckOff v-if="activeTab === 'carrier'" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <IconCubeOff v-else class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {{ activeTab === 'carrier' ? 'Aucun transporteur trouvé' : 'Aucun expéditeur trouvé' }}
        </h3>
        <p class="text-gray-500 px-4">
          {{ activeTab === 'carrier'
            ? "Aucun transporteur ne correspond à votre recherche pour le moment."
            : "Aucun expéditeur n'a été trouvé avec ces critères." }}
        </p>
      </div>

      <!-- Users Grid -->
      <UsersGrid v-else :items="filteredUsers" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '~/stores/user';
import { IconLoader2, IconTruckOff, IconCubeOff } from '@tabler/icons-vue';

const userStore = useUserStore();
const route = useRoute();
const activeTab = ref<'carrier' | 'shipper'>('carrier');
const searchQuery = ref('');
const validatedSearchQuery = ref('');
const loading = ref(true);

const handleSearch = () => {
  validatedSearchQuery.value = searchQuery.value;
};

// Handle Query Params
const handleQueryParams = () => {
  if (route.query.tab === 'shipper') {
    activeTab.value = 'shipper';
  } else if (route.query.tab === 'carrier') {
    activeTab.value = 'carrier';
  }
};

watch(() => route.query.tab, (newTab) => {
  if (newTab === 'shipper' || newTab === 'carrier') {
    activeTab.value = newTab as 'carrier' | 'shipper';
  }
});

// Instead of ref fetching, we use the store
const users = computed(() => activeTab.value === 'carrier' ? userStore.carriers : userStore.shippers);

const filteredUsers = computed(() => {
  if (!validatedSearchQuery.value) return users.value;
  const query = validatedSearchQuery.value.toLowerCase();
  return users.value.filter(user =>
    (user.company?.toLowerCase().includes(query) || '') ||
    (user.firstname?.toLowerCase().includes(query) || '') ||
    (user.lastname?.toLowerCase().includes(query) || '') ||
    (user.location?.toLowerCase().includes(query) || '')
  );
});

onMounted(async () => {
  handleQueryParams();
  loading.value = true;
  await Promise.all([
    userStore.fetchPublicCarriers(),
    userStore.fetchPublicShippers()
  ]);
  loading.value = false;
});

definePageMeta({ layout: 'guest' });
useHead({
  title: 'Annuaire',
  meta: [
    { name: 'description', content: 'Consultez notre annuaire complet et trouvez des partenaires de confiance. Recherchez des transporteurs qualifiés ou des expéditeurs actifs au Bénin.' },
    { name: 'robots', content: 'index, follow' }
  ]
});
</script>
