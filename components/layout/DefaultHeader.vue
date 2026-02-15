<template>
  <div
    class="bg-white/80 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center sticky top-0 z-30 transition-all duration-300">
    <div class="flex items-center gap-4">
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <img src="/img/Logo.png" alt="BourseFret" class="h-10 w-auto bg-white rounded-lg p-1" />
      </NuxtLink>
    </div>

    <div class="flex items-center gap-3">
      <!-- Theme Toggle -->
      <button @click="toggleTheme"
        class="hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50 transition-colors">
        <IconMoon v-if="!isDark" class="w-5 h-5" />
        <IconSun v-else class="w-5 h-5" />
      </button>

      <!-- Notifications -->
      <LayoutNotificationDrop />

      <!-- User Dropdown -->
      <div class="relative" ref="dropdownRef">
        <button @click="isDropdownOpen = !isDropdownOpen"
          class="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
          <div
            class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm ring-2 ring-white dark:ring-gray-800 shadow-sm">
            {{ userInitials }}
          </div>
          <div class="hidden md:block text-left">
            <p class="text-xs font-semibold text-gray-900 dark:text-white leading-none">{{ userName }}</p>
            <p class="text-[10px] text-gray-500 dark:text-gray-400 leading-none mt-1">{{ userRole }}</p>
          </div>
          <IconChevronDown class="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200"
            :class="{ 'rotate-180': isDropdownOpen }" />
        </button>

        <!-- Dropdown Menu -->
        <Transition enter-active-class="transition ease-out duration-200"
          enter-from-class="transform opacity-0 scale-95 translate-y-2"
          enter-to-class="transform opacity-100 scale-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="transform opacity-100 scale-100 translate-y-0"
          leave-to-class="transform opacity-0 scale-95 translate-y-2">
          <div v-if="isDropdownOpen"
            class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 origin-top-right overflow-hidden z-50">
            <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
              <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ userName }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ currentUser?.email }}</p>
            </div>

            <div class="py-1">
              <NuxtLink :to="isShipper ? '/app/us/profile' : '/app/uc/profile'"
                class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                @click="isDropdownOpen = false">
                <IconUser class="w-4 h-4" />
                Mon Profil
              </NuxtLink>
              <div class="border-t border-gray-100 dark:border-gray-700/50 my-1"></div>
              <button @click="handleLogout"
                class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                <IconLogout class="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <button @click="$emit('toggle-menu')"
        class="p-2 text-gray-600 dark:text-gray-300 lg:hidden user-select-none hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
        <IconMenu2 v-if="!menuOpen" class="w-6 h-6" />
        <IconX v-else class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useThemeStore } from '~/stores/theme'; // Added
import { IconMenu2, IconX, IconChevronDown, IconUser, IconLogout, IconHome, IconMoon, IconSun } from '@tabler/icons-vue';

defineProps<{
  menuOpen: boolean;
}>();

defineEmits(['toggle-menu']);

const authStore = useAuthStore();
const themeStore = useThemeStore(); // Added
const router = useRouter();

const isDark = computed(() => themeStore.isDark); // Added
const toggleTheme = () => themeStore.toggleTheme(); // Added

const isDropdownOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const currentUser = computed(() => authStore.currentUser);
const isShipper = computed(() => authStore.isShipper);

const userInitials = computed(() => {
  if (!currentUser.value) return '';
  return `${currentUser.value.firstName[0]}${currentUser.value.lastName[0]}`.toUpperCase();
});

const userName = computed(() => {
  if (!currentUser.value) return '';
  return `${currentUser.value.firstName} ${currentUser.value.lastName}`;
});

const userRole = computed(() => {
  if (!currentUser.value) return '';
  return isShipper.value ? 'Expéditeur' : 'Transporteur';
});

const handleLogout = () => {
  isDropdownOpen.value = false;
  authStore.logout();
  router.push('/auth/login');
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
