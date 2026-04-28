<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-gray-500/75 dark:bg-gray-900/80 backdrop-blur-sm transition-opacity"
          @click="handleClose"></div>

        <!-- Modal Panel -->
        <div
          class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left shadow-xl transition-all w-full max-w-lg p-6 space-y-6 max-h-[90vh] overflow-y-auto">

          <button @click="handleClose"
            class="absolute right-4 top-4 text-gray-400 hover:text-gray-500 focus:outline-none">
            <IconX class="h-6 w-6" />
          </button>

          <div class="flex items-start">
            <div
              class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-secondary-100 dark:bg-secondary-900/30">
              <IconFileUpload class="h-6 w-6 text-secondary-600" />
            </div>
            <div class="ml-4 w-full">
              <h3 class="text-xl font-bold leading-6 text-gray-900 dark:text-white">
                Soumettre un document
              </h3>

              <div class="mt-4 space-y-4">
                <div v-if="error"
                  class="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg text-sm text-center">
                  {{ error }}
                </div>
                <div v-if="success"
                  class="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-lg text-sm text-center">
                  {{ success }}
                </div>

                <div>
                  <label class="label">Type de document</label>
                  <select v-model="form.type" class="input" required>
                    <option value="" disabled>Choisir un type...</option>
                    <template v-if="role === 'carrier'">
                      <option value="id_card">Carte d'identité / CNI</option>
                      <option value="drivers_license">Permis de conduire</option>
                      <option value="truck_insurance">Assurance véhicule</option>
                      <option value="business_license">Licence de transport / Registre de commerce</option>
                    </template>
                    <template v-else-if="role === 'shipper'">
                      <option value="id_card">Carte d'identité / CNI</option>
                      <option value="business_license">Registre de commerce</option>
                      <option value="tax_id">Identifiant fiscal (Patente)</option>
                    </template>
                  </select>
                </div>

                <div>
                  <label class="label">Fichier (Image ou PDF)</label>
                  <div @click="triggerFileInput"
                    class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:border-secondary-500 transition-colors bg-gray-50 dark:bg-gray-700/50">
                    <div class="space-y-1 text-center">
                      <IconCloudUpload v-if="!form.file" class="mx-auto h-12 w-12 text-gray-400" />
                      <IconFileCheck v-else class="mx-auto h-12 w-12 text-secondary-500" />
                      <div class="flex text-sm text-gray-600 dark:text-gray-400">
                        <span class="relative rounded-md font-medium text-secondary-600 hover:text-secondary-500">
                          {{ form.file ? form.file.name : 'Choisir un fichier' }}
                        </span>
                      </div>
                      <p class="text-xs text-gray-500">PNG, JPG, PDF jusqu'à 5MB</p>
                    </div>
                  </div>
                  <input ref="fileInput" type="file" class="hidden" accept="image/*,.pdf" @change="handleFileChange" />
                </div>
              </div>
            </div>
          </div>

          <div class="pt-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3">
            <button type="button" @click="handleClose" class="btn btn-ghost mt-3 w-full sm:mt-0 sm:w-auto">
              Annuler
            </button>
            <button type="button" @click="handleSubmit" class="flex items-center btn btn-secondary w-full sm:w-auto"
              :disabled="loading || !form.type || !form.file">
              <IconLoader2 v-if="loading" class="w-4 h-4 animate-spin mr-2" />
              Soumettre
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import {
  IconX, IconFileUpload, IconCloudUpload, IconFileCheck, IconLoader2
} from '@tabler/icons-vue';

const props = withDefaults(defineProps<{
  show: boolean;
  loading: boolean;
  error?: string;
  success?: string;
  role?: 'carrier' | 'shipper';
}>(), {
  role: 'carrier'
});

const emit = defineEmits(['close', 'submit']);

const fileInput = ref<HTMLInputElement | null>(null);

const form = reactive({
  type: '',
  file: null as File | null
});

const handleClose = () => {
  if (!props.loading) {
    emit('close');
    form.type = '';
    form.file = null;
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    form.file = target.files[0];
  }
};

const handleSubmit = () => {
  if (form.type && form.file) {
    emit('submit', { type: form.type, file: form.file });
  }
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
