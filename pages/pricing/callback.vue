<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4 font-sans transition-colors duration-300">
    <div
      class="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 p-8 text-center relative overflow-hidden">
      <!-- Background subtle gradient blur -->
      <div class="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-primary-500 via-blue-500 to-indigo-600"></div>

      <!-- Loading State -->
      <RootPricingCallbackLoading v-if="status === 'loading'" :active-step="activeStep" />

      <!-- Success State -->
      <RootPricingCallbackSuccess v-else-if="status === 'success'" />

      <!-- Error / Cancel State -->
      <RootPricingCallbackError v-else :message="message" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from '#app';
import { useCmnAuthStore } from '~/stores/cmnAuth';

definePageMeta({
  layout: 'guest'
});

const route = useRoute();
const router = useRouter();
const authStore = useCmnAuthStore();

const status = ref<'loading' | 'success' | 'error'>('loading');
const activeStep = ref(0);
const message = ref('');

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

onMounted(async () => {
  // Récupérer l'id de transaction depuis la query (soit transaction_id soit id retourné par FedaPay)
  const txId = route.query.transaction_id || route.query.id;

  if (!txId) {
    status.value = 'error';
    message.value = "Aucun identifiant de transaction n'a été trouvé dans l'URL.";
    return;
  }

  activeStep.value = 0; // Initialisation

  try {
    await sleep(800); // Laisse le temps de voir l'initialisation
    activeStep.value = 1; // Vérification
    await sleep(400);

    // Appeler l'API de vérification
    const response = await $fetch<any>('/api/common/subscription/verify', {
      method: 'GET',
      query: { transaction_id: txId }
    });

    if (response && response.status === 'approved') {
      activeStep.value = 2; // Génération de la facture
      await sleep(1000);

      activeStep.value = 3; // Envoi de la facture
      await sleep(1200);

      activeStep.value = 4; // Finalisation
      await sleep(800);

      status.value = 'success';
      // Mettre à jour immédiatement la session utilisateur dans le store
      await authStore.loadUser();

      // Rediriger après 3 secondes vers l'espace applicatif
      setTimeout(() => {
        router.push('/app');
      }, 3000);
    } else {
      status.value = 'error';
      message.value = response?.message || "Le statut de votre paiement n'est pas approuvé.";
    }
  } catch (err: any) {
    console.error('Verify error:', err);
    status.value = 'error';
    message.value = err.data?.message || "Une erreur est survenue lors de la validation auprès du serveur.";
  }
});
</script>
