<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
        @click="$emit('close')"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div
        class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                Modifier l'annonce
              </h3>
              <div class="mt-4 space-y-4">
                <div>
                  <label class="label">Titre</label>
                  <input v-model="form.title" type="text" class="input" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="label">Budget (FCFA)</label>
                    <input v-model.number="form.budget" type="number" class="input" />
                  </div>
                  <div>
                    <label class="label">Date d'enlèvement</label>
                    <input v-model="form.pickupDate" type="date" class="input" />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="label">Ville de départ</label>
                    <input v-model="form.origin.city" type="text" class="input" />
                  </div>
                  <div>
                    <label class="label">Ville d'arrivée</label>
                    <input v-model="form.destination.city" type="text" class="input" />
                  </div>
                </div>

                <div>
                  <label class="label">Description</label>
                  <textarea v-model="form.description" rows="3" class="input"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button" class="btn btn-primary w-full sm:w-auto sm:ml-3" @click="handleSubmit">
            Enregistrer
          </button>
          <button type="button" class="mt-3 w-full sm:mt-0 sm:w-auto btn btn-ghost" @click="$emit('close')">
            Annuler
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Announcement } from '~/types';

const props = defineProps<{
  announcement: Announcement | null
}>();

const emit = defineEmits(['close', 'update']);

const form = ref({
  title: '',
  budget: 0,
  pickupDate: '',
  description: '',
  origin: { city: '' },
  destination: { city: '' }
});

onMounted(() => {
  if (props.announcement) {
    form.value = {
      title: props.announcement.title,
      budget: props.announcement.budget,
      pickupDate: props.announcement.pickupDate.split('T')[0],
      description: props.announcement.description || '',
      origin: { ...props.announcement.origin },
      destination: { ...props.announcement.destination }
    };
  }
});

const handleSubmit = () => {
  emit('update', form.value);
};
</script>
