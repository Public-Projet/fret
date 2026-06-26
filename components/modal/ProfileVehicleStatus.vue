<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="!loading && $emit('close')"></div>
        <div
          class="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 space-y-6 transform transition-all">
          <button @click="$emit('close')"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <IconX class="w-5 h-5" />
          </button>

          <div class="text-center">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Modifier le statut</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Sélectionnez le nouveau statut du véhicule</p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-2">
              <label
                class="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                :class="{ 'border-secondary-500 ring-1 ring-secondary-500 bg-secondary-50 dark:bg-secondary-900/10': selectedStatus === 'available' }">
                <input type="radio" v-model="selectedStatus" value="available"
                  class="radio radio-primary radio-sm mr-3" />
                <span class="flex-1 font-medium text-gray-900 dark:text-white">Disponible</span>
                <span class="badge badge-success badge-sm">Succès</span>
              </label>

              <label
                class="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                :class="{ 'border-secondary-500 ring-1 ring-secondary-500 bg-secondary-50 dark:bg-secondary-900/10': selectedStatus === 'in_transit' }">
                <input type="radio" v-model="selectedStatus" value="in_transit"
                  class="radio radio-warning radio-sm mr-3" />
                <span class="flex-1 font-medium text-gray-900 dark:text-white">En transit</span>
                <span class="badge badge-warning badge-sm">Transit</span>
              </label>

              <label
                class="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                :class="{ 'border-secondary-500 ring-1 ring-secondary-500 bg-secondary-50 dark:bg-secondary-900/10': selectedStatus === 'maintenance' }">
                <input type="radio" v-model="selectedStatus" value="maintenance"
                  class="radio radio-error radio-sm mr-3" />
                <span class="flex-1 font-medium text-gray-900 dark:text-white">Maintenance</span>
                <span class="badge badge-danger badge-sm">Arrêt</span>
              </label>
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
              class="justify-center flex items-center w-full btn btn-secondary border-0 shadow-lg text-white"
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
import { ref, watch } from 'vue';
import { IconX, IconLoader2, IconCheck } from '@tabler/icons-vue';

const props = defineProps<{
  show: boolean;
  currentStatus: string;
  loading?: boolean;
  error?: string;
  success?: string;
}>();

const emit = defineEmits<{
  close: [];
  submit: [status: string];
}>();

const selectedStatus = ref(props.currentStatus);

watch(() => props.show, (isOpen) => {
  if (isOpen) {
    selectedStatus.value = props.currentStatus;
  }
});

const handleSubmit = () => {
  emit('submit', selectedStatus.value);
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
