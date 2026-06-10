<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
    <!-- Header with Map Background Effect -->
    <ProfileCarrierHeader :profile="profile" />

    <!-- Stats Bar -->
    <ProfileCarrierStatsBar :missions="0" :rating="'-'" :vehicles="vehicles.length"
      @open-security="showSecurityModal = true" @open-edit="openEditModal" />

    <div class="container-custom mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Info -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Fleet Section -->
        <section>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <IconTruck class="w-5 h-5 mr-2 text-secondary-600" />
              Ma Flotte
            </h3>
            <button v-if="vehicles.length > 0" @click="openVehicleModal"
              class="btn btn-secondary btn-xs flex items-center">
              <IconPlus class="w-3 h-3 mr-1" />
              Ajouter
            </button>
          </div>

          <div v-if="vehicles.length === 0"
            class="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
            <IconTruck class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p class="text-gray-500 dark:text-gray-400 mb-4">Aucun véhicule enregistré</p>
            <button @click="openVehicleModal" class="mx-auto flex items-center btn btn-secondary btn-sm">
              <IconPlus class="w-4 h-4 mr-1" />
              Ajouter un véhicule
            </button>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="vehicle in vehicles" :key="vehicle.id"
              class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h4 class="font-bold text-gray-900 dark:text-white">{{ vehicle.brand }} {{ vehicle.model }}</h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400 font-mono">{{ vehicle.licensePlate }}</p>
                </div>
                <div class="flex space-x-1">
                  <button @click="openEditVehicleModal(vehicle)"
                    class="p-1.5 text-gray-400 hover:text-secondary-600 transition-colors bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                    title="Modifier">
                    <IconPencil class="w-3.5 h-3.5" />
                  </button>
                  <button @click="handleDeleteVehicle(vehicle.id)"
                    class="p-1.5 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                    title="Supprimer">
                    <IconTrash class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div class="flex space-x-2 mb-3">
                <span class="badge badge-outline text-xs capitalize">{{ vehicle.type }}</span>
                <span class="badge text-xs" :class="vehicle.status === 'available' ? 'badge-success' : 'badge-warning'">
                  {{ vehicle.status === 'available' ? 'Disponible' : vehicle.status === 'in_transit' ? 'En transit' :
                    'Maintenance' }}
                </span>
              </div>
              <NuxtLink :to="`/app/uc/vehicles/${vehicle.id}`"
                class="text-xs text-secondary-600 hover:text-secondary-700 font-medium block text-right">
                Voir détails &rarr;
              </NuxtLink>
            </div>
          </div>
        </section>

        <!-- Certifications -->
        <section>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <IconCertificate class="w-5 h-5 mr-2 text-secondary-600" />
            Documents & Certifications
          </h3>
          <div v-if="!profile?.kycDocuments || profile.kycDocuments.length === 0"
            class="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
            <IconFileCheck class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p class="text-gray-500 dark:text-gray-400 mb-4">Aucun document soumis</p>
            <button @click="openKycModal" class="mx-auto flex items-center btn btn-outline btn-sm">
              <IconPlus class="w-4 h-4 mr-1" />
              Soumettre un document
            </button>
          </div>

          <div v-else class="space-y-4">
            <div v-for="doc in profile.kycDocuments" :key="doc.id"
              class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <IconFileCheck v-if="doc.status === 'verified'" class="w-5 h-5 text-green-500" />
                  <IconLoader2 v-else-if="doc.status === 'pending'" class="w-5 h-5 text-yellow-500" />
                  <IconX v-else class="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h4 class="font-bold text-gray-900 dark:text-white">{{ getDocTypeName(doc.type) }}</h4>
                  <div class="flex items-center space-x-2">
                    <p class="text-xs text-gray-500">Soumis le {{ formatDate(doc.uploadedAt) }}</p>
                    <span class="text-gray-300">•</span>
                    <NuxtLink :to="`/app/uc/kyc/${doc.id}`"
                      class="text-xs text-secondary-600 hover:text-secondary-700 font-medium flex items-center">
                      <IconEye class="w-3 h-3 mr-1" /> Détails
                    </NuxtLink>
                  </div>
                </div>
              </div>
              <span class="badge" :class="{
                'badge-success': doc.status === 'verified',
                'badge-warning': doc.status === 'pending',
                'badge-error': doc.status === 'rejected'
              }">
                {{ getStatusLabel(doc.status) }}
              </span>
            </div>
            <button @click="openKycModal"
              class="flex items-center justify-center btn btn-ghost btn-sm w-full border border-dashed">
              <IconPlus class="w-4 h-4 mr-1" /> Ajouter un autre document
            </button>
          </div>
        </section>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <ProfileContactCard :profile="profile" accent-color="secondary" @edit-email="openEmailModal" />
        <ProfileSecurityCard accent-color="secondary" @open-password="openPasswordModal" @open-email="openEmailModal" />

        <div class="bg-secondary-600 text-white rounded-xl p-6 relative overflow-hidden">
          <div class="relative z-10">
            <h4 class="font-bold mb-2">Besoin d'aide ?</h4>
            <p class="text-secondary-100 text-sm mb-2">Contactez le support pour mettre à jour vos documents.</p>
            <div class="flex items-center space-x-2 mb-4">
              <span class="text-xs text-secondary-200 font-medium">Statut KYC:</span>
              <span class="badge badge-sm" :class="getKycStatusClass(profile?.kycStatus)">
                {{ getKycStatusLabel(profile?.kycStatus) }}
              </span>
            </div>
            <NuxtLink to="/support/contact" class="btn bg-white text-secondary-700 border-0 btn-sm">Support</NuxtLink>
          </div>
          <IconHeadset class="absolute -bottom-4 -right-4 w-24 h-24 text-white/10" />
        </div>

        <!-- Subscription Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h4 class="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <IconCreditCard class="w-5 h-5 mr-2 text-secondary-600" />
            Abonnement
          </h4>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">Plan</span>
              <span class="badge"
                :class="profile?.subscriptionStatus === 'active' && profile?.subscriptionPlan === 'pro' ? 'badge-secondary text-white' : 'badge-ghost'">{{
                  profile?.subscriptionStatus === 'active' && profile?.subscriptionPlan === 'pro' ? 'Pro' : 'Gratuit'
                }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">Facturation</span>
              <span class="text-sm font-medium">{{ profile?.subscriptionStatus === 'active' && profile?.subscriptionType
                ? (profile?.subscriptionType === 'annual' ? 'Annuelle' : 'Mensuelle') : 'Aucune' }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">Statut</span>
              <span class="badge badge-sm"
                :class="profile?.subscriptionStatus === 'active' ? 'badge-success text-white' : 'badge-error text-white'">
                {{ profile?.subscriptionStatus === 'active' ? 'Actif' : 'Inactif' }}
              </span>
            </div>
            <div class="flex justify-between items-center" v-if="profile?.subscriptionExpiresAt">
              <span class="text-sm text-gray-500">Expire le</span>
              <span class="text-sm font-medium">{{ formatDate(profile?.subscriptionExpiresAt) }}</span>
            </div>
          </div>
          <NuxtLink v-if="profile?.subscriptionPlan !== 'pro'" to="/pricing"
            class="btn btn-secondary btn-sm w-full mt-4">Passer Pro</NuxtLink>
          <div v-if="canCancelSubscription" class="mt-4">
            <button @click="handleCancelSubscription"
              class="flex items-center justify-center btn btn-outline border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 btn-sm w-full"
              :disabled="cancelLoading">
              <template v-if="cancelLoading">
                <UiStepLoading :steps="['Annulation', 'Génération de la facture', 'Envoi de la facture']"
                  :active-step="cancelActiveStep" :auto-play="false" color="primary" mode="replace" />
              </template>
              <template v-else>
                <IconCircleX class="w-4 h-4 mr-2" />
                Annuler et rembourser
              </template>
            </button>
            <p v-if="cancelError" class="text-xs text-red-500 mt-2">{{ cancelError }}</p>
            <p v-if="cancelSuccess" class="text-xs text-green-500 mt-2">{{ cancelSuccess }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ProfileEditModal :show="showEditModal" :profile="profile" :loading="editLoading" :error="editError"
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

    <ProfileKycModal :show="showKycModal" :loading="kycLoading" :error="kycError" :success="kycSuccess"
      @close="showKycModal = false" @submit="handleKycSubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCmnProfileStore } from '~/stores/cmnProfile';
import { useCarVehiclesStore } from '~/stores/carVehicles';
import type { AddVehicleData, Vehicle } from '~/types';
import { IconTruck, IconCertificate, IconFileCheck, IconHeadset, IconPlus, IconTrash, IconPencil, IconX, IconCircleX, IconLoader2, IconEye, IconCreditCard } from '@tabler/icons-vue';
import { getSubscriptionStatusLabel, getKycStatusLabel, getKycStatusClass, formatDate } from '~/utils/maps';
import { useCmnSubscriptionStore } from '~/stores/cmnSubscription';

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

const cancelLoading = ref(false);
const cancelActiveStep = ref(0);
const cancelError = ref('');
const cancelSuccess = ref('');

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const canCancelSubscription = computed(() => {
  if (profile.value?.subscriptionStatus !== 'active' || !profile.value?.subscriptionExpiresAt) return false;
  const duration = profile.value.subscriptionType === 'annual' ? 365 : 30;
  const createdDate = profile.value.subscriptionExpiresAt - (duration * 24 * 60 * 60 * 1000);
  const now = Date.now();
  return (now - createdDate) <= (3 * 24 * 60 * 60 * 1000);
});

const showVehicleModal = ref(false);
const showKycModal = ref(false);

const selectedVehicle = ref<Vehicle | null>(null);
const vehicleLoading = ref(false);
const vehicleError = ref('');
const vehicleSuccess = ref('');

// Edit Profile state
const editLoading = ref(false);
const editError = ref('');
const editSuccess = ref('');

// Password state
const passwordLoading = ref(false);
const passwordError = ref('');
const passwordSuccess = ref('');

// Email state
const emailLoading = ref(false);
const emailError = ref('');
const emailSuccess = ref('');

// KYC state
const kycLoading = ref(false);
const kycError = ref('');
const kycSuccess = ref('');

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

onMounted(async () => {
  await profileStore.fetchProfile('carrier');
});

const openVehicleModal = () => {
  selectedVehicle.value = null; // Add mode
  vehicleError.value = '';
  vehicleSuccess.value = '';
  showVehicleModal.value = true;
};

const openEditVehicleModal = (vehicle: Vehicle) => {
  selectedVehicle.value = vehicle; // Edit mode
  vehicleError.value = '';
  vehicleSuccess.value = '';
  showVehicleModal.value = true;
};

const handleVehicleSubmit = async (data: AddVehicleData) => {
  vehicleLoading.value = true;
  vehicleError.value = '';
  vehicleSuccess.value = '';

  let result;
  if (selectedVehicle.value) {
    result = await carVehicleStore.updateCarVehicleDetail(selectedVehicle.value.id, data);
  } else {
    result = await carVehicleStore.addCarVehicle(data);
  }

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
  if (!result.success) {
    alert(result.error || 'Erreur lors de la suppression');
  }
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

  // Use skipAuthRedirect to avoid auto-redirects on 401/403 errors
  const result = await profileStore.updateEmail('carrier', data, { skipAuthRedirect: true });

  emailLoading.value = false;
  if (result.success) {
    emailSuccess.value = result.message || 'Email mis à jour !';

    // Refresh profile but don't redirect if it fails (e.g. invalid token after update)
    await profileStore.fetchProfile('carrier', { skipAuthRedirect: true });

    setTimeout(() => { showEmailModal.value = false; }, 1500);
  } else {
    emailError.value = result.error || 'Une erreur est survenue';
  }
};

const handleCancelSubscription = async () => {
  if (!confirm('Êtes-vous sûr de vouloir annuler votre abonnement ? Cette action est irréversible et un administrateur traitera votre remboursement sous peu.')) return;

  cancelLoading.value = true;
  cancelActiveStep.value = 0; // Initialisation
  cancelError.value = '';
  cancelSuccess.value = '';

  try {
    await sleep(800); // Laisse le temps de voir l'initialisation
    cancelActiveStep.value = 1; // Annulation
    await sleep(400);

    const result = await subscriptionStore.cancelSubscription();

    if (result.success) {
      cancelActiveStep.value = 2; // Génération de la facture
      await sleep(1000);

      cancelActiveStep.value = 3; // Envoi de la facture
      await sleep(1200);

      cancelActiveStep.value = 4; // Finalisation
      await sleep(800);

      cancelSuccess.value = result.message;
      await profileStore.fetchProfile('carrier', { skipAuthRedirect: true });
    } else {
      cancelError.value = result.error || 'Erreur lors de l\'annulation';
    }
  } catch (err: any) {
    console.error('Cancel error:', err);
    cancelError.value = 'Une erreur est survenue lors de l\'annulation.';
  } finally {
    cancelLoading.value = false;
  }
};

const openKycModal = () => {
  kycError.value = '';
  kycSuccess.value = '';
  showKycModal.value = true;
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

const getDocTypeName = (type: string) => {
  const types: Record<string, string> = {
    id_card: "Carte d'identité",
    drivers_license: "Permis de conduire",
    truck_insurance: "Assurance véhicule",
    business_license: "Licence de transport"
  };
  return types[type] || type;
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    verified: 'Vérifié',
    rejected: 'Rejeté'
  };
  return labels[status] || status;
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
