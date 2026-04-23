<template>
  <div class="container-custom py-8 h-[calc(100vh-4rem)]">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      <!-- Liste des conversations (masquée sur mobile si chat ouvert) -->
      <div class="hidden md:flex flex-col card overflow-hidden">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="font-bold text-gray-900 dark:text-white">Conversations</h2>
        </div>
        <div class="flex-1 overflow-y-auto">
          <div v-if="loading" class="p-4 space-y-4">
            <div v-for="i in 5" :key="i" class="animate-pulse">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
          <template v-else>
            <NuxtLink v-for="conversation in conversations" :key="conversation.id"
              :to="`/app/messages/${conversation.id}`"
              class="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700/50 last:border-0"
              :class="{ 'bg-primary-50 dark:bg-primary-900/10': isActive(conversation.id) }">
              <div class="flex justify-between items-start mb-1">
                <span class="font-semibold text-gray-900 dark:text-white truncate">
                  {{ getOtherParticipant(conversation)?.company || getOtherParticipant(conversation)?.firstName ||
                    getOtherParticipant(conversation)?.firstname || 'Utilisateur' }}
                </span>
                <span class="text-xs text-gray-500 whitespace-nowrap ml-2">
                  {{ formatDate(conversation.updatedAt) }}
                </span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 truncate">
                {{ conversation.lastMessage?.content || 'Nouvelle conversation' }}
              </p>
            </NuxtLink>
          </template>
        </div>
      </div>

      <!-- Zone de chat -->
      <div class="col-span-1 md:col-span-2 card flex flex-col h-full overflow-hidden">
        <!-- Header Chat -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <NuxtLink to="/app/messages" class="md:hidden mr-2">
              <IconArrowLeft class="w-6 h-6 text-gray-500" />
            </NuxtLink>
            <div
              class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
              {{ (otherParticipant?.firstName || otherParticipant?.firstname || 'U')[0].toUpperCase() }}
            </div>
            <div>
              <h2 class="font-bold text-gray-900 dark:text-white">
                {{ otherParticipant?.company || otherParticipant?.firstName || otherParticipant?.firstname ||
                  'Utilisateur' }}
              </h2>
              <p class="text-xs text-gray-500">
                {{ otherParticipant?.role === 'shipper' ? 'Expéditeur' : 'Transporteur' }}
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <NuxtLink v-if="currentConversation?.announcementId"
              :to="`/annonces/${currentConversation.announcementId}?type=avail`" class="btn btn-ghost btn-sm">
              Voir l'annonce
            </NuxtLink>
          </div>
        </div>

        <!-- Messages -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50" ref="messagesContainer">
          <div v-if="loading" class="space-y-4">
            <div v-for="i in 4" :key="i" class="flex flex-col" :class="i % 2 === 0 ? 'items-end' : 'items-start'">
              <div class="animate-pulse w-2/3 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            </div>
          </div>
          <template v-else>
            <div v-for="message in messages" :key="message.id" class="flex flex-col mb-4"
              :class="String(message.senderRole) === String(currentUser?.role) ? 'items-end' : 'items-start'">

              <div class="max-w-[85%] md:max-w-[70%] flex flex-col"
                :class="String(message.senderRole) === String(currentUser?.role) ? 'items-end' : 'items-start'">

                <div class="rounded-2xl px-4 py-3 shadow-sm relative"
                  :class="String(message.senderRole) === String(currentUser?.role)
                    ? 'bg-primary-600 text-white rounded-br-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm border border-gray-100 dark:border-gray-700'">

                  <p v-if="message.content" class="text-sm whitespace-pre-wrap break-words leading-relaxed">
                    {{ message.content }}
                  </p>

                  <div v-if="message.isCounterOffer && message.counterOfferData"
                    class="mt-2 p-3 rounded-xl bg-opacity-10 w-full min-w-[200px]"
                    :class="String(message.senderRole) === String(currentUser?.role) ? 'bg-black/20' : 'bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800'">
                    <div class="flex items-center gap-2 mb-2">
                      <IconReceipt2 class="w-4 h-4"
                        :class="String(message.senderRole) === String(currentUser?.role) ? 'text-primary-100' : 'text-primary-600 dark:text-primary-400'" />
                      <span class="text-xs font-bold uppercase tracking-wider"
                        :class="String(message.senderRole) === String(currentUser?.role) ? 'text-primary-100' : 'text-primary-600 dark:text-primary-400'">
                        Contre-proposition
                      </span>
                    </div>

                    <div class="space-y-1">
                      <div class="flex justify-between items-center text-sm font-semibold">
                        <span>Nouveau Prix</span>
                        <span>{{ formatPrice(message.counterOfferData.price) }}</span>
                      </div>
                    </div>
                  </div>

                </div>

                <div class="text-[11px] text-gray-500 mt-1 flex items-center space-x-1"
                  :class="String(message.senderRole) === String(currentUser?.role) ? 'justify-end' : 'justify-start'">
                  <span>{{ formatTime(message.createdAt) }}</span>
                  <IconCheck v-if="String(message.senderRole) === String(currentUser?.role)" class="w-3.5 h-3.5"
                    :class="message.read ? 'text-primary-500' : 'text-gray-400'" />
                </div>

              </div>
            </div>
          </template>
        </div>

        <!-- Input -->
        <div class="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <form @submit.prevent="sendMessage" class="flex space-x-2">
            <input v-model="newMessage" type="text" placeholder="Écrivez votre message..." class="input flex-1"
              :disabled="sending" />
            <button type="submit" class="btn btn-primary p-2 rounded-full w-10 h-10 flex items-center justify-center"
              :disabled="!newMessage.trim() || sending">
              <IconSend class="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useCmnMessagingStore } from '~/stores/cmnMessaging';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import type { Conversation } from '~/types';
import { IconArrowLeft, IconSend, IconReceipt2, IconCheck } from '@tabler/icons-vue';

const route = useRoute();
const messagingStore = useCmnMessagingStore();
const authStore = useCmnAuthStore();

const conversationId = route.params.id as string;
const messagesContainer = ref<HTMLElement | null>(null);
const newMessage = ref('');
const sending = ref(false);
const loading = ref(true);

const currentUser = computed(() => authStore.currentUser);
const conversations = computed(() =>
  currentUser.value ? messagingStore.conversations : []
);
const currentConversation = computed(() =>
  conversations.value.find(c => String(c.id) === String(conversationId))
);
const messages = computed(() => messagingStore.conversationMessages(conversationId));

const otherParticipant = computed(() => {
  if (!currentConversation.value || !currentUser.value) return null;
  return currentConversation.value.participants.find((p: any) => p.role !== currentUser.value!.role);
});

const isActive = (id: string | number) => String(id) === String(conversationId);

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

const formatPrice = (price?: number | string) => {
  if (!price) return '0 FCFA';
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0
  }).format(numPrice);
};

const getOtherParticipant = (conversation: Conversation) => {
  return conversation.participants.find((p: any) => p.role !== currentUser.value?.role);
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
    await messagingStore.sendUserMessage(conversationId, newMessage.value);
    newMessage.value = '';
    scrollToBottom();
  } finally {
    sending.value = false;
  }
};

onMounted(async () => {
  if (currentUser.value) {
    loading.value = true;
    await Promise.all([
      messagingStore.fetchUserConversations(),
      messagingStore.fetchUserMessages(conversationId)
    ]);
    messagingStore.readUserMessage(conversationId);
    loading.value = false;
  } else {
    loading.value = false;
  }
  scrollToBottom();
});

watch(messages, () => {
  scrollToBottom();
});
useHead({
  title: 'Conversation',
  meta: [
    { name: 'description', content: 'Gérez votre conversation en cours sur Bourse de Fret.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
