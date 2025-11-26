<template>
  <div class="container-custom py-8 h-[calc(100vh-4rem)]">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      <!-- Liste des conversations (masquée sur mobile si chat ouvert) -->
      <div class="hidden md:flex flex-col card overflow-hidden">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="font-bold text-gray-900 dark:text-white">Conversations</h2>
        </div>
        <div class="flex-1 overflow-y-auto">
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
          </NuxtLink>
        </div>
      </div>

      <!-- Zone de chat -->
      <div class="col-span-1 md:col-span-2 card flex flex-col h-full overflow-hidden">
        <!-- Header Chat -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <NuxtLink to="/messages" class="md:hidden mr-2">
              <ArrowLeftIcon class="w-6 h-6 text-gray-500" />
            </NuxtLink>
            <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
              {{ otherParticipant?.firstName[0] }}
            </div>
            <div>
              <h2 class="font-bold text-gray-900 dark:text-white">
                {{ otherParticipant?.company || otherParticipant?.firstName }}
              </h2>
              <p class="text-xs text-gray-500">
                En ligne
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <NuxtLink v-if="currentConversation?.announcementId" :to="`/announcements/${currentConversation.announcementId}`" class="btn btn-ghost btn-sm">
              Voir l'annonce
            </NuxtLink>
          </div>
        </div>

        <!-- Messages -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50" ref="messagesContainer">
          <div 
            v-for="message in messages" 
            :key="message.id" 
            class="flex"
            :class="message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'"
          >
            <div 
              class="max-w-[75%] rounded-lg p-3 shadow-sm"
              :class="message.senderId === currentUser?.id 
                ? 'bg-primary-600 text-white rounded-br-none' 
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none'"
            >
              <p>{{ message.content }}</p>
              <p 
                class="text-xs mt-1 text-right"
                :class="message.senderId === currentUser?.id ? 'text-primary-100' : 'text-gray-400'"
              >
                {{ formatTime(message.createdAt) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <form @submit.prevent="sendMessage" class="flex space-x-2">
            <input 
              v-model="newMessage" 
              type="text" 
              placeholder="Écrivez votre message..." 
              class="input flex-1"
              :disabled="sending"
            />
            <button 
              type="submit" 
              class="btn btn-primary p-2 rounded-full w-10 h-10 flex items-center justify-center"
              :disabled="!newMessage.trim() || sending"
            >
              <PaperAirplaneIcon class="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { ArrowLeftIcon, PaperAirplaneIcon } from '@heroicons/vue/24/outline';
import { useMessagingStore } from '~/stores/messaging';
import { useAuthStore } from '~/stores/auth';
import type { Conversation } from '~/types';

definePageMeta({
  middleware: ['auth']
});

const route = useRoute();
const messagingStore = useMessagingStore();
const authStore = useAuthStore();

const conversationId = route.params.id as string;
const messagesContainer = ref<HTMLElement | null>(null);
const newMessage = ref('');
const sending = ref(false);

const currentUser = computed(() => authStore.currentUser);
const conversations = computed(() => 
  currentUser.value ? messagingStore.userConversations(currentUser.value.id) : []
);
const currentConversation = computed(() => 
  conversations.value.find(c => c.id === conversationId)
);
const messages = computed(() => messagingStore.conversationMessages(conversationId));

const otherParticipant = computed(() => {
  if (!currentConversation.value || !currentUser.value) return null;
  return currentConversation.value.participants.find(p => p.id !== currentUser.value!.id);
});

const isActive = (id: string) => id === conversationId;

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

const getOtherParticipant = (conversation: Conversation) => {
  return conversation.participants.find(p => p.id !== currentUser.value?.id);
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || !currentUser.value) return;
  
  sending.value = true;
  try {
    await messagingStore.sendMessage(conversationId, currentUser.value.id, newMessage.value);
    newMessage.value = '';
    scrollToBottom();
  } finally {
    sending.value = false;
  }
};

onMounted(() => {
  if (currentUser.value) {
    messagingStore.markAsRead(conversationId, currentUser.value.id);
  }
  scrollToBottom();
});

watch(messages, () => {
  scrollToBottom();
});
</script>
