<template>
  <div class="card p-8 hover:scale-105 transition-transform">
    <div class="flex items-center space-x-1 mb-4">
      <IconStar v-for="i in 5" :key="i" class="w-5 h-5 text-yellow-400 fill-current" />
    </div>
    <p class="text-gray-600 dark:text-gray-400 mb-6 italic">
      {{ quote }}
    </p>
    <div class="flex items-center space-x-3">
      <div :class="['w-12 h-12 rounded-full flex items-center justify-center text-white font-bold', `bg-${avatarColor}-600`]">
        {{ initials }}
      </div>
      <div>
        <p class="font-bold text-gray-900 dark:text-white">{{ name }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ role }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconStar } from '@tabler/icons-vue';

defineProps<{
  quote: string;
  name: string;
  role: string;
  initials: string;
  avatarColor: string;
}>();
</script>
