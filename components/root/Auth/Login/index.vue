<template>
  <NuxtLayout name="auth">
    <div class="w-full space-y-8">
      <RootAuthLoginLoginForm v-model:email="email" v-model:password="password" v-model:rememberMe="rememberMe"
        :role="selectedRole" :loading="loading" :error="error" @submit="handleLogin"
        @forgot-password="openForgotPasswordModal" @resend-email="showResendModal = true" />
    </div>

    <ModalForgotPassword v-model="showForgotModal" :role="selectedRole" :initial-email="email" />

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
