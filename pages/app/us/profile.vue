<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
    <!-- Corporate Banner -->
    <ProfileShipperHeader :profile="profile" @open-security="showSecurityModal = true" @open-edit="openEditModal" />

    <!-- Main Content -->
    <div class="container-custom mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column -->
      <div class="space-y-6">
        <ProfileAboutCard :profile="profile" accent-color="primary" @edit-email="openEmailModal" />
        <ProfileSecurityCard accent-color="primary" @open-password="openPasswordModal" @open-email="openEmailModal" />

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <IconCertificate class="w-5 h-5 mr-2 text-primary-600" />
            Documents
          </h3>

          <div v-if="!profile?.kycDocuments || profile.kycDocuments.length === 0" class="text-center py-4">
            <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">Aucun document</p>
            <button @click="openKycModal" class="btn btn-primary btn-sm w-full">
              <IconPlus class="w-4 h-4 mr-1" /> Ajouter
            </button>
          </div>

          <div v-else class="space-y-3">
            <div v-for="doc in profile.kycDocuments" :key="doc.id"
              class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div class="flex items-center space-x-3 overflow-hidden">
                <IconFileCheck v-if="doc.status === 'verified'" class="w-5 h-5 text-green-500 flex-shrink-0" />
                <IconLoader2 v-else-if="doc.status === 'pending'" class="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <IconX v-else class="w-5 h-5 text-red-500 flex-shrink-0" />
                <div class="min-w-0">
                  <p class="text-sm font-medium truncate text-gray-900 dark:text-white">{{ getDocTypeName(doc.type) }}
                  </p>
                  <NuxtLink :to="`/app/us/kyc/${doc.id}`"
                    class="text-xs text-primary-600 hover:text-primary-700 flex items-center mt-0.5">
                    <IconEye class="w-3 h-3 mr-1" /> Détails
                  </NuxtLink>
                </div>
              </div>
              <span class="badge badge-sm" :class="{
                'badge-success': doc.status === 'verified',
                'badge-warning': doc.status === 'pending',
                'badge-error': doc.status === 'rejected'
              }">{{ getStatusLabel(doc.status) }}</span>
            </div>
            <button @click="openKycModal" class="btn btn-ghost btn-sm w-full text-primary-600 text-xs">
              + Ajouter un autre
            </button>
          </div>
        </div>

        <div
          class="bg-gradient-to-br from-primary-900 to-slate-900 text-white rounded-xl shadow-lg p-6 relative overflow-hidden">
          <div class="relative z-10">
            <h3 class="text-lg font-bold mb-1">Expéditeur</h3>
            <p class="text-primary-200 text-sm mb-2">Compte {{ profile?.status === 'active' ? 'actif' : 'en attente' }}
            </p>
            <div class="flex items-center space-x-2">
              <span class="text-xs text-primary-300">Statut KYC:</span>
              <span class="badge badge-sm" :class="getKycStatusClass(profile?.kycStatus)">
                {{ getKycStatusLabel(profile?.kycStatus) }}
              </span>
            </div>
          </div>
          <IconPremiumRights class="absolute -bottom-4 -right-4 w-32 h-32 text-white/5" />
        </div>
      </div>

      <!-- Right Column -->
      <div class="lg:col-span-2 space-y-6">
        <!-- KPI Cards -->
        <ProfileShipperKpiCards :announcements="0" reliability="-" rating="-" payment="-" />

        <!-- Recent Activity -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="font-bold text-gray-900 dark:text-white mb-6">Activité Récente</h3>
          <div class="text-center py-8">
            <IconHistory class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p class="text-gray-500 dark:text-gray-400">Aucune activité récente</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ProfileEditModal :show="showEditModal" :profile="profile" :loading="editLoading" :error="editError"
      :success="editSuccess" accent-color="primary" @close="showEditModal = false" @submit="handleUpdateProfile" />

    <ModalProfilePassword :show="showPasswordModal" :loading="passwordLoading" :error="passwordError"
      :success="passwordSuccess" accent-color="primary" @close="showPasswordModal = false"
      @submit="handleUpdatePassword" />

    <ModalProfileEmail :show="showEmailModal" :current-email="profile?.email" :loading="emailLoading"
      :error="emailError" :success="emailSuccess" accent-color="primary" @close="showEmailModal = false"
      @submit="handleUpdateEmail" />

    <ModalProfileSecurity :show="showSecurityModal" :email="profile?.email" accent-color="primary"
      @close="showSecurityModal = false" @open-password="openPasswordModal" @open-email="openEmailModal" />

    <ProfileKycModal :show="showKycModal" :loading="kycLoading" :error="kycError" :success="kycSuccess" role="shipper"
      @close="showKycModal = false" @submit="handleKycSubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useProfileStore } from '~/stores/profile';
import { IconPremiumRights, IconHistory, IconCertificate, IconPlus, IconFileCheck, IconLoader2, IconX, IconDownload, IconEye } from '@tabler/icons-vue';

const profileStore = useProfileStore();
const profile = computed(() => profileStore.profile);

// Modals visibility
const showEditModal = ref(false);
const showPasswordModal = ref(false);
const showEmailModal = ref(false);
const showSecurityModal = ref(false);

// Edit profile state
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
const showKycModal = ref(false);
const kycLoading = ref(false);
const kycError = ref('');
const kycSuccess = ref('');

onMounted(async () => {
  await profileStore.fetchProfile('shipper');
});

// Modal handlers
const openEditModal = () => {
  editError.value = '';
  editSuccess.value = '';
  showEditModal.value = true;
};

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

// Form handlers
const handleUpdateProfile = async (data: { firstname: string; lastname: string; phone: string; bio: string }) => {
  editLoading.value = true;
  editError.value = '';
  editSuccess.value = '';
  const result = await profileStore.updateProfile('shipper', data);
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

  // Use skipAuthRedirect to avoid auto-redirects on 401/403 errors
  const result = await profileStore.updateEmail('shipper', data, { skipAuthRedirect: true });

  emailLoading.value = false;
  if (result.success) {
    emailSuccess.value = result.message || 'Email mis à jour !';

    // Refresh profile but don't redirect if it fails (e.g. invalid token after update)
    await profileStore.fetchProfile('shipper', { skipAuthRedirect: true });

    setTimeout(() => { showEmailModal.value = false; }, 1500);
  } else {
    emailError.value = result.error || 'Une erreur est survenue';
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

  const result = await profileStore.uploadKycDocument(data.type, data.file, 'shipper');
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
    business_license: "Registre de commerce",
    tax_id: "Identifiant fiscal (Patente)"
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

const getKycStatusLabel = (status?: string) => {
  const labels: Record<string, string> = {
    none: 'Non soumis',
    pending: 'En attente',
    approved: 'Approuvé',
    verified: 'Vérifié',
    rejected: 'Rejeté'
  };
  return labels[status || 'none'] || 'Non soumis';
};

const getKycStatusClass = (status?: string) => {
  const classes: Record<string, string> = {
    none: 'badge-ghost',
    pending: 'badge-warning',
    approved: 'badge-success',
    verified: 'badge-success',
    rejected: 'badge-error'
  };
  return classes[status || 'none'] || 'badge-ghost';
};

definePageMeta({ layout: 'default' });
useHead({ title: 'Mon Profil Expéditeur - Bourse de Fret' });
</script>
