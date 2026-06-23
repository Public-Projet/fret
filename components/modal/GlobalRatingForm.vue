<template>
  <UiBaseModal :show="show" :title="modalTitle" max-width="md" @close="$emit('close')">
    <!-- Success state -->
    <div v-if="success" class="text-center py-6">
      <div
        class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <IconCheck class="w-8 h-8 text-green-600 dark:text-green-400" />
      </div>
      <p class="text-lg font-bold text-gray-900 dark:text-white mb-2">Merci pour votre avis !</p>
      <p class="text-sm text-gray-500">Votre note a été enregistrée avec succès.</p>
      <button @click="resetForm" class="btn btn-ghost btn-sm mt-4">
        Laisser une autre note
      </button>
    </div>

    <!-- Form state -->
    <div v-else class="space-y-6 py-2">
      <!-- Star Rating -->
      <div class="flex flex-col items-center">
        <div class="flex space-x-2 mb-2">
          <button v-for="i in 5" :key="i" @click="score = i"
            class="focus:outline-none transition-all hover:scale-125 duration-200"
            :class="{ 'scale-110': score === i }">
            <IconStarFilled v-if="i <= score" class="w-10 h-10 text-yellow-500" />
            <IconStar v-else class="w-10 h-10 text-gray-300 hover:text-yellow-200" />
          </button>
        </div>
        <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">
          {{ scoreLabels[score] || 'Sélectionnez une note' }}
        </p>
      </div>

      <!-- Comment -->
      <div class="space-y-2">
        <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Commentaire (optionnel)</label>
        <textarea v-model="comment" rows="3" class="input resize-none text-sm placeholder:italic"
          placeholder="Partagez votre expérience avec cet utilisateur..."></textarea>
      </div>

      <!-- Submit button -->
      <button @click="handleSubmit" :disabled="loading || score === 0"
        class="btn btn-secondary w-full group overflow-hidden relative">
        <span class="relative z-10 flex items-center justify-center">
          <IconLoader2 v-if="loading" class="w-5 h-5 animate-spin mr-2" />
          <IconSend v-else
            class="w-5 h-5 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          {{ loading ? 'Envoi en cours...' : submitButtonText }}
        </span>
      </button>

      <p v-if="error"
        class="text-xs text-red-500 text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/10">
        {{ error }}
      </p>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useCmnUserStore } from '~/stores/cmnUser';
import { IconStarFilled, IconStar, IconCheck, IconLoader2, IconSend } from '@tabler/icons-vue';

const props = defineProps<{
  show: boolean;
  targetId: string;
  targetRole: 'carrier' | 'shipper';
  title?: string;
  initialData?: { score: number, comment?: string } | null;
}>();

const emit = defineEmits<{
  'close': [];
  'success': [result: { rating: number, reviewsCount: number, myReview: { score: number, comment: string } }];
}>();

const userStore = useCmnUserStore();
const score = ref(props.initialData?.score || 0);
const comment = ref(props.initialData?.comment || '');
const loading = ref(false);
const error = ref('');
const success = ref(false);

const modalTitle = computed(() =>
  props.title || (props.initialData ? 'Modifier ma note' : (props.targetRole === 'carrier' ? 'Noter ce transporteur' : 'Noter cet expéditeur'))
);
const submitButtonText = computed(() => props.initialData ? 'Modifier ma note' : 'Envoyer mon avis');

const scoreLabels: Record<number, string> = {
  1: 'Très médiocre',
  2: 'Moyen',
  3: 'Bon',
  4: 'Très bon',
  5: 'Excellent'
};

// Reset form when modal opens with new data
watch(() => props.show, (val) => {
  if (val) {
    score.value = props.initialData?.score || 0;
    comment.value = props.initialData?.comment || '';
    error.value = '';
    success.value = false;
  }
});

const resetForm = () => {
  success.value = false;
  score.value = 0;
  comment.value = '';
};

const handleSubmit = async () => {
  if (score.value === 0) {
    error.value = "Veuillez sélectionner une note.";
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const result = props.targetRole === 'carrier'
      ? await userStore.rateCarrier(props.targetId, score.value, comment.value)
      : await userStore.rateShipper(props.targetId, score.value, comment.value);

    if (result.success && result.data) {
      success.value = true;
      emit('success', {
        ...result.data,
        myReview: { score: score.value, comment: comment.value }
      });
    } else {
      error.value = result.error || "Une erreur est survenue lors de l'envoi de la note.";
    }
  } catch (err) {
    error.value = "Erreur technique lors de l'envoi de la note.";
  } finally {
    loading.value = false;
  }
};
</script>
