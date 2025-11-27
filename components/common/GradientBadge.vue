<template>
  <div :class="[
    'inline-block px-6 py-2 rounded-full mb-4',
    bgClasses
  ]">
    <span :class="[
      'font-bold text-sm uppercase tracking-wide',
      textClasses
    ]">
      <slot>{{ text }}</slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'blue'
  }
})

const bgClasses = computed(() => {
  switch (props.variant) {
    case 'green':
      return 'bg-green-100 dark:bg-green-900/30'
    case 'blue':
    default:
      return 'bg-blue-100 dark:bg-blue-900/30'
  }
})

const textClasses = computed(() => {
  switch (props.variant) {
    case 'green':
      return 'text-green-600 dark:text-green-400'
    case 'blue':
    default:
      return 'text-blue-600 dark:text-blue-400'
  }
})
</script>
