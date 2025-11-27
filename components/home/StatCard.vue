<template>
  <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
    <div class="text-4xl font-black text-white mb-2">{{ value }}{{ suffix }}</div>
    <div class="text-blue-200 text-sm font-medium">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  value: number;
  label: string;
  suffix?: string;
}>();
</script>
