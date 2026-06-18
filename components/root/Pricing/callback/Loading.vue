<template>
  <div class="py-6 flex flex-col items-center">
    <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">Traitement en cours</h2>
    <div class="w-full max-w-sm text-left">
      <UiStepLoading
        :steps="['Vérification', 'Génération de la facture', 'Envoi de la facture']"
        :active-step="activeStep"
        :auto-play="false"
        mode="cascade"
        color="primary"
      />
    </div>
    <p class="text-gray-500 dark:text-gray-400 text-sm">
      Veuillez patienter un instant pendant que nous sécurisons et confirmons votre transaction auprès de FedaPay...
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  activeStep: number;
}>();
</script>
