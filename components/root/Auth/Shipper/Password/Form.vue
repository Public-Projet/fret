<template>
  <div>
    <h2 class="mt-4 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
      Nouveau mot de passe
    </h2>
    <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
      Choisissez un nouveau mot de passe sécurisé pour votre compte expéditeur.
    </p>

    <form @submit.prevent="emit('submit')" class="mt-8 space-y-6">
      <div>
        <label for="password" class="label">Nouveau mot de passe</label>
        <div class="relative">
          <input id="password" :type="showPassword ? 'text' : 'password'" required v-model="newPassword"
            class="input pr-12" placeholder="••••••••" />
          <button type="button" @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <IconEye v-if="!showPassword" class="w-5 h-5" />
            <IconEyeOff v-else class="w-5 h-5" />
          </button>
        </div>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Min. 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
        </p>
      </div>

      <div>
        <label for="confirm-password" class="label">Confirmer le mot de passe</label>
        <div class="relative">
          <input id="confirm-password" :type="showConfirmPassword ? 'text' : 'password'" required
            v-model="confirmPassword" class="input pr-12" placeholder="••••••••" />
          <button type="button" @click="showConfirmPassword = !showConfirmPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <IconEye v-if="!showConfirmPassword" class="w-5 h-5" />
            <IconEyeOff v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <div v-if="error"
        class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <p class="text-red-600 dark:text-red-400 text-sm text-center">{{ error }}</p>
      </div>

      <button type="submit"
        class="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 shadow-lg shadow-primary-500/30 transition-all disabled:opacity-50"
        :disabled="submitting">
        <span v-if="submitting" class="flex items-center gap-2">
          <IconLoader2 class="h-4 w-4 animate-spin" />
          Réinitialisation...
        </span>
        <span v-else class="flex items-center gap-2">
          <IconLock class="h-5 w-5" />
          Réinitialiser le mot de passe
        </span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IconLoader2, IconLock, IconEye, IconEyeOff } from '@tabler/icons-vue';

defineProps<{
  submitting: boolean;
  error: string;
}>();

const emit = defineEmits<{
  (e: 'submit'): void;
}>();

const newPassword = defineModel<string>('newPassword', { required: true });
const confirmPassword = defineModel<string>('confirmPassword', { required: true });

const showPassword = ref(false);
const showConfirmPassword = ref(false);
</script>
