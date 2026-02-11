<template>
  <div class="relative mb-12">
    <IconSearch class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    <input :value="modelValue" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      type="text" placeholder="Rechercher dans l'aide..."
      class="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
  </div>
</template>

<script setup lang="ts">
import { IconSearch } from '@tabler/icons-vue';

defineProps<{
  modelValue: string;
}>();

defineEmits(['update:modelValue']);
</script>
