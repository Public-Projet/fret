<template>
  <div>
    <!-- Availabilities Grid -->
    <AnnoncesAvailabilitiesList
      v-if="activeTab === 'avail'"
      :items="availItems"
      @open-rate-modal="$emit('openRateModal', $event)"
    />

    <!-- Fret Announcements Grid -->
    <AnnoncesFretList v-else :items="fretItems" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  activeTab: 'avail' | 'fret';
  availItems: any[];
  fretItems: any[];
}>();

defineEmits<{
  (e: 'openRateModal', carrier: any): void;
}>();
</script>
