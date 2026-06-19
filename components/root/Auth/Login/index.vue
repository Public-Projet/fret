<template>
  <NuxtLayout name="auth"
    bg-image="https://images.unsplash.com/photo-1700716465891-9e5e9f501d7d?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGltcG9ydGF0aW9ufGVufDB8fDB8fHww"
    quote="Le réseau qui fait circuler le fret sans perte de temps">
    <div class="w-full space-y-8">
      <div>
        <h2 class="mt-4 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Connexion
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Ou
          <NuxtLink to="/auth/register" class="font-medium text-primary-600 hover:text-primary-500">
            créez un compte gratuitement
          </NuxtLink>
        </p>
      </div>

      <!-- Tabs Expéditeur / Transporteur -->
      <div class="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 gap-1">
        <button type="button" @click="selectedRole = 'shipper'" :class="[
          'flex-1 relative py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2',
          selectedRole === 'shipper'
            ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        ]">
          <IconCube class="w-5 h-5" />
          <span>Expéditeur</span>
          <span v-if="lastConnectedRole === 'shipper'"
            class="absolute -top-1 -right-1 px-2 py-0.5 text-xs font-medium bg-primary-500 text-white rounded-full shadow-sm">
            Dernier accès
          </span>
        </button>
        <button type="button" @click="selectedRole = 'carrier'" :class="[
          'flex-1 relative py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2',
          selectedRole === 'carrier'
            ? 'bg-white dark:bg-gray-700 text-secondary-600 dark:text-secondary-400 shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        ]">
          <IconTruck class="w-5 h-5" />
          <span>Transporteur</span>
          <span v-if="lastConnectedRole === 'carrier'"
            class="absolute -top-1 -right-1 px-2 py-0.5 text-xs font-medium bg-secondary-500 text-white rounded-full shadow-sm">
            Dernier accès
          </span>
        </button>
      </div>

      <form class="mt-6 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="email-address" class="label">Adresse email</label>
            <input id="email-address" name="email" type="email" autocomplete="email" required v-model="email"
              class="input" placeholder="exemple@email.com" />
          </div>
          <div>
            <label for="password" class="label">Mot de passe</label>
            <div class="relative">
              <input id="password" name="password" :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password" required v-model="password" class="input pr-12"
                placeholder="••••••••" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <IconEye v-if="!showPassword" class="w-5 h-5" />
                <IconEyeOff v-else class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div v-if="error" class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex flex-col items-center">
          <p class="text-red-600 dark:text-red-400 text-sm text-center">{{ error }}</p>
          <button v-if="error.includes('en attente de validation')" type="button" @click="showResendModal = true" class="mt-2 text-sm font-medium hover:underline" :class="selectedRole === 'shipper' ? 'text-primary-600 hover:text-primary-500' : 'text-secondary-600 hover:text-secondary-500'">
            Renvoyer l'email de vérification
          </button>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember-me" name="remember-me" type="checkbox" v-model="rememberMe"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              Se souvenir de moi
            </label>
          </div>

          <div class="text-sm">
            <button type="button" @click="openForgotPasswordModal" :class="[
              'font-medium hover:underline',
              selectedRole === 'shipper' ? 'text-primary-600 hover:text-primary-500' : 'text-secondary-600 hover:text-secondary-500'
            ]">
              Mot de passe oublié ?
            </button>
          </div>
        </div>

        <div>
          <button type="submit"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            :class="[
              selectedRole === 'shipper'
                ? 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 shadow-primary-500/30'
                : 'bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-500 shadow-secondary-500/30'
            ]" :disabled="loading">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <IconLock class="h-5 w-5 opacity-70" aria-hidden="true" />
            </span>
            <span v-if="loading" class="flex items-center gap-2">
              <IconLoader2 class="h-4 w-4 animate-spin" />
              Connexion...
            </span>
            <span v-else>
              Se connecter en tant que {{ selectedRole === 'shipper' ? 'Expéditeur' : 'Transporteur' }}
            </span>
          </button>
        </div>
      </form>

      <!-- Info sur le dernier accès -->
      <div v-if="lastConnectedRole && lastConnectedAt" class="text-center text-xs text-gray-500 dark:text-gray-400">
        <p>
          Dernière connexion : {{ formatLastConnectedDate(lastConnectedAt) }}
          en tant que {{ lastConnectedRole === 'shipper' ? 'Expéditeur' : 'Transporteur' }}
        </p>
      </div>
    </div>

    <!-- Modal Mot de passe oublié -->
    <RootAuthLoginForgotPasswordModal
      v-model="showForgotModal"
      :role="selectedRole"
      :initial-email="email"
    />

    <!-- Modal Resend Verification -->
    <ModalResendVerification
      v-model="showResendModal"
      :role="selectedRole"
      :initial-email="email"
    />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import { IconLock, IconCube, IconTruck, IconLoader2, IconEye, IconEyeOff } from '@tabler/icons-vue';
import type { UserRole } from '~/types';

const authStore = useCmnAuthStore();
const router = useRouter();
const route = useRoute();
const toastStore = useCmnToastStore();

// form
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const showPassword = ref(false);
const rememberMe = ref(false);
const selectedRole = ref<UserRole>('shipper');
const lastConnectedRole = ref<UserRole | null>(null);
const lastConnectedAt = ref<string | null>(null);

// Forgot password modal state
const showForgotModal = ref(false);
const showResendModal = ref(false);

onMounted(() => {
  // Charger les informations de dernière connexion
  const lastRoleCookie = useCookie<UserRole | null>('last_connected_role');
  const lastAtCookie = useCookie<string | null>('last_connected_at');

  lastConnectedRole.value = lastRoleCookie.value;
  lastConnectedAt.value = lastAtCookie.value;

  // Sélectionner par défaut le dernier rôle utilisé
  if (lastRoleCookie.value) {
    selectedRole.value = lastRoleCookie.value;
  }
});

const formatLastConnectedDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '';
  }
};

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    const result = await authStore.loginUser(email.value, password.value, selectedRole.value, rememberMe.value);

    if (result.success && result.user) {
      toastStore.addToast(`Connexion réussie ! Ravis de vous revoir, ${result.user.firstName}.`, 'success');
      // Redirection après connexion
      const redirectPath = route.query.redirect as string;
      if (redirectPath && redirectPath.startsWith('/')) {
        router.push(redirectPath);
      } else {
        // Redirection selon le rôle par défaut
        if (result.user.role === 'shipper') {
          router.push('/app/us');
        } else {
          router.push('/app/uc');
        }
      }
    } else {
      error.value = result.error || 'Erreur de connexion';
    }
  } catch (e) {
    console.error('Erreur login:', e);
    error.value = 'Une erreur inattendue est survenue';
  } finally {
    loading.value = false;
  }
};

const openForgotPasswordModal = () => {
  showForgotModal.value = true;
};
</script>
