<template>
  <NuxtLayout name="auth"
    bg-image="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    quote="Votre compte transporteur est presque prêt !" author="L'équipe BourseFret">
    <div class="w-full space-y-8 text-center">
      <!-- Loading State -->
      <RootAuthCarrierVerifyEmailLoading v-if="loading" />

      <!-- Success State -->
      <RootAuthCarrierVerifyEmailSuccess v-else-if="success" :success-message="successMessage" />

      <!-- Error State -->
      <RootAuthCarrierVerifyEmailError v-else-if="error" :error-message="errorMessage" @resend="showResendModal = true" />

      <!-- No Token State -->
      <RootAuthCarrierVerifyEmailInvalid v-else @resend="showResendModal = true" />
    </div>

    <!-- Modals -->
    <ModalResendVerification v-model="showResendModal" role="carrier" />
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
    const result = await authStore.verifyUserEmail(token, 'carrier');

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
