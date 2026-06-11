<template>
  <NuxtLink to="/" class="flex items-center space-x-3 group relative">
    <div
      class="relative overflow-hidden rounded-xl bg-white p-1.5 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
      <img src="/img/Logo.png" alt="Logo" class="h-9 w-auto" />
      <div class="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
    <div class="flex flex-col">
      <span :class="['text-lg font-black tracking-tight leading-none', isDark ? 'text-white' : 'text-gray-900']">
        Bourse de Fret
      </span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  isDark: boolean;
}>();
</script>
