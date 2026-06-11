<template>
  <div class="flex items-center gap-4">
    <!-- Mobile: button toggle (logo / X) -->
    <button @click="emit('toggle-menu')" class="lg:hidden flex items-center gap-2">
      <div v-if="!menuOpen"
        class="relative overflow-hidden rounded-xl bg-white p-1.5 shadow-sm transition-all duration-300">
        <img src="/img/Logo.png" alt="BourseFret" class="h-9 w-auto" />
      </div>
      <div v-else class="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 transition-all duration-200">
        <IconX class="w-6 h-6 text-gray-600 dark:text-gray-300" />
      </div>
    </button>

    <!-- Desktop: NuxtLink to home -->
    <NuxtLink to="/" class="hidden lg:flex items-center gap-2 group">
      <div
        class="relative overflow-hidden rounded-xl bg-white p-1.5 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
        <img src="/img/Logo.png" alt="BourseFret" class="h-9 w-auto" />
        <div class="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      <div class="flex flex-col">
        <span class="text-lg font-black tracking-tight leading-none text-gray-900 dark:text-white">
          Bourse de Fret
        </span>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { IconX } from '@tabler/icons-vue';

defineProps<{
  menuOpen: boolean;
}>();

const emit = defineEmits<{
  'toggle-menu': [];
}>();
</script>
