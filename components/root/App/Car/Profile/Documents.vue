<template>
  <section>
    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
      <IconCertificate class="w-5 h-5 mr-2 text-secondary-600" />
      Documents &amp; Certifications
    </h3>

    <!-- Chargement -->
    <div v-if="loading" class="space-y-4">
      <UiAppSkeleton v-for="i in 2" :key="i" :loading="true" type="card" />
    </div>

    <!-- Vide -->
    <div v-else-if="!kycDocuments || kycDocuments.length === 0"
      class="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
      <IconFileCheck class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
      <p class="text-gray-500 dark:text-gray-400 mb-4">Aucun document soumis</p>
      <button @click="openKycModal" class="mx-auto flex items-center btn btn-outline btn-sm">
        <IconPlus class="w-4 h-4 mr-1" />
        Soumettre un document
      </button>
    </div>

    <!-- Contenu -->
    <div v-else class="space-y-4">
      <div v-for="doc in kycDocuments" :key="doc.id"
        class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <IconFileCheck v-if="doc.status === 'verified'" class="w-5 h-5 text-green-500" />
            <IconLoader2 v-else-if="doc.status === 'pending'" class="w-5 h-5 text-yellow-500 animate-spin" />
            <IconX v-else class="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h4 class="font-bold text-gray-900 dark:text-white">{{ getDocTypeName(doc.type) }}</h4>
            <div class="flex items-center space-x-2">
              <p class="text-xs text-gray-500">Soumis le {{ formatDate(doc.uploadedAt) }}</p>
              <span class="text-gray-300">•</span>
              <NuxtLink :to="`/app/uc/kyc/${doc.id}`"
                class="text-xs text-secondary-600 hover:text-secondary-700 font-medium flex items-center">
                <IconEye class="w-3 h-3 mr-1" /> Détails
              </NuxtLink>
            </div>
          </div>
        </div>
        <span class="badge" :class="{
          'badge-success': doc.status === 'verified',
          'badge-warning': doc.status === 'pending',
          'badge-danger': doc.status === 'rejected'
        }">
          {{ getStatusLabel(doc.status) }}
        </span>
      </div>
      <button @click="openKycModal"
        class="flex items-center justify-center btn btn-ghost btn-sm w-full border border-dashed">
        <IconPlus class="w-4 h-4 mr-1" /> Ajouter un autre document
      </button>
    </div>

    <!-- Modals -->
    <ModalProfileKyc :show="showKycModal" :loading="kycLoading" :error="kycError" :success="kycSuccess"
      @close="showKycModal = false" @submit="handleKycSubmit" />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IconCertificate, IconFileCheck, IconLoader2, IconX, IconPlus, IconEye } from '@tabler/icons-vue';
import { formatDate } from '~/utils/maps';
import { useCmnProfileStore } from '~/stores/cmnProfile';

defineProps<{
  kycDocuments?: any[];
  loading?: boolean;
}>();

const profileStore = useCmnProfileStore();

// KYC Modal State
const showKycModal = ref(false);
const kycLoading = ref(false);
const kycError = ref('');
const kycSuccess = ref('');

const openKycModal = () => {
  kycError.value = '';
  kycSuccess.value = '';
  showKycModal.value = true;
};

const handleKycSubmit = async (data: { type: string; file: File }) => {
  kycLoading.value = true;
  kycError.value = '';
  kycSuccess.value = '';
  const result = await profileStore.uploadKycDocument(data.type, data.file);
  kycLoading.value = false;
  if (result.success) {
    kycSuccess.value = result.message || 'Document soumis avec succès !';
    setTimeout(() => { showKycModal.value = false; }, 1500);
  } else {
    kycError.value = result.error || 'Une erreur est survenue lors de l\'envoi';
  }
};

const getDocTypeName = (type: string) => {
  const types: Record<string, string> = {
    id_card: "Carte d'identité",
    drivers_license: "Permis de conduire",
    truck_insurance: "Assurance véhicule",
    business_license: "Licence de transport"
  };
  return types[type] || type;
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    verified: 'Vérifié',
    rejected: 'Rejeté'
  };
  return labels[status] || status;
};
</script>
