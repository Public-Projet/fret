import { defineStore } from 'pinia';
import type { Notification } from '~/types';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [] as Notification[],
    unreadCount: 0,
    isLoading: false,
    page: 1,
    total: 0,
    limit: 20,
    refreshInterval: null as any | null
  }),

  actions: {
    async fetchNotifications(page = 1) {
      this.isLoading = true;
      const authStore = useAuthStore();
      const role = authStore.user?.role;

      if (!role) {
        this.isLoading = false;
        return;
      }

      try {
        const response = await $fetch<any>('/api/notifications', {
          query: { role, page, limit: this.limit },
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });

        if (response?.notifications) {
          if (page === 1) {
            this.notifications = response.notifications;
          } else {
            this.notifications = [...this.notifications, ...response.notifications];
          }
          this.total = response.meta?.total || 0;
          this.page = page;
          this.updateUnreadCount();
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async markAsRead(id: string) {
      const authStore = useAuthStore();
      const role = authStore.user?.role;

      if (!role) return;

      try {
        const response = await $fetch<any>(`/api/notifications/${id}`, {
          query: { role },
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });

        if (response?.notification) {
          const index = this.notifications.findIndex(n => String(n.id) === String(id));
          if (index !== -1) {
            this.notifications[index] = response.notification;
          } else {
            this.notifications.push(response.notification);
          }
          this.updateUnreadCount();
        }
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    },

    async markAllAsRead() {
      const authStore = useAuthStore();
      const role = authStore.user?.role;

      if (!role) return;

      try {
        await $fetch('/api/notifications/mark-all-read', {
          method: 'PATCH',
          body: { role },
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });

        this.notifications.forEach(n => n.status = 'read');
        this.unreadCount = 0;
      } catch (error) {
        console.error('Failed to mark all notifications as read:', error);
      }
    },

    async deleteNotification(id: string) {
      const authStore = useAuthStore();
      const role = authStore.user?.role;

      if (!role) return;

      try {
        await $fetch(`/api/notifications/${id}`, {
          method: 'DELETE',
          query: { role },
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });

        this.notifications = this.notifications.filter(n => String(n.id) !== String(id));
        this.updateUnreadCount();
      } catch (error) {
        console.error('Failed to delete notification:', error);
      }
    },

    updateUnreadCount() {
      this.unreadCount = this.notifications.filter(n => n.status === 'unread').length;
    },

    startPolling() {
      if (this.refreshInterval) return;
      this.refreshInterval = setInterval(() => {
        this.fetchNotifications(1);
      }, 60000);
    },

    stopPolling() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
      }
    }
  }
});
