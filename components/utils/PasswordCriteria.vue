<template>
  <ul v-if="password" class="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
    <li
      v-for="c in criteria"
      :key="c.label"
      class="flex items-center gap-1 text-xs transition-colors"
      :class="c.met ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'"
    >
      <!-- Icône ✓ si critère validé -->
      <svg v-if="c.met" class="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clip-rule="evenodd" />
      </svg>
      <!-- Point neutre si critère non validé -->
      <svg v-else class="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="3" />
      </svg>
      {{ c.label }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  password: string;
}>();

const criteria = computed(() => [
  { label: '8 caractères min.', met: props.password.length >= 8 },
  { label: '1 majuscule', met: /[A-Z]/.test(props.password) },
  { label: '1 minuscule', met: /[a-z]/.test(props.password) },
  { label: '1 chiffre', met: /[0-9]/.test(props.password) },
  { label: '1 caractère spécial', met: /[^A-Za-z0-9]/.test(props.password) },
]);

const isValid = computed(() => criteria.value.every((c) => c.met));

// Exposé pour permettre au parent de lire la validité via templateRef
defineExpose({ isValid });
</script>
