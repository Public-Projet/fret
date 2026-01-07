<template>
  <aside
    class="flex-shrink-0 hidden lg:flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out h-[calc(100vh-64px)] overflow-hidden"
    :class="[collapsed ? 'w-20' : 'w-72']">

    <!-- User Profile Section -->
    <div class="p-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center transition-all duration-300"
      :class="collapsed ? 'justify-center' : 'gap-3'">

      <div class="relative shrink-0">
        <div
          class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm ring-2 ring-white dark:ring-gray-800 shadow-sm">
          {{ userInitials }}
        </div>
        <div
          class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full">
        </div>
      </div>

      <div v-if="!collapsed" class="flex-1 min-w-0">
        <h3 class="font-bold text-sm text-gray-900 dark:text-white truncate">{{ userName }}</h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">{{ userRole }}</p>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex-1 overflow-y-auto py-4 px-3">
      <AppNavigation :is-shipper="isShipper" :unread-count="unreadCount" :collapsed="collapsed" />
    </div>

    <!-- Collapse Toggle (Bottom) -->
    <div class="p-4 border-t border-gray-100 dark:border-gray-700/50 flex"
      :class="collapsed ? 'justify-center' : 'justify-end'">
      <button @click="$emit('toggle-collapse')"
        class="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title="Réduire/Agrandir">
        <IconLayoutSidebarLeftCollapse v-if="!collapsed" class="w-5 h-5" />
        <IconLayoutSidebarLeftExpand v-else class="w-5 h-5" />
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from '@tabler/icons-vue';
import AppNavigation from './AppNavigation.vue';

defineProps<{
  userInitials: string;
  userName: string;
  userRole: string;
  userEmail: string;
  isShipper: boolean;
  unreadCount: number;
  collapsed: boolean;
}>();

defineEmits(['toggle-collapse']);
</script>
