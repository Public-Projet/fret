<template>
  <NuxtLayout name="auth"
    bg-image="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    quote="Un réseau puissant pour faire avancer votre business.">
    <RootAuthRegister />


    <div class="w-full space-y-6">
      <RootAuthRegisterHeader />

      <RootAuthRegisterRoleCards v-model="role" />

      <RootAuthRegisterForm v-model:form="form" :role="role" :loading="loading" :active-step="activeStep" :error="error"
        :success-message="successMessage" @submit="handleRegister" />

      <RootAuthRegisterTermsFooter />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import type { UserRole } from '~/types';

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
  activeStep.value = 0;

  try {
    await sleep(800);
    activeStep.value = 1;
    await sleep(400);

    const result = await authStore.registerUser({
      email: form.email,
      password: form.password,
      firstname: form.firstname,
      lastname: form.lastname,
    }, role.value);

    if (result.success) {
      activeStep.value = 2;
      await sleep(1200);

      activeStep.value = 3;
      await sleep(800);

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
  title: 'Inscription',
  meta: [
    { name: 'description', content: 'Créez votre compte Bourse de Fret pour commencer à expédier ou transporter des marchandises.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
