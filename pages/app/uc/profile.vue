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
            <button @click="activeTab = 'security'" class="btn btn-outline btn-sm">
              <IconLock class="w-4 h-4 mr-1" />
              Sécurité
            </button>
            <button @click="openEditModal" class="btn btn-primary btn-sm">
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
            <IconTruck class="w-5 h-5 mr-2 text-primary-600" />
            Ma Flotte
          </h3>
          <div
            class="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
            <IconTruck class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p class="text-gray-500 dark:text-gray-400 mb-4">Aucun véhicule enregistré</p>
            <button class="btn btn-primary btn-sm">
              <IconPlus class="w-4 h-4 mr-1" />
              Ajouter un véhicule
            </button>
          </div>
        </section>

        <!-- Certifications -->
        <section>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <IconCertificate class="w-5 h-5 mr-2 text-primary-600" />
            Documents & Certifications
          </h3>
          <div
            class="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
            <IconFileCheck class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p class="text-gray-500 dark:text-gray-400 mb-4">Aucun document soumis</p>
            <button class="btn btn-outline btn-sm">
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
            <li class="flex items-start">
              <IconMail class="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <span class="font-medium text-gray-900 dark:text-white">{{ profile?.email }}</span>
              </div>
            </li>
          </ul>
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
                class="w-full btn bg-secondary-600 hover:bg-secondary-700 text-white border-0 shadow-lg"
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
import { ref, reactive, onMounted } from 'vue';
import { useProfileStore } from '~/stores/profile';
import { useAuthStore } from '~/stores/auth';
import {
  IconShieldCheck, IconTruck, IconCertificate, IconFileCheck, IconPhone, IconMail,
  IconHeadset, IconEdit, IconLock, IconX, IconLoader2, IconCheck, IconPlus, IconUser
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
  await profileStore.fetchProfile('carrier');
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

  const result = await profileStore.updateProfile('carrier', {
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
  title: 'Mon Profil Transporteur - Bourse de Fret'
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
</style>
