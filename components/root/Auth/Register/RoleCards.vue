<template>
  <div class="flex justify-center space-x-4">
    <button
      type="button"
      @click="selectRole('shipper')"
      :class="[
        'flex-1 py-4 px-4 rounded-xl border-2 text-center transition-all duration-200',
        modelValue === 'shipper'
          ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 shadow-lg shadow-primary-500/20'
          : 'border-gray-200 hover:border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
      ]"
    >
      <IconCube class="w-8 h-8 mx-auto mb-2" />
      <span class="font-semibold block">Expéditeur</span>
      <span class="text-xs opacity-75">Je veux expédier des marchandises</span>
    </button>

    <button
      type="button"
      @click="selectRole('carrier')"
      :class="[
        'flex-1 py-4 px-4 rounded-xl border-2 text-center transition-all duration-200',
        modelValue === 'carrier'
          ? 'border-secondary-600 bg-secondary-50 text-secondary-700 dark:bg-secondary-900/20 dark:text-secondary-400 shadow-lg shadow-secondary-500/20'
          : 'border-gray-200 hover:border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
      ]"
    >
      <IconTruck class="w-8 h-8 mx-auto mb-2" />
      <span class="font-semibold block">Transporteur</span>
      <span class="text-xs opacity-75">Je propose mes services de transport</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { IconCube, IconTruck } from '@tabler/icons-vue';
import type { UserRole } from '~/types';

const props = defineProps<{
  modelValue: UserRole;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: UserRole): void;
}>();

const selectRole = (role: UserRole) => {
  emit('update:modelValue', role);
};
</script>
