<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
    <!-- Hero Section -->
    <UsersHeroSection />

    <div class="container-custom -mt-10">
      <!-- Tabs & Search -->
      <UsersFilters :active-tab="activeTab" :search-query="searchQuery" @update:active-tab="activeTab = $event"
        @update:search-query="searchQuery = $event" />

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <IconLoader2 class="w-12 h-12 text-primary-600 animate-spin mb-4" />
        <p class="text-gray-500">Chargement de l'annuaire...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredUsers.length === 0" class="text-center py-20">
        <IconUserOff class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Aucun utilisateur trouvé</h3>
        <p class="text-gray-500">Essayez de modifier votre recherche.</p>
      </div>

      <!-- Users Grid -->
      <UsersGrid v-else :items="filteredUsers" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '~/stores/user';
import { IconLoader2, IconUserOff } from '@tabler/icons-vue';

const userStore = useUserStore();
const activeTab = ref<'carrier' | 'shipper'>('carrier');
const searchQuery = ref('');
const loading = ref(true);

// Instead of ref fetching, we use the store
const users = computed(() => activeTab.value === 'carrier' ? userStore.carriers : userStore.shippers);

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const query = searchQuery.value.toLowerCase();
  return users.value.filter(user =>
    (user.company?.toLowerCase().includes(query) || '') ||
    (user.firstname?.toLowerCase().includes(query) || '') ||
    (user.lastname?.toLowerCase().includes(query) || '') ||
    (user.location?.toLowerCase().includes(query) || '')
  );
});

onMounted(async () => {
  loading.value = true;
  await Promise.all([
    userStore.fetchPublicCarriers(),
    userStore.fetchPublicShippers()
  ]);
  loading.value = false;
});

definePageMeta({ layout: 'guest' });
useHead({ title: 'Annuaire - Bourse de Fret' });
</script>
