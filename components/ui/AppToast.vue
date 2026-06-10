<template>
  <div class="fixed bottom-6 left-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
    <TransitionGroup enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-4 opacity-0 scale-95"
      enter-to-class="transform translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100 scale-100"
      leave-to-class="transform translate-y-4 opacity-0 scale-95">
      <div v-for="toast in toasts" :key="toast.id"
        class="pointer-events-auto flex items-start justify-between p-4 rounded-2xl shadow-xl border backdrop-blur-xl transition-all duration-300 relative overflow-hidden group"
        :class="toastClasses(toast.type)">
        <!-- Decorative subtle gradient pulse element -->
        <div
          class="absolute -right-4 -bottom-4 w-20 h-20 rounded-full opacity-[0.08] group-hover:scale-125 transition-transform duration-500"
          :class="decorClasses(toast.type)"></div>

        <div class="flex items-start gap-3 relative z-10">
          <component :is="toastIcon(toast.type)" class="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div class="flex-1">
            <p class="text-sm font-bold leading-tight">{{ toast.message }}</p>
          </div>
        </div>
        <button @click="removeToast(toast.id)"
          class="ml-4 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-current opacity-60 hover:opacity-100 transition-all relative z-10">
          <IconX class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCmnToastStore } from '~/stores/cmnToast';
import { IconCircleCheck, IconAlertTriangle, IconInfoCircle, IconCircleX, IconX } from '@tabler/icons-vue';

const toastStore = useCmnToastStore();
const toasts = computed(() => toastStore.toasts);

const removeToast = (id: string) => {
  toastStore.removeToast(id);
};

const toastIcon = (type: string) => {
  switch (type) {
    case 'success':
      return IconCircleCheck;
    case 'error':
      return IconCircleX;
    case 'warning':
      return IconAlertTriangle;
    case 'info':
    default:
      return IconInfoCircle;
  }
};

const toastClasses = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-emerald-50/95 dark:bg-emerald-950/90 border-emerald-200/50 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-200 shadow-emerald-500/5';
    case 'error':
      return 'bg-rose-50/95 dark:bg-rose-950/90 border-rose-200/50 dark:border-rose-800/30 text-rose-800 dark:text-rose-200 shadow-rose-500/5';
    case 'warning':
      return 'bg-amber-50/95 dark:bg-amber-950/90 border-amber-200/50 dark:border-amber-800/30 text-amber-800 dark:text-amber-200 shadow-amber-500/5';
    case 'info':
    default:
      return 'bg-primary-50/95 dark:bg-primary-950/90 border-primary-200/50 dark:border-primary-800/30 text-primary-800 dark:text-primary-200 shadow-primary-500/5';
  }
};

const decorClasses = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-emerald-500';
    case 'error':
      return 'bg-rose-500';
    case 'warning':
      return 'bg-amber-500';
    case 'info':
    default:
      return 'bg-primary-500';
  }
};
</script>
