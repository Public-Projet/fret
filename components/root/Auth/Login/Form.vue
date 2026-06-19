<template>
  <form class="mt-6 space-y-6" @submit.prevent="emit('submit')">
    <div class="space-y-4">
      <div>
        <label for="email-address" class="label">Adresse email</label>
        <input id="email-address" name="email" type="email" autocomplete="email" required v-model="email"
          class="input" placeholder="exemple@email.com" />
      </div>
      <div>
        <label for="password" class="label">Mot de passe</label>
        <div class="relative">
          <input id="password" name="password" :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password" required v-model="password" class="input pr-12"
            placeholder="••••••••" />
          <button type="button" @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <IconEye v-if="!showPassword" class="w-5 h-5" />
            <IconEyeOff v-else class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="error" class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex flex-col items-center">
      <p class="text-red-600 dark:text-red-400 text-sm text-center">{{ error }}</p>
      <button v-if="error.includes('en attente de validation')" type="button" @click="emit('resend-email')" class="mt-2 text-sm font-medium hover:underline" :class="role === 'shipper' ? 'text-primary-600 hover:text-primary-500' : 'text-secondary-600 hover:text-secondary-500'">
        Renvoyer l'email de vérification
      </button>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <input id="remember-me" name="remember-me" type="checkbox" v-model="rememberMe"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
        <label for="remember-me" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
          Se souvenir de moi
        </label>
      </div>

      <div class="text-sm">
        <button type="button" @click="emit('forgot-password')" :class="[
          'font-medium hover:underline',
          role === 'shipper' ? 'text-primary-600 hover:text-primary-500' : 'text-secondary-600 hover:text-secondary-500'
        ]">
          Mot de passe oublié ?
        </button>
      </div>
    </div>

    <div>
      <button type="submit"
        class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        :class="[
          role === 'shipper'
            ? 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 shadow-primary-500/30'
            : 'bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-500 shadow-secondary-500/30'
        ]" :disabled="loading || !isFormValid">
        <span class="absolute left-0 inset-y-0 flex items-center pl-3">
          <IconLock class="h-5 w-5 opacity-70" aria-hidden="true" />
        </span>
        <span v-if="loading" class="flex items-center gap-2">
          <IconLoader2 class="h-4 w-4 animate-spin" />
          Connexion...
        </span>
        <span v-else>
          Se connecter en tant que {{ role === 'shipper' ? 'Expéditeur' : 'Transporteur' }}
        </span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { IconLock, IconEye, IconEyeOff, IconLoader2 } from '@tabler/icons-vue';
import type { UserRole } from '~/types';

const props = defineProps<{
  role: UserRole;
  loading: boolean;
  error: string;
}>();

const emit = defineEmits<{
  (e: 'submit'): void;
  (e: 'forgot-password'): void;
  (e: 'resend-email'): void;
}>();

const email = defineModel<string>('email', { required: true });
const password = defineModel<string>('password', { required: true });
const rememberMe = defineModel<boolean>('rememberMe', { required: true });

const showPassword = ref(false);

const isFormValid = computed(() =>
  (email.value?.trim() ?? '').length > 0 &&
  (password.value?.trim() ?? '').length > 0
);
</script>
