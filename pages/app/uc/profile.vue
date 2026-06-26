<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
    <!-- Header -->
    <RootAppCarProfileHeader :profile="profile" :loading="profileStore.isLoading"
      @open-security="showSecurityModal = true" />

    <!-- Stats Bar -->
    <RootAppCarProfileStatsBar :missions="0" :rating="'-'" :vehicles="vehicles.length"
      :loading="profileStore.isLoading" />

    <div class="container-custom mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Info -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Fleet Section -->
        <RootAppCarProfileFleet :vehicles="vehicles" :loading="carVehicleStore.vehiclesLoading" />

        <!-- Documents & Certifications -->
        <RootAppCarProfileDocuments :kyc-documents="profile?.kycDocuments" :loading="profileStore.isLoading" />
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <RootAppCarProfileContactCard :profile="profile" accent-color="secondary" :loading="profileStore.isLoading"
          @edit-email="openEmailModal" />
        <CommonProfileSecurityCard accent-color="secondary" @open-password="openPasswordModal"
          @open-email="openEmailModal" />
        <RootAppCarProfileKycStatusCard :profile="profile" :loading="profileStore.isLoading" />
        <RootAppCarProfileSubscriptionCard :profile="profile" :loading="profileStore.isLoading" role="carrier" />
      </div>
    </div>

    <!-- Security & Credentials Modals -->
    <ModalProfilePassword :show="showPasswordModal" :loading="passwordLoading" :error="passwordError"
      :success="passwordSuccess" accent-color="secondary" @close="showPasswordModal = false"
      @submit="handleUpdatePassword" />

    <ModalProfileEmail :show="showEmailModal" :current-email="profile?.email" :loading="emailLoading"
      :error="emailError" :success="emailSuccess" accent-color="secondary" @close="showEmailModal = false"
      @submit="handleUpdateEmail" />

    <ModalProfileSecurity :show="showSecurityModal" :email="profile?.email" accent-color="secondary"
      @close="showSecurityModal = false" @open-password="openPasswordModal" @open-email="openEmailModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCmnProfileStore } from '~/stores/cmnProfile';
import { useCarVehiclesStore } from '~/stores/carVehicles';

const profileStore = useCmnProfileStore();
const carVehicleStore = useCarVehiclesStore();

const profile = computed(() => profileStore.profile);
const vehicles = computed(() => carVehicleStore.vehicles);

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
  await profileStore.fetchProfile('carrier');
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
  const result = await profileStore.updatePassword('carrier', {
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
  const result = await profileStore.updateEmail('carrier', data, { skipAuthRedirect: true });
  emailLoading.value = false;
  if (result.success) {
    emailSuccess.value = result.message || 'Email mis à jour !';
    await profileStore.fetchProfile('carrier', { skipAuthRedirect: true });
    setTimeout(() => { showEmailModal.value = false; }, 1500);
  } else {
    emailError.value = result.error || 'Une erreur est survenue';
  }
};

definePageMeta({ layout: 'default' });
useHead({
  title: 'Mon Profil Transporteur',
  meta: [
    { name: 'description', content: 'Gérez les informations de votre profil transporteur.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
