<template>
  <div class="container-custom py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Messagerie</h1>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      <!-- Liste des conversations -->
      <div class="card overflow-hidden flex flex-col">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <input type="text" placeholder="Rechercher..." class="input" />
        </div>
        <div class="flex-1 overflow-y-auto">
          <div v-if="loading" class="p-4 space-y-4">
            <div v-for="i in 5" :key="i" class="animate-pulse flex space-x-4">
              <div class="flex-1 space-y-3 py-1">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div class="space-y-2">
                  <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="conversations.length === 0" class="p-4 text-center text-gray-500">
            Aucune conversation
          </div>
          <div v-else>
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
          <IconMessage class="w-16 h-16 mx-auto mb-4" />
          <p class="text-lg">Sélectionnez une conversation pour commencer à discuter</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useMessagingStore } from '~/stores/messaging';
import { useAuthStore } from '~/stores/auth';
import type { Conversation } from '~/types';
import { IconMessage, IconPlus } from '@tabler/icons-vue';

const messagingStore = useMessagingStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const loading = ref(true);

const currentUser = computed(() => authStore.currentUser);
const conversations = computed(() =>
  currentUser.value ? messagingStore.userConversations(currentUser.value.id) : []
);

const isActive = (id: string) => route.params.id === id;

const getOtherParticipant = (conversation: Conversation) => {
  return conversation.participants.find(p => p.role !== currentUser.value?.role);
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

onMounted(async () => {
  if (currentUser.value) {
    loading.value = true;
    await messagingStore.fetchConversations();
    loading.value = false;
  } else {
    loading.value = false;
  }
});
useHead({
  title: 'Messagerie',
  meta: [
    { name: 'description', content: 'Accédez à toutes vos conversations sur Bourse de Fret.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
