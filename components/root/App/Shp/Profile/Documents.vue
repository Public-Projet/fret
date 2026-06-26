<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <h3 class="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
      <IconCertificate class="w-5 h-5 mr-2 text-primary-600" />
      Documents
    </h3>

    <!-- Chargement -->
    <div v-if="loading" class="space-y-3">
      <UiAppSkeleton v-for="i in 2" :key="i" :loading="true" type="card" />
    </div>

    <!-- Contenu -->
    <div v-else-if="kycDocuments && kycDocuments.length > 0" class="space-y-3">
      <div v-for="doc in kycDocuments" :key="doc.id"
        class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div class="flex items-center space-x-3 overflow-hidden">
          <IconFileCheck v-if="doc.status === 'verified'" class="w-5 h-5 text-green-500 flex-shrink-0" />
          <IconLoader2 v-else-if="doc.status === 'pending'"
            class="w-5 h-5 text-yellow-500 flex-shrink-0 animate-spin" />
          <IconX v-else class="w-5 h-5 text-red-500 flex-shrink-0" />
          <div class="min-w-0">
            <p class="text-sm font-medium truncate text-gray-900 dark:text-white">{{ getDocTypeName(doc.type) }}</p>
            <NuxtLink :to="`/app/us/kyc/${doc.id}`"
              class="text-xs text-primary-600 hover:text-primary-700 flex items-center mt-0.5">
              <IconEye class="w-3 h-3 mr-1" /> Détails
            </NuxtLink>
          </div>
        </div>
        <span class="badge badge-sm" :class="{
          'badge-success': doc.status === 'verified',
          'badge-warning': doc.status === 'pending',
          'badge-error': doc.status === 'rejected'
        }">{{ getStatusLabel(doc.status) }}</span>
      </div>
      <button @click="openKycModal" class="btn btn-ghost btn-sm w-full text-primary-600 text-xs">
        + Ajouter un autre
      </button>
    </div>

    <!-- Vide -->
    <div v-else class="text-center py-4">
      <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">Aucun document</p>
      <button @click="openKycModal" class="flex items-center justify-center btn btn-primary btn-sm w-full">
        <IconPlus class="w-4 h-4 mr-1" /> Ajouter
      </button>
    </div>

    <!-- Modals -->
    <ModalProfileKyc :show="showKycModal" :loading="kycLoading" :error="kycError" :success="kycSuccess" role="shipper"
      @close="showKycModal = false" @submit="handleKycSubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IconCertificate, IconFileCheck, IconLoader2, IconX, IconPlus, IconEye } from '@tabler/icons-vue';
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
  const result = await profileStore.uploadKycDocument(data.type, data.file, 'shipper');
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
    business_license: "Registre de commerce",
    tax_id: "Identifiant fiscal (Patente)"
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
