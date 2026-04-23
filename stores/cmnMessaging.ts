import { defineStore } from 'pinia';
import { useCmnAuthStore } from './cmnAuth';

export const useCmnMessagingStore = defineStore('cmnMessaging', {
  state: () => ({
    conversations: [] as any[],
    messages: [] as any[],
    currentConversation: null as any | null,
    offers: [] as any[],
    loading: false,
  }),

  getters: {
    unreadCount: (state) => {
      return state.conversations.reduce((total: number, conv: any) => total + (conv.unreadCount || 0), 0);
    },
    conversationMessages: (state) => (conversationId: string) => {
      return state.messages.filter((m: any) => String(m.conversation || m.conversationId) === String(conversationId));
    },
    offersByCarrier: (state) => (carrierId: string) => {
      return state.offers.filter((o: any) => String(o.carrier?.id || o.carrier || o.carrierId) === String(carrierId));
    },
    offersByAnnouncement: (state) => (announcementId: string) => {
      return state.offers.filter((o: any) => String(o.announcement?.id || o.announcement || o.announcementId) === String(announcementId));
    },
  },

  actions: {
    // Lister les convsersations des utilsiateurs
    async fetchUserConversations() {
      this.loading = true;
      const auth = useCmnAuthStore();
      const role = auth.userRole;

      if (!role) {
        this.loading = false;
        return;
      }

      try {
        const res = await $fetch<any[]>('/api/common/messaging/conversations', {
          query: { role },
          headers: { Authorization: `Bearer ${useCookie('auth_token').value}` }
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

    // Lister les messages d'une conversation
    async fetchUserMessages(conversationId: string) {
      this.loading = true;
      const auth = useCmnAuthStore();
      const role = auth.userRole;

      if (!role) {
        this.loading = false;
        return;
      }

      try {
        const res = await $fetch<any[]>('/api/common/messaging/messages', {
          query: { role, id: conversationId },
          headers: { Authorization: `Bearer ${useCookie('auth_token').value}` }
        });
        if (Array.isArray(res)) {
          this.messages = [...this.messages.filter(m => String(m.conversation || m.conversationId) !== String(conversationId)), ...res];
        }
      } catch (e) {
        console.error('Failed to fetch messages', e);
      } finally {
        this.loading = false;
      }
    },

    // Envoyer un message
    async sendUserMessage(conversationId: string, content: string) {
      this.loading = true;
      const auth = useCmnAuthStore();
      const role = auth.userRole;

      if (!role) {
        this.loading = false;
        return { success: false };
      }

      try {
        const res = await $fetch<any>('/api/common/messaging/send', {
          method: 'POST',
          body: {
            conversationId,
            role,
            content
          },
          headers: { Authorization: `Bearer ${useCookie('auth_token').value}` }
        });

        if (res && res.id) {
          this.messages.push(res);
          // Sync conversation lastMessage
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

    // Lire un message
    async readUserMessage(conversationId: string) {
      const auth = useCmnAuthStore();
      const role = auth.userRole;

      if (!role) return;

      try {
        await $fetch('/api/common/messaging/read', {
          method: 'POST',
          body: { id: conversationId, role },
          headers: { Authorization: `Bearer ${useCookie('auth_token').value}` }
        });

        const convIndex = this.conversations.findIndex(c => String(c.id) === String(conversationId));
        if (convIndex !== -1) {
          this.conversations[convIndex].unreadCount = 0;
        }

        // Local mark as read
        const userId = auth.user?.id;
        this.messages
          .filter(m => String(m.conversation || m.conversationId) === String(conversationId) && String(m.senderId) !== String(userId))
          .forEach(m => m.read = true);

      } catch (e) {
        console.error('Failed to mark read', e);
      }
    },

    // Créer ou obtenir une conversation (Mock)
    async getOrCreateUserConversation(announcementId: string, participantIds: string[]) {
      this.loading = true;
      try {
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Pour l'instant on retourne un mock ID
        const mockConversation = {
          id: "mock-id-" + Date.now(),
          announcementId,
          lastMessage: null,
          unreadCount: 0,
          updatedAt: new Date().toISOString()
        };

        if (!this.conversations.find(c => String(c.id) === String(mockConversation.id))) {
          this.conversations.unshift(mockConversation);
        }
        
        return { success: true, conversation: mockConversation };
      } finally {
        this.loading = false;
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
  },
});
