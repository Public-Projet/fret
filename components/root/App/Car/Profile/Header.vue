<template>
  <div class="h-64 bg-slate-800 relative overflow-hidden group">
    <div
      class="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] opacity-10 bg-center bg-no-repeat bg-cover">
    </div>
    <div class="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>

    <div class="container-custom h-full flex items-end pb-8 relative z-10">
      <!-- CHARGEMENT -->
      <div v-if="loading" class="flex items-end space-x-6 w-full">
        <div class="w-32 h-32 -mb-16 shrink-0">
          <UiAppSkeleton :loading="true" type="avatar" width="8rem" height="8rem" radius="0.5rem" theme="dark" />
        </div>

        <div class="flex-1 pb-4 space-y-2">
          <UiAppSkeleton :loading="true" type="heading" width="12rem" height="2rem" theme="dark" />
          <UiAppSkeleton :loading="true" type="text" width="16rem" height="1rem" theme="dark" />
        </div>

        <div class="pb-4 flex space-x-3">
          <UiAppSkeleton :loading="true" type="rectangle" width="3rem" height="2.5rem" radius="0.5rem" theme="dark" />
          <UiAppSkeleton :loading="true" type="rectangle" width="9rem" height="2.5rem" radius="0.5rem" theme="dark" />
        </div>
      </div>

      <!-- DONNÉES -->
      <div v-else-if="profile" class="flex items-end space-x-6 w-full">
        <!-- Avatar contenu -->
        <div class="w-32 h-32 bg-white rounded-lg shadow-xl p-1 flex items-center justify-center -mb-16 shrink-0">
          <div
            class="w-full h-full bg-slate-100 rounded flex items-center justify-center text-4xl font-bold text-slate-700 uppercase">
            {{ profile.firstname?.[0] }}{{ profile.lastname?.[0] }}
          </div>
        </div>

        <!-- Infos contenu -->
        <div class="flex-1 pb-4">
          <div class="flex items-center space-x-4 mb-1">
            <span v-if="profile.status === 'active'"
              class="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center">
              <IconRosetteDiscountCheck class="w-3 h-3 mr-1 shrink-0" />
              Transporteur Vérifié
            </span>
            <span v-else-if="profile.status === 'pending'"
              class="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
              En attente de vérification
            </span>
          </div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">
            {{ profile.firstname }} {{ profile.lastname }}
          </h1>
          <p class="text-slate-400 mt-1 max-w-2xl text-sm">
            {{ profile.bio || 'Pas de description' }}
          </p>
        </div>

        <!-- Actions contenu -->
        <div class="pb-4 flex space-x-3 shrink-0">
          <button @click="$emit('open-security')"
            class="btn bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm" title="Sécurité">
            <IconLock class="w-5 h-5" />
          </button>
          <button @click="openEditModal"
            class="btn bg-secondary-600 hover:bg-secondary-700 text-white border-0 shadow-lg shadow-secondary-900/20">
            Modifier le profil
          </button>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ModalProfileEdit :show="showEditModal" :profile="profile" :loading="editLoading" :error="editError"
      :success="editSuccess" accent-color="secondary" @close="showEditModal = false" @submit="handleUpdateProfile" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IconRosetteDiscountCheck, IconLock } from '@tabler/icons-vue';
import type { UserProfile } from '~/types';
import { useCmnProfileStore } from '~/stores/cmnProfile';

defineProps<{
  profile: UserProfile | null;
  loading?: boolean;
}>();

defineEmits<{
  'open-security': [];
}>();

const profileStore = useCmnProfileStore();

// Local States for edit modal
const showEditModal = ref(false);
const editLoading = ref(false);
const editError = ref('');
const editSuccess = ref('');

const openEditModal = () => {
  editError.value = '';
  editSuccess.value = '';
  showEditModal.value = true;
};

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
</script>
