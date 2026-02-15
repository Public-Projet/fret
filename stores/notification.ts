import { defineStore } from 'pinia';

export interface Notification {
  id: string;
  title: string;
  content: string;
  status: 'read' | 'unread';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: number;
  metadata?: any;
}

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
      const api = useAPI();
      const authStore = useAuthStore();
      const role = authStore.user?.role;
      const baseUrl = role === 'shipper' ? '/shipper/notifications' : '/carrier/notifications';
      const endpoint = `${baseUrl}?page=${page}&limit=${this.limit}`;

      try {
        const response = await api.get<any>(endpoint);
        if (response.success && response.data) {
          if (page === 1) {
            this.notifications = response.data.notifications;
          } else {
            this.notifications = [...this.notifications, ...response.data.notifications];
          }
          this.total = response.data.meta.total;
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
      const api = useAPI();
      const authStore = useAuthStore();
      const role = authStore.user?.role;
      const endpoint = role === 'shipper' ? `/shipper/notifications/${id}` : `/carrier/notifications/${id}`;

      try {
        const response = await api.get<any>(endpoint);
        if (response.success && response.data && response.data.notification) {
          const notificationData = response.data.notification;
          const index = this.notifications.findIndex(n => String(n.id) === String(id));
          if (index !== -1) {
            this.notifications[index] = notificationData;
          } else {
            this.notifications.push(notificationData);
          }
          this.updateUnreadCount();
        }
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    },

    async markAllAsRead() {
      const api = useAPI();
      const authStore = useAuthStore();
      const role = authStore.user?.role;
      const endpoint = role === 'shipper' ? '/shipper/notifications/mark-all-read' : '/carrier/notifications/mark-all-read';

      try {
        const response = await api.patch<any>(endpoint);
        if (response.success) {
          this.notifications.forEach(n => n.status = 'read');
          this.unreadCount = 0;
        }
      } catch (error) {
        console.error('Failed to mark all notifications as read:', error);
      }
    },

    async deleteNotification(id: string) {
      const api = useAPI();
      const authStore = useAuthStore();
      const role = authStore.user?.role;
      const endpoint = role === 'shipper' ? `/shipper/notifications/${id}` : `/carrier/notifications/${id}`;

      try {
        const response = await api.del<any>(endpoint);
        if (response.success) {
          this.notifications = this.notifications.filter(n => String(n.id) !== String(id));
          this.updateUnreadCount();
        }
      } catch (error) {
        console.error('Failed to delete notification:', error);
      }
    },

    updateUnreadCount() {
      this.unreadCount = this.notifications.filter(n => n.status === 'unread').length;
    },

    startPolling() {
      if (this.refreshInterval) return;
      // Fetch every 60 seconds
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
