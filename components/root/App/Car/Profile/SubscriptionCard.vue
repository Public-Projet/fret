<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
    <h4 class="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
      <IconCreditCard class="w-5 h-5 mr-2 text-secondary-600" />
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
            :class="profile?.subscriptionStatus === 'active' && profile?.subscriptionPlan === 'pro' ? 'badge-secondary text-white' : 'badge-ghost'">
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
      <div v-if="profile?.subscriptionPlan !== 'pro'" class="mt-4">
        <NuxtLink to="/pricing" class="flex items-center justify-center btn btn-secondary btn-sm w-full">
          Passer Pro
        </NuxtLink>
      </div>
      <div v-if="canCancel" class="mt-4">
        <button @click="handleCancelSubscription"
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
import { ref, computed } from 'vue';
import { IconCreditCard, IconCircleX } from '@tabler/icons-vue';
import { formatDate } from '~/utils/maps';
import { useCmnProfileStore } from '~/stores/cmnProfile';
import { useCmnSubscriptionStore } from '~/stores/cmnSubscription';

const props = defineProps<{
  profile?: any;
  loading?: boolean;
  role: 'carrier' | 'shipper';
}>();

const profileStore = useCmnProfileStore();
const subscriptionStore = useCmnSubscriptionStore();

// Local states for cancel subscription
const cancelLoading = ref(false);
const cancelActiveStep = ref(0);
const cancelError = ref('');
const cancelSuccess = ref('');

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const canCancel = computed(() => {
  if (props.profile?.subscriptionStatus !== 'active' || !props.profile?.subscriptionExpiresAt) return false;
  const duration = props.profile.subscriptionType === 'annual' ? 365 : 30;
  const createdDate = props.profile.subscriptionExpiresAt - (duration * 24 * 60 * 60 * 1000);
  return (Date.now() - createdDate) <= (3 * 24 * 60 * 60 * 1000);
});

const handleCancelSubscription = async () => {
  if (!confirm('Êtes-vous sûr de vouloir annuler votre abonnement ? Cette action est irréversible et un administrateur traitera votre remboursement sous peu.')) return;

  cancelLoading.value = true;
  cancelActiveStep.value = 0;
  cancelError.value = '';
  cancelSuccess.value = '';

  try {
    await sleep(800);
    cancelActiveStep.value = 1;
    await sleep(400);
    const result = await subscriptionStore.cancelSubscription();
    if (result.success) {
      cancelActiveStep.value = 2;
      await sleep(1000);
      cancelActiveStep.value = 3;
      await sleep(1200);
      cancelActiveStep.value = 4;
      await sleep(800);
      cancelSuccess.value = result.message;
      await profileStore.fetchProfile(props.role, { skipAuthRedirect: true });
    } else {
      cancelError.value = result.error || 'Erreur lors de l\'annulation';
    }
  } catch (err: any) {
    cancelError.value = 'Une erreur est survenue lors de l\'annulation.';
  } finally {
    cancelLoading.value = false;
  }
};
</script>
