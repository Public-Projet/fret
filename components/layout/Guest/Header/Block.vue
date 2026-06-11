<template>
  <header class="sticky top-0 z-50 transition-all duration-300 border-b" :class="[
    isScrolled
      ? (isDark ? 'glass-dark py-2' : 'glass-light py-2')
      : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-4 border-gray-200/50 dark:border-gray-700/50'
  ]">
    <nav class="container-custom">
      <div class="flex items-center justify-between">
        <LayoutGuestHeaderLogo :is-dark="isDark" />
        <LayoutGuestHeaderDesktopNav :header-links="headerLinks" />
        <LayoutGuestHeaderActions :is-authenticated="isAuthenticated" :is-user-menu-open="isUserMenuOpen"
          :is-mobile-menu-open="isMobileMenuOpen" :current-user="currentUser" :user-initials="userInitials"
          :user-role="userRole" :is-shipper="isShipper" @toggle-user-menu="toggleUserMenu"
          @toggle-mobile-menu="toggleMobileMenu" @logout="handleLogout" />
      </div>

      <LayoutGuestHeaderMobileMenu :is-open="isMobileMenuOpen" :is-authenticated="isAuthenticated"
        :header-links="headerLinks" :current-user="currentUser" :user-initials="userInitials"
        @close="closeMobileMenu" />
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import { useFrtThemeStore } from '~/stores/frtTheme';
import { useCmnMessagingStore } from '~/stores/cmnMessaging';

const authStore = useCmnAuthStore();
const themeStore = useFrtThemeStore();
const messagingStore = useCmnMessagingStore();

const isUserMenuOpen = ref(false);
const isMobileMenuOpen = ref(false);
const isScrolled = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);

const isAuthenticated = computed(() => authStore.isAuthenticated);
const isShipper = computed(() => authStore.isShipper);
const isDark = computed(() => themeStore.isDark);
const currentUser = computed(() => authStore.currentUser);
const userRole = computed(() => {
  if (!currentUser.value) return '';
  return isShipper.value ? 'Expéditeur' : 'Transporteur';
});
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

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleLogout = () => {
  authStore.logoutUser(false);
  isUserMenuOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    isUserMenuOpen.value = false;
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
