<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
    <!-- Header -->
    <RootAppCarProfilHeader :profile="profile" :loading="profileStore.isLoading" />

    <!-- Stats Bar -->
    <RootAppCarProfilStatsBar :missions="0" :rating="'-'" :vehicles="vehicles.length" :loading="profileStore.isLoading"
      @open-security="showSecurityModal = true" @open-edit="openEditModal" />

    <div class="container-custom mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Info -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Fleet Section -->
        <RootAppCarProfilFleet :vehicles="vehicles" :loading="carVehicleStore.vehiclesLoading"
          @add-vehicle="openVehicleModal" @edit-vehicle="openEditVehicleModal" @delete-vehicle="handleDeleteVehicle" />

        <!-- Documents & Certifications -->
        <RootAppCarProfilDocuments :kyc-documents="profile?.kycDocuments" :loading="profileStore.isLoading"
          @add-doc="openKycModal" />
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <RootAppCarProfilContactCard :profile="profile" accent-color="secondary" :loading="profileStore.isLoading"
          @edit-email="openEmailModal" />
        <CommonProfileSecurityCard accent-color="secondary" @open-password="openPasswordModal"
          @open-email="openEmailModal" />
        <RootAppCarProfilKycStatusCard :profile="profile" :loading="profileStore.isLoading" />
        <RootAppCarProfilSubscriptionCard :profile="profile" :can-cancel="canCancelSubscription"
          :cancel-loading="cancelLoading" :cancel-active-step="cancelActiveStep" :cancel-error="cancelError"
          :cancel-success="cancelSuccess" :loading="profileStore.isLoading"
          @cancel-subscription="handleCancelSubscription" />
      </div>
    </div>

    <!-- Modals -->
    <ModalProfileEdit :show="showEditModal" :profile="profile" :loading="editLoading" :error="editError"
      :success="editSuccess" accent-color="secondary" @close="showEditModal = false" @submit="handleUpdateProfile" />

    <ModalProfilePassword :show="showPasswordModal" :loading="passwordLoading" :error="passwordError"
      :success="passwordSuccess" accent-color="secondary" @close="showPasswordModal = false"
      @submit="handleUpdatePassword" />

    <ModalProfileEmail :show="showEmailModal" :current-email="profile?.email" :loading="emailLoading"
      :error="emailError" :success="emailSuccess" accent-color="secondary" @close="showEmailModal = false"
      @submit="handleUpdateEmail" />

    <ModalProfileVehicle :show="showVehicleModal" :vehicle="selectedVehicle" :loading="vehicleLoading"
      :error="vehicleError" :success="vehicleSuccess" @close="showVehicleModal = false" @submit="handleVehicleSubmit" />

    <ModalProfileSecurity :show="showSecurityModal" :email="profile?.email" accent-color="secondary"
      @close="showSecurityModal = false" @open-password="openPasswordModal" @open-email="openEmailModal" />

    <ModalProfileKyc :show="showKycModal" :loading="kycLoading" :error="kycError" :success="kycSuccess"
      @close="showKycModal = false" @submit="handleKycSubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCmnProfileStore } from '~/stores/cmnProfile';
import { useCarVehiclesStore } from '~/stores/carVehicles';
import { useCmnSubscriptionStore } from '~/stores/cmnSubscription';
import type { AddVehicleData, Vehicle } from '~/types';

const profileStore = useCmnProfileStore();
const carVehicleStore = useCarVehiclesStore();
const subscriptionStore = useCmnSubscriptionStore();

const profile = computed(() => profileStore.profile);
const vehicles = computed(() => carVehicleStore.vehicles);

// Modals visibility
const showEditModal = ref(false);
const showPasswordModal = ref(false);
const showEmailModal = ref(false);
const showSecurityModal = ref(false);
const showVehicleModal = ref(false);
const showKycModal = ref(false);

// Selected vehicle for edit
const selectedVehicle = ref<Vehicle | null>(null);

// Loading states
const editLoading = ref(false);
const editError = ref('');
const editSuccess = ref('');

const passwordLoading = ref(false);
const passwordError = ref('');
const passwordSuccess = ref('');

const emailLoading = ref(false);
const emailError = ref('');
const emailSuccess = ref('');

const vehicleLoading = ref(false);
const vehicleError = ref('');
const vehicleSuccess = ref('');

const kycLoading = ref(false);
const kycError = ref('');
const kycSuccess = ref('');

const cancelLoading = ref(false);
const cancelActiveStep = ref(0);
const cancelError = ref('');
const cancelSuccess = ref('');

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const canCancelSubscription = computed(() => {
  if (profile.value?.subscriptionStatus !== 'active' || !profile.value?.subscriptionExpiresAt) return false;
  const duration = profile.value.subscriptionType === 'annual' ? 365 : 30;
  const createdDate = profile.value.subscriptionExpiresAt - (duration * 24 * 60 * 60 * 1000);
  return (Date.now() - createdDate) <= (3 * 24 * 60 * 60 * 1000);
});

onMounted(async () => {
  await profileStore.fetchProfile('carrier');
});

// Modal openers
const openEditModal = () => {
  editError.value = '';
  editSuccess.value = '';
  showEditModal.value = true;
};

const openPasswordModal = () => {
  passwordError.value = '';
  passwordSuccess.value = '';
  showPasswordModal.value = true;
};

const openEmailModal = () => {
  emailError.value = '';
  emailSuccess.value = '';
  showEmailModal.value = true;
};

const openVehicleModal = () => {
  selectedVehicle.value = null;
  vehicleError.value = '';
  vehicleSuccess.value = '';
  showVehicleModal.value = true;
};

const openEditVehicleModal = (vehicle: Vehicle) => {
  selectedVehicle.value = vehicle;
  vehicleError.value = '';
  vehicleSuccess.value = '';
  showVehicleModal.value = true;
};

const openKycModal = () => {
  kycError.value = '';
  kycSuccess.value = '';
  showKycModal.value = true;
};

// Form handlers
const handleUpdateProfile = async (data: { firstname: string; lastname: string; phone: string; bio: string; photoUrl: string }) => {
  editLoading.value = true;
  editError.value = '';
  editSuccess.value = '';
  const result = await profileStore.updateProfile('carrier', data);
  editLoading.value = false;
  if (result.success) {
    editSuccess.value = result.message || 'Profil mis à jour !';
    setTimeout(() => { showEditModal.value = false; }, 1500);
  } else {
    editError.value = result.error || 'Une erreur est survenue';
  }
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

const handleVehicleSubmit = async (data: AddVehicleData) => {
  vehicleLoading.value = true;
  vehicleError.value = '';
  vehicleSuccess.value = '';
  const result = selectedVehicle.value
    ? await carVehicleStore.updateCarVehicleDetail(selectedVehicle.value.id, data)
    : await carVehicleStore.addCarVehicle(data);
  vehicleLoading.value = false;
  if (result.success) {
    vehicleSuccess.value = result.message || (selectedVehicle.value ? 'Véhicule mis à jour !' : 'Véhicule ajouté !');
    setTimeout(() => { showVehicleModal.value = false; }, 1500);
  } else {
    vehicleError.value = result.error || 'Une erreur est survenue';
  }
};

const handleDeleteVehicle = async (id: string) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) return;
  const result = await carVehicleStore.deleteCarVehicle(id);
  if (!result.success) alert(result.error || 'Erreur lors de la suppression');
};

const handleKycSubmit = async (data: { type: string; file: File }) => {
  kycLoading.value = true;
  kycError.value = '';
  kycSuccess.value = '';
  const result = await profileStore.uploadKycDocument(data.type, data.file);
  kycLoading.value = false;
  if (result.success) {
    kycSuccess.value = result.message || 'Document soumis avec succès !';
    setTimeout(() => { showKycModal.value = false; }, 1500);
  } else {
    kycError.value = result.error || 'Une erreur est survenue lors de l\'envoi';
  }
};

const handleCancelSubscription = async () => {
  if (!confirm('Êtes-vous sûr de vouloir annuler votre abonnement ? Cette action est irréversible et un administrateur traitera votre remboursement sous peu.')) return;

  cancelLoading.value = true;
  cancelActiveStep.value = 0;
  cancelError.value = '';
  cancelSuccess.value = '';

  try {
    await sleep(800);
    cancelActiveStep.value = 1;
    await sleep(400);
    const result = await subscriptionStore.cancelSubscription();
    if (result.success) {
      cancelActiveStep.value = 2;
      await sleep(1000);
      cancelActiveStep.value = 3;
      await sleep(1200);
      cancelActiveStep.value = 4;
      await sleep(800);
      cancelSuccess.value = result.message;
      await profileStore.fetchProfile('carrier', { skipAuthRedirect: true });
    } else {
      cancelError.value = result.error || 'Erreur lors de l\'annulation';
    }
  } catch (err: any) {
    cancelError.value = 'Une erreur est survenue lors de l\'annulation.';
  } finally {
    cancelLoading.value = false;
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
