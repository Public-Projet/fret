<template>
  <div class="container-custom py-12 max-w-4xl">
    <div class="card p-8 md:p-12">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">{{ title }}</h1>

      <div class="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
        <slot />
      </div>

      <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
        <p v-if="lastUpdate" class="text-sm text-gray-500 dark:text-gray-400">Dernière mise à jour : {{ new
          Date(lastUpdate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  lastUpdate?: string;
}>();
</script>
