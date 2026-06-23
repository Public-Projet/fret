<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <UtilsCard v-for="announcement in items" :key="announcement.id" :announcement="announcement"
      detailRoute="/annonces" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: any[];
}>();
</script>
