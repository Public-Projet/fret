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
      <RootAuthLoginRoleTabs v-model="selectedRole" :last-connected-role="lastConnectedRole" />

      <!-- Formulaire de connexion -->
      <RootAuthLoginLoginForm v-model:email="email" v-model:password="password" v-model:rememberMe="rememberMe"
        :role="selectedRole" :loading="loading" :error="error" @submit="handleLogin"
        @forgot-password="openForgotPasswordModal" @resend-email="showResendModal = true" />

      <!-- Info sur le dernier accès -->
      <RootAuthLoginLastConnectionInfo :last-connected-role="lastConnectedRole" :last-connected-at="lastConnectedAt" />
    </div>

    <!-- Modal Mot de passe oublié -->
    <ModalForgotPassword v-model="showForgotModal" :role="selectedRole" :initial-email="email" />

    <!-- Modal Resend Verification -->
    <ModalResendVerification v-model="showResendModal" :role="selectedRole" :initial-email="email" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import type { UserRole } from '~/types';

const authStore = useCmnAuthStore();
const router = useRouter();
const route = useRoute();
const toastStore = useCmnToastStore();

// Form state
const email = ref('');
const password = ref('');
const rememberMe = ref(false);

const error = ref('');
const loading = ref(false);
const selectedRole = ref<UserRole>('shipper');
const lastConnectedRole = ref<UserRole | null>(null);
const lastConnectedAt = ref<string | null>(null);

// Modal states
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
