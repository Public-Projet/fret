<template>
  <div
    class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl p-4 lg:p-6 mb-8 border border-white dark:border-gray-700/50">
    <div class="flex flex-col space-y-6">
      <!-- Tabs Selection -->
      <div class="flex p-1.5 bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-md rounded-2xl w-full sm:w-fit self-center sm:self-start">
        <button @click="$emit('update:activeTab', 'avail')"
          :class="activeTab === 'avail' ? 'bg-white dark:bg-gray-600 shadow-lg shadow-primary-500/10 text-primary-600 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
          class="flex-1 sm:flex-none px-4 lg:px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2">
          <IconTruck class="w-4 h-4" />
          <span class="whitespace-nowrap">Disponibilités</span>
        </button>
        <button @click="$emit('update:activeTab', 'fret')"
          :class="activeTab === 'fret' ? 'bg-white dark:bg-gray-600 shadow-lg shadow-primary-500/10 text-primary-600 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
          class="flex-1 sm:flex-none px-4 lg:px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2">
          <IconPackage class="w-4 h-4" />
          <span class="whitespace-nowrap">Annonces Fret</span>
        </button>
      </div>

      <!-- Availability Filters -->
      <div v-if="activeTab === 'avail'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div class="space-y-1.5">
          <label class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Départ</label>
          <div class="relative group">
            <IconMapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            <input :value="availFilters.origin"
              @input="$emit('update:availFilters', { ...availFilters, origin: ($event.target as HTMLInputElement).value })"
              type="text" placeholder="Ville de départ"
              class="input pl-10 pr-4 py-2.5 rounded-2xl border-gray-200/60 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 w-full focus:ring-4 focus:ring-primary-500/10 outline-none" />
          </div>
        </div>
        <div class="space-y-1.5">
          <label class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Arrivée</label>
          <div class="relative group">
            <IconMapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            <input :value="availFilters.destination"
              @input="$emit('update:availFilters', { ...availFilters, destination: ($event.target as HTMLInputElement).value })"
              type="text" placeholder="Ville d'arrivée"
              class="input pl-10 pr-4 py-2.5 rounded-2xl border-gray-200/60 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 w-full focus:ring-4 focus:ring-primary-500/10 outline-none" />
          </div>
        </div>
        <div class="space-y-1.5">
          <label class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Date</label>
          <div class="relative group">
            <IconCalendar class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            <input :value="availFilters.date"
              @input="$emit('update:availFilters', { ...availFilters, date: ($event.target as HTMLInputElement).value })"
              type="date"
              class="input pl-10 pr-4 py-2.5 rounded-2xl border-gray-200/60 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 w-full focus:ring-4 focus:ring-primary-500/10 outline-none" />
          </div>
        </div>
        <div class="flex items-end gap-2 pt-2 sm:pt-0">
          <button class="flex items-center justify-center btn-primary flex-1 h-[48px] rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-primary-500/20">
            <IconSearch class="w-5 h-5 mr-2" />
            Rechercher
          </button>
          <button @click="$emit('resetAvailFilters')"
            class="group h-[48px] px-4 rounded-2xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 transition-all active:rotate-180 duration-500"
            title="Réinitialiser">
            <IconRefresh class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Fret Filters -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div class="space-y-1.5">
          <label class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Départ</label>
          <div class="relative group">
            <IconMapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            <input :value="fretFilters.originCity"
              @input="$emit('update:fretFilters', { ...fretFilters, originCity: ($event.target as HTMLInputElement).value })"
              type="text" placeholder="Ville de départ"
              class="input pl-10 pr-4 py-2.5 rounded-2xl border-gray-200/60 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 w-full focus:ring-4 focus:ring-primary-500/10 outline-none" />
          </div>
        </div>
        <div class="space-y-1.5">
          <label class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Arrivée</label>
          <div class="relative group">
            <IconMapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            <input :value="fretFilters.destinationCity"
              @input="$emit('update:fretFilters', { ...fretFilters, destinationCity: ($event.target as HTMLInputElement).value })"
              type="text" placeholder="Ville d'arrivée"
              class="input pl-10 pr-4 py-2.5 rounded-2xl border-gray-200/60 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 w-full focus:ring-4 focus:ring-primary-500/10 outline-none" />
          </div>
        </div>
        <div class="space-y-1.5">
          <label class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">Marchandise</label>
          <select :value="fretFilters.cargoType"
            @change="$emit('update:fretFilters', { ...fretFilters, cargoType: ($event.target as HTMLSelectElement).value })"
            class="input px-4 py-2.5 rounded-2xl border-gray-200/60 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 w-full focus:ring-4 focus:ring-primary-500/10 outline-none appearance-none cursor-pointer">
            <option value="">Tous</option>
            <option value="palettes">Palettes</option>
            <option value="vrac">Vrac</option>
            <option value="conteneur">Conteneur</option>
            <option value="frigorifique">Frigorifique</option>
            <option value="dangereux">Dangereux</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        <div class="flex items-end gap-2 pt-2 sm:pt-0">
          <button @click="$emit('applyFretFilters')"
            class="flex items-center justify-center btn-primary flex-1 h-[48px] rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-primary-500/20">
            <IconSearch class="w-5 h-5 mr-2" />
            Filtrer
          </button>
          <button @click="$emit('resetFretFilters')"
            class="group h-[48px] px-4 rounded-2xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 transition-all active:rotate-180 duration-500"
            title="Réinitialiser">
            <IconRefresh class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconTruck, IconPackage, IconMapPin, IconCalendar, IconSearch, IconRefresh } from '@tabler/icons-vue';

defineProps<{
  activeTab: 'avail' | 'fret';
  availFilters: {
    origin: string;
    destination: string;
    date: string;
  };
  fretFilters: {
    originCity: string;
    destinationCity: string;
    cargoType: string;
    minBudget?: number;
  };
}>();

defineEmits<{
  (e: 'update:activeTab', value: 'avail' | 'fret'): void;
  (e: 'update:availFilters', value: any): void;
  (e: 'update:fretFilters', value: any): void;
  (e: 'applyFretFilters'): void;
  (e: 'resetFretFilters'): void;
  (e: 'resetAvailFilters'): void;
}>();
</script>
