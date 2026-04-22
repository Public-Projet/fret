<template>
  <nav class="space-y-1">
    <template v-for="(item, index) in navigationItems" :key="index">
      <div v-if="index === 1" class="my-2 border-t border-gray-100 dark:border-gray-700/50"></div>

      <NuxtLink :to="item.to"
        class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
        active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium shadow-sm ring-1 ring-primary-100 dark:ring-primary-900/30"
        :class="{ 
          'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium shadow-sm ring-1 ring-primary-100 dark:ring-primary-900/30': item.label === 'Tableau de bord' ? $route.path === item.to : $route.path.startsWith(item.to),
          'justify-center px-2': collapsed 
        }">
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
import { computed } from 'vue';
import { IconDashboard, IconTruck, IconMessage, IconSettings, IconListCheck } from '@tabler/icons-vue';
import { ROLES } from '~/utils/roles';
import { useCmnAuthStore } from '~/stores/cmnAuth';

const props = defineProps<{
  isShipper: boolean;
  unreadCount: number;
  collapsed?: boolean;
}>();

const authStore = useCmnAuthStore();

const navigationItems = computed(() => {
  const items = [
    // Shipper Specific
    {
      label: 'Tableau de bord',
      to: '/app/us',
      icon: IconDashboard,
      roles: [ROLES.Shipper]
    },
    {
      label: 'Annonces',
      to: '/app/us/offers',
      icon: IconTruck,
      roles: [ROLES.Shipper]
    },
    {
      label: 'Souscriptions',
      to: '/app/us/avail',
      icon: IconListCheck,
      roles: [ROLES.Shipper]
    },

    // Carrier Specific
    {
      label: 'Tableau de bord',
      to: '/app/uc',
      icon: IconDashboard,
      roles: [ROLES.Carrier]
    },
    {
      label: 'Véhicules',
      to: '/app/uc/vehicles',
      icon: IconTruck,
      roles: [ROLES.Carrier]
    },
    {
      label: 'Disponibilités',
      to: '/app/uc/avail',
      icon: IconTruck,
      roles: [ROLES.Carrier]
    },

    // Shared
    {
      label: 'Messages',
      to: '/app/messages',
      icon: IconMessage,
      roles: ['all'],
      badge: props.unreadCount
    }
  ];

  if (!authStore.currentUser) return [];
  const userRole = authStore.currentUser.role;

  return items.filter(item => {
    if (item.roles.includes('all')) return true;
    return item.roles.includes(userRole);
  });
});
</script>
