<template>
  <NuxtLayout name="auth"
    bg-image="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    quote="Un réseau puissant pour faire avancer votre business." author="L'équipe BourseFret">
    <div class="w-full space-y-6">
      <div>
        <h2 class="mt-4 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Créer un compte
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Ou
          <NuxtLink to="/auth/login" class="font-medium text-primary-600 hover:text-primary-500">
            connectez-vous à votre compte existant
          </NuxtLink>
        </p>
      </div>

      <!-- Role Selection -->
      <div class="flex justify-center space-x-4">
        <button type="button" @click="role = 'shipper'" :class="[
          'flex-1 py-4 px-4 rounded-xl border-2 text-center transition-all duration-200',
          role === 'shipper'
            ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 shadow-lg shadow-primary-500/20'
            : 'border-gray-200 hover:border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
        ]">
          <IconCube class="w-8 h-8 mx-auto mb-2" />
          <span class="font-semibold block">Expéditeur</span>
          <span class="text-xs opacity-75">Je veux expédier des marchandises</span>
        </button>
        <button type="button" @click="role = 'carrier'" :class="[
          'flex-1 py-4 px-4 rounded-xl border-2 text-center transition-all duration-200',
          role === 'carrier'
            ? 'border-secondary-600 bg-secondary-50 text-secondary-700 dark:bg-secondary-900/20 dark:text-secondary-400 shadow-lg shadow-secondary-500/20'
            : 'border-gray-200 hover:border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
        ]">
          <IconTruck class="w-8 h-8 mx-auto mb-2" />
          <span class="font-semibold block">Transporteur</span>
          <span class="text-xs opacity-75">Je propose mes services de transport</span>
        </button>
      </div>

      <form class="space-y-5" @submit.prevent="handleRegister">
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
          </div>
        </div>

        <!-- Message de succès -->
        <div v-if="successMessage"
          class="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <div class="flex items-center gap-2">
            <IconCheck class="w-5 h-5 text-green-600 dark:text-green-400" />
            <p class="text-green-600 dark:text-green-400 text-sm">{{ successMessage }}</p>
          </div>
        </div>

        <!-- Message d'erreur -->
        <div v-if="error" class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p class="text-red-600 dark:text-red-400 text-sm text-center">{{ error }}</p>
        </div>

        <div>
          <button type="submit"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            :class="[
              role === 'shipper'
                ? 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 shadow-primary-500/30'
                : 'bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-500 shadow-secondary-500/30'
            ]" :disabled="loading">
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

      <!-- Conditions -->
      <p class="text-center text-xs text-gray-500 dark:text-gray-400">
        En vous inscrivant, vous acceptez nos
        <NuxtLink to="/legal/terms" class="text-primary-600 hover:underline">Conditions d'utilisation</NuxtLink>
        et notre
        <NuxtLink to="/legal/privacy" class="text-primary-600 hover:underline">Politique de confidentialité</NuxtLink>.
      </p>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import type { UserRole } from '~/types';
import { IconCube, IconTruck, IconLoader2, IconCheck, IconEye, IconEyeOff } from '@tabler/icons-vue';

definePageMeta({
  layout: false
});

const route = useRoute();
const router = useRouter();
const authStore = useCmnAuthStore();

const role = ref<UserRole>('shipper');
const loading = ref(false);
const activeStep = ref(0);
const error = ref('');
const successMessage = ref('');
const showPassword = ref(false);

const form = reactive({
  firstname: '',
  lastname: '',
  email: '',
  password: '',
});

onMounted(() => {
  // Préremplir le rôle depuis l'URL si présent
  if (route.query.role && (route.query.role === 'shipper' || route.query.role === 'carrier')) {
    role.value = route.query.role as UserRole;
  }
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const handleRegister = async () => {
  loading.value = true;
  error.value = '';
  successMessage.value = '';
  activeStep.value = 0; // Initialisation

  try {
    await sleep(800); // Laisse le temps de voir l'initialisation
    activeStep.value = 1; // Création
    await sleep(400); // Laisse le temps de voir la transition vers Création

    const result = await authStore.registerUser({
      email: form.email,
      password: form.password,
      firstname: form.firstname,
      lastname: form.lastname,
    }, role.value);

    if (result.success) {
      activeStep.value = 2; // Envoi de mail
      await sleep(1200); // Laisse le temps de voir l'envoi de mail

      activeStep.value = 3; // Finalisation
      await sleep(800); // Laisse le temps de voir la finalisation

      successMessage.value = result.message || 'Inscription réussie ! Vérifiez votre email pour activer votre compte.';

      // Réinitialiser le formulaire
      form.firstname = '';
      form.lastname = '';
      form.email = '';
      form.password = '';

      // Rediriger vers la page de login après 3 secondes
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } else {
      error.value = result.error || 'Erreur lors de l\'inscription';
    }
  } catch (e) {
    console.error('Erreur register:', e);
    error.value = 'Une erreur inattendue est survenue';
  } finally {
    loading.value = false;
  }
};

useHead({
  title: 'Inscription - Bourse de Fret',
  meta: [
    { name: 'description', content: 'Créez votre compte Bourse de Fret pour commencer à expédier ou transporter des marchandises.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
