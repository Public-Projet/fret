<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
    <!-- Corporate Banner -->
    <RootAppShpProfileHeader :profile="profile" :loading="profileStore.isLoading"
      @open-security="showSecurityModal = true" />

    <!-- Main Content -->
    <div class="container-custom mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column (Sidebar) -->
      <div class="space-y-6">
        <RootAppShpProfileAboutCard :profile="profile" accent-color="primary" :loading="profileStore.isLoading"
          @edit-email="openEmailModal" />
        <CommonProfileSecurityCard accent-color="primary" @open-password="openPasswordModal"
          @open-email="openEmailModal" />

        <!-- Documents KYC -->
        <RootAppShpProfileDocuments :kyc-documents="profile?.kycDocuments" :loading="profileStore.isLoading" />

        <!-- Statut compte / KYC -->
        <RootAppShpProfileKycStatusCard :profile="profile" :loading="profileStore.isLoading" />

        <!-- Abonnement -->
        <RootAppShpProfileSubscriptionCard :profile="profile" :loading="profileStore.isLoading" role="shipper" />
      </div>

      <!-- Right Column -->
      <div class="lg:col-span-2 space-y-6">
        <RootAppShpProfileKpiCards :announcements="0" reliability="-" rating="-" payment="-"
          :loading="profileStore.isLoading" />

        <!-- Recent Activity -->
        <RootAppShpProfileRecentActivity :loading="profileStore.isLoading" />
      </div>
    </div>

    <!-- Security Modals -->
    <ModalProfilePassword :show="showPasswordModal" :loading="passwordLoading" :error="passwordError"
      :success="passwordSuccess" accent-color="primary" @close="showPasswordModal = false"
      @submit="handleUpdatePassword" />

    <ModalProfileEmail :show="showEmailModal" :current-email="profile?.email" :loading="emailLoading"
      :error="emailError" :success="emailSuccess" accent-color="primary" @close="showEmailModal = false"
      @submit="handleUpdateEmail" />

    <ModalProfileSecurity :show="showSecurityModal" :email="profile?.email" accent-color="primary"
      @close="showSecurityModal = false" @open-password="openPasswordModal" @open-email="openEmailModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCmnProfileStore } from '~/stores/cmnProfile';

const profileStore = useCmnProfileStore();
const profile = computed(() => profileStore.profile);

// Security Modals Visibility
const showPasswordModal = ref(false);
const showEmailModal = ref(false);
const showSecurityModal = ref(false);

// Security Loading States
const passwordLoading = ref(false);
const passwordError = ref('');
const passwordSuccess = ref('');

const emailLoading = ref(false);
const emailError = ref('');
const emailSuccess = ref('');

onMounted(async () => {
  await profileStore.fetchProfile('shipper');
});

const openPasswordModal = () => {
  showSecurityModal.value = false;
  passwordError.value = '';
  passwordSuccess.value = '';
  showPasswordModal.value = true;
};

const openEmailModal = () => {
  showSecurityModal.value = false;
  emailError.value = '';
  emailSuccess.value = '';
  showEmailModal.value = true;
};

const handleUpdatePassword = async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
  passwordError.value = '';
  if (data.newPassword !== data.confirmPassword) {
    passwordError.value = 'Les mots de passe ne correspondent pas.';
    return;
  }
  passwordLoading.value = true;
  const result = await profileStore.updatePassword('shipper', {
    currentPassword: data.currentPassword,
    newPassword: data.newPassword
  }, { skipAuthRedirect: true });
  passwordLoading.value = false;
  if (result.success) {
    passwordSuccess.value = result.message || 'Mot de passe mis à jour !';
    setTimeout(() => { showPasswordModal.value = false; }, 1500);
  } else {
    passwordError.value = result.error || 'Une erreur est survenue';
  }
};

const handleUpdateEmail = async (data: { newEmail: string; password: string }) => {
  emailLoading.value = true;
  emailError.value = '';
  const result = await profileStore.updateEmail('shipper', data, { skipAuthRedirect: true });
  emailLoading.value = false;
  if (result.success) {
    emailSuccess.value = result.message || 'Email mis à jour !';
    await profileStore.fetchProfile('shipper', { skipAuthRedirect: true });
    setTimeout(() => { showEmailModal.value = false; }, 1500);
  } else {
    emailError.value = result.error || 'Une erreur est survenue';
  }
};

definePageMeta({ layout: 'default' });
useHead({
  title: 'Mon Profil Expéditeur',
  meta: [
    { name: 'description', content: 'Gérez les informations de votre profil expéditeur.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
