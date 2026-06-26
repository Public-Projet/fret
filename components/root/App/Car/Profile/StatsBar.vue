<template>
  <div class="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-20">
    <div class="container-custom py-4">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <div v-if="loading" class="flex space-x-8 px-2 overflow-x-auto w-full md:w-auto justify-center md:justify-start">
          <div v-for="i in 3" :key="i" class="text-center min-w-[70px]">
            <UiAppSkeleton :loading="true" type="text" class="h-6 w-12 mx-auto mb-1" />
            <UiAppSkeleton :loading="true" type="text" class="h-3 w-16 mx-auto" />
          </div>
        </div>
        <div v-else class="flex space-x-8 px-2 overflow-x-auto w-full md:w-auto justify-center md:justify-start">
          <div class="text-center min-w-[70px]">
            <span class="block text-xl font-bold text-gray-900 dark:text-white">{{ missions }}</span>
            <span class="text-xs text-gray-500 uppercase">Missions</span>
          </div>
          <div class="text-center min-w-[70px]">
            <div class="flex items-center justify-center">
              <span class="block text-xl font-bold text-gray-900 dark:text-white">{{ rating }}</span>
              <IconStarFilled class="w-4 h-4 text-yellow-500 ml-1 mb-1" />
            </div>
            <span class="text-xs text-gray-500 uppercase">Note</span>
          </div>
          <div class="text-center min-w-[70px]">
            <span class="block text-xl font-bold text-gray-900 dark:text-white">{{ vehicles }}</span>
            <span class="text-xs text-gray-500 uppercase">Véhicules</span>
          </div>
        </div>
        <div class="flex items-center space-x-2 sm:space-x-3 w-full md:w-auto justify-center md:justify-end">
          <div v-if="loading" class="flex space-x-2">
            <UiAppSkeleton :loading="true" type="text" class="h-8 w-28 rounded-lg" />
            <UiAppSkeleton :loading="true" type="text" class="h-8 w-32 rounded-lg" />
          </div>
          <template v-else>
            <button @click="$emit('open-security')"
              class="flex-1 md:flex-none flex items-center justify-center btn btn-outline btn-sm py-2.5">
              <IconLock class="w-4 h-4 mr-1" />
              Sécurité
            </button>
            <button @click="$emit('open-edit')"
              class="flex-1 md:flex-none flex items-center justify-center btn btn-primary btn-sm py-2.5">
              <IconEdit class="w-4 h-4 mr-1" />
              Modifier Profil
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconLock, IconEdit, IconStarFilled } from '@tabler/icons-vue';

withDefaults(defineProps<{
  missions?: number | string;
  rating?: number | string;
  vehicles?: number | string;
  loading?: boolean;
}>(), {
  missions: 0,
  rating: '-',
  vehicles: 0,
  loading: false
});

defineEmits<{
  'open-security': [];
  'open-edit': [];
}>();
</script>
