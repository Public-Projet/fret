<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
    <h4 class="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
      <IconShieldLock :class="['w-5 h-5 mr-2', iconColorClass]" />
      Sécurité
    </h4>
    <div class="space-y-3">
      <button @click="$emit('open-password')"
        :class="['w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors flex items-center justify-between group', hoverBorderClass]">
        <div class="flex items-center">
          <IconKey :class="['w-5 h-5 text-gray-400 mr-3', hoverIconClass]" />
          <span class="text-sm text-gray-700 dark:text-gray-300">Modifier le mot de passe</span>
        </div>
        <IconChevronRight class="w-4 h-4 text-gray-400" />
      </button>
      <button @click="$emit('open-email')"
        :class="['w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors flex items-center justify-between group', hoverBorderClass]">
        <div class="flex items-center">
          <IconMail :class="['w-5 h-5 text-gray-400 mr-3', hoverIconClass]" />
          <span class="text-sm text-gray-700 dark:text-gray-300">Modifier l'adresse email</span>
        </div>
        <IconChevronRight class="w-4 h-4 text-gray-400" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IconShieldLock, IconKey, IconMail, IconChevronRight } from '@tabler/icons-vue';

const props = defineProps<{
  accentColor?: 'primary' | 'secondary';
}>();

defineEmits<{
  'open-password': [];
  'open-email': [];
}>();

const iconColorClass = computed(() => {
  return props.accentColor === 'secondary'
    ? 'text-secondary-600'
    : 'text-primary-600';
});

const hoverBorderClass = computed(() => {
  return props.accentColor === 'secondary'
    ? 'hover:border-secondary-500'
    : 'hover:border-primary-500';
});

const hoverIconClass = computed(() => {
  return props.accentColor === 'secondary'
    ? 'group-hover:text-secondary-600'
    : 'group-hover:text-primary-600';
});
</script>
