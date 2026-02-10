<template>
  <nav class="space-y-1">
    <template v-for="(item, index) in navigationItems" :key="index">
      <div v-if="index === 1" class="my-2 border-t border-gray-100 dark:border-gray-700/50"></div>

      <NuxtLink :to="item.to"
        class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
        active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium shadow-sm ring-1 ring-primary-100 dark:ring-primary-900/30"
        :class="{ 'justify-center px-2': collapsed }">
        <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />

        <template v-if="!collapsed">
          <div class="flex-1 flex justify-between items-center truncate">
            <span>{{ item.label }}</span>
            <span v-if="item.badge && item.badge > 0"
              class="bg-red-500 text-white text-[10px] font-bold rounded-full h-5 min-w-[1.25rem] flex items-center justify-center px-1">
              {{ item.badge }}
            </span>
          </div>
        </template>
        <template v-else-if="item.badge && item.badge > 0">
          <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </template>
      </NuxtLink>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { IconHome, IconMessage, IconSettings, IconTruck, IconDashboard } from '@tabler/icons-vue';

const props = defineProps<{
  isShipper: boolean;
  unreadCount: number;
  collapsed?: boolean;
}>();

const navigationItems = computed(() => [
  {
    label: 'Accueil',
    to: '/',
    icon: IconHome,
    exact: true
  },
  {
    label: "Vue d'ensemble",
    to: props.isShipper ? '/app/us' : '/app/uc',
    icon: IconDashboard
  },
  {
    label: props.isShipper ? 'Mes Expéditions' : 'Mes Trajets',
    to: props.isShipper ? '/app/us' : '/app/uc', // Note: this seems to duplicate the path of "Vue d'ensemble" in the original code? 
    // Checking original code: 
    // Vue d'ensemble -> isShipper ? '/app/us' : '/app/uc'
    // Mes Expéditions -> '/app/us'
    // Mes Trajets -> '/app/uc'
    // It seems they point to the same root path in the original code too?
    // Wait, let me check the original file content again carefully from the read.
    // Line 13: Vue d'ensemble -> isShipper ? '/app/us' : '/app/uc'
    // Line 22: Mes Expéditions -> '/app/us'
    // Line 32: Mes Trajets -> '/app/uc'
    // Yes, they point to the same place. I will preserve this behavior.
    icon: IconTruck
  },
  {
    label: 'Messages',
    to: '/app/messages',
    icon: IconMessage,
    badge: props.unreadCount,
    badgeColor: 'bg-red-500' // Added for extensibility, though hardcoded in template originally
  },
  {
    label: 'Paramètres',
    to: '/app/settings',
    icon: IconSettings
  }
]);
</script>
