<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
    <!-- Corporate Banner -->
    <div class="h-64 bg-slate-900 relative overflow-hidden">
      <div
        class="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob">
      </div>
      <div
        class="absolute -bottom-32 -left-32 w-64 h-64 bg-primary-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000">
      </div>

      <div class="container-custom h-full flex items-end pb-8 relative z-10">
        <div class="flex items-end space-x-6 w-full">
          <div class="w-32 h-32 bg-white rounded-lg shadow-xl p-1 flex items-center justify-center -mb-16">
            <div
              class="w-full h-full bg-slate-100 rounded flex items-center justify-center text-4xl font-bold text-slate-700 uppercase">
              {{ profile?.firstname?.[0] }}{{ profile?.lastname?.[0] }}
            </div>
          </div>
          <div class="flex-1 pb-4">
            <h1 class="text-3xl font-bold text-white mb-1">{{ profile?.firstname }} {{ profile?.lastname }}</h1>
            <p class="text-slate-300 flex items-center">
              <IconBuildingSkyscraper class="w-4 h-4 mr-1" />
              Compte Expéditeur
              <span class="mx-2">•</span>
              <span v-if="profile?.status === 'active'" class="text-green-400 flex items-center text-sm font-medium">
                <IconDiscountCheckFilled class="w-4 h-4 mr-1" />
                Vérifié
              </span>
              <span v-else class="text-yellow-400 text-sm font-medium">
                En attente
              </span>
            </p>
          </div>
          <div class="pb-4 flex space-x-3">
            <button @click="openSecurityModal"
              class="btn bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm">
              <IconLock class="w-5 h-5" />
            </button>
            <button @click="openEditModal"
              class="btn bg-primary-600 hover:bg-primary-700 text-white border-0 shadow-lg shadow-primary-900/20">
              Modifier le profil
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container-custom mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column -->
      <div class="space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">A propos</h3>
          <div class="space-y-4">
            <div>
              <label class="text-xs text-gray-500 block mb-1">Nom d'utilisateur</label>
              <p class="font-medium text-gray-900 dark:text-white">@{{ profile?.username }}</p>
            </div>
            <div>
              <label class="text-xs text-gray-500 block mb-1">Email professionnel</label>
              <div class="flex items-center justify-between">
                <p class="font-medium text-gray-900 dark:text-white flex items-center">
                  <IconMail class="w-4 h-4 mr-2 text-gray-400" />
                  {{ profile?.email }}
                </p>
                <button @click="openEmailModal" class="text-xs text-primary-600 hover:underline">Modifier</button>
              </div>
            </div>
            <div>
              <label class="text-xs text-gray-500 block mb-1">Téléphone</label>
              <p class="font-medium text-gray-900 dark:text-white flex items-center">
                <IconPhone class="w-4 h-4 mr-2 text-gray-400" />
                {{ profile?.phone || 'Non renseigné' }}
              </p>
            </div>
            <div v-if="profile?.bio">
              <label class="text-xs text-gray-500 block mb-1">Biographie</label>
              <p class="text-gray-600 dark:text-gray-400 text-sm">{{ profile.bio }}</p>
            </div>
          </div>
        </div>

        <!-- Sécurité rapide -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 class="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <IconShieldLock class="w-5 h-5 mr-2 text-primary-600" />
            Sécurité
          </h4>
          <div class="space-y-3">
            <button @click="openPasswordModal"
              class="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors flex items-center justify-between group">
              <div class="flex items-center">
                <IconKey class="w-5 h-5 text-gray-400 mr-3 group-hover:text-primary-600" />
                <span class="text-sm text-gray-700 dark:text-gray-300">Modifier le mot de passe</span>
              </div>
              <IconChevronRight class="w-4 h-4 text-gray-400" />
            </button>
            <button @click="openEmailModal"
              class="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors flex items-center justify-between group">
              <div class="flex items-center">
                <IconMail class="w-5 h-5 text-gray-400 mr-3 group-hover:text-primary-600" />
                <span class="text-sm text-gray-700 dark:text-gray-300">Modifier l'adresse email</span>
              </div>
              <IconChevronRight class="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        <div
          class="bg-gradient-to-br from-primary-900 to-slate-900 text-white rounded-xl shadow-lg p-6 relative overflow-hidden">
          <div class="relative z-10">
            <h3 class="text-lg font-bold mb-1">Expéditeur</h3>
            <p class="text-primary-200 text-sm mb-4">Compte {{ profile?.status === 'active' ? 'actif' : 'en attente' }}
            </p>
          </div>
          <IconPremiumRights class="absolute -bottom-4 -right-4 w-32 h-32 text-white/5" />
        </div>
      </div>

      <!-- Right Column -->
      <div class="lg:col-span-2 space-y-6">
        <!-- KPI Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
            <span class="text-3xl font-bold text-slate-800 dark:text-white mb-1">0</span>
            <span class="text-xs text-slate-500 uppercase font-medium">Annonces</span>
          </div>
          <div
            class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
            <span class="text-3xl font-bold text-green-600 mb-1">-</span>
            <span class="text-xs text-slate-500 uppercase font-medium">Fiabilité</span>
          </div>
          <div
            class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
            <span class="text-3xl font-bold text-yellow-500 mb-1">-</span>
            <span class="text-xs text-slate-500 uppercase font-medium">Note</span>
          </div>
          <div
            class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
            <span class="text-3xl font-bold text-blue-600 mb-1">-</span>
            <span class="text-xs text-slate-500 uppercase font-medium">Paiement</span>
          </div>
        </div>

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

    <!-- Modal Profil -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeEditModal"></div>
          <div
            class="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <button @click="closeEditModal"
              class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <IconX class="w-5 h-5" />
            </button>
            <div class="text-center mb-6">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">Modifier mon profil</h3>
            </div>
            <form @submit.prevent="handleUpdateProfile" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="label">Prénom</label>
                  <input type="text" v-model="editForm.firstname" class="input" placeholder="Prénom" />
                </div>
                <div>
                  <label class="label">Nom</label>
                  <input type="text" v-model="editForm.lastname" class="input" placeholder="Nom" />
                </div>
              </div>
              <div>
                <label class="label">Téléphone</label>
                <input type="tel" v-model="editForm.phone" class="input" placeholder="+229 XX XX XX XX" />
              </div>
              <div>
                <label class="label">Biographie</label>
                <textarea v-model="editForm.bio" class="input" rows="3"
                  placeholder="Décrivez votre activité..."></textarea>
              </div>
              <div v-if="editError"
                class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p class="text-red-600 dark:text-red-400 text-sm text-center">{{ editError }}</p>
              </div>
              <div v-if="editSuccess"
                class="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p class="text-green-600 dark:text-green-400 text-sm text-center">{{ editSuccess }}</p>
              </div>
              <button type="submit"
                class="justify-center flex items-center w-full btn bg-primary-600 hover:bg-primary-700 text-white border-0 shadow-lg"
                :disabled="editLoading">
                <IconLoader2 v-if="editLoading" class="w-4 h-4 mr-2 animate-spin" />
                <IconCheck v-else class="w-4 h-4 mr-2" />
                Enregistrer
              </button>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal Mot de passe -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showPasswordModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closePasswordModal"></div>
          <div class="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 space-y-6">
            <button @click="closePasswordModal"
              class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <IconX class="w-5 h-5" />
            </button>
            <div class="text-center">
              <div
                class="w-14 h-14 mx-auto mb-4 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <IconKey class="w-7 h-7 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">Modifier le mot de passe</h3>
            </div>
            <form @submit.prevent="handleUpdatePassword" class="space-y-4">
              <div>
                <label class="label">Mot de passe actuel</label>
                <div class="relative">
                  <input :type="showCurrentPassword ? 'text' : 'password'" v-model="passwordForm.currentPassword"
                    class="input pr-12" placeholder="••••••••" required />
                  <button type="button" @click="showCurrentPassword = !showCurrentPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <IconEye v-if="!showCurrentPassword" class="w-5 h-5" />
                    <IconEyeOff v-else class="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div>
                <label class="label">Nouveau mot de passe</label>
                <div class="relative">
                  <input :type="showNewPassword ? 'text' : 'password'" v-model="passwordForm.newPassword"
                    class="input pr-12" placeholder="••••••••" required />
                  <button type="button" @click="showNewPassword = !showNewPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <IconEye v-if="!showNewPassword" class="w-5 h-5" />
                    <IconEyeOff v-else class="w-5 h-5" />
                  </button>
                </div>
                <p class="mt-1 text-xs text-gray-500">Min. 8 caractères, majuscule, minuscule, chiffre, spécial</p>
              </div>
              <div>
                <label class="label">Confirmer le mot de passe</label>
                <input type="password" v-model="passwordForm.confirmPassword" class="input" placeholder="••••••••"
                  required />
              </div>
              <div v-if="passwordError"
                class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p class="text-red-600 dark:text-red-400 text-sm text-center">{{ passwordError }}</p>
              </div>
              <div v-if="passwordSuccess"
                class="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p class="text-green-600 dark:text-green-400 text-sm text-center">{{ passwordSuccess }}</p>
              </div>
              <button type="submit"
                class="justify-center flex items-center w-full btn bg-primary-600 hover:bg-primary-700 text-white border-0 shadow-lg"
                :disabled="passwordLoading">
                <IconLoader2 v-if="passwordLoading" class="w-4 h-4 mr-2 animate-spin" />
                <IconCheck v-else class="w-4 h-4 mr-2" />
                Mettre à jour
              </button>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal Email -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showEmailModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeEmailModal"></div>
          <div class="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 space-y-6">
            <button @click="closeEmailModal"
              class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <IconX class="w-5 h-5" />
            </button>
            <div class="text-center">
              <div
                class="w-14 h-14 mx-auto mb-4 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <IconMail class="w-7 h-7 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">Modifier l'adresse email</h3>
            </div>
            <form @submit.prevent="handleUpdateEmail" class="space-y-4">
              <div>
                <label class="label">Email actuel</label>
                <input type="email" :value="profile?.email" class="input bg-gray-100 dark:bg-gray-800" disabled />
              </div>
              <div>
                <label class="label">Nouvelle adresse email</label>
                <input type="email" v-model="emailForm.newEmail" class="input" placeholder="nouveau@email.com"
                  required />
              </div>
              <div>
                <label class="label">Mot de passe (confirmation)</label>
                <div class="relative">
                  <input :type="showEmailPassword ? 'text' : 'password'" v-model="emailForm.password"
                    class="input pr-12" placeholder="••••••••" required />
                  <button type="button" @click="showEmailPassword = !showEmailPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <IconEye v-if="!showEmailPassword" class="w-5 h-5" />
                    <IconEyeOff v-else class="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div v-if="emailError"
                class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p class="text-red-600 dark:text-red-400 text-sm text-center">{{ emailError }}</p>
              </div>
              <div v-if="emailSuccess"
                class="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p class="text-green-600 dark:text-green-400 text-sm text-center">{{ emailSuccess }}</p>
              </div>
              <button type="submit"
                class="justify-center flex items-center w-full btn bg-primary-600 hover:bg-primary-700 text-white border-0 shadow-lg"
                :disabled="emailLoading">
                <IconLoader2 v-if="emailLoading" class="w-4 h-4 mr-2 animate-spin" />
                <IconCheck v-else class="w-4 h-4 mr-2" />
                Mettre à jour
              </button>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal Sécurité -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showSecurityModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeSecurityModal"></div>
          <div class="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 space-y-4">
            <button @click="closeSecurityModal"
              class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <IconX class="w-5 h-5" />
            </button>
            <div class="text-center mb-4">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">Paramètres de sécurité</h3>
            </div>
            <button @click="closeSecurityModal(); openPasswordModal()"
              class="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors flex items-center justify-between group">
              <div class="flex items-center">
                <IconKey class="w-6 h-6 text-gray-400 mr-4 group-hover:text-primary-600" />
                <div class="text-left">
                  <p class="font-medium text-gray-900 dark:text-white">Mot de passe</p>
                  <p class="text-xs text-gray-500">Modifier votre mot de passe</p>
                </div>
              </div>
              <IconChevronRight class="w-5 h-5 text-gray-400" />
            </button>
            <button @click="closeSecurityModal(); openEmailModal()"
              class="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors flex items-center justify-between group">
              <div class="flex items-center">
                <IconMail class="w-6 h-6 text-gray-400 mr-4 group-hover:text-primary-600" />
                <div class="text-left">
                  <p class="font-medium text-gray-900 dark:text-white">Adresse email</p>
                  <p class="text-xs text-gray-500">{{ profile?.email }}</p>
                </div>
              </div>
              <IconChevronRight class="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useProfileStore } from '~/stores/profile';
import {
  IconBuildingSkyscraper, IconDiscountCheckFilled, IconMail, IconPhone, IconPremiumRights,
  IconLock, IconX, IconLoader2, IconCheck, IconHistory, IconKey, IconChevronRight,
  IconShieldLock, IconEye, IconEyeOff
} from '@tabler/icons-vue';

const profileStore = useProfileStore();
const profile = computed(() => profileStore.profile);

// Modals
const showEditModal = ref(false);
const showPasswordModal = ref(false);
const showEmailModal = ref(false);
const showSecurityModal = ref(false);

// Edit profile
const editLoading = ref(false);
const editError = ref('');
const editSuccess = ref('');
const editForm = reactive({ firstname: '', lastname: '', phone: '', bio: '' });

// Password
const passwordLoading = ref(false);
const passwordError = ref('');
const passwordSuccess = ref('');
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const passwordForm = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' });

// Email
const emailLoading = ref(false);
const emailError = ref('');
const emailSuccess = ref('');
const showEmailPassword = ref(false);
const emailForm = reactive({ newEmail: '', password: '' });

onMounted(async () => {
  await profileStore.fetchProfile('shipper');
  if (profileStore.profile) {
    editForm.firstname = profileStore.profile.firstname || '';
    editForm.lastname = profileStore.profile.lastname || '';
    editForm.phone = profileStore.profile.phone || '';
    editForm.bio = profileStore.profile.bio || '';
  }
});

// Profile
const openEditModal = () => {
  editError.value = '';
  editSuccess.value = '';
  if (profileStore.profile) {
    editForm.firstname = profileStore.profile.firstname || '';
    editForm.lastname = profileStore.profile.lastname || '';
    editForm.phone = profileStore.profile.phone || '';
    editForm.bio = profileStore.profile.bio || '';
  }
  showEditModal.value = true;
};
const closeEditModal = () => { showEditModal.value = false; };

const handleUpdateProfile = async () => {
  editLoading.value = true;
  editError.value = '';
  editSuccess.value = '';
  const result = await profileStore.updateProfile('shipper', editForm);
  editLoading.value = false;
  if (result.success) {
    editSuccess.value = result.message || 'Profil mis à jour !';
    setTimeout(closeEditModal, 1500);
  } else {
    editError.value = result.error || 'Une erreur est survenue';
  }
};

// Security
const openSecurityModal = () => { showSecurityModal.value = true; };
const closeSecurityModal = () => { showSecurityModal.value = false; };

// Password
const openPasswordModal = () => {
  passwordError.value = '';
  passwordSuccess.value = '';
  passwordForm.currentPassword = '';
  passwordForm.newPassword = '';
  passwordForm.confirmPassword = '';
  showPasswordModal.value = true;
};
const closePasswordModal = () => { showPasswordModal.value = false; };

const handleUpdatePassword = async () => {
  passwordError.value = '';
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = 'Les mots de passe ne correspondent pas.';
    return;
  }
  passwordLoading.value = true;
  const result = await profileStore.updatePassword('shipper', {
    currentPassword: passwordForm.currentPassword,
    newPassword: passwordForm.newPassword
  });
  passwordLoading.value = false;
  if (result.success) {
    passwordSuccess.value = result.message || 'Mot de passe mis à jour !';
    setTimeout(closePasswordModal, 1500);
  } else {
    passwordError.value = result.error || 'Une erreur est survenue';
  }
};

// Email
const openEmailModal = () => {
  emailError.value = '';
  emailSuccess.value = '';
  emailForm.newEmail = '';
  emailForm.password = '';
  showEmailModal.value = true;
};
const closeEmailModal = () => { showEmailModal.value = false; };

const handleUpdateEmail = async () => {
  emailLoading.value = true;
  emailError.value = '';
  const result = await profileStore.updateEmail('shipper', {
    newEmail: emailForm.newEmail,
    password: emailForm.password
  });
  emailLoading.value = false;
  if (result.success) {
    emailSuccess.value = result.message || 'Email mis à jour !';
    await profileStore.fetchProfile('shipper');
    setTimeout(closeEmailModal, 1500);
  } else {
    emailError.value = result.error || 'Une erreur est survenue';
  }
};

definePageMeta({ layout: 'default' });
useHead({ title: 'Mon Profil Expéditeur - Bourse de Fret' });
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@keyframes blob {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  25% {
    transform: translate(20px, -50px) scale(1.1);
  }

  50% {
    transform: translate(-20px, 20px) scale(0.9);
  }

  75% {
    transform: translate(50px, 50px) scale(1.05);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}
</style>
