<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
    <!-- Corporate Banner -->
    <div class="h-64 bg-slate-900 relative overflow-hidden">
      <!-- Abstract Shapes -->
      <div
        class="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob">
      </div>
      <div
        class="absolute -bottom-32 -left-32 w-64 h-64 bg-primary-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000">
      </div>

      <div class="container-custom h-full flex items-end pb-8 relative z-10">
        <div class="flex items-end space-x-6 w-full">
          <div class="w-32 h-32 bg-white rounded-lg shadow-xl p-1 flex items-center justify-center -mb-16">
            <div
              class="w-full h-full bg-slate-100 rounded flex items-center justify-center text-4xl font-bold text-slate-700 uppercase">
              {{ user?.company ? user.company[0] : user?.firstName[0] }}
            </div>
          </div>
          <div class="flex-1 pb-4">
            <h1 class="text-3xl font-bold text-white mb-1">{{ user?.company || (user?.firstName + ' ' + user?.lastName)
              }}</h1>
            <p class="text-slate-300 flex items-center">
              <IconBuildingSkyscraper class="w-4 h-4 mr-1" />
              Compte Chargeur
              <span class="mx-2">•</span>
              <span v-if="user?.verified" class="text-green-400 flex items-center text-sm font-medium">
                <IconDiscountCheckFilled class="w-4 h-4 mr-1" />
                Vérifié
              </span>
            </p>
          </div>
          <div class="pb-4 flex space-x-3">
            <button class="btn bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm">
              <IconSettings class="w-5 h-5" />
            </button>
            <button class="btn bg-primary-600 hover:bg-primary-700 text-white border-0 shadow-lg shadow-primary-900/20">
              Modifier le profil
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container-custom mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">

      <!-- Left Column: Info & Stats -->
      <div class="space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">A propos</h3>
          <div class="space-y-4">
            <div>
              <label class="text-xs text-gray-500 block mb-1">Responsable</label>
              <p class="font-medium text-gray-900 dark:text-white">{{ user?.firstName }} {{ user?.lastName }}</p>
            </div>
            <div>
              <label class="text-xs text-gray-500 block mb-1">Email professionnel</label>
              <p class="font-medium text-gray-900 dark:text-white flex items-center">
                <IconMail class="w-4 h-4 mr-2 text-gray-400" />
                {{ user?.email }}
              </p>
            </div>
            <div>
              <label class="text-xs text-gray-500 block mb-1">Téléphone</label>
              <p class="font-medium text-gray-900 dark:text-white flex items-center">
                <IconPhone class="w-4 h-4 mr-2 text-gray-400" />
                {{ user?.phone }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-gradient-to-br from-primary-900 to-slate-900 text-white rounded-xl shadow-lg p-6 relative overflow-hidden">
          <div class="relative z-10">
            <h3 class="text-lg font-bold mb-1">Premium Member</h3>
            <p class="text-primary-200 text-sm mb-4">Plan Business</p>
            <div class="w-full bg-white/10 rounded-full h-2 mb-2">
              <div class="bg-primary-400 h-2 rounded-full" style="width: 75%"></div>
            </div>
            <p class="text-xs text-slate-300">75% d'utilisation ce mois</p>
          </div>
          <IconPremiumRights class="absolute -bottom-4 -right-4 w-32 h-32 text-white/5" />
        </div>
      </div>

      <!-- Right Column: Dashboard Widgets -->
      <div class="lg:col-span-2 space-y-6">
        <!-- KPI Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
            <span class="text-3xl font-bold text-slate-800 dark:text-white mb-1">{{ user?.reviewCount || 12 }}</span>
            <span class="text-xs text-slate-500 uppercase font-medium">Annonces</span>
          </div>
          <div
            class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
            <span class="text-3xl font-bold text-green-600 mb-1">98%</span>
            <span class="text-xs text-slate-500 uppercase font-medium">Fiabilité</span>
          </div>
          <div
            class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
            <span class="text-3xl font-bold text-yellow-500 mb-1">{{ user?.rating || '4.8' }}</span>
            <span class="text-xs text-slate-500 uppercase font-medium">Note</span>
          </div>
          <div
            class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
            <span class="text-3xl font-bold text-blue-600 mb-1">24h</span>
            <span class="text-xs text-slate-500 uppercase font-medium">Paiement</span>
          </div>
        </div>

        <!-- Recent Activity / Timeline -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="font-bold text-gray-900 dark:text-white mb-6">Activité Récente</h3>
          <div class="relative pl-8 border-l border-gray-200 dark:border-gray-700 space-y-8">
            <div class="relative">
              <div
                class="absolute -left-[37px] p-1 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
                <div class="w-4 h-4 rounded-full bg-blue-500"></div>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Annonce "Transport Palettes" publiée</p>
                <p class="text-xs text-gray-500 mt-1">Il y a 2 heures</p>
              </div>
            </div>
            <div class="relative">
              <div
                class="absolute -left-[37px] p-1 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
                <div class="w-4 h-4 rounded-full bg-green-500"></div>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Paiement effectué pour "Conteneur Lomé"</p>
                <p class="text-xs text-gray-500 mt-1">Hier à 14:30</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import {
  IconBuildingSkyscraper, IconDiscountCheckFilled, IconSettings, IconMail,
  IconPhone, IconPremiumRights
} from '@tabler/icons-vue';

const authStore = useAuthStore();
const user = computed(() => authStore.currentUser);

definePageMeta({
  layout: 'default' // Or a specific dashboard layout
});
</script>
