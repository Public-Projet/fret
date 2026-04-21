<template>
  <NuxtLayout name="auth"
    bg-image="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    quote="Sécurisez votre compte transporteur." author="L'équipe BourseFret">
    <div class="w-full space-y-8">
      <!-- Vérification du token en cours -->
      <div v-if="loading" class="text-center py-12">
        <div
          class="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
          <IconLoader2 class="w-8 h-8 text-secondary-600 dark:text-secondary-400 animate-spin" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Vérification du lien...
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          Veuillez patienter.
        </p>
      </div>

      <!-- Token invalide ou absent -->
      <div v-else-if="tokenError" class="text-center py-12">
        <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <IconCircleX class="w-12 h-12 text-red-600 dark:text-red-400" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Lien invalide
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ tokenError }}
        </p>
        <NuxtLink to="/auth/login"
          class="inline-flex items-center gap-2 px-6 py-3 bg-secondary-600 hover:bg-secondary-700 text-white font-medium rounded-xl transition-all">
          <IconLogin class="w-5 h-5" />
          Retour à la connexion
        </NuxtLink>
      </div>

      <!-- Formulaire nouveau mot de passe -->
      <div v-else-if="!resetSuccess">
        <h2 class="mt-4 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Nouveau mot de passe
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Choisissez un nouveau mot de passe sécurisé pour votre compte transporteur.
        </p>

        <form @submit.prevent="handleResetPassword" class="mt-8 space-y-6">
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
            class="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-500 shadow-lg shadow-secondary-500/30 transition-all disabled:opacity-50"
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

      <!-- Succès réinitialisation -->
      <div v-else class="text-center py-12">
        <div
          class="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <IconCircleCheck class="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Mot de passe réinitialisé !
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ successMessage }}
        </p>
        <NuxtLink to="/auth/login"
          class="inline-flex items-center gap-2 px-6 py-3 bg-secondary-600 hover:bg-secondary-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-secondary-500/30">
          <IconLogin class="w-5 h-5" />
          Se connecter
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import { IconLoader2, IconLock, IconEye, IconEyeOff, IconCircleCheck, IconCircleX, IconLogin } from '@tabler/icons-vue';

definePageMeta({
  layout: false
});

const route = useRoute();
const authStore = useCmnAuthStore();

const token = ref<string | null>(null);
const loading = ref(true);
const tokenError = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const error = ref('');
const submitting = ref(false);
const resetSuccess = ref(false);
const successMessage = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

onMounted(() => {
  token.value = route.query.token as string | null;

  if (!token.value) {
    tokenError.value = 'Le lien de réinitialisation est invalide ou incomplet.';
    loading.value = false;
    return;
  }

  // Token présent, on peut afficher le formulaire
  loading.value = false;
});

const handleResetPassword = async () => {
  error.value = '';

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Les mots de passe ne correspondent pas.';
    return;
  }

  submitting.value = true;

  try {
    const response = await authStore.resetUserPassword(token.value!, newPassword.value, 'carrier');

    if (response.success && response.data) {
      resetSuccess.value = true;
      successMessage.value = response.data.message;
    } else {
      // Extraire le message d'erreur
      if (response.error?.data) {
        const errorData = response.error.data as Record<string, unknown>;
        if (errorData.expiredToken && typeof errorData.expiredToken === 'object') {
          error.value = (errorData.expiredToken as { message?: string }).message || 'Le lien a expiré.';
        } else if (errorData.invalidToken && typeof errorData.invalidToken === 'object') {
          error.value = (errorData.invalidToken as { message?: string }).message || 'Le lien est invalide.';
        } else if (errorData.passwordFormatInvalid && typeof errorData.passwordFormatInvalid === 'object') {
          error.value = (errorData.passwordFormatInvalid as { message?: string }).message || 'Format de mot de passe invalide.';
        } else if (errorData.message) {
          error.value = errorData.message as string;
        } else {
          error.value = 'Une erreur est survenue.';
        }
      } else {
        error.value = response.error?.message || 'Une erreur est survenue.';
      }
    }
  } catch (e) {
    error.value = 'Une erreur inattendue est survenue.';
  } finally {
    submitting.value = false;
  }
};

useHead({
  title: 'Réinitialisation Mot de Passe - Bourse de Fret',
  meta: [
    { name: 'description', content: 'Réinitialisez le mot de passe de votre compte transporteur Bourse de Fret.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
