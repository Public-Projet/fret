import { defineStore } from 'pinia';
import { useCmnAuthStore } from './cmnAuth';

export const useMessagingStore = defineStore('messaging', {
  state: () => ({
    conversations: [] as any[],
    messages: [] as any[],
    currentConversation: null as any | null,
    offers: [] as any[],
    loading: false,
  }),

  getters: {
    userConversations: (state) => (userId: string) => {
      return state.conversations;
    },
    conversationMessages: (state) => (conversationId: string) => {
      return state.messages.filter((m: any) => String(m.conversation) === String(conversationId));
    },
    unreadCount: (state) => () => {
      return state.conversations.reduce((total: number, conv: any) => total + (conv.unreadCount || 0), 0);
    },
    offersByCarrier: (state) => (carrierId: string) => {
      return state.offers.filter((o: any) => String(o.carrier?.id || o.carrier) === String(carrierId));
    },
    offersByAnnouncement: (state) => (announcementId: string) => {
      const idStr = String(announcementId);
      return state.offers.filter((o: any) => String(o.announcement?.id || o.announcement) === idStr);
    },
  },

  actions: {
    getApiBase() {
      const auth = useCmnAuthStore();
      const role = auth.userRole || 'public';
      return `/api/${role}/messaging`;
    },

    async fetchConversations() {
      this.loading = true;
      try {
        const token = useCookie('auth_token').value;
        const res = await $fetch<any[]>(`${this.getApiBase()}/conversations`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (Array.isArray(res)) {
          this.conversations = res;
        }
      } catch (e) {
        console.error('Failed to fetch conversations', e);
      } finally {
        this.loading = false;
      }
    },

    async fetchMessages(conversationId: string) {
      this.loading = true;
      try {
        const token = useCookie('auth_token').value;
        const res = await $fetch<any[]>(`${this.getApiBase()}/conversations/${conversationId}/messages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (Array.isArray(res)) {
          this.messages = [...this.messages.filter(m => String(m.conversation) !== String(conversationId)), ...res];
        }
      } catch (e) {
        console.error('Failed to fetch messages', e);
      } finally {
        this.loading = false;
      }
    },

    async sendMessage(conversationId: string, senderId: string, content: string) {
      this.loading = true;
      try {
        const auth = useCmnAuthStore();
        const token = useCookie('auth_token').value;
        const res = await $fetch<any>(`${this.getApiBase()}/conversations/${conversationId}/messages`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: {
            conversationId,
            senderRole: auth.userRole,
            content
          }
        });

        if (res && res.id) {
          this.messages.push(res);
          // Update conversation lastMessage
          const convIndex = this.conversations.findIndex(c => String(c.id) === String(conversationId));
          if (convIndex !== -1) {
            this.conversations[convIndex].lastMessage = res;
            this.conversations[convIndex].updatedAt = res.createdAt;
          }
        }
        return { success: true, message: res };
      } catch (e) {
        console.error('Failed to send message', e);
        return { success: false };
      } finally {
        this.loading = false;
      }
    },

    async markAsRead(conversationId: string, userId: string) {
      try {
        const token = useCookie('auth_token').value;
        await $fetch(`${this.getApiBase()}/conversations/${conversationId}/read`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });

        const convIndex = this.conversations.findIndex(c => String(c.id) === String(conversationId));
        if (convIndex !== -1) {
          this.conversations[convIndex].unreadCount = 0;
        }

        // local mark messages read
        this.messages
          .filter(m => String(m.conversation) === String(conversationId) && String(m.senderId) !== String(userId))
          .forEach(m => m.read = true);

      } catch (e) {
        console.error('Failed to mark read', e);
      }
    },


    async fetchCarrierOffers() {
      this.loading = true;
      try {
        const token = useCookie('auth_token').value;
        const res = await $fetch<any[]>(`/api/carrier/offers`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (Array.isArray(res)) {
          this.offers = res;
        }
      } catch (e) {
        console.error('Failed to fetch carrier offers', e);
      } finally {
        this.loading = false;
      }
    },

    async getOrCreateConversation(announcementId: string, participantIds: string[]) {
      // Mock implementation
      this.loading = true;
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true, conversation: { id: "mock-id" } };
      } finally {
        this.loading = false;
      }
    },
  }
});
