<template>
  <NuxtLayout name="auth"
    bg-image="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    quote="Votre compte transporteur est presque prêt !" author="L'équipe BourseFret">
    <div class="w-full space-y-8 text-center">
      <!-- Loading State -->
      <div v-if="loading" class="py-12">
        <div
          class="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
          <IconLoader2 class="w-8 h-8 text-secondary-600 dark:text-secondary-400 animate-spin" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Vérification en cours...
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          Veuillez patienter pendant que nous vérifions votre email.
        </p>
      </div>

      <!-- Success State -->
      <div v-else-if="success" class="py-12">
        <div
          class="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <IconCircleCheck class="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Email vérifié avec succès !
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ successMessage }}
        </p>
        <NuxtLink to="/auth/login"
          class="inline-flex items-center gap-2 px-6 py-3 bg-secondary-600 hover:bg-secondary-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-secondary-500/30">
          <IconLogin class="w-5 h-5" />
          Se connecter en tant que Transporteur
        </NuxtLink>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="py-12">
        <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <IconCircleX class="w-12 h-12 text-red-600 dark:text-red-400" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Échec de la vérification
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ errorMessage }}
        </p>


        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button @click="showResendModal = true"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary-600 hover:bg-secondary-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-secondary-500/30">
            <IconMail class="w-5 h-5" />
            Renvoyer le lien
          </button>
          <NuxtLink to="/auth/login"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
            <IconLogin class="w-5 h-5" />
            Connexion
          </NuxtLink>
        </div>
      </div>

      <!-- No Token State -->
      <div v-else class="py-12">
        <div
          class="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
          <IconAlertTriangle class="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Lien invalide
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Le lien de vérification semble incomplet ou invalide.
        </p>
        <button @click="showResendModal = true"
          class="inline-flex items-center gap-2 px-6 py-3 bg-secondary-600 hover:bg-secondary-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-secondary-500/30">
          <IconMail class="w-5 h-5" />
          Renvoyer le lien
        </button>
      </div>
    </div>

    <!-- Modals -->
    <ModalResendVerification v-model="showResendModal" role="carrier" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { IconLoader2, IconCircleCheck, IconCircleX, IconLogin, IconUserPlus, IconAlertTriangle, IconMail } from '@tabler/icons-vue';

definePageMeta({
  layout: false
});

const route = useRoute();
const authStore = useAuthStore();

const loading = ref(false);
const success = ref(false);
const error = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const showResendModal = ref(false);

onMounted(async () => {
  const token = route.query.token as string;

  if (!token) {
    return;
  }

  loading.value = true;

  try {
    const result = await authStore.verifyEmail(token, 'carrier');

    if (result.success && result.data) {
      success.value = true;
      successMessage.value = result.data.message || 'Votre email a été vérifié avec succès !';
    } else {
      error.value = true;

      errorMessage.value = result.error?.message || 'Le lien de vérification est invalide ou a expiré.';
    }
  } catch (e) {
    console.error('Erreur verification:', e);
    error.value = true;
    errorMessage.value = 'Une erreur inattendue est survenue.';
  } finally {
    loading.value = false;
  }
});

useHead({
  title: 'Vérification Email Transporteur - Bourse de Fret',
  meta: [
    { name: 'description', content: 'Vérifiez votre adresse email pour activer votre compte transporteur Bourse de Fret.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
