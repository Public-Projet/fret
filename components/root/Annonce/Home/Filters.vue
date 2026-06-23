<template>
  <AnnoncesFilters
    :active-tab="activeTab"
    v-model:avail-filters="availFilters"
    v-model:fret-filters="fretFilters"
    @update:active-tab="$emit('update:activeTab', $event)"
    @apply-fret-filters="$emit('applyFretFilters')"
    @reset-fret-filters="$emit('resetFretFilters')"
    @reset-avail-filters="$emit('resetAvailFilters')"
  />
</template>

<script setup lang="ts">
defineProps<{
  activeTab: 'avail' | 'fret';
  availFilters: { origin: string; destination: string; date: string };
  fretFilters: { originCity: string; destinationCity: string; cargoType: string; minBudget?: number };
}>();

defineEmits<{
  (e: 'update:activeTab', tab: 'avail' | 'fret'): void;
  (e: 'update:availFilters', filters: any): void;
  (e: 'update:fretFilters', filters: any): void;
  (e: 'applyFretFilters'): void;
  (e: 'resetFretFilters'): void;
  (e: 'resetAvailFilters'): void;
}>();
</script>
