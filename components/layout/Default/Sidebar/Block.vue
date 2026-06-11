<template>
  <aside :class="[
    mobile
      ? 'fixed top-[61px] left-0 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out z-40 lg:hidden'
      : 'flex-shrink-0 hidden lg:flex border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out h-[calc(100vh-64px)] relative z-40',
    mobile
      ? (open ? 'translate-x-0' : '-translate-x-full')
      : (collapsed ? 'w-20' : 'w-72')
  ]">

    <div class="flex flex-col h-full overflow-hidden">
      <LayoutDefaultSidebarNavigation :mobile="mobile" :collapsed="collapsed" :menu-items="filteredMenuItems"
        @link-click="handleLinkClick" />

      <LayoutDefaultSidebarSubscription :mobile="mobile" :collapsed="collapsed" :current-user="currentUser"
        @link-click="handleLinkClick" @logout="handleLogout" />

      <LayoutDefaultSidebarFooter :mobile="mobile" :collapsed="collapsed" :current-year="currentYear"
        @link-click="handleLinkClick" />
    </div>

    <LayoutDefaultSidebarToggle :mobile="mobile" :collapsed="collapsed" @toggle-collapse="emit('toggle-collapse')" />
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { IconTruck, IconDashboard, IconMessage, IconListCheck } from '@tabler/icons-vue';
import { ROLES } from '~/utils/roles';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import { useCmnMessagingStore } from '~/stores/cmnMessaging';

interface MenuItem {
  label: string;
  to: string;
  icon: any;
  roles: string[];
  badge?: number;
}

const props = withDefaults(defineProps<{
  mobile?: boolean;
  open?: boolean;
  collapsed?: boolean;
}>(), {
  mobile: false,
  open: false,
  collapsed: false
});

const emit = defineEmits(['toggle-collapse', 'close']);

const authStore = useCmnAuthStore();
const messagingStore = useCmnMessagingStore();
const router = useRouter();

const currentUser = computed(() => authStore.currentUser);
const unreadCount = computed(() => currentUser.value ? messagingStore.unreadCount : 0);

const menuItems = computed<MenuItem[]>(() => [
  // Expediteur
  { label: 'Tableau de bord', to: '/app/us', icon: IconDashboard, roles: [ROLES.Shipper] },
  { label: 'Annonces', to: '/app/us/offers', icon: IconTruck, roles: [ROLES.Shipper] },
  { label: 'Souscriptions', to: '/app/us/avail', icon: IconListCheck, roles: [ROLES.Shipper] },
  // Transporteur
  { label: 'Tableau de bord', to: '/app/uc', icon: IconDashboard, roles: [ROLES.Carrier] },
  { label: 'Véhicules', to: '/app/uc/vehicles', icon: IconTruck, roles: [ROLES.Carrier] },
  { label: 'Disponibilités', to: '/app/uc/avail', icon: IconTruck, roles: [ROLES.Carrier] },
  { label: 'Annonces de fret', to: '/app/uc/offers', icon: IconTruck, roles: [ROLES.Carrier] },
  { label: 'Messages', to: '/app/messages', icon: IconMessage, roles: ['all'], badge: unreadCount.value }
]);

const filteredMenuItems = computed(() => {
  if (!authStore.currentUser) return [];
  const userRole = authStore.currentUser.role;

  return menuItems.value.filter(item => {
    if (item.roles.includes('all')) return true;
    return item.roles.includes(userRole);
  });
});

const handleLinkClick = () => {
  if (props.mobile) {
    emit('close');
  }
};

const handleLogout = () => {
  authStore.logoutUser();
  if (props.mobile) {
    emit('close');
  }
  router.push('/auth/login');
};

const currentYear = computed(() => new Date().getFullYear());
</script>
