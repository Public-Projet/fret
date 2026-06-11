<template>
  <!-- User Dropdown -->
  <div class="relative" ref="dropdownRef">
    <button @click="isDropdownOpen = !isDropdownOpen"
      class="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
      <div
        class="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center ring-2 ring-white dark:ring-gray-800 shadow-sm">
        <img v-if="currentUser?.avatar" :src="currentUser.avatar" alt="Avatar" class="w-full h-full object-cover" />
        <div v-else
          class="w-full h-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm">
          {{ userInitials }}
        </div>
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
          <NuxtLink v-for="link in dropdownLinks" :key="link.to" :to="link.to"
            class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            @click="isDropdownOpen = false">
            <component :is="link.icon" class="w-4 h-4" />
            <span class="flex-1">{{ link.label }}</span>
          </NuxtLink>
          <div class="border-t border-gray-100 dark:border-gray-700/50 my-1"></div>
          <button @click="emit('logout')"
            class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
            <IconLogout class="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { IconChevronDown, IconUser, IconLogout, IconSettings, IconReceipt } from '@tabler/icons-vue';

const props = defineProps<{
  currentUser: { avatar?: string; firstName: string; lastName: string; email?: string } | null;
  userInitials: string;
  userName: string;
  userRole: string;
  isShipper: boolean;
}>();

const emit = defineEmits<{
  logout: [];
}>();

const isDropdownOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const dropdownLinks = computed(() => [
  {
    to: props.isShipper ? '/app/us/profile' : '/app/uc/profile',
    icon: IconUser,
    label: 'Mon Profil',
  },
  {
    to: props.isShipper ? '/app/us/transactions' : '/app/uc/transactions',
    icon: IconReceipt,
    label: 'Transactions',
  },
  {
    to: '/app/settings',
    icon: IconSettings,
    label: 'Paramètres',
  }
]);

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
