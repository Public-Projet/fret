<template>
  <div
    class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl p-4 lg:p-6 mb-8 border border-white dark:border-gray-700/50">
    <div class="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 lg:gap-6">
      <!-- Tabs -->
      <div class="flex p-1.5 bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-md rounded-2xl w-full lg:w-auto">
        <button @click="$emit('update:activeTab', 'carrier')"
          :class="activeTab === 'carrier' ? 'bg-white dark:bg-gray-600 shadow-lg shadow-primary-500/10 text-primary-600 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
          class="flex-1 lg:flex-none px-4 lg:px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2">
          <IconTruck class="w-4 h-4" />
          <span class="whitespace-nowrap">Transporteurs</span>
        </button>
        <button @click="$emit('update:activeTab', 'shipper')"
          :class="activeTab === 'shipper' ? 'bg-white dark:bg-gray-600 shadow-lg shadow-primary-500/10 text-primary-600 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
          class="flex-1 lg:flex-none px-4 lg:px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2">
          <IconBuildingStore class="w-4 h-4" />
          <span class="whitespace-nowrap">Expéditeurs</span>
        </button>
      </div>

      <!-- Search -->
      <div class="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto lg:flex-1 lg:max-w-xl">
        <div class="relative w-full">
          <IconSearch class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          <input :value="searchQuery" @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
            @keyup.enter="$emit('search')" type="text"
            :placeholder="activeTab === 'carrier' ? 'Rechercher un transporteur...' : 'Rechercher un expéditeur...'"
            class="input pl-12 pr-4 py-3 rounded-2xl border-gray-200/60 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 w-full focus:ring-4 focus:ring-primary-500/10 outline-none" />
        </div>
        <button @click="$emit('search')"
          class="btn-primary w-full sm:w-auto h-[48px] px-8 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-primary-500/20 active:scale-95 transition-all">
          <IconSearch class="w-5 h-5" />
          <span class="lg:hidden xl:inline">Rechercher</span>
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
