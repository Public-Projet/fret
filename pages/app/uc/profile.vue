<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
    <!-- Header with Map Background Effect -->
    <CarrierProfileHeader :profile="profile" />

    <!-- Stats Bar -->
    <CarrierStatsBar :missions="0" :rating="'-'" :vehicles="0" @open-security="showSecurityModal = true"
      @open-edit="openEditModal" />

    <div class="container-custom mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Info -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Fleet Section -->
        <section>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <IconTruck class="w-5 h-5 mr-2 text-secondary-600" />
            Ma Flotte
          </h3>
          <div
            class="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
            <IconTruck class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p class="text-gray-500 dark:text-gray-400 mb-4">Aucun véhicule enregistré</p>
            <button class="mx-auto flex items-center btn btn-secondary btn-sm">
              <IconPlus class="w-4 h-4 mr-1" />
              Ajouter un véhicule
            </button>
          </div>
        </section>

        <!-- Certifications -->
        <section>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <IconCertificate class="w-5 h-5 mr-2 text-secondary-600" />
            Documents & Certifications
          </h3>
          <div
            class="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
            <IconFileCheck class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p class="text-gray-500 dark:text-gray-400 mb-4">Aucun document soumis</p>
            <button class="mx-auto flex items-center btn btn-outline btn-sm">
              <IconPlus class="w-4 h-4 mr-1" />
              Soumettre un document
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
            <p class="text-secondary-100 text-sm mb-4">Contactez le support pour mettre à jour vos documents.</p>
            <NuxtLink to="/h/contact" class="btn bg-white text-secondary-700 border-0 btn-sm">Support</NuxtLink>
          </div>
          <IconHeadset class="absolute -bottom-4 -right-4 w-24 h-24 text-white/10" />
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ProfileEditModal :show="showEditModal" :profile="profile" :loading="editLoading" :error="editError"
      :success="editSuccess" accent-color="secondary" @close="showEditModal = false" @submit="handleUpdateProfile" />

    <ProfilePasswordModal :show="showPasswordModal" :loading="passwordLoading" :error="passwordError"
      :success="passwordSuccess" accent-color="secondary" @close="showPasswordModal = false"
      @submit="handleUpdatePassword" />

    <ProfileEmailModal :show="showEmailModal" :current-email="profile?.email" :loading="emailLoading"
      :error="emailError" :success="emailSuccess" accent-color="secondary" @close="showEmailModal = false"
      @submit="handleUpdateEmail" />

    <ProfileSecurityModal :show="showSecurityModal" :email="profile?.email" accent-color="secondary"
      @close="showSecurityModal = false" @open-password="openPasswordModal" @open-email="openEmailModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useProfileStore } from '~/stores/profile';
import {
  IconTruck, IconCertificate, IconFileCheck, IconHeadset, IconPlus
} from '@tabler/icons-vue';

// Profile Components
import CarrierProfileHeader from '~/components/profile/CarrierProfileHeader.vue';
import CarrierStatsBar from '~/components/profile/CarrierStatsBar.vue';
import ProfileContactCard from '~/components/profile/ProfileContactCard.vue';
import ProfileSecurityCard from '~/components/profile/ProfileSecurityCard.vue';
import ProfileEditModal from '~/components/profile/ProfileEditModal.vue';
import ProfilePasswordModal from '~/components/profile/ProfilePasswordModal.vue';
import ProfileEmailModal from '~/components/profile/ProfileEmailModal.vue';
import ProfileSecurityModal from '~/components/profile/ProfileSecurityModal.vue';

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

onMounted(async () => {
  await profileStore.fetchProfile('carrier');
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

definePageMeta({ layout: 'default' });
useHead({ title: 'Mon Profil Transporteur - Bourse de Fret' });
</script>
