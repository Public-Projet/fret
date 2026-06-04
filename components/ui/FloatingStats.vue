<template>
  <div :class="[
    'absolute bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-2xl border border-gray-200 dark:border-gray-700',
    positionClasses
  ]">
    <div class="flex items-center space-x-3">
      <div :class="[
        'w-10 h-10 rounded-full flex items-center justify-center',
        iconBgColor
      ]">
        <component :is="icon" :class="['w-6 h-6', iconColor]" />
      </div>
      <div>
        <p class="text-2xl font-black text-gray-900 dark:text-white">{{ value }}</p>
        <p class="text-xs text-gray-600 dark:text-gray-400">{{ label }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  value: string
  label: string
  icon: Component
  positionClasses?: string
  iconBgColor?: string
  iconColor?: string
}>()
</script>
