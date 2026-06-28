<template>
  <div class="h-64 bg-slate-900 relative overflow-hidden">
    <div class="container-custom h-full flex items-end pb-8 relative z-10">
      <!-- CHARGEMENT -->
      <div v-if="loading" class="flex items-end space-x-6 w-full">
        <div class="w-32 h-32 -mb-16 shrink-0">
          <UiAppSkeleton :loading="true" type="avatar" width="8rem" height="8rem" radius="0.5rem" theme="dark" />
        </div>

        <div class="flex-1 pb-4 space-y-2">
          <UiAppSkeleton :loading="true" type="heading" width="12rem" height="2rem" theme="dark" />
          <UiAppSkeleton :loading="true" type="text" width="9rem" height="1rem" theme="dark" />
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
          <img v-if="profile.photoUrl" :src="profile.photoUrl" :alt="`${profile.firstname} ${profile.lastname}`"
            class="w-full h-full object-cover rounded" />
          <div v-else
            class="w-full h-full bg-slate-100 rounded flex items-center justify-center text-4xl font-bold text-slate-700 uppercase">
            {{ profile.firstname?.[0] }}{{ profile.lastname?.[0] }}
          </div>
        </div>

        <!-- Infos contenu -->
        <div class="flex-1 pb-4">
          <h1 class="text-3xl font-bold text-white mb-1">
            {{ profile.firstname }} {{ profile.lastname }}
          </h1>
          <p class="text-slate-300 flex items-center flex-wrap gap-y-1">
            <IconBuildingSkyscraper class="w-4 h-4 mr-1 shrink-0" />
            Compte Expéditeur
            <span class="mx-2">•</span>
            <span v-if="profile.status === 'active'" class="text-green-400 flex items-center text-sm font-medium">
              <IconDiscountCheckFilled class="w-4 h-4 mr-1 shrink-0" />
              Vérifié
            </span>
            <span v-else class="text-yellow-400 text-sm font-medium">En attente</span>
          </p>
        </div>

        <!-- Actions contenu -->
        <div class="pb-4 flex space-x-3 shrink-0">
          <button @click="$emit('open-security')"
            class="btn bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm" title="Sécurité">
            <IconLock class="w-5 h-5" />
          </button>
          <button @click="openEditModal"
            class="btn bg-primary-600 hover:bg-primary-700 text-white border-0 shadow-lg shadow-primary-900/20">
            Modifier le profil
          </button>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ModalProfileEdit :show="showEditModal" :profile="profile" :loading="editLoading" :error="editError"
      :success="editSuccess" accent-color="primary" @close="showEditModal = false" @submit="handleUpdateProfile" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IconBuildingSkyscraper, IconDiscountCheckFilled, IconLock } from '@tabler/icons-vue';
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
  const result = await profileStore.updateProfile('shipper', data);
  editLoading.value = false;
  if (result.success) {
    editSuccess.value = result.message || 'Profil mis à jour !';
    setTimeout(() => { showEditModal.value = false; }, 1500);
  } else {
    editError.value = result.error || 'Une erreur est survenue';
  }
};
</script>

<style scoped>
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
