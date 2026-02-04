<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="!loading && $emit('close')"></div>
        <div class="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 space-y-6">
          <!-- Close button -->
          <button @click="$emit('close')"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <IconX class="w-5 h-5" />
          </button>

          <!-- Header -->
          <div class="text-center">
            <div
              class="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/30">
              <IconAlertTriangle class="w-7 h-7 text-red-600 dark:text-red-400" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Supprimer mon compte</h3>
            <p class="text-sm text-gray-500 mt-1">Étape {{ currentStep }} sur 3</p>
          </div>

          <!-- Step 1: Conditions -->
          <div v-if="currentStep === 1" class="space-y-4">
            <div
              class="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
              <h4 class="font-bold text-orange-800 dark:text-orange-300 mb-2">Attention !</h4>
              <ul class="text-sm text-orange-700 dark:text-orange-400 list-disc list-inside space-y-1">
                <li>Votre profil ne sera plus visible.</li>
                <li>Vos offres et annonces en cours seront suspendues.</li>
                <li>Cette action est irréversible après validation finale.</li>
              </ul>
            </div>
            <label class="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" v-model="step1Accepted"
                class="mt-1 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
              <span class="text-sm text-gray-600 dark:text-gray-400">J'ai compris que la suppression de mon compte
                entrainera la perte d'accès à mes données.</span>
            </label>
            <div class="flex justify-end pt-4">
              <button @click="currentStep = 2" :disabled="!step1Accepted"
                class="btn btn-primary bg-red-600 hover:bg-red-700 text-white disabled:opacity-50">
                Continuer
                <IconArrowRight class="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

          <!-- Step 2: Confirmation String -->
          <div v-if="currentStep === 2" class="space-y-4">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Pour confirmer, veuillez saisir <span class="font-bold text-gray-900 dark:text-white">SUPPRIMER</span>
              ci-dessous :
            </p>
            <input type="text" v-model="confirmationString" class="input uppercase" placeholder="Taper ici..." />
            <div class="flex justify-between pt-4">
              <button @click="currentStep = 1" class="btn btn-outline text-gray-600">Retour</button>
              <button @click="currentStep = 3" :disabled="confirmationString !== 'SUPPRIMER'"
                class="btn btn-primary bg-red-600 hover:bg-red-700 text-white disabled:opacity-50">
                Étape suivante
                <IconArrowRight class="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

          <!-- Step 3: Password -->
          <form v-if="currentStep === 3" @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="label">Entrez votre mot de passe pour confirmer</label>
              <div class="relative">
                <input :type="showPassword ? 'text' : 'password'" v-model="password" class="input pr-12"
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

            <div class="flex justify-between pt-4 gap-4">
              <button type="button" @click="currentStep = 2"
                class="btn btn-outline text-gray-600 flex-1">Retour</button>
              <button type="submit" :disabled="loading || !password"
                class="btn bg-red-600 hover:bg-red-700 text-white flex-1 flex items-center justify-center">
                <IconLoader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
                <IconTrash v-else class="w-4 h-4 mr-2" />
                Supprimer mon compte
              </button>
            </div>
          </form>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { IconX, IconAlertTriangle, IconArrowRight, IconEye, IconEyeOff, IconLoader2, IconTrash } from '@tabler/icons-vue';

const props = defineProps<{
  show: boolean;
  loading?: boolean;
  error?: string;
  success?: string;
}>();

const emit = defineEmits<{
  close: [];
  submit: [data: { password: string, confirmation: string }];
}>();

const currentStep = ref(1);
const step1Accepted = ref(false);
const confirmationString = ref('');
const password = ref('');
const showPassword = ref(false);

// Reset modal state when closed
watch(() => props.show, (val) => {
  if (!val) {
    setTimeout(() => {
      currentStep.value = 1;
      step1Accepted.value = false;
      confirmationString.value = '';
      password.value = '';
      showPassword.value = false;
    }, 300);
  }
});

const handleSubmit = () => {
  emit('submit', {
    password: password.value,
    confirmation: confirmationString.value
  });
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
