<template>
  <div
    class="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
    <IconTruckOff v-if="activeTab === 'avail'" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <IconPackageOff v-else class="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
      {{ activeTab === 'avail' ? 'Aucun véhicule disponible' : 'Aucune annonce de fret trouvée' }}
    </h3>
    <p class="text-gray-500 px-4">
      {{
        activeTab === 'avail'
          ? "Il n'y a pas de véhicules correspondant à vos critères pour le moment."
          : "Aucun chargement n'est disponible avec ces filtres actuellement."
      }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { IconTruckOff, IconPackageOff } from '@tabler/icons-vue';

defineProps<{
  activeTab: 'avail' | 'fret';
}>();
</script>
