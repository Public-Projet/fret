<template>
  <div class="p-4 border-t border-gray-100 dark:border-gray-700/50" v-if="mobile || !collapsed">
    <div class="flex flex-col space-y-3">
      <div class="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
        <NuxtLink to="/legal/terms" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          @click="emit('linkClick')">
          Conditions
        </NuxtLink>
        <NuxtLink to="/legal/privacy" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          @click="emit('linkClick')">
          Confidentialité
        </NuxtLink>
        <NuxtLink to="/support/help" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          @click="emit('linkClick')">
          Aide
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
</script>
