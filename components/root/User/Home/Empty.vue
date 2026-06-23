<template>
  <div
    class="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700"
  >
    <IconTruckOff v-if="activeTab === 'carrier'" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <IconCubeOff v-else class="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
      {{ activeTab === 'carrier' ? 'Aucun transporteur trouvé' : 'Aucun expéditeur trouvé' }}
    </h3>
    <p class="text-gray-500 px-4">
      {{
        activeTab === 'carrier'
          ? "Aucun transporteur ne correspond à votre recherche pour le moment."
          : "Aucun expéditeur n'a été trouvé avec ces critères."
      }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { IconTruckOff, IconCubeOff } from '@tabler/icons-vue';

defineProps<{
  activeTab: 'carrier' | 'shipper';
}>();
</script>
