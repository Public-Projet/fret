<template>
  <button v-if="!mobile" @click="emit('toggle-collapse')"
    class="absolute -right-3 top-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 shadow-md text-gray-500 hover:text-primary-600 hidden lg:flex items-center justify-center z-50 transition-colors transform hover:scale-110"
    title="Réduire/Agrandir">
    <IconChevronLeft v-if="!collapsed" class="w-4 h-4" />
    <IconChevronRight v-else class="w-4 h-4" />
  </button>
</template>

<script setup lang="ts">
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-vue';

defineProps<{
  mobile: boolean;
  collapsed: boolean;
}>();

const emit = defineEmits<{
  'toggle-collapse': [];
}>();
</script>
