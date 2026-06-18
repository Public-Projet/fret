<template>
  <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Mis à jour le {{ formattedDate }}
      </p>
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-500 dark:text-gray-400">Cet article vous a-t-il été utile ?</span>
        <button
          @click="handleRate('like')"
          :class="[
            'p-2 rounded-lg flex items-center gap-2 transition-colors',
            article?.hasLiked ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-600'
          ]"
        >
          <IconThumbUp class="w-5 h-5" :class="{ 'fill-current': article?.hasLiked }" />
          <span class="text-sm font-medium" v-if="article?.likesCount">{{ article.likesCount }}</span>
        </button>
        <button
          @click="handleRate('dislike')"
          :class="[
            'p-2 rounded-lg flex items-center gap-2 transition-colors',
            article?.hasDisliked ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600'
          ]"
        >
          <IconThumbDown class="w-5 h-5" :class="{ 'fill-current': article?.hasDisliked }" />
          <span class="text-sm font-medium" v-if="article?.dislikesCount">{{ article.dislikesCount }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IconThumbUp, IconThumbDown } from '@tabler/icons-vue';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import { useToast } from 'vue-toastification';
import type { HelpArticle } from '~/types';

const props = defineProps<{
  updatedAt: string;
  article: HelpArticle;
}>();

const emit = defineEmits<{
  (e: 'rate', value: 'like' | 'dislike'): void;
}>();

const authStore = useCmnAuthStore();
const toast = useToast();

const formattedDate = computed(() => {
  const date = new Date(props.updatedAt);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
});

const handleRate = (action: 'like' | 'dislike') => {
  if (!authStore.isAuthenticated) {
    toast.warning("Vous devez être connecté pour donner votre avis.");
    return;
  }
  emit('rate', action);
};
</script>
