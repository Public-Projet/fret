<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-100 dark:border-gray-700">
    <div class="flex flex-col space-y-6">
      <!-- Tabs Selection -->
      <div class="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-xl w-fit self-center md:self-start">
        <button @click="$emit('update:activeTab', 'avail')"
          :class="activeTab === 'avail' ? 'bg-white dark:bg-gray-600 shadow-sm text-primary-600 dark:text-white' : 'text-gray-500 hover:text-gray-700'"
          class="px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
          <IconTruck class="w-4 h-4" />
          Disponibilités
        </button>
        <button @click="$emit('update:activeTab', 'fret')"
          :class="activeTab === 'fret' ? 'bg-white dark:bg-gray-600 shadow-sm text-primary-600 dark:text-white' : 'text-gray-500 hover:text-gray-700'"
          class="px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
          <IconPackage class="w-4 h-4" />
          Annonces Fret
        </button>
      </div>

      <!-- Availability Filters -->
      <div v-if="activeTab === 'avail'" class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="space-y-1">
          <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Départ</label>
          <div class="relative">
            <IconMapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input :value="availFilters.origin"
              @input="$emit('update:availFilters', { ...availFilters, origin: ($event.target as HTMLInputElement).value })"
              type="text" placeholder="Ville de départ" class="input pl-10" />
          </div>
        </div>
        <div class="space-y-1">
          <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Arrivée</label>
          <div class="relative">
            <IconMapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input :value="availFilters.destination"
              @input="$emit('update:availFilters', { ...availFilters, destination: ($event.target as HTMLInputElement).value })"
              type="text" placeholder="Ville d'arrivée" class="input pl-10" />
          </div>
        </div>
        <div class="space-y-1">
          <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Date</label>
          <div class="relative">
            <IconCalendar class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input :value="availFilters.date"
              @input="$emit('update:availFilters', { ...availFilters, date: ($event.target as HTMLInputElement).value })"
              type="date" class="input pl-10" />
          </div>
        </div>
        <div class="flex items-end gap-2">
          <button class="flex item-center btn btn-primary flex-1 h-[42px]">
            <IconSearch class="w-5 h-5 mr-2" />
            Rechercher
          </button>
          <button @click="$emit('resetAvailFilters')" class="btn btn-ghost h-[42px]" title="Réinitialiser">
            <IconRefresh class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Fret Filters -->
      <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="space-y-1">
          <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Départ</label>
          <div class="relative">
            <IconMapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input :value="fretFilters.originCity"
              @input="$emit('update:fretFilters', { ...fretFilters, originCity: ($event.target as HTMLInputElement).value })"
              type="text" placeholder="Ville de départ" class="input pl-10" />
          </div>
        </div>
        <div class="space-y-1">
          <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Arrivée</label>
          <div class="relative">
            <IconMapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input :value="fretFilters.destinationCity"
              @input="$emit('update:fretFilters', { ...fretFilters, destinationCity: ($event.target as HTMLInputElement).value })"
              type="text" placeholder="Ville d'arrivée" class="input pl-10" />
          </div>
        </div>
        <div class="space-y-1">
          <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Marchandise</label>
          <select :value="fretFilters.cargoType"
            @change="$emit('update:fretFilters', { ...fretFilters, cargoType: ($event.target as HTMLSelectElement).value })"
            class="input">
            <option value="">Tous</option>
            <option value="palettes">Palettes</option>
            <option value="vrac">Vrac</option>
            <option value="conteneur">Conteneur</option>
            <option value="frigorifique">Frigorifique</option>
            <option value="dangereux">Dangereux</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        <div class="flex items-end gap-2">
          <button @click="$emit('applyFretFilters')" class="flex item-center btn btn-primary flex-1 h-[42px]">
            <IconSearch class="w-5 h-5 mr-2" />
            Filtrer
          </button>
          <button @click="$emit('resetFretFilters')" class="btn btn-ghost h-[42px]" title="Réinitialiser">
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
