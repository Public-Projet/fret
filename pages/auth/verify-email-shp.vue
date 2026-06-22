<template>
  <NuxtLayout name="auth"
    bg-image="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    quote="Votre compte expéditeur est presque prêt !" author="L'équipe BourseFret">
    <div class="w-full space-y-8 text-center">
      <!-- Loading State -->
      <RootAuthShipperVerifyEmailLoading v-if="loading" />

      <!-- Success State -->
      <RootAuthShipperVerifyEmailSuccess v-else-if="success" :success-message="successMessage" />

      <!-- Error State -->
      <RootAuthShipperVerifyEmailError v-else-if="error" :error-message="errorMessage"
        @resend="showResendModal = true" />

      <!-- No Token State -->
      <RootAuthShipperVerifyEmailInvalid v-else @resend="showResendModal = true" />
    </div>

    <!-- Modals -->
    <ModalResendVerification v-model="showResendModal" role="shipper" />
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
  const role = 'shipper';

  try {
    const result = await (authStore.verifyUserEmail as any)(token!, role);
    if (result.success) {
      success.value = true;
      successMessage.value = result.data?.message || 'Votre email a été vérifié avec succès !';
    } else {
      error.value = true;
      errorMessage.value = result.error?.message || 'Le lien de vérification est invalide ou a expiré.';
    }
  } catch (e: any) {
    console.error('Erreur verification:', e);
    error.value = true;
    errorMessage.value = 'Une erreur est survenue lors de la vérification.';
  } finally {
    loading.value = false;
  }
});

useHead({
  title: 'Vérification Email Expéditeur',
  meta: [
    { name: 'description', content: 'Vérifiez votre adresse email pour activer votre compte expéditeur Bourse de Fret.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
