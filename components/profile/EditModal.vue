<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="!error && !loading && $emit('close')"></div>
        <div
          class="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
          <button @click="$emit('close')"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <IconX class="w-5 h-5" />
          </button>
          <div class="text-center mb-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Modifier mon profil</h3>
          </div>

          <!-- Photo Upload Section -->
          <div class="flex flex-col items-center space-y-4 mb-6">
            <div class="relative group">
              <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-800 shadow-md">
                <img v-if="form.photoUrl" :src="form.photoUrl" alt="Photo de profil" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <IconUser class="w-10 h-10 text-gray-400" />
                </div>
              </div>
              <button 
                type="button" 
                @click="triggerFileUpload"
                class="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:text-primary-600 transition-colors"
                :disabled="uploadingPhoto"
              >
                <IconLoader2 v-if="uploadingPhoto" class="w-4 h-4 animate-spin" />
                <IconCamera v-else class="w-4 h-4" />
              </button>
              <input 
                ref="fileInput" 
                type="file" 
                accept="image/*" 
                class="hidden" 
                @change="handleFileUpload" 
              />
            </div>
            <p class="text-xs text-gray-500">Cliquez sur l'icône pour changer votre photo</p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="label">Prénom</label>
                <input type="text" v-model="form.firstname" class="input" placeholder="Prénom" />
              </div>
              <div>
                <label class="label">Nom</label>
                <input type="text" v-model="form.lastname" class="input" placeholder="Nom" />
              </div>
            </div>
            <div>
              <label class="label">Téléphone</label>
              <UtilsPhoneInput v-model="form.phone" />
            </div>
            <div>
              <label class="label">Biographie</label>
              <textarea v-model="form.bio" class="input" rows="3" placeholder="Décrivez votre activité..."></textarea>
            </div>
            <div v-if="error"
              class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p class="text-red-600 dark:text-red-400 text-sm text-center">{{ error }}</p>
            </div>
            <div v-if="success"
              class="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <p class="text-green-600 dark:text-green-400 text-sm text-center">{{ success }}</p>
            </div>
            <button type="submit"
              :class="['justify-center flex items-center w-full btn border-0 shadow-lg text-white', accentClass]"
              :disabled="loading">
              <IconLoader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
              <IconCheck v-else class="w-4 h-4 mr-2" />
              Enregistrer
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import { IconX, IconLoader2, IconCheck, IconCamera, IconUser } from '@tabler/icons-vue';
import { useCmnProfileStore } from '~/stores/cmnProfile';
import type { UserProfile } from '~/types';

const props = defineProps<{
  show: boolean;
  profile: UserProfile | null;
  loading?: boolean;
  error?: string;
  success?: string;
  accentColor?: 'primary' | 'secondary';
}>();

const emit = defineEmits<{
  close: [];
  submit: [data: { firstname: string; lastname: string; phone: string; bio: string; photoUrl: string }];
}>();

const profileStore = useCmnProfileStore();
const fileInput = ref<HTMLInputElement | null>(null);
const uploadingPhoto = ref(false);

const form = reactive({
  firstname: '',
  lastname: '',
  phone: '',
  bio: '',
  photoUrl: ''
});

const accentClass = computed(() => {
  return props.accentColor === 'secondary'
    ? 'bg-secondary-600 hover:bg-secondary-700'
    : 'bg-primary-600 hover:bg-primary-700';
});

// Sync form with profile when modal opens
watch(() => props.show, (isOpen) => {
  if (isOpen && props.profile) {
    form.firstname = props.profile.firstname || '';
    form.lastname = props.profile.lastname || '';
    form.phone = props.profile.phone || '';
    form.bio = props.profile.bio || '';
    form.photoUrl = props.profile.photoUrl || '';
  }
}, { immediate: true });

const triggerFileUpload = () => {
  fileInput.value?.click();
};

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const file = input.files[0];
  uploadingPhoto.value = true;

  try {
    const result = await profileStore.uploadProfilePhoto(props.profile?.role || 'carrier', file);
    if (result.success) {
      form.photoUrl = result.photoUrl!;
    }
  } finally {
    uploadingPhoto.value = false;
    // Reset input
    input.value = '';
  }
};

const handleSubmit = () => {
  emit('submit', { ...form });
};
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
