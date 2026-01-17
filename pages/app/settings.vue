<template>
  <div class="container-custom py-8">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Paramètres</h1>

    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="flex -mb-px">
          <button v-for="tab in tabs" :key="tab.id" @click="currentTab = tab.id" :class="[
            'px-6 py-4 text-sm font-medium border-b-2 transition-colors',
            currentTab === tab.id
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          ]">
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <div class="p-6">
        <!-- Profile Settings -->
        <div v-if="currentTab === 'profile'" class="space-y-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Informations personnelles</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="label">Prénom</label>
              <input type="text" :value="getFirstName(userProfile)" class="input" disabled />
            </div>
            <div>
              <label class="label">Nom</label>
              <input type="text" :value="getLastName(userProfile)" class="input" disabled />
            </div>
            <div>
              <label class="label">Email</label>
              <input type="email" :value="userProfile?.email" class="input" disabled />
            </div>
            <div>
              <label class="label">Téléphone</label>
              <input type="tel" :value="userProfile?.phone" class="input" disabled />
            </div>
          </div>
        </div>

        <!-- Notification Settings -->
        <div v-if="currentTab === 'notifications'" class="space-y-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Préférences de notification</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Notifications par email</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Recevoir des emails pour les nouvelles offres</p>
              </div>
              <input type="checkbox" checked
                class="h-6 w-11 rounded-full border-gray-300 text-primary-600 focus:ring-primary-500" />
            </div>
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Notifications push</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Recevoir des notifications sur le navigateur</p>
              </div>
              <input type="checkbox" checked
                class="h-6 w-11 rounded-full border-gray-300 text-primary-600 focus:ring-primary-500" />
            </div>
          </div>
        </div>

        <!-- Security Settings -->
        <!-- Security Settings -->
        <div v-if="currentTab === 'security'" class="space-y-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Sécurité</h2>
          <div class="space-y-4">
            <button @click="showPasswordModal = true" class="btn btn-outline w-full sm:w-auto">
              Changer le mot de passe
            </button>
            <button @click="showEmailModal = true" class="btn btn-outline w-full sm:w-auto">
              Changer l'email
            </button>
            <div class="pt-4 border-t border-gray-100 dark:border-gray-700">
              <h3 class="text-sm font-medium text-red-600 mb-2">Zone danger</h3>
              <button @click="handleDeleteAccount"
                class="btn btn-outline text-red-600 hover:bg-red-50 border-red-200 w-full sm:w-auto">
                Supprimer mon compte
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ProfilePasswordModal :show="showPasswordModal" :loading="passwordLoading" :error="passwordError"
      :success="passwordSuccess" @close="closePasswordModal" @submit="handlePasswordSubmit" />

    <ProfileEmailModal :show="showEmailModal" :loading="emailLoading" :error="emailError" :success="emailSuccess"
      @close="closeEmailModal" @submit="handleEmailSubmit" />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import { useProfileStore, type UpdatePasswordData, type UpdateEmailData } from '~/stores/profile';
import ProfilePasswordModal from '~/components/profile/ProfilePasswordModal.vue';
import ProfileEmailModal from '~/components/profile/ProfileEmailModal.vue';

const router = useRouter();
const authStore = useAuthStore();
const profileStore = useProfileStore();
const currentUser = computed(() => authStore.currentUser);

const tabs = [
  { id: 'profile', name: 'Profil' },
  { id: 'notifications', name: 'Notifications' },
  { id: 'security', name: 'Sécurité' }
];

const currentTab = ref('profile');

const userProfile = computed(() => profileStore.profile || currentUser.value);

const getFirstName = (user: any) => {
  if (!user) return '';
  return user.firstname || user.firstName || '';
};

const getLastName = (user: any) => {
  if (!user) return '';
  return user.lastname || user.lastName || '';
};

onMounted(async () => {
  if (currentUser.value) {
    await profileStore.fetchProfile(currentUser.value.role);
  }
});

// Password Modal
const showPasswordModal = ref(false);
const passwordLoading = ref(false);
const passwordError = ref('');
const passwordSuccess = ref('');

// Email Modal
const showEmailModal = ref(false);
const emailLoading = ref(false);
const emailError = ref('');
const emailSuccess = ref('');

// Password Handlers
const closePasswordModal = () => {
  showPasswordModal.value = false;
  setTimeout(() => {
    passwordError.value = '';
    passwordSuccess.value = '';
  }, 300);
};

const handlePasswordSubmit = async (data: UpdatePasswordData) => {
  if (!currentUser.value) return;
  passwordLoading.value = true;
  passwordError.value = '';
  passwordSuccess.value = '';

  const result = await profileStore.updatePassword(currentUser.value.role, data, { skipAuthRedirect: true }); // Skip global redirect to handle 401 manually inside store if needed? Actually store handles it via error message usually or we catch it.

  // Note: updatePassword action returns success/error message string directly or error string.

  if (result.success) {
    passwordSuccess.value = result.message || 'Mot de passe mis à jour.';
    setTimeout(() => {
      closePasswordModal();
    }, 1500);
  } else {
    passwordError.value = result.error || 'Erreur lors de la mise à jour.';
  }
  passwordLoading.value = false;
};


// Email Handlers
const closeEmailModal = () => {
  showEmailModal.value = false;
  setTimeout(() => {
    emailError.value = '';
    emailSuccess.value = '';
  }, 300);
};

const handleEmailSubmit = async (data: UpdateEmailData) => {
  if (!currentUser.value) return;
  emailLoading.value = true;
  emailError.value = '';
  emailSuccess.value = '';

  const result = await profileStore.updateEmail(currentUser.value.role, data, { skipAuthRedirect: true });

  if (result.success) {
    emailSuccess.value = result.message || 'Email mis à jour.';
    // Optionally logout or refresh profile
    setTimeout(() => {
      closeEmailModal();
    }, 1500);
  } else {
    emailError.value = result.error || 'Erreur lors de la mise à jour.';
  }
  emailLoading.value = false;
};

// Delete Account
const handleDeleteAccount = async () => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) return;

  try {
    const api = useAPI();
    const userRole = currentUser.value?.role;
    const endpoint = userRole === 'shipper' ? '/shipper/delete-account' : '/carrier/delete-account';

    const response = await api.del(endpoint);

    if (response.success) {
      await authStore.logout();
      router.push('/auth/login');
    } else {
      alert('Erreur lors de la suppression du compte: ' + (response.error?.message || response.error));
    }
  } catch (error) {
    alert('Une erreur est survenue.');
  }
};

</script>
