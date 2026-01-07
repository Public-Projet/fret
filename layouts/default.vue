<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Mobile Header -->
    <AppHeader :menu-open="mobileMenuOpen" @toggle-menu="mobileMenuOpen = !mobileMenuOpen" />

    <!-- Mobile Menu Overlay -->
    <div v-if="mobileMenuOpen" class="lg:hidden fixed inset-0 z-20 bg-gray-900/50 backdrop-blur-sm"
      @click="mobileMenuOpen = false"></div>

    <!-- Mobile Sidebar (Drawer) -->
    <div
      :class="['fixed top-[61px] left-0 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out z-20 lg:hidden overflow-y-auto', mobileMenuOpen ? 'translate-x-0' : '-translate-x-full']">
      <div class="p-4">
        <!-- Mobile User Profile -->
        <div class="p-4 mb-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-lg">
              {{ userInitials }}
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white truncate max-w-[140px]">{{ userName }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ userRole }}</p>
            </div>
          </div>
        </div>
        <AppNavigation :is-shipper="isShipper" :unread-count="unreadCount" @click.native="mobileMenuOpen = false" />
      </div>
    </div>

    <div class="flex flex-grow relative">
      <!-- Desktop Sidebar -->
      <AppSidebar :user-initials="userInitials" :user-name="userName" :user-role="userRole"
        :user-email="currentUser?.email || ''" :is-shipper="isShipper" :unread-count="unreadCount"
        :collapsed="isSidebarCollapsed" @toggle-collapse="isSidebarCollapsed = !isSidebarCollapsed" />

      <!-- Main Content -->
      <main
        class="flex-grow min-w-0 transition-opacity duration-300 bg-gray-50 dark:bg-gray-900 overflow-y-auto h-[calc(100vh-64px)]">
        <div class="container-custom py-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AppHeader from '~/components/layout/AppHeader.vue';
import AppSidebar from '~/components/layout/AppSidebar.vue';
import AppNavigation from '~/components/layout/AppNavigation.vue';

import { useAuthStore } from '~/stores/auth';
import { useMessagingStore } from '~/stores/messaging';

const authStore = useAuthStore();
const messagingStore = useMessagingStore();
const mobileMenuOpen = ref(false);
const isSidebarCollapsed = ref(false);

const currentUser = computed(() => authStore.currentUser);
const isShipper = computed(() => authStore.isShipper);
const unreadCount = computed(() =>
  currentUser.value ? messagingStore.unreadCount(currentUser.value.id) : 0
);

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
</script>
