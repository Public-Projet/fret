<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="!loading && $emit('close')"></div>
        <div
          class="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
          <button @click="$emit('close')"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <IconX class="w-5 h-5" />
          </button>

          <div class="text-center mb-6">
            <div
              class="w-14 h-14 mx-auto mb-4 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
              <IconTruck class="w-7 h-7 text-secondary-600 dark:text-secondary-400" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ modalTitle }}</h3>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="label">Marque</label>
                <input type="text" v-model="form.brand" class="input" placeholder="ex: Mercedes" />
              </div>
              <div>
                <label class="label">Modèle</label>
                <input type="text" v-model="form.model" class="input" placeholder="ex: Actros" />
              </div>
            </div>

            <div>
              <label class="label">Immatriculation</label>
              <input type="text" v-model="form.licensePlate" class="input" placeholder="XX-123-YY" required />
            </div>

            <div>
              <label class="label">Type de véhicule</label>
              <select v-model="form.type" class="input" required>
                <option value="" disabled>Sélectionner un type</option>
                <option value="truck">Camion</option>
                <option value="van">Fourgonnette</option>
                <option value="pickup">Pick-up</option>
                <option value="semi">Semi-remorque</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="label">Capacité (T)</label>
                <input type="number" step="0.1" v-model.number="form.capacity" class="input" placeholder="0.0" />
              </div>
              <div>
                <label class="label">Volume (m³)</label>
                <input type="number" step="0.1" v-model.number="form.volume" class="input" placeholder="0.0" />
              </div>
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
              {{ isEdit ? 'Mettre à jour' : 'Ajouter le véhicule' }}
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue';
import { IconX, IconTruck, IconLoader2, IconCheck } from '@tabler/icons-vue';
import type { AddVehicleData, Vehicle } from '~/types';

const props = defineProps<{
  show: boolean;
  vehicle?: Vehicle | null;
  loading?: boolean;
  error?: string;
  success?: string;
}>();

const emit = defineEmits<{
  close: [];
  submit: [data: AddVehicleData];
}>();

const isEdit = computed(() => !!props.vehicle);
const modalTitle = computed(() => isEdit.value ? 'Modifier le véhicule' : 'Ajouter un véhicule');

const form = reactive<AddVehicleData>({
  brand: '',
  model: '',
  licensePlate: '',
  type: '',
  capacity: undefined,
  volume: undefined
});

// Reset or fill form when modal opens
watch(() => props.show, (isOpen) => {
  if (isOpen) {
    if (props.vehicle) {
      form.brand = props.vehicle.brand || '';
      form.model = props.vehicle.model || '';
      form.licensePlate = props.vehicle.licensePlate;
      form.type = props.vehicle.type;
      form.capacity = props.vehicle.capacity;
      form.volume = props.vehicle.volume;
    } else {
      form.brand = '';
      form.model = '';
      form.licensePlate = '';
      form.type = '';
      form.capacity = undefined;
      form.volume = undefined;
    }
  }
});

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
