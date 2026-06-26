<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
    <h4 class="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
      <IconCreditCard class="w-5 h-5 mr-2 text-primary-600" />
      Abonnement
    </h4>

    <!-- Chargement -->
    <div v-if="loading" class="space-y-3">
      <UiAppSkeleton v-for="i in 3" :key="i" :loading="true" type="text" />
      <UiAppSkeleton :loading="true" type="rectangle" class="mt-4" />
    </div>

    <!-- Contenu -->
    <template v-else>
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500">Plan</span>
          <span class="badge"
            :class="profile?.subscriptionStatus === 'active' && profile?.subscriptionPlan === 'pro' ? 'badge-primary text-white' : 'badge-ghost'">
            {{ profile?.subscriptionStatus === 'active' && profile?.subscriptionPlan === 'pro' ? 'Pro' : 'Gratuit' }}
          </span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500">Facturation</span>
          <span class="text-sm font-medium">
            {{ profile?.subscriptionStatus === 'active' && profile?.subscriptionType
              ? (profile?.subscriptionType === 'annual' ? 'Annuelle' : 'Mensuelle') : 'Aucune' }}
          </span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500">Statut</span>
          <span class="badge badge-sm"
            :class="profile?.subscriptionStatus === 'active' ? 'badge-success text-white' : 'badge-error text-white'">
            {{ profile?.subscriptionStatus === 'active' ? 'Actif' : 'Inactif' }}
          </span>
        </div>
        <div v-if="profile?.subscriptionExpiresAt" class="flex justify-between items-center">
          <span class="text-sm text-gray-500">Expire le</span>
          <span class="text-sm font-medium">{{ formatDate(profile?.subscriptionExpiresAt) }}</span>
        </div>
      </div>
      <NuxtLink v-if="profile?.subscriptionPlan !== 'pro'" to="/pricing" class="btn btn-primary btn-sm w-full mt-4">
        Passer Pro
      </NuxtLink>
      <div v-if="canCancel" class="mt-4">
        <button @click="$emit('cancel-subscription')"
          class="flex items-center justify-center btn btn-outline border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 btn-sm w-full"
          :disabled="cancelLoading">
          <template v-if="cancelLoading">
            <UiStepLoading :steps="['Annulation', 'Génération de la facture', 'Envoi de la facture']"
              :active-step="cancelActiveStep" :auto-play="false" color="primary" mode="replace" />
          </template>
          <template v-else>
            <IconCircleX class="w-4 h-4 mr-2" />
            Annuler et rembourser
          </template>
        </button>
        <p v-if="cancelError" class="text-xs text-red-500 mt-2">{{ cancelError }}</p>
        <p v-if="cancelSuccess" class="text-xs text-green-500 mt-2">{{ cancelSuccess }}</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { IconCreditCard, IconCircleX } from '@tabler/icons-vue';
import { formatDate } from '~/utils/maps';

defineProps<{
  profile?: any;
  canCancel?: boolean;
  cancelLoading?: boolean;
  cancelActiveStep?: number;
  cancelError?: string;
  cancelSuccess?: string;
  loading?: boolean;
}>();

defineEmits<{
  (e: 'cancel-subscription'): void;
}>();
</script>
