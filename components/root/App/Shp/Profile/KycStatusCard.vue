<template>
  <div
    class="bg-gradient-to-br from-primary-900 to-slate-900 text-white rounded-xl shadow-lg p-6 relative overflow-hidden">

    <!-- Chargement -->
    <div v-if="loading" class="space-y-3">
      <UiAppSkeleton :loading="true" type="text" class="w-1/3" />
      <UiAppSkeleton :loading="true" type="text" class="w-1/2" />
      <UiAppSkeleton :loading="true" type="text" class="w-1/4 mt-2" />
    </div>

    <div v-else class="relative z-10 flex flex-col h-full justify-between">
      <div>
        <h3 class="text-lg font-bold mb-1">Expéditeur</h3>
        <p class="text-primary-200 text-sm mb-2">
          Compte {{ profile?.status === 'active' ? 'actif' : 'en attente' }}
        </p>
        <div class="flex items-center space-x-2">
          <span class="text-xs text-primary-300">Statut KYC:</span>
          <span class="badge badge-sm shrink-0" :class="getKycStatusClass(profile?.kycStatus)">
            {{ getKycStatusLabel(profile?.kycStatus) }}
          </span>
        </div>
      </div>

      <IconPremiumRights class="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 pointer-events-none" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { IconPremiumRights } from '@tabler/icons-vue';
import { getKycStatusLabel, getKycStatusClass } from '~/utils/maps';

defineProps<{
  profile?: any;
  loading?: boolean;
}>();
</script>
