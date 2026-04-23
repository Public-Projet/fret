<template>
  <header class="sticky top-0 z-50 transition-all duration-300 border-b" :class="[
    isScrolled
      ? (isDark ? 'glass-dark py-2' : 'glass-light py-2')
      : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-4 border-gray-200/50 dark:border-gray-700/50'
  ]">
    <nav class="container-custom">
      <div class="flex items-center justify-between">
        <!-- Logo Section -->
        <NuxtLink to="/" class="flex items-center space-x-3 group relative">
          <div
            class="relative overflow-hidden rounded-xl bg-white p-1.5 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
            <img src="/img/Logo.png" alt="Logo" class="h-9 w-auto" />
            <div class="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div class="flex flex-col">
            <span :class="['text-lg font-black tracking-tight leading-none', isDark ? 'text-white' : 'text-gray-900']">
              Bourse de Fret
            </span>
            <span class="text-[10px] font-bold text-primary-500 uppercase tracking-[0.2em] leading-none mt-1">
              Bénin Connecté
            </span>
          </div>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div
          class="hidden md:flex items-center bg-gray-100/50 dark:bg-white/5 rounded-2xl px-2 py-1.5 border border-gray-200/50 dark:border-white/5">
          <NuxtLink v-for="link in headerLinks" :key="link.to" :to="link.to"
            class="relative px-5 py-2 text-sm font-bold transition-all duration-300 rounded-xl group overflow-hidden"
            :class="[
              route.path === link.to.split('?')[0]
                ? 'text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            ]">
            <span class="relative z-10 flex items-center gap-2">
              {{ link.label }}
              <span v-if="link.badge && link.badge > 0"
                class="bg-primary-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                {{ link.badge }}
              </span>
            </span>
            <div v-if="route.path !== link.to.split('?')[0]"
              class="absolute inset-0 bg-gray-200/50 dark:bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            </div>
          </NuxtLink>
        </div>

        <!-- Actions Shell -->
        <div class="flex items-center gap-3">
          <!-- Utils -->
          <div class="hidden sm:flex items-center gap-2 pr-3 border-r border-gray-200 dark:border-gray-700">
            <UiThemeToggle class="hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors p-1" />
            <LayoutNotificationDrop v-if="isAuthenticated" />
          </div>

          <!-- Profile / Auth -->
          <div class="flex items-center gap-3">
            <template v-if="isAuthenticated">
              <div class="relative" ref="userMenuRef">
                <button @click="toggleUserMenu"
                  class="flex items-center gap-2 pl-1 pr-3 py-1 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-300 dark:hover:border-white/10 group">
                  <div
                    class="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
                    {{ userInitials }}
                  </div>
                  <div class="hidden md:block text-left">
                    <p class="text-[10px] font-bold text-gray-500 uppercase leading-none">Connecté</p>
                    <IconChevronDown
                      class="w-4 h-4 text-gray-700 dark:text-gray-300 group-hover:translate-y-0.5 transition-transform" />
                  </div>
                </button>

                <!-- Premium Dropdown Menu -->
                <Transition enter-active-class="transition duration-200 ease-out"
                  enter-from-class="transform scale-95 opacity-0 translate-y-2"
                  enter-to-class="transform scale-100 opacity-100 translate-y-0"
                  leave-active-class="transition duration-150 ease-in"
                  leave-from-class="transform scale-100 opacity-100 translate-y-0"
                  leave-to-class="transform scale-95 opacity-0 translate-y-2">
                  <div v-if="isUserMenuOpen"
                    class="absolute right-0 mt-3 w-56 glass-dark rounded-2xl shadow-2xl border border-white/10 overflow-hidden py-2 p-1.5 ring-1 ring-black/5">
                    <div class="px-4 py-3 mb-2 bg-white/5 rounded-xl border border-white/5">
                      <p class="text-xs font-bold text-gray-400 mb-1">Session active</p>
                      <p class="text-sm font-black text-white truncate">{{ currentUser?.firstName }} {{
                        currentUser?.lastName }}</p>
                    </div>

                    <NuxtLink v-for="link in userMenuLinks" :key="link.to" :to="link.to"
                      class="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 group"
                      @click="link.action">
                      <component :is="link.icon"
                        class="w-4 h-4 text-gray-500 group-hover:text-primary-400 transition-colors" />
                      {{ link.label }}
                    </NuxtLink>

                    <div class="h-px bg-white/10 my-2 mx-2"></div>

                    <button @click="handleLogout"
                      class="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-all duration-200 group">
                      <IconLogout class="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                </Transition>
              </div>
            </template>

            <template v-else>
              <NuxtLink to="/auth/login"
                class="hidden md:flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-xl overflow-hidden group relative">
                <span class="relative z-10">Connexion</span>
                <div
                  class="absolute inset-0 bg-gray-100 dark:bg-white/5 -translate-x-full group-hover:translate-x-0 transition-transform">
                </div>
              </NuxtLink>

              <NuxtLink to="/auth/register"
                class="flex items-center gap-2 px-6 py-2.5 text-sm font-black text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all duration-300 active:scale-95">
                Rejoindre
                <IconArrowRight class="w-4 h-4" />
              </NuxtLink>
            </template>

            <!-- Mobile Toggle -->
            <button @click="toggleMobileMenu"
              class="md:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-all border border-transparent active:scale-90">
              <IconMenu2 v-if="!isMobileMenuOpen" class="w-5 h-5" />
              <IconX v-else class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Enhanced Mobile Menu -->
      <Transition enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform -translate-y-4 opacity-0" enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in" leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-4 opacity-0">
        <div v-if="isMobileMenuOpen"
          class="md:hidden pt-4 pb-6 space-y-2 border-t border-gray-100 dark:border-gray-800 mt-4">
          <NuxtLink v-for="link in headerLinks" :key="link.to" :to="link.to"
            class="flex items-center justify-between px-4 py-3.5 text-sm font-bold rounded-2xl transition-all" :class="[
              route.path === link.to.split('?')[0]
                ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
            ]" @click="closeMobileMenu">
            {{ link.label }}
            <span v-if="link.badge && link.badge > 0"
              class="bg-primary-500 text-white text-[10px] rounded-full px-2 py-0.5 font-black">
              {{ link.badge }}
            </span>
          </NuxtLink>

          <!-- Mobile Auth Actions -->
          <template v-if="!isAuthenticated">
            <div class="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 mt-4 px-2">
              <NuxtLink to="/auth/login"
                class="flex items-center justify-center py-3 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 rounded-2xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                @click="closeMobileMenu">
                Connexion
              </NuxtLink>
              <NuxtLink to="/auth/register"
                class="flex items-center justify-center py-3 text-sm font-black text-white bg-primary-600 rounded-2xl shadow-lg shadow-primary-500/20 active:scale-95 transition-transform"
                @click="closeMobileMenu">
                C'est parti !
              </NuxtLink>
            </div>
          </template>
          <div v-else class="flex items-center justify-between p-4 bg-gray-100 dark:bg-white/5 rounded-2xl mt-4">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white text-xs font-black">
                {{ userInitials }}
              </div>
              <p class="text-sm font-black text-gray-900 dark:text-white">{{ currentUser?.firstName }}</p>
            </div>
            <UiThemeToggle />
          </div>
        </div>
      </Transition>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import { useThemeStore } from '~/stores/theme';
import { useCmnMessagingStore } from '~/stores/cmnMessaging';
import { IconChevronDown, IconMenu2, IconX, IconArrowRight, IconLayoutDashboard, IconUser, IconSettings, IconLogout } from '@tabler/icons-vue';

const authStore = useCmnAuthStore();
const themeStore = useThemeStore();
const messagingStore = useCmnMessagingStore();
const router = useRouter();
const route = useRoute();

const isUserMenuOpen = ref(false);
const isMobileMenuOpen = ref(false);
const isScrolled = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);

const isAuthenticated = computed(() => authStore.isAuthenticated);
const isShipper = computed(() => authStore.isShipper);
const isDark = computed(() => themeStore.isDark);
const currentUser = computed(() => authStore.currentUser);
const unreadCount = computed(() =>
  currentUser.value ? messagingStore.unreadCount : 0
);

const userInitials = computed(() => {
  if (!currentUser.value) return '';
  return `${currentUser.value.firstName[0]}${currentUser.value.lastName[0]}`.toUpperCase();
});

const headerLinks = computed(() => {
  const links = [
    { label: 'Marché', to: '/annonces' },
    { label: 'Annuaire', to: '/users' },
    { label: 'Tarifs', to: '/pricing' }
  ];

  if (isAuthenticated.value) {
    return [
      { label: 'Tableau de bord', to: isShipper.value ? '/app/us' : '/app/uc' },
      ...links,
      { label: 'Messages', to: '/app/messages', badge: unreadCount.value }
    ];
  }

  return links;
});

const userMenuLinks = computed(() => [
  {
    label: 'Tableau de bord',
    to: isShipper.value ? '/app/us' : '/app/uc',
    icon: IconLayoutDashboard,
    action: closeUserMenu
  },
  {
    label: 'Mon profil',
    to: isShipper.value ? '/app/us/profile' : '/app/uc/profile',
    icon: IconUser,
    action: closeUserMenu
  },
  {
    label: 'Paramètres',
    to: '/app/settings',
    icon: IconSettings,
    action: closeUserMenu
  }
]);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

const closeUserMenu = () => {
  isUserMenuOpen.value = false;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleLogout = () => {
  authStore.logoutUser();
  closeUserMenu();
  router.push('/');
};

const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    closeUserMenu();
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="postcss">
.glass-dark {
  @apply bg-gray-900/80 backdrop-blur-xl border-white/5;
}

.glass-light {
  @apply bg-white/80 backdrop-blur-xl border-gray-200/50;
}

.text-gradient {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400;
}
</style>
