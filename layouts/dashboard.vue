<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <div class="flex flex-grow container-custom py-8 gap-6">
      <!-- Sidebar -->
      <aside class="w-64 flex-shrink-0 hidden lg:block">
        <div
          class="sticky top-24 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
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

          <nav class="p-2 space-y-1">
            <NuxtLink to="/dashboard"
              class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
              <IconHome class="w-5 h-5" />
              <span>Vue d'ensemble</span>
            </NuxtLink>

            <template v-if="isShipper">
              <NuxtLink to="/dashboard/shipper"
                class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
                <IconTruck class="w-5 h-5" />
                <span>Mes Expéditions</span>
              </NuxtLink>
            </template>

            <template v-else>
              <NuxtLink to="/dashboard/carrier"
                class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
                <IconTruck class="w-5 h-5" />
                <span>Mes Trajets</span>
              </NuxtLink>
            </template>

            <NuxtLink to="/messages"
              class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
              <IconMessage class="w-5 h-5" />
              <div class="flex-1 flex justify-between items-center">
                <span>Messages</span>
                <span v-if="unreadCount > 0"
                  class="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center">
                  {{ unreadCount }}
                </span>
              </div>
            </NuxtLink>

            <NuxtLink to="/settings"
              class="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
              <IconSettings class="w-5 h-5" />
              <span>Paramètres</span>
            </NuxtLink>
          </nav>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-grow min-w-0">
        <slot />
      </main>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Footer from '~/components/layout/Footer.vue';
import { useAuthStore } from '~/stores/auth';
import { useMessagingStore } from '~/stores/messaging';
import { IconHome, IconMessage, IconSettings, IconTruck } from '@tabler/icons-vue';

const authStore = useAuthStore();
const messagingStore = useMessagingStore();

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
