<template>
  <div>
    <!-- Collapsed logout -->
    <div v-if="!mobile && collapsed" class="px-2 pb-3">
      <button @click="emit('logout')" title="Déconnexion"
        class="w-full flex items-center justify-center p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
        <IconLogout class="w-5 h-5" />
      </button>
    </div>
    <!-- Pricing & Logout block -->
    <div v-else class="px-3 pb-3 space-y-2">
      <!-- Subscription status card -->
      <div
        class="rounded-xl p-3 bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/10 border border-primary-100 dark:border-primary-800/30">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-primary-700 dark:text-primary-300">Mon abonnement</span>
          <span class="badge badge-xs"
            :class="currentUser?.subscriptionStatus === 'active' ? 'badge-success text-white' : 'badge-ghost text-gray-500'">
            {{ currentUser?.subscriptionStatus === 'active' ? 'Actif' : 'Inactif' }}
          </span>
        </div>
        <p class="text-sm font-bold text-gray-900 dark:text-white">
          {{ currentUser?.subscriptionStatus === 'active' && currentUser?.subscriptionPlan === 'pro' ? 'Plan Pro' :
          'Plan Gratuit' }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Facturation : {{ currentUser?.subscriptionStatus === 'active' ? (currentUser?.subscriptionType === 'annual'
            ? 'Annuelle' : 'Mensuelle') : 'Aucune' }}
        </p>
        <NuxtLink v-if="currentUser?.subscriptionStatus !== 'active' || currentUser?.subscriptionPlan !== 'pro'"
          to="/pricing" class="mt-2 w-full btn btn-primary btn-xs" @click="emit('linkClick')">
          Passer Pro
        </NuxtLink>
      </div>
      <!-- Logout button -->
      <button @click="emit('logout')"
        class="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
        <IconLogout class="w-4 h-4 flex-shrink-0" />
        Déconnexion
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconLogout } from '@tabler/icons-vue';

defineProps<{
  mobile: boolean;
  collapsed: boolean;
  currentUser: any;
}>();

const emit = defineEmits<{
  linkClick: [];
  logout: [];
}>();
</script>
