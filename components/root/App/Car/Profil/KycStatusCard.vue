<template>
  <div class="bg-secondary-600 text-white rounded-xl p-6 relative overflow-hidden">
    <div class="relative z-10">
      <h4 class="font-bold mb-2">Besoin d'aide ?</h4>
      <p class="text-secondary-100 text-sm mb-2">Contactez le support pour mettre à jour vos documents.</p>
      <div class="flex items-center space-x-2 mb-4">
        <span class="text-xs text-secondary-200 font-medium">Statut KYC:</span>
        <span class="badge badge-sm" :class="getKycStatusClass(profile?.kycStatus)">
          {{ getKycStatusLabel(profile?.kycStatus) }}
        </span>
      </div>
      <NuxtLink to="/support/contact" class="btn bg-white text-secondary-700 border-0 btn-sm">Support</NuxtLink>
    </div>
    <IconHeadset class="absolute -bottom-4 -right-4 w-24 h-24 text-white/10" />
  </div>
</template>

<script setup lang="ts">
import { IconHeadset } from '@tabler/icons-vue';
import { getKycStatusLabel, getKycStatusClass } from '~/utils/maps';

defineProps<{
  profile?: any;
}>();
</script>
