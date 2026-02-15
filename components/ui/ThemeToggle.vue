<template>
  <button @click="themeStore.toggleTheme()"
    class="p-2 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500/50"
    :class="[
      isDark
        ? 'bg-white/5 text-primary-400 border border-white/10 hover:bg-white/10'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
      , customClass]" :aria-label="isDark ? 'Passer au mode clair' : 'Passer au mode sombre'">
    <div class="relative w-5 h-5 overflow-hidden">
      <Transition enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform translate-y-full opacity-0" enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-300 ease-in" leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-full opacity-0">
        <IconSun v-if="isDark" key="sun" class="w-5 h-5" />
        <IconMoon v-else key="moon" class="w-5 h-5" />
      </Transition>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useThemeStore } from '~/stores/theme';
import { IconMoon, IconSun } from '@tabler/icons-vue';

defineProps<{
  customClass?: string;
}>();

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);
</script>
