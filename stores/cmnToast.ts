import { defineStore } from 'pinia';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export const useCmnToastStore = defineStore('cmnToast', {
  state: () => ({
    toasts: [] as Toast[],
  }),

  actions: {
    addToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 4000) {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, message, type, duration };
      this.toasts.push(newToast);

      if (duration > 0) {
        setTimeout(() => {
          this.removeToast(id);
        }, duration);
      }
    },

    removeToast(id: string) {
      this.toasts = this.toasts.filter((t) => t.id !== id);
    },
  },
});
