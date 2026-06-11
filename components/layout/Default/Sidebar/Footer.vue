<template>
  <div class="p-4 border-t border-gray-100 dark:border-gray-700/50" v-if="mobile || !collapsed">
    <div class="flex flex-col space-y-3">
      <div class="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
        <NuxtLink v-for="link in footerLinks" :key="link.to" :to="link.to"
          class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors" @click="emit('linkClick')">
          {{ link.label }}
        </NuxtLink>
      </div>
      <p class="text-sm text-gray-400 dark:text-gray-500">
        © {{ currentYear }} Bourse de Fret Bénin
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  mobile: boolean;
  collapsed: boolean;
  currentYear: number;
}>();

const emit = defineEmits<{
  linkClick: [];
}>();

const footerLinks = [
  { to: '/legal/terms', label: 'Conditions' },
  { to: '/legal/privacy', label: 'Confidentialité' },
  { to: '/support/help', label: 'Aide' }
];
</script>
