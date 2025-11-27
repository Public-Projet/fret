<template>
  <header class="sticky top-0 z-50 glass border-b border-gray-200 dark:border-gray-700">
    <nav class="container-custom">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-2 group">
          <div
            class="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <IconTruck class="w-6 h-6 text-white" />
          </div>
          <span class="text-xl font-bold text-gradient hidden sm:block">FreightConnect</span>
        </NuxtLink>

        <!-- Navigation Desktop -->
        <div class="hidden md:flex items-center space-x-6">
          <template v-if="isAuthenticated">
            <NuxtLink :to="isShipper ? '/dashboard/shipper' : '/dashboard/carrier'"
              class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Tableau de bord
            </NuxtLink>
            <NuxtLink to="/announcements"
              class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Annonces
            </NuxtLink>
            <NuxtLink to="/messages"
              class="relative text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Messages
              <span v-if="unreadCount > 0"
                class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {{ unreadCount }}
              </span>
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink to="/announcements"
              class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Annonces
            </NuxtLink>
            <NuxtLink to="/#features"
              class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Fonctionnalités
            </NuxtLink>
          </template>
        </div>

        <!-- Actions -->
        <div class="flex items-center space-x-4">
          <!-- Toggle Dark Mode -->
          <button @click="toggleTheme" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode">
            <IconMoon v-if="!isDark" class="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <IconSun v-else class="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>

          <!-- User Menu -->
          <template v-if="isAuthenticated">
            <div class="relative" ref="userMenuRef">
              <button @click="toggleUserMenu"
                class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div
                  class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                  {{ userInitials }}
                </div>
                <IconChevronDown class="w-4 h-4 text-gray-700 dark:text-gray-300 hidden md:block" />
              </button>

              <!-- Dropdown Menu -->
              <Transition enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95">
                <div v-if="isUserMenuOpen"
                  class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                  <NuxtLink to="app/profile"
                    class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    @click="closeUserMenu">
                    Mon profil
                  </NuxtLink>
                  <NuxtLink to="/settings"
                    class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    @click="closeUserMenu">
                    Paramètres
                  </NuxtLink>
                  <hr class="my-1 border-gray-200 dark:border-gray-700" />
                  <button @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Déconnexion
                  </button>
                </div>
              </Transition>
            </div>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="btn btn-ghost hidden md:inline-flex">
              Connexion
            </NuxtLink>
            <NuxtLink to="/register" class="btn btn-primary">
              Inscription
            </NuxtLink>
          </template>

          <!-- Mobile Menu Button -->
          <button @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle mobile menu">
            <IconMenu2 v-if="!isMobileMenuOpen" class="w-6 h-6 text-gray-700 dark:text-gray-300" />
            <IconX v-else class="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition enter-active-class="transition ease-out duration-200"
        enter-from-class="transform opacity-0 -translate-y-2" enter-to-class="transform opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150" leave-from-class="transform opacity-100 translate-y-0"
        leave-to-class="transform opacity-0 -translate-y-2">
        <div v-if="isMobileMenuOpen" class="md:hidden py-4 space-y-2">
          <template v-if="isAuthenticated">
            <NuxtLink :to="isShipper ? '/dashboard/shipper' : '/dashboard/carrier'"
              class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              @click="closeMobileMenu">
              Tableau de bord
            </NuxtLink>
            <NuxtLink to="/announcements"
              class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              @click="closeMobileMenu">
              Annonces
            </NuxtLink>
            <NuxtLink to="/messages"
              class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              @click="closeMobileMenu">
              Messages
              <span v-if="unreadCount > 0" class="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {{ unreadCount }}
              </span>
            </NuxtLink>
            <NuxtLink to="app/profile"
              class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              @click="closeMobileMenu">
              Mon profil
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink to="/announcements"
              class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              @click="closeMobileMenu">
              Annonces
            </NuxtLink>
            <NuxtLink to="/login"
              class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              @click="closeMobileMenu">
              Connexion
            </NuxtLink>
            <NuxtLink to="/register"
              class="block px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg text-center"
              @click="closeMobileMenu">
              Inscription
            </NuxtLink>
          </template>
        </div>
      </Transition>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useThemeStore } from '~/stores/theme';
import { useMessagingStore } from '~/stores/messaging';
import { IconChevronDown, IconMenu2, IconMoon, IconSun, IconTruck, IconX } from '@tabler/icons-vue';

const authStore = useAuthStore();
const themeStore = useThemeStore();
const messagingStore = useMessagingStore();
const router = useRouter();

const isUserMenuOpen = ref(false);
const isMobileMenuOpen = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);

const isAuthenticated = computed(() => authStore.isAuthenticated);
const isShipper = computed(() => authStore.isShipper);
const isDark = computed(() => themeStore.isDark);
const currentUser = computed(() => authStore.currentUser);
const unreadCount = computed(() =>
  currentUser.value ? messagingStore.unreadCount(currentUser.value.id) : 0
);

const userInitials = computed(() => {
  if (!currentUser.value) return '';
  return `${currentUser.value.firstName[0]}${currentUser.value.lastName[0]}`.toUpperCase();
});

const toggleTheme = () => {
  themeStore.toggleTheme();
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
  authStore.logout();
  closeUserMenu();
  router.push('/');
};

// Fermer le menu utilisateur en cliquant à l'extérieur
const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    closeUserMenu();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
