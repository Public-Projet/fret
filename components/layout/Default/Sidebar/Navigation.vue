<template>
  <div class="flex-1 overflow-y-auto py-4 px-3 space-y-1 overflow-x-hidden">
    <!-- Mobile: Accueil link -->
    <NuxtLink v-if="mobile" to="/"
      class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
      @click="emit('linkClick')">
      <IconHome2 class="w-5 h-5 flex-shrink-0" />
      <span>Accueil</span>
    </NuxtLink>
    <div v-if="mobile" class="my-1 border-t border-gray-100 dark:border-gray-700/50"></div>
    <NuxtLink v-for="item in menuItems" :key="item.to" :to="item.to"
      class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white transition-all duration-200 group relative"
      active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium shadow-sm ring-1 ring-primary-100 dark:ring-primary-900/30"
      :class="{
        'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium shadow-sm ring-1 ring-primary-100 dark:ring-primary-900/30': item.label === 'Tableau de bord' ? $route.path === item.to : $route.path.startsWith(item.to),
        'justify-center px-2': !mobile && collapsed
      }" :title="(!mobile && collapsed) ? item.label : ''" @click="emit('linkClick')">

      <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />

      <div v-if="mobile || !collapsed" class="flex-1 flex justify-between items-center truncate">
        <span>{{ item.label }}</span>
        <span v-if="item.badge && item.badge > 0"
          class="bg-red-500 text-white text-[10px] font-bold rounded-full h-5 min-w-[1.25rem] flex items-center justify-center px-1">
          {{ item.badge }}
        </span>
      </div>
      <span v-else-if="item.badge && item.badge > 0"
        class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { IconHome2 } from '@tabler/icons-vue';

interface MenuItem {
  label: string;
  to: string;
  icon: any;
  roles: string[];
  badge?: number;
}

defineProps<{
  mobile: boolean;
  collapsed: boolean;
  menuItems: MenuItem[];
}>();

const emit = defineEmits<{
  linkClick: [];
}>();
</script>
