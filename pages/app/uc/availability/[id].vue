<template>
  <div class="container-custom py-8">
    <!-- Header/Nav -->
    <div class="mb-6 flex justify-between items-center">
      <NuxtLink to="/app/uc/availability" class="text-sm text-gray-500 hover:text-gray-900 flex items-center">
        <IconArrowLeft class="w-4 h-4 mr-1" />
        Retour aux disponibilités
      </NuxtLink>
      <div v-if="availability" class="flex gap-2">
        <button @click="toggleEditMode" class="btn btn-outline btn-sm">
          <IconPencil class="w-4 h-4 mr-1" /> {{ isEditing ? 'Annuler' : 'Modifier' }}
        </button>
        <button @click="handleDelete" class="btn btn-outline border-red-200 text-red-600 hover:bg-red-50 btn-sm">
          <IconTrash class="w-4 h-4 mr-1" /> Supprimer
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <IconLoader2 class="w-10 h-10 animate-spin text-secondary-600" />
    </div>

    <div v-else-if="error" class="bg-red-50 text-red-600 p-6 rounded-xl text-center">
      <p class="mb-4">{{ error }}</p>
      <NuxtLink to="/app/uc/availability" class="btn btn-outline btn-sm">Retour à la liste</NuxtLink>
    </div>

    <!-- View Mode -->
    <div v-else-if="availability && !isEditing" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-6">
        <div class="card p-8">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {{ availability.vehicle?.brand }} {{ availability.vehicle?.model }}
              </h1>
              <span class="badge" :class="{
                'badge-success': availability.status === 'active',
                'badge-error': availability.status === 'expired',
                'badge-warning': availability.status === 'full'
              }">
                {{ availability.status.toUpperCase() }}
              </span>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-primary-600">{{ availability.price || '-' }} <span
                  class="text-sm text-gray-500 font-normal">FCFA</span></p>
              <div v-if="availability.maxRequests" class="mt-1 text-sm">
                <span class="font-medium"
                  :class="availability.currentRequests >= availability.maxRequests ? 'text-red-600' : 'text-gray-600'">
                  {{ availability.currentRequests }} / {{ availability.maxRequests }}
                </span>
                <span class="text-gray-500"> demandes</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 dark:border-gray-700 pt-6">
            <div>
              <h3 class="text-sm font-medium text-gray-500 uppercase mb-3">Trajet</h3>
              <div class="space-y-4">
                <div class="flex items-start">
                  <div class="mt-1 mr-3">
                    <div class="w-2 h-2 rounded-full bg-green-500 ring-4 ring-green-100"></div>
                    <div v-if="availability.destination?.city" class="w-0.5 h-10 bg-gray-200 mx-auto my-1"></div>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ availability.origin.city }}</p>
                    <p class="text-sm text-gray-500">{{ availability.origin.country }}</p>
                  </div>
                </div>
                <div v-if="availability.destination?.city" class="flex items-start">
                  <div class="mt-1 mr-3">
                    <div class="w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-100"></div>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ availability.destination.city }}</p>
                    <p class="text-sm text-gray-500">{{ availability.destination.country }}</p>
                  </div>
                </div>
                <div v-else class="flex items-center text-gray-500 italic text-sm">
                  <IconMapPin class="w-4 h-4 mr-2" /> Toute destination
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-500 uppercase mb-3">Dates</h3>
              <div class="space-y-3">
                <div>
                  <p class="text-xs text-gray-400">Début</p>
                  <p class="font-medium">{{ formatDate(availability.startDate) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-400">Fin</p>
                  <p class="font-medium">{{ formatDate(availability.endDate) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Mode -->
    <div v-else-if="availability && isEditing" class="max-w-2xl mx-auto">
      <div class="card p-6">
        <h2 class="text-xl font-bold mb-6">Modifier la disponibilité</h2>

        <form @submit.prevent="handleUpdate">


          <!-- Dates -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label class="label">Du</label>
              <input v-model="form.startDate" type="datetime-local" class="input" required />
            </div>
            <div>
              <label class="label">Au</label>
              <input v-model="form.endDate" type="datetime-local" class="input" required />
            </div>
          </div>

          <!-- Prix et Max Requests -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label class="label">Prix (FCFA)</label>
              <input v-model.number="form.price" type="number" class="input" />
            </div>
            <div>
              <label class="label">Limite de demandes</label>
              <input v-model.number="form.maxRequests" type="number" class="input" />
            </div>
          </div>

          <!-- Locations -->
          <div class="space-y-4 mb-6">
            <div>
              <label class="label">Origine</label>
              <div class="grid grid-cols-2 gap-2">
                <input v-model="form.origin.city" type="text" required class="input" placeholder="Ville" />
                <input v-model="form.origin.country" type="text" class="input" placeholder="Pays" />
              </div>
            </div>
            <div>
              <label class="label">Destination (Optionnel)</label>
              <div class="grid grid-cols-2 gap-2">
                <input v-model="form.destination.city" type="text" class="input" placeholder="Ville" />
                <input v-model="form.destination.country" type="text" class="input" placeholder="Pays" />
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" @click="toggleEditMode" class="btn btn-ghost">Annuler</button>
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              <IconLoader2 v-if="submitting" class="w-4 h-4 animate-spin mr-2" />
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAvailabilityStore, type Availability } from '~/stores/availability';
import { IconArrowLeft, IconPencil, IconTrash, IconLoader2, IconMapPin } from '@tabler/icons-vue';

const route = useRoute();
const router = useRouter();
const store = useAvailabilityStore();
const id = route.params.id as string;

const availability = ref<Availability | null>(null);
const loading = ref(true);
const error = ref('');
const isEditing = ref(false);
const submitting = ref(false);

const form = reactive({
  startDate: '',
  endDate: '',
  price: undefined as number | undefined,
  maxRequests: undefined as number | undefined,
  origin: { city: '', country: '' },
  destination: { city: '', country: '' }
});

onMounted(async () => {
  await loadAvailability();
});

const loadAvailability = async () => {
  loading.value = true;
  const result = await store.fetchAvailability(id);
  if (result.success && result.availability) {
    availability.value = result.availability;
  } else {
    if (typeof result.error === 'object' && result.error !== null) {
      error.value = result.error.message || 'Impossible de charger la disponibilité';
    } else {
      error.value = result.error || 'Impossible de charger la disponibilité';
    }
  }
  loading.value = false;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

const formatInputDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset() * 60000;
  const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
  return localISOTime;
};

const toggleEditMode = () => {
  if (!availability.value) return;

  if (!isEditing.value) {
    // Populate form
    form.startDate = formatInputDate(availability.value.startDate);
    form.endDate = formatInputDate(availability.value.endDate);
    form.price = availability.value.price;
    form.maxRequests = availability.value.maxRequests;
    form.origin = { ...availability.value.origin };
    form.destination = availability.value.destination ? { ...availability.value.destination } : { city: '', country: '' };
  }

  isEditing.value = !isEditing.value;
};

const handleUpdate = async () => {
  if (new Date(form.startDate) >= new Date(form.endDate)) {
    alert('La date de début doit être avant la date de fin');
    return;
  }

  const now = new Date();
  if (new Date(form.startDate) < now) {
    if (new Date(form.startDate).getTime() !== new Date(availability.value!.startDate).getTime()) {
      alert('La date de début ne peut pas être dans le passé');
      return;
    }
  }
  if (new Date(form.endDate) < now) {
    alert('La date de fin ne peut pas être dans le passé');
    return;
  }

  submitting.value = true;

  const payload = {
    // status is handled by backend
    startDate: form.startDate,
    endDate: form.endDate,
    price: form.price,
    maxRequests: form.maxRequests,
    origin: form.origin,
    destination: form.destination.city ? form.destination : undefined
  };

  const result = await store.updateAvailability(id, payload);

  if (result.success && result.availability) {
    availability.value = result.availability;
    isEditing.value = false;
  } else {
    alert(result.error || 'Erreur lors de la mise à jour');
  }

  submitting.value = false;
};

const handleDelete = async () => {
  if (!confirm('Supprimer cette disponibilité ?')) return;
  const result = await store.deleteAvailability(id);
  if (result.success) {
    router.push('/app/uc/availability');
  } else {
    alert(result.error);
  }
};

definePageMeta({ layout: 'default' });
</script>
