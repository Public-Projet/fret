<template>
  <form class="space-y-5" @submit.prevent="$emit('submit')">
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="firstname" class="label">Prénom</label>
          <input id="firstname" type="text" required v-model="form.firstname" class="input" placeholder="Jean" />
        </div>
        <div>
          <label for="lastname" class="label">Nom</label>
          <input id="lastname" type="text" required v-model="form.lastname" class="input" placeholder="Dossou" />
        </div>
      </div>

      <div>
        <label for="email" class="label">Adresse email</label>
        <input id="email" type="email" required v-model="form.email" class="input"
          placeholder="jean.dossou@email.com" />
      </div>

      <div>
        <label for="password" class="label">Mot de passe</label>
        <div class="relative">
          <input id="password" :type="showPassword ? 'text' : 'password'" required v-model="form.password"
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
        <!-- Critères visuels (affichés uniquement si le champ a du contenu) -->
        <ul v-if="form?.password" class="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
          <li v-for="c in passwordCriteria" :key="c.label"
            class="flex items-center gap-1 text-xs transition-colors"
            :class="c.met ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'">
            <svg v-if="c.met" class="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <svg v-else class="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="3"/>
            </svg>
            {{ c.label }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Message de succès -->
    <div v-if="successMessage"
      class="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
      <div class="flex items-center gap-2">
        <IconCheck class="w-5 h-5 text-green-600 dark:text-green-400" />
        <p class="text-green-600 dark:text-green-400 text-sm">{{ successMessage }}</p>
      </div>
    </div>

    <!-- Message d'erreur -->
    <div v-if="error" class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
      <p class="text-red-600 dark:text-red-400 text-sm text-center">{{ error }}</p>
    </div>

    <div>
      <button type="submit"
        class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        :class="[
          role === 'shipper'
            ? 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 shadow-primary-500/30'
            : 'bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-500 shadow-secondary-500/30'
        ]" :disabled="loading || !isFormValid">
        <template v-if="loading">
          <UiStepLoading :steps="['Création', 'Envoi de mail']" :active-step="activeStep" :auto-play="false"
            color="white" mode="replace" />
        </template>
        <template v-else>
          S'inscrire en tant que {{ role === 'shipper' ? 'Expéditeur' : 'Transporteur' }}
        </template>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { IconEye, IconEyeOff, IconCheck } from '@tabler/icons-vue';
import type { UserRole } from '~/types';

interface RegisterForm {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

const props = defineProps<{
  role: UserRole;
  loading: boolean;
  activeStep: number;
  error: string;
  successMessage: string;
}>();

defineEmits<{
  (e: 'submit'): void;
}>();

const form = defineModel<RegisterForm>('form', { required: true });
const showPassword = ref(false);

// Critères de validation du mot de passe
const passwordCriteria = computed(() => {
  const pwd = form.value?.password ?? '';
  return [
    { label: '8 caractères min.', met: pwd.length >= 8 },
    { label: '1 majuscule', met: /[A-Z]/.test(pwd) },
    { label: '1 minuscule', met: /[a-z]/.test(pwd) },
    { label: '1 chiffre', met: /[0-9]/.test(pwd) },
    { label: '1 caractère spécial', met: /[^A-Za-z0-9]/.test(pwd) },
  ];
});

const isPasswordValid = computed(() => passwordCriteria.value.every((c) => c.met));

const isFormValid = computed(() =>
  (form.value?.firstname?.trim() ?? '').length > 0 &&
  (form.value?.lastname?.trim() ?? '').length > 0 &&
  (form.value?.email?.trim() ?? '').length > 0 &&
  isPasswordValid.value
);
</script>
