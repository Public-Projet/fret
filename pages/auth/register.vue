<template>
  <NuxtLayout name="auth"
    bg-image="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    quote="Un réseau puissant pour faire avancer votre business.">

    <div class="w-full space-y-6">
      <RootAuthRegisterHeader />

      <!-- Tabs Expéditeur / Transporteur -->
      <RootAuthRegisterRoleCards v-model="role" />

      <!-- Formulaire d'inscription -->
      <RootAuthRegisterForm v-model:form="form" :role="role" :loading="loading" :active-step="activeStep" @submit="handleRegister" />

      <!-- Footer -->
      <RootAuthRegisterTermsFooter />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import type { UserRole } from '~/types';

definePageMeta({
  layout: false
});

const route = useRoute();
const router = useRouter();
const authStore = useCmnAuthStore();
const toastStore = useCmnToastStore();

const role = ref<UserRole>('shipper');
const loading = ref(false);
const activeStep = ref(0);

const form = ref({
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
  activeStep.value = 0;

  try {
    await sleep(800);
    activeStep.value = 1;
    await sleep(400);

    const result = await authStore.registerUser({
      email: form.value.email,
      password: form.value.password,
      firstname: form.value.firstname,
      lastname: form.value.lastname,
    }, role.value);

    if (result.success) {
      activeStep.value = 2;
      await sleep(1200);

      activeStep.value = 3;
      await sleep(800);

      toastStore.addToast(
        result.message || 'Inscription réussie ! Vérifiez votre email pour activer votre compte.',
        'success'
      );

      // Réinitialiser le formulaire
      form.value.firstname = '';
      form.value.lastname = '';
      form.value.email = '';
      form.value.password = '';

      // Rediriger vers la page de login après 3 secondes
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } else {
      toastStore.addToast(result.error || 'Erreur lors de l\'inscription', 'error');
    }
  } catch (e) {
    console.error('Erreur register:', e);
    toastStore.addToast('Une erreur inattendue est survenue', 'error');
  } finally {
    loading.value = false;
  }
};

useHead({
  title: 'Inscription',
  meta: [
    { name: 'description', content: 'Créez votre compte Bourse de Fret pour commencer à expédier ou transporter des marchandises.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
