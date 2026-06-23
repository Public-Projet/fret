<template>
  <div v-if="show" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
    @click.self="$emit('close')">
    <div class="w-full max-w-md animate-in fade-in zoom-in duration-200">
      <div class="relative">
        <button @click="$emit('close')"
          class="absolute -top-12 right-0 text-white hover:text-secondary-400 transition-colors flex items-center text-xs font-black uppercase tracking-widest">
          Fermer
          <IconX class="ml-2 w-5 h-5" />
        </button>
        <ProfileRatingForm :targetId="target?.id" :targetRole="'carrier'" :initialData="target?.myReview"
          @success="$emit('success', $event)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconX } from '@tabler/icons-vue';

defineProps<{
  show: boolean;
  target: any;
}>();

defineEmits<{
  (e: 'close'): void;
  (e: 'success', data: { rating: number; reviewsCount: number; myReview: any }): void;
}>();
</script>
