<template>
  <NuxtLayout name="auth"
    bg-image="https://images.unsplash.com/photo-1700716465891-9e5e9f501d7d?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGltcG9ydGF0aW9ufGVufDB8fDB8fHww"
    quote="Le réseau qui fait circuler le fret sans perte de temps">
    <div class="w-full space-y-8">
      <RootAuthLoginHeader />

      <!-- Tabs Expéditeur / Transporteur -->
      <RootAuthLoginRoleTabs v-model="selectedRole" :last-connected-role="lastConnectedRole" />

      <!-- Formulaire de connexion -->
      <RootAuthLoginForm v-model:email="email" v-model:password="password" v-model:rememberMe="rememberMe"
        :role="selectedRole" :loading="loading" :error="error" @submit="handleLogin"
        @forgot-password="openForgotPasswordModal" @resend-email="showResendModal = true" />

      <!-- Info sur le dernier accès -->
      <RootAuthLoginLastConnectionInfo :last-connected-role="lastConnectedRole" :last-connected-at="lastConnectedAt" />
    </div>

    <!-- Modal Mot de passe oublié -->
    <ModalAuthForgotPassword v-model="showForgotModal" :role="selectedRole" :initial-email="email" />

    <!-- Modal Resend Verification -->
    <ModalAuthResendVerification v-model="showResendModal" :role="selectedRole" :initial-email="email" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import type { UserRole } from '~/types';

definePageMeta({
  layout: false
});

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
      const msg = result.error || 'Erreur de connexion';
      error.value = msg;
      // Toast en attente de validation → warning, sinon erreur
      const toastType = msg.includes('en attente de validation') ? 'warning' : 'error';
      toastStore.addToast(msg, toastType);
    }
  } catch (e) {
    console.error('Erreur login:', e);
    const msg = 'Une erreur inattendue est survenue';
    error.value = msg;
    toastStore.addToast(msg, 'error');
  } finally {
    loading.value = false;
  }
};

const openForgotPasswordModal = () => {
  showForgotModal.value = true;
};

useHead({
  title: 'Connexion',
  meta: [
    { name: 'description', content: 'Connectez-vous à votre compte Bourse de Fret pour accéder à votre espace.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
