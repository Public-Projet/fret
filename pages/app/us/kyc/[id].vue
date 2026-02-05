<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
    <div class="container-custom pt-12">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <button @click="router.back()" class="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">
          <IconArrowLeft class="w-5 h-5 mr-2" />
          Retour au profil
        </button>
        <span class="badge" :class="statusClass">
          {{ getStatusLabel(document?.status) }}
        </span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Document View -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h1 class="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <IconFileDescription class="w-6 h-6 mr-2 text-primary-600" />
                {{ getDocTypeName(document?.type) }}
              </h1>
              <a v-if="document?.url" :href="document.url" target="_blank" class="btn btn-primary btn-sm">
                <IconDownload class="w-4 h-4 mr-2" />
                Télécharger
              </a>
            </div>

            <div class="p-8 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center min-h-[400px]">
              <div v-if="loading" class="text-center">
                <IconLoader2 class="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
                <p class="text-gray-500">Chargement de l'aperçu...</p>
              </div>
              <div v-else-if="error" class="text-center">
                <IconAlertCircle class="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p class="text-red-600 font-medium">{{ error }}</p>
              </div>
              <div v-else-if="document" class="w-full">
                 <div v-if="isImage" class="relative group">
                    <img :src="document.url" :alt="document.name" class="max-w-full h-auto rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mx-auto" />
                 </div>
                 <div v-else class="text-center p-12 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <IconFileTypePdf class="w-20 h-20 text-red-500 mx-auto mb-4" />
                    <h3 class="font-bold text-lg mb-2">Document PDF</h3>
                    <p class="text-gray-500 mb-6">L'aperçu direct des fichiers PDF n'est pas disponible.</p>
                    <a :href="document.url" target="_blank" class="btn btn-outline btn-primary">
                       Ouvrir dans un nouvel onglet
                    </a>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Details Sidebar -->
        <div class="space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="font-bold text-gray-900 dark:text-white mb-6">Détails du document</h3>
            
            <div class="space-y-4">
              <div class="flex flex-col">
                <span class="text-xs text-gray-500 uppercase tracking-wider mb-1">Date de soumission</span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ document ? formatDate(document.uploadedAt) : '-' }}
                </span>
              </div>
              <hr class="border-gray-100 dark:border-gray-700" />
              <div class="flex flex-col">
                <span class="text-xs text-gray-500 uppercase tracking-wider mb-1">Nom du fichier</span>
                <span class="font-medium text-gray-900 dark:text-white truncate" :title="document?.name">
                  {{ document?.name || '-' }}
                </span>
              </div>
              <hr class="border-gray-100 dark:border-gray-700" />
              <div class="flex flex-col">
                <span class="text-xs text-gray-500 uppercase tracking-wider mb-1">Statut</span>
                <div class="mt-1">
                   <span class="badge" :class="statusClass">
                     {{ getStatusLabel(document?.status) }}
                   </span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-6 border border-primary-100 dark:border-primary-900/30">
            <h4 class="font-bold text-primary-900 dark:text-primary-100 mb-2">Verification KYC</h4>
            <p class="text-sm text-primary-700 dark:text-primary-300 leading-relaxed">
              Ce document est en cours d'examen par nos administrateurs. Une fois vérifié, votre compte passera au statut "Vérifié".
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProfileStore } from '~/stores/profile';
import { 
  IconArrowLeft, IconFileDescription, IconDownload, IconLoader2, 
  IconAlertCircle, IconFileTypePdf 
} from '@tabler/icons-vue';

const route = useRoute();
const router = useRouter();
const profileStore = useProfileStore();

const document = ref<any>(null);
const loading = ref(true);
const error = ref('');

const docId = route.params.id as string;

const isImage = computed(() => {
  if (!document.value?.name) return false;
  const ext = document.value.name.split('.').pop()?.toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '');
});

const statusClass = computed(() => {
  if (!document.value) return 'badge-ghost';
  const status = document.value.status;
  return {
    'badge-success': status === 'verified',
    'badge-warning': status === 'pending',
    'badge-error': status === 'rejected'
  };
});

onMounted(async () => {
  const result = await profileStore.fetchKycDocument('shipper', docId);
  loading.value = false;
  if (result.success) {
    document.value = result.document;
  } else {
    error.value = result.error || 'Impossible de trouver le document.';
  }
});

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

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

definePageMeta({ layout: 'default' });
useHead({ title: 'Détails du document KYC - Bourse de Fret' });
</script>
