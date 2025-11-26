<template>
  <div class="container-custom py-8">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Messagerie</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      <!-- Liste des conversations -->
      <div class="card overflow-hidden flex flex-col">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <input type="text" placeholder="Rechercher..." class="input" />
        </div>
        <div class="flex-1 overflow-y-auto">
          <div v-if="conversations.length === 0" class="p-4 text-center text-gray-500">
            Aucune conversation
          </div>
          <div v-else>
            <NuxtLink 
              v-for="conversation in conversations" 
              :key="conversation.id"
              :to="`/messages/${conversation.id}`"
              class="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700/50 last:border-0"
              :class="{ 'bg-primary-50 dark:bg-primary-900/10': isActive(conversation.id) }"
            >
              <div class="flex justify-between items-start mb-1">
                <span class="font-semibold text-gray-900 dark:text-white truncate">
                  {{ getOtherParticipant(conversation)?.company || getOtherParticipant(conversation)?.firstName }}
                </span>
                <span class="text-xs text-gray-500 whitespace-nowrap ml-2">
                  {{ formatDate(conversation.updatedAt) }}
                </span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 truncate">
                {{ conversation.lastMessage?.content || 'Nouvelle conversation' }}
              </p>
              <div v-if="conversation.unreadCount > 0" class="mt-2">
                <span class="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {{ conversation.unreadCount }} non lu(s)
                </span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Zone de chat (placeholder pour desktop) -->
      <div class="hidden md:flex col-span-2 card items-center justify-center text-gray-400">
        <div class="text-center">
          <ChatBubbleLeftRightIcon class="w-16 h-16 mx-auto mb-4" />
          <p class="text-lg">Sélectionnez une conversation pour commencer à discuter</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ChatBubbleLeftRightIcon } from '@heroicons/vue/24/outline';
import { useMessagingStore } from '~/stores/messaging';
import { useAuthStore } from '~/stores/auth';
import type { Conversation } from '~/types';

definePageMeta({
  middleware: ['auth']
});

const messagingStore = useMessagingStore();
const authStore = useAuthStore();
const route = useRoute();

const currentUser = computed(() => authStore.currentUser);
const conversations = computed(() => 
  currentUser.value ? messagingStore.userConversations(currentUser.value.id) : []
);

const isActive = (id: string) => route.params.id === id;

const getOtherParticipant = (conversation: Conversation) => {
  return conversation.participants.find(p => p.id !== currentUser.value?.id);
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};
</script>
