<template>
  <div
    class="group flex items-start space-x-4 p-5 rounded-2xl hover:bg-white dark:hover:bg-gray-700/50 transition-all duration-300 cursor-pointer">
    <div
      :class="['w-14 h-14 bg-gradient-to-br rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform', iconClass]">
      <component :is="icon" class="w-7 h-7 text-white" />
    </div>
    <div>
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {{ title }}
      </h3>
      <p class="text-gray-600 dark:text-gray-400">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: any;
  title: string;
  description: string;
  iconClass: string;
}>();
</script>
