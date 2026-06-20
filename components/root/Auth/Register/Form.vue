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
        <!-- Critères visuels -->
        <UtilsPasswordCriteria ref="passwordCriteriaRef" :password="form?.password ?? ''" />
      </div>
    </div>

    <div>
      <button type="submit"
        class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all shadow-lg disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:shadow-none"
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
import { IconEye, IconEyeOff } from '@tabler/icons-vue';
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
}>();

defineEmits<{
  (e: 'submit'): void;
}>();

const form = defineModel<RegisterForm>('form', { required: true });
const showPassword = ref(false);

// Réf vers le composant critères pour lire sa validité
const passwordCriteriaRef = ref<{ isValid: boolean } | null>(null);

const isFormValid = computed(() =>
  (form.value?.firstname?.trim() ?? '').length > 0 &&
  (form.value?.lastname?.trim() ?? '').length > 0 &&
  (form.value?.email?.trim() ?? '').length > 0 &&
  (passwordCriteriaRef.value?.isValid ?? false)
);
</script>
