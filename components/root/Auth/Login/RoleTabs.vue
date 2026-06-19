<template>
  <div class="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 gap-1">
    <button type="button" @click="selectRole('shipper')" :class="[
      'flex-1 relative py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2',
      modelValue === 'shipper'
        ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
    ]">
      <IconCube class="w-5 h-5" />
      <span>Expéditeur</span>
      <span v-if="lastConnectedRole === 'shipper'"
        class="absolute -top-1 -right-1 px-2 py-0.5 text-xs font-medium bg-primary-500 text-white rounded-full shadow-sm">
        Dernier accès
      </span>
    </button>
    <button type="button" @click="selectRole('carrier')" :class="[
      'flex-1 relative py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2',
      modelValue === 'carrier'
        ? 'bg-white dark:bg-gray-700 text-secondary-600 dark:text-secondary-400 shadow-sm'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
    ]">
      <IconTruck class="w-5 h-5" />
      <span>Transporteur</span>
      <span v-if="lastConnectedRole === 'carrier'"
        class="absolute -top-1 -right-1 px-2 py-0.5 text-xs font-medium bg-secondary-500 text-white rounded-full shadow-sm">
        Dernier accès
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { IconCube, IconTruck } from '@tabler/icons-vue';
import type { UserRole } from '~/types';

const props = defineProps<{
  modelValue: UserRole;
  lastConnectedRole: UserRole | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: UserRole): void;
}>();

const selectRole = (role: UserRole) => {
  emit('update:modelValue', role);
};
</script>
