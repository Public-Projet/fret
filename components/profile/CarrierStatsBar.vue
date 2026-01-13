<template>
  <div class="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-20">
    <div class="container-custom py-4">
      <div class="flex justify-between items-center overflow-x-auto">
        <div class="flex space-x-8 min-w-max px-2">
          <div class="text-center">
            <span class="block text-xl font-bold text-gray-900 dark:text-white">{{ missions }}</span>
            <span class="text-xs text-gray-500 uppercase">Missions</span>
          </div>
          <div class="text-center">
            <span class="block text-xl font-bold text-gray-900 dark:text-white">{{ rating }}</span>
            <span class="text-xs text-gray-500 uppercase">Note</span>
          </div>
          <div class="text-center">
            <span class="block text-xl font-bold text-gray-900 dark:text-white">{{ vehicles }}</span>
            <span class="text-xs text-gray-500 uppercase">Véhicules</span>
          </div>
        </div>
        <div class="hidden md:flex space-x-3">
          <button @click="$emit('open-security')" class="flex items-center btn btn-outline btn-sm">
            <IconLock class="w-4 h-4 mr-1" />
            Sécurité
          </button>
          <button @click="$emit('open-edit')" class="flex items-center btn btn-primary btn-sm">
            <IconEdit class="w-4 h-4 mr-1" />
            Modifier Profil
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconLock, IconEdit } from '@tabler/icons-vue';

withDefaults(defineProps<{
  missions?: number | string;
  rating?: number | string;
  vehicles?: number | string;
}>(), {
  missions: 0,
  rating: '-',
  vehicles: 0
});

defineEmits<{
  'open-security': [];
  'open-edit': [];
}>();
</script>
