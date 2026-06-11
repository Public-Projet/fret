<template>
  <!-- Actions Shell -->
  <div class="flex items-center gap-3">
    <!-- Utils -->
    <div class="hidden sm:flex items-center gap-2 pr-3 border-r border-gray-200 dark:border-gray-700">
      <UiThemeToggle class="hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors p-1" />
      <LayoutNotificationDrop v-if="isAuthenticated" />
    </div>

    <!-- Profile / Auth -->
    <div class="flex items-center gap-3">
      <!-- Utilisateur connecté -->
      <template v-if="isAuthenticated">
        <div class="relative" ref="userMenuRef">
          <button @click="emit('toggle-user-menu')"
            class="flex items-center gap-2 pl-1 pr-3 py-1 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-300 dark:hover:border-white/10 group">
            <div
              class="w-8 h-8 overflow-hidden rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform bg-primary-600">
              <img v-if="currentUser?.avatar" :src="currentUser.avatar" alt="Avatar"
                class="w-full h-full object-cover" />
              <span v-else class="text-white text-xs font-black">{{ userInitials }}</span>
            </div>
            <div class="hidden md:block text-left">
              <p class="text-[10px] font-bold text-primary-500 uppercase leading-none mb-0.5 tracking-wider">
                {{ userRole }}
              </p>
              <div class="flex items-center gap-1.5">
                <p class="text-sm font-black text-gray-900 dark:text-gray-100 leading-none">{{ currentUser?.firstName }}
                </p>
                <IconChevronDown class="w-3.5 h-3.5 text-gray-400 group-hover:translate-y-0.5 transition-transform" />
              </div>
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
                <p class="text-xs font-bold text-gray-400 mb-1">Session active ({{ userRole }})</p>
                <p class="text-sm font-black text-white truncate">{{ currentUser?.firstName }} {{ currentUser?.lastName
                  }}</p>
              </div>

              <NuxtLink v-for="link in userMenuLinks" :key="link.to" :to="link.to"
                class="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 group"
                @click="link.action">
                <component :is="link.icon"
                  class="w-4 h-4 text-gray-500 group-hover:text-primary-400 transition-colors" />
                {{ link.label }}
              </NuxtLink>

              <div class="h-px bg-white/10 my-2 mx-2"></div>

              <button @click="emit('logout')"
                class="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-all duration-200 group">
                <IconLogout class="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </Transition>
        </div>
      </template>

      <!-- Non connecté -->
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
      <button @click="emit('toggle-mobile-menu')"
        class="md:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-all border border-transparent active:scale-90">
        <IconMenu2 v-if="!isMobileMenuOpen" class="w-5 h-5" />
        <IconX v-else class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconChevronDown, IconMenu2, IconX, IconArrowRight, IconLayoutDashboard, IconUser, IconSettings, IconLogout } from '@tabler/icons-vue';

const props = defineProps<{
  isAuthenticated: boolean;
  isUserMenuOpen: boolean;
  isMobileMenuOpen: boolean;
  currentUser: { avatar?: string; firstName: string; lastName: string } | null;
  userInitials: string;
  userRole: string;
  isShipper: boolean;
}>();

const emit = defineEmits<{
  'toggle-user-menu': [];
  'toggle-mobile-menu': [];
  'logout': [];
}>();

const userMenuLinks = computed(() => [
  {
    label: 'Tableau de bord',
    to: props.isShipper ? '/app/us' : '/app/uc',
    icon: IconLayoutDashboard,
    action: () => emit('toggle-user-menu')
  },
  {
    label: 'Mon profil',
    to: props.isShipper ? '/app/us/profile' : '/app/uc/profile',
    icon: IconUser,
    action: () => emit('toggle-user-menu')
  },
  {
    label: 'Paramètres',
    to: '/app/settings',
    icon: IconSettings,
    action: () => emit('toggle-user-menu')
  }
]);
</script>

<style scoped lang="postcss">
.glass-dark {
  @apply bg-gray-900/80 backdrop-blur-xl border-white/5;
}
</style>
