<template>
  <aside
    class="flex-shrink-0 hidden lg:flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out h-[calc(100vh-64px)] relative z-40"
    :class="[collapsed ? 'w-20' : 'w-72']">

    <div class="flex flex-col h-full overflow-hidden">
      <!-- User Profile Section -->
      <div class="p-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center transition-all duration-300"
        :class="collapsed ? 'justify-center' : 'gap-3'">

        <div class="relative shrink-0">
          <div
            class="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold text-sm ring-2 ring-white dark:ring-gray-800 shadow-sm">
            <img v-if="userAvatar" :src="userAvatar" alt="Avatar" class="w-full h-full object-cover" />
            <span v-else>{{ userInitials }}</span>
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
      <div class="flex-1 overflow-y-auto py-4 px-3 space-y-1 overflow-x-hidden">
        <NuxtLink v-for="item in filteredMenuItems" :key="item.to" :to="item.to"
          class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white transition-all duration-200 group relative"
          active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium shadow-sm ring-1 ring-primary-100 dark:ring-primary-900/30"
          :class="{
            'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium shadow-sm ring-1 ring-primary-100 dark:ring-primary-900/30': item.label === 'Tableau de bord' ? $route.path === item.to : $route.path.startsWith(item.to),
            'justify-center px-2': collapsed
          }" :title="collapsed ? item.label : ''">

          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />

          <div v-if="!collapsed" class="flex-1 flex justify-between items-center truncate">
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

      <!-- Pricing & Logout block -->
      <div v-if="!collapsed" class="px-3 pb-3 space-y-2">
        <!-- Subscription status card -->
        <div
          class="rounded-xl p-3 bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/10 border border-primary-100 dark:border-primary-800/30">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold text-primary-700 dark:text-primary-300">Mon abonnement</span>
            <span class="badge badge-xs"
              :class="currentUser?.subscriptionStatus === 'active' ? 'badge-success text-white' : 'badge-ghost text-gray-500'">
              {{ currentUser?.subscriptionStatus === 'active' ? 'Actif' : 'Inactif' }}
            </span>
          </div>
          <p class="text-sm font-bold text-gray-900 dark:text-white">
            {{ currentUser?.subscriptionStatus === 'active' && currentUser?.subscriptionPlan === 'pro' ? 'Plan Pro' :
            'Plan Gratuit' }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Facturation : {{ currentUser?.subscriptionStatus === 'active' ? (currentUser?.subscriptionType === 'annual'
              ? 'Annuelle' : 'Mensuelle') : 'Aucune' }}
          </p>
          <NuxtLink v-if="currentUser?.subscriptionStatus !== 'active' || currentUser?.subscriptionPlan !== 'pro'"
            to="/pricing" class="mt-2 w-full btn btn-primary btn-xs">
            Passer Pro
          </NuxtLink>
        </div>
        <!-- Logout button -->
        <button @click="handleLogout"
          class="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
          <IconLogout class="w-4 h-4 flex-shrink-0" />
          Déconnexion
        </button>
      </div>
      <!-- Collapsed logout -->
      <div v-else class="px-2 pb-3">
        <button @click="handleLogout" title="Déconnexion"
          class="w-full flex items-center justify-center p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
          <IconLogout class="w-5 h-5" />
        </button>
      </div>

      <!-- Footer Section -->
      <div class="p-4 border-t border-gray-100 dark:border-gray-700/50" v-if="!collapsed">
        <div class="flex flex-col space-y-3">
          <div class="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
            <NuxtLink to="/legal/terms" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Conditions
            </NuxtLink>
            <NuxtLink to="/legal/privacy" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Confidentialité</NuxtLink>
            <NuxtLink to="/support/help" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Aide
            </NuxtLink>
          </div>
          <p class="text-sm text-gray-400 dark:text-gray-500">
            © {{ currentYear }} Bourse de Fret Bénin
          </p>
        </div>
      </div>
    </div>

    <!-- Collapse Toggle (Absolute) -->
    <button @click="$emit('toggle-collapse')"
      class="absolute -right-3 top-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 shadow-md text-gray-500 hover:text-primary-600 hidden lg:flex items-center justify-center z-50 transition-colors transform hover:scale-110"
      title="Réduire/Agrandir">
      <IconChevronLeft v-if="!collapsed" class="w-4 h-4" />
      <IconChevronRight v-else class="w-4 h-4" />
    </button>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IconTruck, IconDashboard, IconMessage, IconSettings, IconChevronLeft, IconChevronRight, IconListCheck, IconLogout } from '@tabler/icons-vue';
import { ROLES } from '~/utils/roles';
import { useCmnAuthStore } from '~/stores/cmnAuth';

const props = defineProps<{
  userInitials: string;
  userAvatar?: string;
  userName: string;
  userRole: string;
  userEmail: string;
  isShipper: boolean;
  unreadCount: number;
  collapsed: boolean;
}>();

defineEmits(['toggle-collapse']);

const authStore = useCmnAuthStore();
const router = useRouter();

const currentUser = computed(() => authStore.currentUser);

const handleLogout = () => {
  authStore.logoutUser();
  router.push('/auth/login');
};

interface MenuItem {
  label: string;
  to: string;
  icon: any;
  roles: string[];
  badge?: number;
}

const menuItems = computed<MenuItem[]>(() => [
  // Expediteur
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

  // Transporteur
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
  {
    label: 'Annonces de fret',
    to: '/app/uc/offers',
    icon: IconTruck,
    roles: [ROLES.Carrier]
  },
  {
    label: 'Messages',
    to: '/app/messages',
    icon: IconMessage,
    roles: ['all'],
    badge: props.unreadCount
  }
]);

const filteredMenuItems = computed(() => {
  if (!authStore.currentUser) return [];
  const userRole = authStore.currentUser.role;

  return menuItems.value.filter(item => {
    if (item.roles.includes('all')) return true;
    return item.roles.includes(userRole);
  });
});

const currentYear = computed(() => new Date().getFullYear());
</script>
