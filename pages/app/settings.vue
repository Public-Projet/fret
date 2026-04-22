<template>
  <div class="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 pb-20 pt-10">
    <div class="container-custom max-w-5xl">
      <!-- Header -->
      <div class="mb-10">
        <h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Paramètres</h1>
        <p class="text-gray-500 font-medium mt-1">Gérez vos informations personnelles et vos préférences</p>
      </div>

      <div class="flex flex-col lg:flex-row gap-10">
        <!-- Sidebar Navigation -->
        <aside class="w-full lg:w-72 shrink-0">
          <nav class="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
            <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
              'flex items-center space-x-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300 whitespace-nowrap lg:w-full',
              activeTab === tab.id
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 -translate-x-1'
                : 'text-gray-500 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white hover:shadow-sm'
            ]">
              <component :is="tab.icon" class="w-5 h-5 shrink-0" />
              <span>{{ tab.label }}</span>
            </button>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="flex-1">
          <div
            class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-white dark:border-gray-700 overflow-hidden">
            <!-- Profile Tab -->
            <div v-if="activeTab === 'profile'"
              class="p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div class="flex items-center space-x-6 mb-12">
                <div class="relative group">
                  <div
                    class="w-24 h-24 rounded-[2rem] bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 text-4xl font-black shadow-inner overflow-hidden">
                    <span v-if="!currentUser?.avatar">{{ currentUser?.firstName?.[0] }}</span>
                    <img v-else :src="currentUser.avatar" class="w-full h-full object-cover" />
                  </div>
                  <button
                    class="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-100 dark:border-gray-600 text-primary-600 hover:scale-110 transition-transform">
                    <IconCamera class="w-5 h-5" />
                  </button>
                </div>
                <div>
                  <h2 class="text-2xl font-black text-gray-900 dark:text-white">{{ currentUser?.firstName }} {{
                    currentUser?.lastName }}</h2>
                  <p class="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">{{ currentUser?.role }}
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div class="space-y-2">
                  <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Prénom</label>
                  <input v-model="profileForm.firstname" type="text"
                    class="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none font-bold text-gray-900 dark:text-white" />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nom</label>
                  <input v-model="profileForm.lastname" type="text"
                    class="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none font-bold text-gray-900 dark:text-white" />
                </div>
                <div class="space-y-2 md:col-span-2">
                  <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                  <div class="flex items-center space-x-3">
                    <input :value="currentUser?.email" type="email" disabled
                      class="flex-1 px-5 py-3.5 bg-gray-100 dark:bg-gray-900/50 border border-transparent rounded-2xl font-bold text-gray-400 cursor-not-allowed" />
                    <button @click="showEmailModal = true"
                      class="px-6 py-3.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">Modifier</button>
                  </div>
                </div>
              </div>

              <div class="flex justify-end pt-8 border-t border-gray-100 dark:border-gray-700">
                <button @click="updateProfile" :disabled="loading"
                  class="px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black transition-all hover:shadow-xl hover:shadow-primary-500/30 flex items-center justify-center active:scale-95 disabled:opacity-50">
                  <IconLoader2 v-if="loading" class="w-5 h-5 mr-3 animate-spin" />
                  Enregistrer les modifications
                </button>
              </div>
            </div>

            <!-- Notifications Tab -->
            <div v-if="activeTab === 'notifications'"
              class="p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 class="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center">
                <IconBell class="w-7 h-7 mr-3 text-primary-500" /> Préférences de notifications
              </h2>

              <div class="space-y-6">
                <!-- Example notification toggles -->
                <div
                  class="flex items-center justify-between p-6 bg-gray-50/50 dark:bg-gray-900/30 rounded-3xl border border-gray-100 dark:border-gray-700 group hover:border-primary-100 dark:hover:border-primary-900/30 transition-all">
                  <div>
                    <h3 class="font-bold text-gray-900 dark:text-white">Nouvelles offres</h3>
                    <p class="text-sm text-gray-500 mt-0.5">Recevez des emails pour chaque nouvelle offre correspondant
                      à votre profil</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked class="sr-only peer">
                    <div
                      class="w-14 h-8 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600 shadow-inner">
                    </div>
                  </label>
                </div>
                <div
                  class="flex items-center justify-between p-6 bg-gray-50/50 dark:bg-gray-900/30 rounded-3xl border border-gray-100 dark:border-gray-700 group hover:border-primary-100 dark:hover:border-primary-900/30 transition-all">
                  <div>
                    <h3 class="font-bold text-gray-900 dark:text-white">Messages instantanés</h3>
                    <p class="text-sm text-gray-500 mt-0.5">Être alerté lors de la réception d'un nouveau message</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked class="sr-only peer">
                    <div
                      class="w-14 h-8 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600 shadow-inner">
                    </div>
                  </label>
                </div>
              </div>

              <div class="flex justify-end mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
                <button
                  class="px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black transition-all hover:shadow-xl hover:shadow-primary-500/30 active:scale-95">
                  Sauvegarder les préférences
                </button>
              </div>
            </div>

            <!-- Security Tab -->
            <div v-if="activeTab === 'security'"
              class="p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 class="text-2xl font-black text-gray-900 dark:text-white mb-10 flex items-center">
                <IconShieldLock class="w-7 h-7 mr-3 text-primary-500" /> Sécurité du compte
              </h2>

              <div class="space-y-8">
                <div
                  class="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-gray-50/50 dark:bg-gray-900/30 rounded-[2.5rem] border border-gray-100 dark:border-gray-700">
                  <div class="flex items-center space-x-5">
                    <div class="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600">
                      <IconKey class="w-6 h-6" />
                    </div>
                    <div>
                      <h3 class="font-bold text-gray-900 dark:text-white">Mot de passe</h3>
                      <p class="text-sm text-gray-500 mt-0.5">Dernière modification il y a 3 mois</p>
                    </div>
                  </div>
                  <button @click="showPasswordModal = true"
                    class="px-8 py-3.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl font-black text-sm hover:shadow-lg transition-all active:scale-95">
                    Modifier le mot de passe
                  </button>
                </div>

                <div class="mt-20">
                  <h3 class="text-xs font-black text-red-500 uppercase tracking-widest mb-6 ml-1 flex items-center">
                    <IconAlertTriangle class="w-4 h-4 mr-2" /> Zone de danger
                  </h3>
                  <div
                    class="p-8 bg-red-50/30 dark:bg-red-900/10 rounded-[2.5rem] border border-red-100 dark:border-red-900/30">
                    <h4 class="font-black text-gray-900 dark:text-white mb-2">Supprimer le compte</h4>
                    <p class="text-sm text-gray-500 mb-8 max-w-xl">Une fois votre compte supprimé, toutes vos données
                      (profil, annonces, messages) seront définitivement effacées. Cette opération est irréversible.</p>
                    <button @click="handleDeleteAccount"
                      class="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-sm transition-all hover:shadow-xl hover:shadow-red-500/30 active:scale-95">
                      Supprimer mon compte
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- Modals -->
    <ModalProfilePassword :show="showPasswordModal" :loading="passwordLoading" :error="passwordError"
      :success="passwordSuccess" @close="closePasswordModal" @submit="handlePasswordSubmit" />

    <ModalProfileEmail :show="showEmailModal" :loading="emailLoading" :error="emailError" :success="emailSuccess"
      @close="closeEmailModal" @submit="handleEmailSubmit" />

    <ModalProfileAccountDeletion :show="showDeleteModal" :loading="deleteLoading" :error="deleteError"
      :success="deleteSuccess" @close="closeDeleteModal" @submit="handleDeleteSubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { IconUser, IconBell, IconShieldLock, IconCamera, IconLoader2, IconKey, IconAlertTriangle } from '@tabler/icons-vue';
import { useCmnAuthStore } from '~/stores/cmnAuth';
import { useCmnProfileStore } from '~/stores/cmnProfile';
import type { UpdatePasswordData, UpdateEmailData } from '~/types';

const router = useRouter();
const authStore = useCmnAuthStore();
const profileStore = useCmnProfileStore();
const currentUser = computed(() => authStore.currentUser);

const activeTab = ref('profile');
const loading = ref(false);

const tabs = [
  { id: 'profile', label: 'Profil', icon: IconUser },
  { id: 'notifications', label: 'Notifications', icon: IconBell },
  { id: 'security', label: 'Sécurité', icon: IconShieldLock }
];

const profileForm = reactive({
  firstname: '',
  lastname: ''
});

onMounted(async () => {
  if (currentUser.value) {
    const res = await profileStore.fetchProfile(currentUser.value.role);
    if (res.success && res.profile) {
      profileForm.firstname = res.profile.firstname || '';
      profileForm.lastname = res.profile.lastname || '';
    } else {
      profileForm.firstname = currentUser.value.firstName || '';
      profileForm.lastname = currentUser.value.lastName || '';
    }
  }
});

const updateProfile = async () => {
  if (!currentUser.value) return;
  loading.value = true;
  const result = await profileStore.updateProfile(currentUser.value.role, {
    firstname: profileForm.firstname,
    lastname: profileForm.lastname
  });

  loading.value = false;
  if (result.success) {
    // Le header sera mis à jour via la synchro dans le store
  } else {
    alert(result.error || 'Erreur lors de la mise à jour');
  }
};

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

// Delete Account Modal
const showDeleteModal = ref(false);
const deleteLoading = ref(false);
const deleteError = ref('');
const deleteSuccess = ref('');

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
  const result = await profileStore.updatePassword(currentUser.value.role, data, { skipAuthRedirect: true });
  if (result.success) {
    passwordSuccess.value = result.message || 'Mot de passe mis à jour.';
    setTimeout(() => closePasswordModal(), 1500);
  } else {
    passwordError.value = result.error || 'Erreur lors de la mise à jour.';
  }
  passwordLoading.value = false;
};

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
    setTimeout(() => closeEmailModal(), 1500);
  } else {
    emailError.value = result.error || 'Erreur lors de la mise à jour.';
  }
  emailLoading.value = false;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  setTimeout(() => {
    deleteError.value = '';
    deleteSuccess.value = '';
  }, 300);
};

const handleDeleteAccount = () => {
  showDeleteModal.value = true;
};

const handleDeleteSubmit = async (data: { password: string; confirmation: string }) => {
  if (!currentUser.value) return;
  deleteLoading.value = true;
  deleteError.value = '';
  deleteSuccess.value = '';
  try {
    const result = await profileStore.deleteAccount(currentUser.value.role, data);
    if (result.success) {
      deleteSuccess.value = result.message || 'Votre compte a été supprimé.';
      setTimeout(async () => {
        await authStore.logoutUser();
        router.push('/auth/login');
      }, 1500);
    } else {
      deleteError.value = result.error || 'Erreur lors de la suppression.';
    }
  } catch (error: any) {
    deleteError.value = error.message || 'Une erreur est survenue.';
  } finally {
    deleteLoading.value = false;
  }
};

useHead({
  title: 'Paramètres',
  meta: [
    { name: 'description', content: 'Gérez les paramètres de votre compte.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>
