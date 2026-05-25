<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4 font-sans transition-colors duration-300">
    <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 p-8 text-center relative overflow-hidden">
      <!-- Background subtle gradient blur -->
      <div class="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-primary-500 via-blue-500 to-indigo-600"></div>
      
      <!-- Loading State -->
      <div v-if="status === 'loading'" class="py-6 flex flex-col items-center">
        <div class="relative flex items-center justify-center mb-6">
          <IconLoader2 class="w-16 h-16 text-primary-600 dark:text-primary-400 animate-spin" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Vérification de votre paiement</h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          Veuillez patienter un instant pendant que nous sécurisons et confirmons votre transaction auprès de FedaPay...
        </p>
      </div>

      <!-- Success State -->
      <div v-else-if="status === 'success'" class="py-6 flex flex-col items-center animate-fade-in">
        <div class="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-500 mb-6 border border-green-100 dark:border-green-800/30">
          <IconCircleCheck class="w-12 h-12" />
        </div>
        <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Paiement Réussi !</h2>
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-6">
          Félicitations, votre abonnement <strong>Transporteur Pro</strong> est maintenant actif ! Vous allez être redirigé vers votre espace.
        </p>
        <span class="text-xs text-gray-400 dark:text-gray-500">Redirection automatique dans quelques secondes...</span>
        <NuxtLink to="/app" class="mt-6 btn btn-primary w-full rounded-xl py-3 font-semibold shadow-lg shadow-primary-500/20">
          Accéder à mon espace
        </NuxtLink>
      </div>

      <!-- Error / Cancel State -->
      <div v-else class="py-6 flex flex-col items-center animate-fade-in">
        <div class="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-500 mb-6 border border-red-100 dark:border-red-800/30">
          <IconCircleX class="w-12 h-12" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Paiement non finalisé</h2>
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-6">
          {{ message || "Le paiement n'a pas pu être validé ou a été annulé." }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 w-full">
          <NuxtLink to="/pricing" class="btn btn-outline border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700/50 w-full sm:w-1/2 rounded-xl py-3 font-semibold">
            Réessayer
          </NuxtLink>
          <NuxtLink to="/app" class="btn btn-primary w-full sm:w-1/2 rounded-xl py-3 font-semibold">
            Mon espace
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from '#app';
import { IconLoader2, IconCircleCheck, IconCircleX } from '@tabler/icons-vue';
import { useCmnAuthStore } from '~/stores/cmnAuth';

definePageMeta({
  layout: 'guest'
});

const route = useRoute();
const router = useRouter();
const authStore = useCmnAuthStore();

const status = ref<'loading' | 'success' | 'error'>('loading');
const message = ref('');

onMounted(async () => {
  // Récupérer l'id de transaction depuis la query (soit transaction_id soit id retourné par FedaPay)
  const txId = route.query.transaction_id || route.query.id;

  if (!txId) {
    status.value = 'error';
    message.value = "Aucun identifiant de transaction n'a été trouvé dans l'URL.";
    return;
  }

  try {
    // Appeler l'API de vérification
    const response = await $fetch<any>('/api/common/subscription/verify', {
      method: 'GET',
      query: { transaction_id: txId }
    });

    if (response && response.status === 'approved') {
      status.value = 'success';
      // Mettre à jour immédiatement la session utilisateur dans le store
      await authStore.loadUser();
      
      // Rediriger après 3 secondes vers l'espace applicatif
      setTimeout(() => {
        router.push('/app');
      }, 3500);
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

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
