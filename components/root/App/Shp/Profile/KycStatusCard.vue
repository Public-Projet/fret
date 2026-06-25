<template>
  <div
    class="bg-gradient-to-br from-primary-900 to-slate-900 text-white rounded-xl shadow-lg p-6 relative overflow-hidden">
    <UiAppSkeleton :loading="loading" type="card" theme="dark">
      <div class="relative z-10">
        <h3 class="text-lg font-bold mb-1">Expéditeur</h3>
        <p class="text-primary-200 text-sm mb-2">
          Compte {{ profile?.status === 'active' ? 'actif' : 'en attente' }}
        </p>
        <div class="flex items-center space-x-2">
          <span class="text-xs text-primary-300">Statut KYC:</span>
          <span class="badge badge-sm" :class="getKycStatusClass(profile?.kycStatus)">
            {{ getKycStatusLabel(profile?.kycStatus) }}
          </span>
        </div>
      </div>
      <IconPremiumRights class="absolute -bottom-4 -right-4 w-32 h-32 text-white/5" />
    </UiAppSkeleton>
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
