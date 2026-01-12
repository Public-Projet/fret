<template>
  <nav class="space-y-1">
    <NuxtLink to="/"
      class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
      active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium shadow-sm ring-1 ring-primary-100 dark:ring-primary-900/30"
      :class="{ 'justify-center px-2': collapsed }">
      <IconHome class="w-5 h-5 flex-shrink-0" />
      <span v-if="!collapsed" class="truncate">Accueil</span>
    </NuxtLink>

    <div class="my-2 border-t border-gray-100 dark:border-gray-700/50"></div>

    <NuxtLink :to="isShipper ? '/app/us' : '/app/uc'"
      class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
      active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium shadow-sm ring-1 ring-primary-100 dark:ring-primary-900/30"
      :class="{ 'justify-center px-2': collapsed }">
      <IconDashboard class="w-5 h-5 flex-shrink-0" />
      <span v-if="!collapsed" class="truncate">Vue d'ensemble</span>
    </NuxtLink>

    <template v-if="isShipper">
      <NuxtLink to="/app/us"
        class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
        active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium shadow-sm ring-1 ring-primary-100 dark:ring-primary-900/30"
        :class="{ 'justify-center px-2': collapsed }">
        <IconTruck class="w-5 h-5 flex-shrink-0" />
        <span v-if="!collapsed" class="truncate">Mes Expéditions</span>
      </NuxtLink>
    </template>

    <template v-else>
      <NuxtLink to="/app/uc"
        class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
        active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium shadow-sm ring-1 ring-primary-100 dark:ring-primary-900/30"
        :class="{ 'justify-center px-2': collapsed }">
        <IconTruck class="w-5 h-5 flex-shrink-0" />
        <span v-if="!collapsed" class="truncate">Mes Trajets</span>
      </NuxtLink>
    </template>

    <NuxtLink to="/app/messages"
      class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
      active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium shadow-sm ring-1 ring-primary-100 dark:ring-primary-900/30"
      :class="{ 'justify-center px-2': collapsed }">
      <IconMessage class="w-5 h-5 flex-shrink-0" />
      <div v-if="!collapsed" class="flex-1 flex justify-between items-center truncate">
        <span>Messages</span>
        <span v-if="unreadCount > 0"
          class="bg-red-500 text-white text-[10px] font-bold rounded-full h-5 min-w-[1.25rem] flex items-center justify-center px-1">
          {{ unreadCount }}
        </span>
      </div>
      <span v-else-if="unreadCount > 0" class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
    </NuxtLink>

    <NuxtLink to="/app/settings"
      class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
      active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium shadow-sm ring-1 ring-primary-100 dark:ring-primary-900/30"
      :class="{ 'justify-center px-2': collapsed }">
      <IconSettings class="w-5 h-5 flex-shrink-0" />
      <span v-if="!collapsed" class="truncate">Paramètres</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import { IconHome, IconMessage, IconSettings, IconTruck, IconDashboard } from '@tabler/icons-vue';

defineProps<{
  isShipper: boolean;
  unreadCount: number;
  collapsed?: boolean;
}>();
</script>
