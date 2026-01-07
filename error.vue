<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center">
      <div>
        <h1 class="text-9xl font-black text-primary-200 dark:text-primary-900/50 select-none">
          {{ error.statusCode }}
        </h1>
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div class="text-center">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight sm:text-4xl">
              {{ errorTitle }}
            </h2>
            <p class="mt-4 text-lg text-gray-500 dark:text-gray-400">
              {{ errorMessage }}
            </p>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center relative mt-16">
        <button @click="handleError" class="btn btn-primary flex items-center justify-center gap-2">
          <IconHome class="w-5 h-5" />
          Retour à l'accueil
        </button>
        <button @click="router.back()" class="btn btn-outline flex items-center justify-center gap-2">
          <IconArrowLeft class="w-5 h-5" />
          Page précédente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';
import { IconHome, IconArrowLeft } from '@tabler/icons-vue';

const props = defineProps<{
  error: NuxtError;
}>();

const router = useRouter();

const errorTitle = computed(() => {
  if (props.error.statusCode === 404) return 'Oups ! Page introuvable';
  if (props.error.statusCode === 403) return 'Accès non autorisé';
  if (props.error.statusCode === 500) return 'Erreur serveur';
  return 'Une erreur est survenue';
});

const errorMessage = computed(() => {
  if (props.error.statusCode === 404) return "La page que vous recherchez semble n'avoir jamais existé ou a été déplacée.";
  if (props.error.statusCode === 403) return "Vous n'avez pas les droits nécessaires pour accéder à cette page.";
  if (props.error.statusCode === 500) return "Notre serveur rencontre quelques difficultés. Veuillez réessayer plus tard.";
  return props.error.message || "Quelque chose s'est mal passé.";
});

const handleError = () => {
  clearError({ redirect: '/' });
};
</script>
