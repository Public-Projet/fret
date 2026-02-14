<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-100 dark:border-gray-700">
    <div class="flex flex-col md:flex-row justify-between items-center gap-6">
      <!-- Tabs -->
      <div class="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-xl w-full md:w-auto">
        <button @click="$emit('update:activeTab', 'carrier')"
          :class="activeTab === 'carrier' ? 'bg-white dark:bg-gray-600 shadow-sm text-primary-600 dark:text-white' : 'text-gray-500 hover:text-gray-700'"
          class="flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2">
          <IconTruck class="w-4 h-4" />
          Transporteurs
        </button>
        <button @click="$emit('update:activeTab', 'shipper')"
          :class="activeTab === 'shipper' ? 'bg-white dark:bg-gray-600 shadow-sm text-primary-600 dark:text-white' : 'text-gray-500 hover:text-gray-700'"
          class="flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2">
          <IconBuildingStore class="w-4 h-4" />
          Expéditeurs
        </button>
      </div>

      <!-- Search -->
      <div class="flex items-center gap-2 w-full md:w-[450px]">
        <div class="relative flex-1">
          <IconSearch class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input :value="searchQuery" @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
            @keyup.enter="$emit('search')" type="text"
            :placeholder="activeTab === 'carrier' ? 'Rechercher un transporteur...' : 'Rechercher un expéditeur...'"
            class="input pl-12 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 focus:bg-white dark:focus:bg-gray-800 transition-colors w-full" />
        </div>
        <button @click="$emit('search')" class="btn btn-primary h-[42px] px-6 rounded-xl flex items-center gap-2">
          <IconSearch class="w-4 h-4" />
          <span>Rechercher</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconTruck, IconBuildingStore, IconSearch } from '@tabler/icons-vue';

defineProps<{
  activeTab: 'carrier' | 'shipper';
  searchQuery: string;
}>();

defineEmits(['update:activeTab', 'update:searchQuery', 'search']);
</script>
