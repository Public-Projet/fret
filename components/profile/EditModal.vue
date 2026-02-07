<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="!error && !loading && $emit('close')"></div>
        <div
          class="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
          <button @click="$emit('close')"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <IconX class="w-5 h-5" />
          </button>
          <div class="text-center mb-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Modifier mon profil</h3>
          </div>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="label">Prénom</label>
                <input type="text" v-model="form.firstname" class="input" placeholder="Prénom" />
              </div>
              <div>
                <label class="label">Nom</label>
                <input type="text" v-model="form.lastname" class="input" placeholder="Nom" />
              </div>
            </div>
            <div>
              <label class="label">Téléphone</label>
              <input type="tel" v-model="form.phone" class="input" placeholder="+229 01 XX XX XX XX" />
            </div>
            <div>
              <label class="label">Biographie</label>
              <textarea v-model="form.bio" class="input" rows="3" placeholder="Décrivez votre activité..."></textarea>
            </div>
            <div v-if="error"
              class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p class="text-red-600 dark:text-red-400 text-sm text-center">{{ error }}</p>
            </div>
            <div v-if="success"
              class="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <p class="text-green-600 dark:text-green-400 text-sm text-center">{{ success }}</p>
            </div>
            <button type="submit"
              :class="['justify-center flex items-center w-full btn border-0 shadow-lg text-white', accentClass]"
              :disabled="loading">
              <IconLoader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
              <IconCheck v-else class="w-4 h-4 mr-2" />
              Enregistrer
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue';
import { IconX, IconLoader2, IconCheck } from '@tabler/icons-vue';
import type { UserProfile } from '~/stores/profile';

const props = defineProps<{
  show: boolean;
  profile: UserProfile | null;
  loading?: boolean;
  error?: string;
  success?: string;
  accentColor?: 'primary' | 'secondary';
}>();

const emit = defineEmits<{
  close: [];
  submit: [data: { firstname: string; lastname: string; phone: string; bio: string }];
}>();

const form = reactive({
  firstname: '',
  lastname: '',
  phone: '',
  bio: ''
});

const accentClass = computed(() => {
  return props.accentColor === 'secondary'
    ? 'bg-secondary-600 hover:bg-secondary-700'
    : 'bg-primary-600 hover:bg-primary-700';
});

// Sync form with profile when modal opens
watch(() => props.show, (isOpen) => {
  if (isOpen && props.profile) {
    form.firstname = props.profile.firstname || '';
    form.lastname = props.profile.lastname || '';
    form.phone = props.profile.phone || '';
    form.bio = props.profile.bio || '';
  }
}, { immediate: true });

const handleSubmit = () => {
  emit('submit', { ...form });
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
