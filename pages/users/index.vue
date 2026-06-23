<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
    <!-- Hero Section -->
    <UsersHeroSection />

    <div class="container-custom -mt-10">
      <!-- Tabs & Search -->
      <UsersFilters :active-tab="activeTab" :search-query="searchQuery" @update:active-tab="activeTab = $event"
        @update:search-query="searchQuery = $event" @search="handleSearch" />

      <!-- Loading State -->
      <RootUserHomeLoading v-if="loading" />

      <!-- Empty State -->
      <RootUserHomeEmpty v-else-if="filteredUsers.length === 0" :active-tab="activeTab" />

      <!-- Users Grid -->
      <UsersGrid v-else :items="filteredUsers" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCmnUserStore } from '~/stores/cmnUser';


const userStore = useCmnUserStore();
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
