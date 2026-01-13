<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
    <!-- Header with Map Background Effect -->
    <div class="h-64 bg-slate-800 relative overflow-hidden group">
      <div
        class="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] opacity-10 bg-center bg-no-repeat bg-cover">
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>

      <div class="container-custom h-full flex flex-col justify-end pb-8 relative z-10">
        <div class="flex items-center space-x-4 mb-2">
          <span v-if="profile?.status === 'active'"
            class="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center">
            <IconShieldCheck class="w-3 h-3 mr-1" />
            Transporteur Vérifié
          </span>
          <span v-else-if="profile?.status === 'pending'"
            class="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
            En attente de vérification
          </span>
        </div>
        <h1 class="text-4xl font-extrabold text-white tracking-tight">
          {{ profile?.firstname }} {{ profile?.lastname }}
        </h1>
        <p class="text-slate-400 mt-2 max-w-2xl">
          {{ profile?.bio || 'Expert en logistique et transport de marchandises.' }}
        </p>
      </div>
    </div>

    <!-- Stats Bar -->
    <div class="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-20">
      <div class="container-custom py-4">
        <div class="flex justify-between items-center overflow-x-auto">
          <div class="flex space-x-8 min-w-max px-2">
            <div class="text-center">
              <span class="block text-xl font-bold text-gray-900 dark:text-white">0</span>
              <span class="text-xs text-gray-500 uppercase">Missions</span>
            </div>
            <div class="text-center">
              <span class="block text-xl font-bold text-gray-900 dark:text-white">-</span>
              <span class="text-xs text-gray-500 uppercase">Note</span>
            </div>
            <div class="text-center">
              <span class="block text-xl font-bold text-gray-900 dark:text-white">0</span>
              <span class="text-xs text-gray-500 uppercase">Véhicules</span>
            </div>
          </div>
          <div class="hidden md:flex space-x-3">
            <button @click="openSecurityModal" class="flex items-center btn btn-outline btn-sm">
              <IconLock class="w-4 h-4 mr-1" />
              Sécurité
            </button>
            <button @click="openEditModal" class="flex items-center btn btn-primary btn-sm">
              <IconEdit class="w-4 h-4 mr-1" />
              Modifier Profil
            </button>
          </div>
        </div>
      </div>
    </div>

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
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 class="font-bold text-gray-900 dark:text-white mb-4">Coordonnées</h4>
          <ul class="space-y-4 text-sm">
            <li class="flex items-start">
              <IconUser class="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <span class="font-medium text-gray-900 dark:text-white">@{{ profile?.username }}</span>
              </div>
            </li>
            <li class="flex items-start">
              <IconPhone class="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <span class="font-medium text-gray-900 dark:text-white">{{ profile?.phone || 'Non renseigné' }}</span>
              </div>
            </li>
            <li class="flex items-center justify-between">
              <div class="flex items-start">
                <IconMail class="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <span class="font-medium text-gray-900 dark:text-white">{{ profile?.email }}</span>
              </div>
              <button @click="openEmailModal" class="text-xs text-secondary-600 hover:underline">Modifier</button>
            </li>
          </ul>
        </div>

        <!-- Sécurité rapide -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 class="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <IconShieldLock class="w-5 h-5 mr-2 text-secondary-600" />
            Sécurité
          </h4>
          <div class="space-y-3">
            <button @click="openPasswordModal"
              class="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-secondary-500 transition-colors flex items-center justify-between group">
              <div class="flex items-center">
                <IconKey class="w-5 h-5 text-gray-400 mr-3 group-hover:text-secondary-600" />
                <span class="text-sm text-gray-700 dark:text-gray-300">Modifier le mot de passe</span>
              </div>
              <IconChevronRight class="w-4 h-4 text-gray-400" />
            </button>
            <button @click="openEmailModal"
              class="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-secondary-500 transition-colors flex items-center justify-between group">
              <div class="flex items-center">
                <IconMail class="w-5 h-5 text-gray-400 mr-3 group-hover:text-secondary-600" />
                <span class="text-sm text-gray-700 dark:text-gray-300">Modifier l'adresse email</span>
              </div>
              <IconChevronRight class="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

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

    <!-- Modal d'édition du profil -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeEditModal"></div>
          <div
            class="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <button @click="closeEditModal"
              class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
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
                class="justify-center flex items-center w-full btn bg-secondary-600 hover:bg-secondary-700 text-white border-0 shadow-lg"
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
              class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <IconX class="w-5 h-5" />
            </button>
            <div class="text-center">
              <div
                class="w-14 h-14 mx-auto mb-4 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
                <IconKey class="w-7 h-7 text-secondary-600 dark:text-secondary-400" />
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
                class="justify-center flex items-center w-full btn bg-secondary-600 hover:bg-secondary-700 text-white border-0 shadow-lg"
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
              class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <IconX class="w-5 h-5" />
            </button>
            <div class="text-center">
              <div
                class="w-14 h-14 mx-auto mb-4 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
                <IconMail class="w-7 h-7 text-secondary-600 dark:text-secondary-400" />
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
                class="justify-center flex items-center w-full btn bg-secondary-600 hover:bg-secondary-700 text-white border-0 shadow-lg"
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

    <!-- Modal Sécurité (menu) -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showSecurityModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeSecurityModal"></div>
          <div class="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 space-y-4">
            <button @click="closeSecurityModal"
              class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <IconX class="w-5 h-5" />
            </button>
            <div class="text-center mb-4">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">Paramètres de sécurité</h3>
            </div>
            <button @click="closeSecurityModal(); openPasswordModal()"
              class="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-secondary-500 transition-colors flex items-center justify-between group">
              <div class="flex items-center">
                <IconKey class="w-6 h-6 text-gray-400 mr-4 group-hover:text-secondary-600" />
                <div class="text-left">
                  <p class="font-medium text-gray-900 dark:text-white">Mot de passe</p>
                  <p class="text-xs text-gray-500">Modifier votre mot de passe</p>
                </div>
              </div>
              <IconChevronRight class="w-5 h-5 text-gray-400" />
            </button>
            <button @click="closeSecurityModal(); openEmailModal()"
              class="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-secondary-500 transition-colors flex items-center justify-between group">
              <div class="flex items-center">
                <IconMail class="w-6 h-6 text-gray-400 mr-4 group-hover:text-secondary-600" />
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
  IconShieldCheck, IconTruck, IconCertificate, IconFileCheck, IconPhone, IconMail,
  IconHeadset, IconEdit, IconLock, IconX, IconLoader2, IconCheck, IconPlus, IconUser,
  IconKey, IconChevronRight, IconShieldLock, IconEye, IconEyeOff
} from '@tabler/icons-vue';

const profileStore = useProfileStore();
const profile = computed(() => profileStore.profile);

// Modals visibility
const showEditModal = ref(false);
const showPasswordModal = ref(false);
const showEmailModal = ref(false);
const showSecurityModal = ref(false);

// Edit profile form
const editLoading = ref(false);
const editError = ref('');
const editSuccess = ref('');
const editForm = reactive({ firstname: '', lastname: '', phone: '', bio: '' });

// Password form
const passwordLoading = ref(false);
const passwordError = ref('');
const passwordSuccess = ref('');
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const passwordForm = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' });

// Email form
const emailLoading = ref(false);
const emailError = ref('');
const emailSuccess = ref('');
const showEmailPassword = ref(false);
const emailForm = reactive({ newEmail: '', password: '' });

onMounted(async () => {
  await profileStore.fetchProfile('carrier');
  if (profileStore.profile) {
    editForm.firstname = profileStore.profile.firstname || '';
    editForm.lastname = profileStore.profile.lastname || '';
    editForm.phone = profileStore.profile.phone || '';
    editForm.bio = profileStore.profile.bio || '';
  }
});

// Profile modal
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
  const result = await profileStore.updateProfile('carrier', editForm);
  editLoading.value = false;
  if (result.success) {
    editSuccess.value = result.message || 'Profil mis à jour !';
    setTimeout(closeEditModal, 1500);
  } else {
    editError.value = result.error || 'Une erreur est survenue';
  }
};

// Security modal
const openSecurityModal = () => { showSecurityModal.value = true; };
const closeSecurityModal = () => { showSecurityModal.value = false; };

// Password modal
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
  const result = await profileStore.updatePassword('carrier', {
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

// Email modal
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
  const result = await profileStore.updateEmail('carrier', {
    newEmail: emailForm.newEmail,
    password: emailForm.password
  });
  emailLoading.value = false;
  if (result.success) {
    emailSuccess.value = result.message || 'Email mis à jour !';
    await profileStore.fetchProfile('carrier'); // Refresh profile
    setTimeout(closeEmailModal, 1500);
  } else {
    emailError.value = result.error || 'Une erreur est survenue';
  }
};

definePageMeta({ layout: 'default' });
useHead({ title: 'Mon Profil Transporteur - Bourse de Fret' });
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
</style>
