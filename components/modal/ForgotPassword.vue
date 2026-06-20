<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal"></div>

        <!-- Modal Content -->
        <div class="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 space-y-6">
          <!-- Close Button -->
          <button @click="closeModal"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <IconX class="w-5 h-5" />
          </button>

          <!-- Formulaire demande de réinitialisation -->
          <div v-if="!forgotEmailSent">
            <div class="text-center mb-6">
              <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                :class="role === 'shipper' ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-secondary-100 dark:bg-secondary-900/30'">
                <IconMail class="w-8 h-8"
                  :class="role === 'shipper' ? 'text-primary-600 dark:text-primary-400' : 'text-secondary-600 dark:text-secondary-400'" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                Mot de passe oublié
              </h3>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Entrez votre adresse email pour recevoir un lien de réinitialisation.
              </p>
            </div>

            <form @submit.prevent="handleForgotPassword" class="space-y-4">
              <div>
                <label for="forgot-email" class="label">Adresse email</label>
                <input id="forgot-email" type="email" required v-model="forgotEmail" class="input"
                  placeholder="exemple@email.com" />
              </div>

              <div v-if="forgotError"
                class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p class="text-red-600 dark:text-red-400 text-sm text-center">{{ forgotError }}</p>
              </div>

              <button type="submit"
                class="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all shadow-lg disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:shadow-none"
                :class="[
                  role === 'shipper'
                    ? 'bg-primary-600 hover:bg-primary-700 shadow-primary-500/30'
                    : 'bg-secondary-600 hover:bg-secondary-700 shadow-secondary-500/30'
                ]" :disabled="forgotLoading || !forgotEmail.trim()">
                <span v-if="forgotLoading" class="flex items-center gap-2">
                  <IconLoader2 class="h-4 w-4 animate-spin" />
                  Envoi...
                </span>
                <span v-else class="flex items-center gap-2">
                  <IconMail class="h-5 w-5" />
                  Envoyer le lien
                </span>
              </button>
            </form>
          </div>

          <!-- Email envoyé -->
          <div v-else class="text-center py-6">
            <div
              class="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <IconMailCheck class="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Email envoyé !
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              {{ forgotSuccessMessage }}
            </p>
            <button @click="closeModal" class="px-6 py-2 text-sm font-medium rounded-lg transition-colors" :class="[
              role === 'shipper'
                ? 'text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                : 'text-secondary-600 hover:bg-secondary-50 dark:hover:bg-secondary-900/20'
            ]">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import { IconX, IconMail, IconMailCheck, IconLoader2 } from '@tabler/icons-vue';
import type { UserRole } from '~/types';

const props = defineProps<{
  modelValue: boolean;
  role: UserRole;
  initialEmail?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const authStore = useCmnAuthStore();
const toastStore = useCmnToastStore();

const forgotEmail = ref('');
const forgotError = ref('');
const forgotLoading = ref(false);
const forgotEmailSent = ref(false);
const forgotSuccessMessage = ref('');

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    forgotEmail.value = props.initialEmail || '';
    forgotError.value = '';
    forgotEmailSent.value = false;
    forgotSuccessMessage.value = '';
  }
});

const closeModal = () => {
  emit('update:modelValue', false);
};

const handleForgotPassword = async () => {
  forgotLoading.value = true;
  forgotError.value = '';

  try {
    const response = await authStore.forgotUserPassword(forgotEmail.value, props.role);

    if (response.success && response.data) {
      forgotEmailSent.value = true;
      if (typeof response.data === 'string') {
        forgotSuccessMessage.value = response.data;
      } else {
        const data = response.data as { message?: string };
        forgotSuccessMessage.value = data.message || 'Un email de réinitialisation a été envoyé.';
      }
      toastStore.addToast("Lien de réinitialisation envoyé par email !", "success");
    } else {
      forgotError.value = response.error?.message || 'Une erreur est survenue.';
    }
  } catch (e) {
    forgotError.value = 'Une erreur inattendue est survenue.';
  } finally {
    forgotLoading.value = false;
  }
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

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
