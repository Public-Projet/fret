<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 transform transition-all">
          <!-- Header -->
          <div class="relative p-6 text-center border-b border-gray-50 dark:border-gray-800">
            <button @click="close" class="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <IconX class="w-5 h-5" />
            </button>
            <div :class="[
              'w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3',
              role === 'shipper' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600' : 'bg-secondary-50 dark:bg-secondary-900/30 text-secondary-600'
            ]">
              <IconMail class="w-8 h-8" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              Vérification de l'email
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Renvoyer le lien de vérification pour votre compte
            </p>
          </div>

          <!-- Body -->
          <div class="p-8">
            <div v-if="!success" class="space-y-6">
              <div class="space-y-2">
                <label for="resend-email" class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                  Adresse email
                </label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <IconMail class="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    id="resend-email"
                    v-model="email"
                    type="email"
                    class="block w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white rounded-2xl outline-none transition-all placeholder:text-gray-400"
                    placeholder="exemple@email.com"
                    @keyup.enter="handleResend"
                  />
                </div>
              </div>

              <div v-if="error" class="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30">
                <div class="flex gap-3">
                  <IconAlertTriangle class="w-5 h-5 text-red-600 shrink-0" />
                  <p class="text-sm text-red-600 dark:text-red-400 font-medium">{{ error }}</p>
                </div>
              </div>

              <button
                @click="handleResend"
                :disabled="loading || !email"
                :class="[
                  'w-full flex justify-center items-center gap-3 py-4 px-6 border border-transparent text-base font-bold rounded-2xl text-white shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
                  role === 'shipper' ? 'bg-primary-600 hover:bg-primary-700 shadow-primary-500/30' : 'bg-secondary-600 hover:bg-secondary-700 shadow-secondary-500/30'
                ]"
              >
                <IconLoader2 v-if="loading" class="w-5 h-5 animate-spin" />
                <span v-else>Renvoyer le lien</span>
              </button>
            </div>

            <!-- Success State -->
            <div v-else class="text-center space-y-6 py-4">
              <div class="w-20 h-20 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center shadow-inner animate-bounce">
                <IconMailCheck class="w-10 h-10" />
              </div>
              <div class="space-y-2">
                <h4 class="text-xl font-bold text-gray-900 dark:text-white">Email envoyé !</h4>
                <p class="text-gray-600 dark:text-gray-400">
                  {{ successMessage }}
                </p>
              </div>
              <button
                @click="close"
                class="w-full py-4 text-base font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { IconX, IconMail, IconMailCheck, IconLoader2, IconAlertTriangle } from '@tabler/icons-vue';
import { useAuthStore } from '~/stores/auth';
import type { UserRole } from '~/types';

const props = defineProps<{
  modelValue: boolean;
  role: UserRole;
  initialEmail?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const authStore = useAuthStore();
const email = ref(props.initialEmail || '');
const loading = ref(false);
const error = ref('');
const success = ref(false);
const successMessage = ref('');

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    email.value = props.initialEmail || '';
    error.value = '';
    success.value = false;
  }
});

const close = () => {
  emit('update:modelValue', false);
};

const handleResend = async () => {
  if (!email.value || loading.value) return;

  loading.value = true;
  error.value = '';

  try {
    const result = await authStore.resendVerificationEmail(email.value, props.role);

    if (result.success) {
      success.value = true;
      successMessage.value = result.data?.message || 'Un nouveau lien de vérification a été envoyé.';
    } else {
      error.value = result.error?.message || 'Une erreur est survenue lors du renvoi.';
    }
  } catch (e) {
    error.value = 'Une erreur inattendue est survenue.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
