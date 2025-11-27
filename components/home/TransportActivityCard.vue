<template>
  <div class="bg-gradient-to-r p-5 rounded-2xl border-2 transform hover:scale-105 transition-all duration-300 cursor-pointer" :class="[iconClass === 'from-blue-500 to-blue-700' ? 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800' : iconClass === 'from-green-500 to-green-700' ? 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800' : 'from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-gray-200 dark:border-gray-600']">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center space-x-3">
        <div :class="['w-12 h-12 bg-gradient-to-br rounded-xl flex items-center justify-center', iconClass]">
          <component :is="icon" class="w-6 h-6 text-white" />
        </div>
        <div>
          <p class="font-bold text-gray-900 dark:text-white">{{ title }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ subtitle }}</p>
        </div>
      </div>
      <span :class="['px-4 py-2 text-white text-xs font-bold rounded-full shadow-lg', statusClass]">
        {{ status }}
      </span>
    </div>
    <div class="flex items-center justify-between text-sm">
      <span class="text-gray-600 dark:text-gray-400">{{ weight }}</span>
      <span :class="['font-bold', priceClass]">{{ price }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: any;
  title: string;
  subtitle: string;
  status: string;
  weight: string;
  price: string;
  iconClass: string;
  statusClass: string;
  priceClass: string;
}>();
</script>
