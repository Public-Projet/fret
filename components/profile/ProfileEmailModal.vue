<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>
        <div class="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 space-y-6">
          <button @click="$emit('close')"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <IconX class="w-5 h-5" />
          </button>
          <div class="text-center">
            <div :class="['w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center', iconBgClass]">
              <IconMail :class="['w-7 h-7', iconColorClass]" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Modifier l'adresse email</h3>
          </div>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="label">Email actuel</label>
              <input type="email" :value="currentEmail" class="input bg-gray-100 dark:bg-gray-800" disabled />
            </div>
            <div>
              <label class="label">Nouvelle adresse email</label>
              <input type="email" v-model="form.newEmail" class="input" placeholder="nouveau@email.com" required />
            </div>
            <div>
              <label class="label">Mot de passe (confirmation)</label>
              <div class="relative">
                <input :type="showPassword ? 'text' : 'password'" v-model="form.password" class="input pr-12"
                  placeholder="••••••••" required />
                <button type="button" @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <IconEye v-if="!showPassword" class="w-5 h-5" />
                  <IconEyeOff v-else class="w-5 h-5" />
                </button>
              </div>
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
              :class="['justify-center flex items-center w-full btn border-0 shadow-lg text-white', buttonClass]"
              :disabled="loading">
              <IconLoader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
              <IconCheck v-else class="w-4 h-4 mr-2" />
              Mettre à jour
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { IconX, IconMail, IconEye, IconEyeOff, IconLoader2, IconCheck } from '@tabler/icons-vue';

const props = defineProps<{
  show: boolean;
  currentEmail?: string;
  loading?: boolean;
  error?: string;
  success?: string;
  accentColor?: 'primary' | 'secondary';
}>();

const emit = defineEmits<{
  close: [];
  submit: [data: { newEmail: string; password: string }];
}>();

const showPassword = ref(false);

const form = reactive({
  newEmail: '',
  password: ''
});

const iconBgClass = computed(() => {
  return props.accentColor === 'secondary'
    ? 'bg-secondary-100 dark:bg-secondary-900/30'
    : 'bg-primary-100 dark:bg-primary-900/30';
});

const iconColorClass = computed(() => {
  return props.accentColor === 'secondary'
    ? 'text-secondary-600 dark:text-secondary-400'
    : 'text-primary-600 dark:text-primary-400';
});

const buttonClass = computed(() => {
  return props.accentColor === 'secondary'
    ? 'bg-secondary-600 hover:bg-secondary-700'
    : 'bg-primary-600 hover:bg-primary-700';
});

// Reset form when modal closes
watch(() => props.show, (isOpen) => {
  if (!isOpen) {
    form.newEmail = '';
    form.password = '';
    showPassword.value = false;
  }
});

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
