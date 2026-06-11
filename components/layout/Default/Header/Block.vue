<template>
  <div
    class="bg-white/80 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center sticky top-0 z-30 transition-all duration-300">
    <LayoutDefaultHeaderLogo :menu-open="menuOpen" @toggle-menu="emit('toggle-menu')" />

    <div class="flex items-center gap-3">
      <!-- Theme Toggle -->
      <UiThemeToggle class="hidden sm:flex" />

      <!-- Notifications -->
      <LayoutNotificationDrop />

      <!-- User Dropdown -->
      <LayoutDefaultHeaderUserDropdown :current-user="currentUser" :user-initials="userInitials" :user-name="userName"
        :user-role="userRole" :is-shipper="isShipper" @logout="handleLogout" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import { useCmnSubscriptionStore } from '~/stores/cmnSubscription';

const props = defineProps<{
  menuOpen: boolean;
}>();

const emit = defineEmits<{
  'toggle-menu': [];
}>();

const authStore = useCmnAuthStore();
const subscriptionStore = useCmnSubscriptionStore();
const router = useRouter();

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
  authStore.logoutUser();
  router.push('/auth/login');
};
</script>
