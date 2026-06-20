<template>
  <ul v-if="password" class="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
    <li v-for="c in criteria" :key="c.label" class="flex items-center gap-1 text-xs transition-colors"
      :class="c.met ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'">
      <IconCheck v-if="c.met" class="w-3 h-3 shrink-0" />
      <IconPoint v-else class="w-3 h-3 shrink-0" />
      {{ c.label }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IconCheck, IconPoint } from '@tabler/icons-vue';

const props = defineProps<{
  password: string;
}>();

const criteria = computed(() => [
  { label: '8 caractères min.', met: props.password.length >= 8 },
  { label: '1 majuscule min.', met: /[A-Z]/.test(props.password) },
  { label: '1 minuscule min.', met: /[a-z]/.test(props.password) },
  { label: '1 chiffre min.', met: /[0-9]/.test(props.password) },
  { label: '1 caractère spécial min.', met: /[^A-Za-z0-9]/.test(props.password) },
]);

const isValid = computed(() => criteria.value.every((c) => c.met));

// Exposé pour permettre au parent de lire la validité via templateRef
defineExpose({ isValid });
</script>
