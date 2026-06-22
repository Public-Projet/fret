<template>
  <NuxtLayout name="auth"
    bg-image="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    quote="Sécurisez votre compte expéditeur." author="L'équipe BourseFret">
    <div class="w-full space-y-8">
      <!-- Vérification du token en cours -->
      <RootAuthShipperPasswordLoading v-if="loading" />

      <!-- Token invalide ou absent -->
      <RootAuthShipperPasswordTokenError v-else-if="tokenError" :token-error="tokenError" />

      <!-- Formulaire nouveau mot de passe -->
      <RootAuthShipperPasswordForm v-else-if="!resetSuccess" v-model:newPassword="newPassword"
        v-model:confirmPassword="confirmPassword" :submitting="submitting" :error="error"
        @submit="handleResetPassword" />

      <!-- Succès réinitialisation -->
      <RootAuthShipperPasswordSuccess v-else :success-message="successMessage" />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCmnAuthStore } from '~/stores/cmnAuth';

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
    const response = await authStore.resetUserPassword(token.value!, newPassword.value, 'shipper');

    if (response.success && response.data) {
      resetSuccess.value = true;
      successMessage.value = extractSuccessMessage(response.data, 'Mot de passe réinitialisé avec succès');
    } else {
      error.value = response.error?.message || 'Une erreur est survenue.';
    }
  } catch (e) {
    error.value = extractErrorMessage(e);
  } finally {
    submitting.value = false;
  }
};

useHead({
  title: 'Réinitialisation Mot de Passe - Bourse de Fret',
  meta: [
    { name: 'description', content: 'Réinitialisez le mot de passe de votre compte expéditeur Bourse de Fret.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
