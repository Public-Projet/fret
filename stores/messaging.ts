import { defineStore } from 'pinia';
import type { Offer, Message, Conversation } from '~/types';
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
        c.participants.some(p => p.id === userId)
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
        .filter(c => c.participants.some(p => p.id === userId))
        .reduce((total, conv) => total + conv.unreadCount, 0);
    },
  },

  actions: {
    /**
     * Créer une nouvelle offre
     */
    async createOffer(offerData: Omit<Offer, 'id' | 'createdAt' | 'status'>) {
      this.loading = true;
      // Simulation d'un appel API
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
     * Mettre à jour une offre
     */
    async updateOffer(id: string, updates: Partial<Offer>) {
      this.loading = true;
      // Simulation d'un appel API
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
     * Accepter une offre
     */
    async acceptOffer(offerId: string) {
      return this.updateOffer(offerId, { status: 'accepted' });
    },

    /**
     * Rejeter une offre
     */
    async rejectOffer(offerId: string) {
      return this.updateOffer(offerId, { status: 'rejected' });
    },

    /**
     * Créer ou récupérer une conversation
     */
    async getOrCreateConversation(announcementId: string, participantIds: string[]) {
      this.loading = true;
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 300));

      // Chercher une conversation existante
      let conversation = this.conversations.find(c =>
        c.announcementId === announcementId &&
        c.participants.every(p => participantIds.includes(p.id))
      );

      if (!conversation) {
        // Créer une nouvelle conversation
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
     * Envoyer un message
     */
    async sendMessage(conversationId: string, senderId: string, content: string) {
      this.loading = true;
      // Simulation d'un appel API
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

      // Mettre à jour la conversation
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
     * Marquer les messages comme lus
     */
    async markAsRead(conversationId: string, userId: string) {
      this.loading = true;
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 200));

      // Marquer tous les messages de la conversation comme lus
      this.messages
        .filter(m => m.conversationId === conversationId && m.senderId !== userId)
        .forEach(m => m.read = true);

      // Réinitialiser le compteur de messages non lus
      const convIndex = this.conversations.findIndex(c => c.id === conversationId);
      if (convIndex !== -1) {
        this.conversations[convIndex].unreadCount = 0;
      }

      this.loading = false;
      return { success: true };
    },

    /**
     * Mettre à jour le statut d'une conversation
     */
    async updateConversationStatus(conversationId: string, status: Conversation['status']) {
      this.loading = true;
      // Simulation d'un appel API
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
