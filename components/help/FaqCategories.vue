<template>
  <div class="flex flex-wrap gap-2 mb-8">
    <button v-for="category in categories" :key="category.id || category"
      @click="$emit('update:activeCategory', category)" :class="[
        'px-4 py-2 rounded-full text-sm font-medium transition-all',
        isActive(category)
          ? 'bg-primary-500 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
      ]">
      {{ category.title || category }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  categories: any[];
  activeCategory: string | any;
}>();

defineEmits(['update:activeCategory']);

const isActive = (category: any) => {
  // 1. Comparaison directe (pour 'Toutes' ou références identiques)
  if (props.activeCategory === category) return true;

  // 2. Comparaison  par ID (si ce sont des objets avec ID)
  if (
    typeof props.activeCategory === 'object' && props.activeCategory !== null &&
    typeof category === 'object' && category !== null &&
    props.activeCategory.id && category.id
  ) {
    return props.activeCategory.id === category.id;
  }

  return false;
};
</script>
