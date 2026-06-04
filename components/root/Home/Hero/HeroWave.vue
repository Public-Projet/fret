<template>
  <div>
    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <IconChevronDown class="w-8 h-8 text-white/70 dark:text-gray-400" />
    </div>

    <!-- Wave separator moderne -->
    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full">
        <path
          d="M0 200L48 183.3C96 166.7 192 133.3 288 116.7C384 100 480 100 576 108.3C672 116.7 768 133.3 864 133.3C960 133.3 1056 116.7 1152 108.3C1248 100 1344 100 1392 100L1440 100V200H1392C1344 200 1248 200 1152 200C1056 200 960 200 864 200C768 200 672 200 576 200C480 200 384 200 288 200C192 200 96 200 48 200H0Z"
          fill="currentColor" class="text-gray-50 dark:text-gray-900" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconChevronDown } from '@tabler/icons-vue';
</script>
