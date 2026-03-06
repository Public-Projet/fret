import { defineStore } from 'pinia';
import type { Offer, Message, Conversation, User } from '~/types';
import { mockOffers, mockMessages, mockConversations } from '~/data/mock';

interface MessagingState {
  offers: Offer[];
  conversations: Conversation[];
  messages: Message[];
  currentConversation: Conversation | null;
  loading: boolean;
}

export const useMessagingStore = defineStore('messaging', {
  state: (): MessagingState => ({
    offers: [...mockOffers],
    conversations: [...mockConversations],
    messages: [...mockMessages],
    currentConversation: null,
    loading: false,
  }),

  getters: {
    /**
     * Récupérer toutes les offres
     */
    allOffers: (state) => state.offers,

    /**
     * Récupérer les offres pour une annonce
     */
    offersByAnnouncement: (state) => (announcementId: string) => {
      return state.offers.filter(o => o.announcementId === announcementId);
    },

    /**
     * Récupérer les offres d'un transporteur
     */
    offersByCarrier: (state) => (carrierId: string) => {
      return state.offers.filter(o => o.carrierId === carrierId);
    },

    /**
     * Récupérer toutes les conversations
     */
    allConversations: (state) => state.conversations,

    /**
     * Récupérer les conversations d'un utilisateur
     */
    userConversations: (state) => (userId: string) => {
      return state.conversations.filter(c =>
        c.participants.some((p: User) => p.id === userId)
      );
    },

    /**
     * Récupérer les messages d'une conversation
     */
    conversationMessages: (state) => (conversationId: string) => {
      return state.messages
        .filter(m => m.conversationId === conversationId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    },

    /**
     * Compter les messages non lus
     */
    unreadCount: (state) => (userId: string) => {
      return state.conversations
        .filter(c => c.participants.some((p: User) => p.id === userId))
        .reduce((total, conv) => total + conv.unreadCount, 0);
    },
  },

  actions: {
    /**
     * Créer une nouvelle offre (mock)
     */
    async createOffer(offerData: Omit<Offer, 'id' | 'createdAt' | 'status'>) {
      this.loading = true;
      await new Promise(resolve => setTimeout(resolve, 500));

      const newOffer: Offer = {
        ...offerData,
        id: `offer-${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      this.offers.push(newOffer);
      this.loading = false;

      return { success: true, offer: newOffer };
    },

    /**
     * Mettre à jour une offre (mock)
     */
    async updateOffer(id: string, updates: Partial<Offer>) {
      this.loading = true;
      await new Promise(resolve => setTimeout(resolve, 500));

      const index = this.offers.findIndex(o => o.id === id);
      if (index !== -1) {
        this.offers[index] = { ...this.offers[index], ...updates };
        this.loading = false;
        return { success: true, offer: this.offers[index] };
      }

      this.loading = false;
      return { success: false, error: 'Offre non trouvée' };
    },

    /**
     * Charger les offres pour une annonce (Shipper) — via server API
     */
    async fetchOffersForAnnouncement(announcementId: string) {
      this.loading = true;
      try {
        const response = await $fetch<any[]>(`/api/messaging/offers/${announcementId}`);
        if (Array.isArray(response)) {
          const otherOffers = this.offers.filter(o => o.announcementId !== announcementId);
          this.offers = [...otherOffers, ...response.map(o => ({
            ...o,
            announcementId: o.announcement
          }))];
        }
      } catch (error) {
        console.error('Erreur chargement offres:', error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Accepter une offre — via server API
     */
    async acceptOffer(offerId: string) {
      this.loading = true;
      try {
        await $fetch(`/api/messaging/offers/${offerId}/accept`, { method: 'POST' });
        const index = this.offers.findIndex(o => o.id === offerId);
        if (index !== -1) this.offers[index].status = 'accepted';
        return { success: true };
      } catch (error) {
        console.error('Erreur acceptation offre:', error);
        return { success: false, error };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Créer ou récupérer une conversation (mock)
     */
    async getOrCreateConversation(announcementId: string, participantIds: string[]) {
      this.loading = true;
      await new Promise(resolve => setTimeout(resolve, 300));

      let conversation = this.conversations.find(c =>
        c.announcementId === announcementId &&
        c.participants.every((p: User) => participantIds.includes(p.id))
      );

      if (!conversation) {
        const { mockUsers } = await import('~/data/mock');
        const participants = mockUsers.filter(u => participantIds.includes(u.id));

        conversation = {
          id: `conv-${Date.now()}`,
          announcementId,
          participants,
          unreadCount: 0,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        this.conversations.push(conversation);
      }

      this.currentConversation = conversation;
      this.loading = false;

      return { success: true, conversation };
    },

    /**
     * Envoyer un message (mock)
     */
    async sendMessage(conversationId: string, senderId: string, content: string) {
      this.loading = true;
      await new Promise(resolve => setTimeout(resolve, 300));

      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        conversationId,
        senderId,
        content,
        read: false,
        createdAt: new Date().toISOString(),
      };

      this.messages.push(newMessage);

      const convIndex = this.conversations.findIndex(c => c.id === conversationId);
      if (convIndex !== -1) {
        this.conversations[convIndex].lastMessage = newMessage;
        this.conversations[convIndex].updatedAt = new Date().toISOString();
        this.conversations[convIndex].unreadCount += 1;
      }

      this.loading = false;
      return { success: true, message: newMessage };
    },

    /**
     * Marquer les messages comme lus (mock)
     */
    async markAsRead(conversationId: string, userId: string) {
      this.loading = true;
      await new Promise(resolve => setTimeout(resolve, 200));

      this.messages
        .filter(m => m.conversationId === conversationId && m.senderId !== userId)
        .forEach(m => m.read = true);

      const convIndex = this.conversations.findIndex(c => c.id === conversationId);
      if (convIndex !== -1) {
        this.conversations[convIndex].unreadCount = 0;
      }

      this.loading = false;
      return { success: true };
    },

    /**
     * Mettre à jour le statut d'une conversation (mock)
     */
    async updateConversationStatus(conversationId: string, status: Conversation['status']) {
      this.loading = true;
      await new Promise(resolve => setTimeout(resolve, 300));

      const index = this.conversations.findIndex(c => c.id === conversationId);
      if (index !== -1) {
        this.conversations[index].status = status;
        this.conversations[index].updatedAt = new Date().toISOString();
        this.loading = false;
        return { success: true, conversation: this.conversations[index] };
      }

      this.loading = false;
      return { success: false, error: 'Conversation non trouvée' };
    },
  },
});
