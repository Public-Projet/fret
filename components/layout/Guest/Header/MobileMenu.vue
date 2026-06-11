<template>
  <!-- Enhanced Mobile Menu -->
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform -translate-y-4 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform -translate-y-4 opacity-0">
    <div
      v-if="isOpen"
      class="md:hidden pt-4 pb-6 space-y-2 border-t border-gray-100 dark:border-gray-800 mt-4">
      <NuxtLink
        v-for="link in headerLinks"
        :key="link.to"
        :to="link.to"
        class="flex items-center justify-between px-4 py-3.5 text-sm font-bold rounded-2xl transition-all"
        :class="[
          route.path === link.to.split('?')[0]
            ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
        ]"
        @click="emit('close')">
        {{ link.label }}
        <span
          v-if="link.badge && link.badge > 0"
          class="bg-primary-500 text-white text-[10px] rounded-full px-2 py-0.5 font-black">
          {{ link.badge }}
        </span>
      </NuxtLink>

      <!-- Mobile Auth Actions -->
      <template v-if="!isAuthenticated">
        <div class="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 mt-4 px-2">
          <NuxtLink
            to="/auth/login"
            class="flex items-center justify-center py-3 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 rounded-2xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
            @click="emit('close')">
            Connexion
          </NuxtLink>
          <NuxtLink
            to="/auth/register"
            class="flex items-center justify-center py-3 text-sm font-black text-white bg-primary-600 rounded-2xl shadow-lg shadow-primary-500/20 active:scale-95 transition-transform"
            @click="emit('close')">
            C'est parti !
          </NuxtLink>
        </div>
      </template>

      <!-- Mobile User Card -->
      <div v-else class="flex items-center justify-between p-4 bg-gray-100 dark:bg-white/5 rounded-2xl mt-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 overflow-hidden rounded-xl flex items-center justify-center bg-primary-600">
            <img v-if="currentUser?.avatar" :src="currentUser.avatar" alt="Avatar" class="w-full h-full object-cover" />
            <span v-else class="text-white text-xs font-black">{{ userInitials }}</span>
          </div>
          <p class="text-sm font-black text-gray-900 dark:text-white">{{ currentUser?.firstName }}</p>
        </div>
        <UiThemeToggle />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const route = useRoute();

defineProps<{
  isOpen: boolean;
  isAuthenticated: boolean;
  headerLinks: Array<{ label: string; to: string; badge?: number }>;
  currentUser: { avatar?: string; firstName: string; lastName: string } | null;
  userInitials: string;
}>();

const emit = defineEmits<{
  close: [];
}>();
</script>
