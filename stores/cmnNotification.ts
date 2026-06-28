import { defineStore } from 'pinia';
import type { Notification } from '~/types';
import { extractErrorMessage } from '~/utils/error';
import { useDesktopNotifications } from '~/composables/useDesktopNotifications';

export const useCmnNotificationStore = defineStore('cmnNotification', {
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
    // Liste de toutes les notifications
    async fetchUserNotifications(page = 1) {
      this.isLoading = true;
      const authStore = useCmnAuthStore();
      const role = authStore.user?.role;

      if (!role) {
        this.isLoading = false;
        return;
      }

      try {
        const response = await $fetch<any>('/api/common/notifications/list', {
          query: { role, page, limit: this.limit },
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });

        if (response?.notifications) {
          // Détecter les nouvelles notifications non lues pour les notifier en desktop
          if (page === 1 && this.notifications.length > 0) {
            const existingIds = new Set(this.notifications.map((n: Notification) => String(n.id)));
            const newUnread = (response.notifications as Notification[]).filter(
              (n: Notification) => !existingIds.has(String(n.id)) && n.status === 'unread'
            );
            if (newUnread.length > 0) {
              const { notifyNewPlatformNotification } = useDesktopNotifications();
              newUnread.forEach((n: Notification) => {
                notifyNewPlatformNotification(
                  n.title || 'Nouvelle notification',
                  n.content || '',
                  { tag: `bourse-fret-${n.id}` }
                );
              });
            }
          }

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
        return { success: false, error: extractErrorMessage(error) };
      } finally {
        this.isLoading = false;
      }
    },

    // Lire une notification utilisateur
    async getOneUserNotification(id: string) {
      const authStore = useCmnAuthStore();
      const role = authStore.user?.role;

      if (!role) return;

      try {
        const response = await $fetch<any>(`/api/common/notifications/mine`, {
          query: { role, id },
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
        return { success: false, error: extractErrorMessage(error) };
      }
    },

    // Marquer comme lu
    async markNotificationAsRead() {
      const authStore = useCmnAuthStore();
      const role = authStore.user?.role;

      if (!role) return;

      try {
        await $fetch('/api/common/notifications/mark-all-read', {
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
        return { success: false, error: extractErrorMessage(error) };
      }
    },

    // Supprimer les notifications
    async deleteUserNotification(id: string) {
      const authStore = useCmnAuthStore();
      const role = authStore.user?.role;

      if (!role) return;

      try {
        await $fetch(`/api/common/notifications/remove`, {
          method: 'DELETE',
          query: { role, id },
          headers: {
            'Authorization': `Bearer ${useCookie('auth_token').value}`,
          },
        });

        this.notifications = this.notifications.filter(n => String(n.id) !== String(id));
        this.updateUnreadCount();
      } catch (error) {
        console.error('Failed to delete notification:', error);
        return { success: false, error: extractErrorMessage(error) };
      }
    },

    updateUnreadCount() {
      this.unreadCount = this.notifications.filter(n => n.status === 'unread').length;
    },

    startPolling() {
      if (this.refreshInterval) return;
      this.refreshInterval = setInterval(() => {
        this.fetchUserNotifications(1);
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
