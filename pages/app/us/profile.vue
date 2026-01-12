<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
    <!-- Corporate Banner -->
    <div class="h-64 bg-slate-900 relative overflow-hidden">
      <!-- Abstract Shapes -->
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
            <button @click="activeTab = 'security'"
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

      <!-- Left Column: Info & Stats -->
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
              <p class="font-medium text-gray-900 dark:text-white flex items-center">
                <IconMail class="w-4 h-4 mr-2 text-gray-400" />
                {{ profile?.email }}
              </p>
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

        <div
          class="bg-gradient-to-br from-primary-900 to-slate-900 text-white rounded-xl shadow-lg p-6 relative overflow-hidden">
          <div class="relative z-10">
            <h3 class="text-lg font-bold mb-1">Expéditeur</h3>
            <p class="text-primary-200 text-sm mb-4">Compte {{ profile?.status === 'active' ? 'actif' : 'en attente'
            }}</p>
          </div>
          <IconPremiumRights class="absolute -bottom-4 -right-4 w-32 h-32 text-white/5" />
        </div>
      </div>

      <!-- Right Column: Dashboard Widgets -->
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

              <button type="submit" class="w-full btn bg-primary-600 hover:bg-primary-700 text-white border-0 shadow-lg"
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useProfileStore } from '~/stores/profile';
import { useAuthStore } from '~/stores/auth';
import {
  IconBuildingSkyscraper, IconDiscountCheckFilled, IconMail, IconPhone,
  IconPremiumRights, IconLock, IconX, IconLoader2, IconCheck, IconHistory
} from '@tabler/icons-vue';

const profileStore = useProfileStore();
const authStore = useAuthStore();

const profile = computed(() => profileStore.profile);
const showEditModal = ref(false);
const editLoading = ref(false);
const editError = ref('');
const editSuccess = ref('');
const activeTab = ref('profile');

const editForm = reactive({
  firstname: '',
  lastname: '',
  phone: '',
  bio: ''
});

onMounted(async () => {
  // Récupérer le profil au chargement
  await profileStore.fetchProfile('shipper');
  if (profileStore.profile) {
    editForm.firstname = profileStore.profile.firstname || '';
    editForm.lastname = profileStore.profile.lastname || '';
    editForm.phone = profileStore.profile.phone || '';
    editForm.bio = profileStore.profile.bio || '';
  }
});

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

const closeEditModal = () => {
  showEditModal.value = false;
};

const handleUpdateProfile = async () => {
  editLoading.value = true;
  editError.value = '';
  editSuccess.value = '';

  const result = await profileStore.updateProfile('shipper', {
    firstname: editForm.firstname,
    lastname: editForm.lastname,
    phone: editForm.phone,
    bio: editForm.bio
  });

  editLoading.value = false;

  if (result.success) {
    editSuccess.value = result.message || 'Profil mis à jour avec succès !';
    setTimeout(() => {
      closeEditModal();
    }, 1500);
  } else {
    editError.value = result.error || 'Une erreur est survenue';
  }
};

definePageMeta({
  layout: 'default'
});

useHead({
  title: 'Mon Profil Expéditeur - Bourse de Fret'
});
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
