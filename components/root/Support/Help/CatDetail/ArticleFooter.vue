<template>
  <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Mis à jour le {{ formattedDate }}
      </p>
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-500 dark:text-gray-400">Cet article vous a-t-il été utile ?</span>
        <button
          @click="emit('rate', 'yes')"
          class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
        >
          <IconThumbUp class="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-green-600" />
        </button>
        <button
          @click="emit('rate', 'no')"
          class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
        >
          <IconThumbDown class="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-red-600" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IconThumbUp, IconThumbDown } from '@tabler/icons-vue';

const props = defineProps<{
  updatedAt: string;
}>();

const emit = defineEmits<{
  (e: 'rate', value: 'yes' | 'no'): void;
}>();

const formattedDate = computed(() => {
  const date = new Date(props.updatedAt);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
});
</script>
