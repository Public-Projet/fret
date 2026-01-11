<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
    <!-- Header with Map Background Effect -->
    <div class="h-64 bg-slate-800 relative overflow-hidden group">
      <div
        class="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] opacity-10 bg-center bg-no-repeat bg-cover">
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>

      <div class="container-custom h-full flex flex-col justify-end pb-8 relative z-10">
        <div class="flex items-center space-x-4 mb-2">
          <span v-if="user?.verified"
            class="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center">
            <IconShieldCheck class="w-3 h-3 mr-1" />
            Transporteur Certifié
          </span>
          <span
            class="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
            Flotte Premium
          </span>
        </div>
        <h1 class="text-4xl font-extrabold text-white tracking-tight">{{ user?.company || (user?.firstName + ' ' +
          user?.lastName) }}</h1>
        <p class="text-slate-400 mt-2 max-w-2xl">
          Expert en logistique et transport de marchandises. Disponible pour trajets nationaux et sous-régionaux.
        </p>
      </div>
    </div>

    <!-- Stats Bar -->
    <div class="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-20">
      <div class="container-custom py-4">
        <div class="flex justify-between items-center overflow-x-auto">
          <div class="flex space-x-8 min-w-max px-2">
            <div class="text-center">
              <span class="block text-xl font-bold text-gray-900 dark:text-white">{{ user?.reviewCount || 45 }}</span>
              <span class="text-xs text-gray-500 uppercase">Missions</span>
            </div>
            <div class="text-center">
              <span class="block text-xl font-bold text-gray-900 dark:text-white">{{ user?.rating || 4.9 }}</span>
              <span class="text-xs text-gray-500 uppercase">Note</span>
            </div>
            <div class="text-center">
              <span class="block text-xl font-bold text-gray-900 dark:text-white">3</span>
              <span class="text-xs text-gray-500 uppercase">Véhicules</span>
            </div>
            <div class="text-center">
              <span class="block text-xl font-bold text-gray-900 dark:text-white">2018</span>
              <span class="text-xs text-gray-500 uppercase">Depuis</span>
            </div>
          </div>
          <div class="hidden md:flex space-x-3">
            <button class="btn btn-outline btn-sm">Paramètres</button>
            <button class="btn btn-primary btn-sm">Modifier Profil</button>
          </div>
        </div>
      </div>
    </div>

    <div class="container-custom mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Info -->
      <div class="lg:col-span-2 space-y-8">

        <!-- Fleet Section -->
        <section>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <IconTruck class="w-5 h-5 mr-2 text-primary-600" />
            Ma Flotte
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Cards de véhicules mockés -->
            <div
              class="group bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors cursor-pointer">
              <div class="flex justify-between items-start mb-3">
                <div class="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <IconTruck class="w-6 h-6 text-slate-600 dark:text-slate-300" />
                </div>
                <span class="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">Disponible</span>
              </div>
              <h4 class="font-bold text-gray-900 dark:text-white">Camion Benne 20T</h4>
              <p class="text-sm text-gray-500 mt-1">Capacité: 20 Tonnes • Vrac</p>
            </div>
            <div
              class="group bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors cursor-pointer">
              <div class="flex justify-between items-start mb-3">
                <div class="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <IconTruckDelivery class="w-6 h-6 text-slate-600 dark:text-slate-300" />
                </div>
                <span class="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded">En mission</span>
              </div>
              <h4 class="font-bold text-gray-900 dark:text-white">Fourgon 12m³</h4>
              <p class="text-sm text-gray-500 mt-1">Capacité: 3.5 Tonnes • Express</p>
            </div>
          </div>
        </section>

        <!-- Certifications -->
        <section>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <IconCertificate class="w-5 h-5 mr-2 text-primary-600" />
            Documents & Certifications
          </h3>
          <div
            class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
            <div class="p-4 flex items-center justify-between">
              <div class="flex items-center">
                <IconFileCheck class="w-5 h-5 text-green-500 mr-3" />
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">Licence de Transport</p>
                  <p class="text-xs text-gray-500">Validée le 12/01/2024</p>
                </div>
              </div>
              <button class="text-sm text-primary-600 hover:underline">Voir</button>
            </div>
            <div class="p-4 flex items-center justify-between">
              <div class="flex items-center">
                <IconFileCheck class="w-5 h-5 text-green-500 mr-3" />
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">Assurance Marchandises</p>
                  <p class="text-xs text-gray-500">AXA Assurances • Exp 2026</p>
                </div>
              </div>
              <button class="text-sm text-primary-600 hover:underline">Voir</button>
            </div>
          </div>
        </section>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 class="font-bold text-gray-900 dark:text-white mb-4">Coordonnées</h4>
          <ul class="space-y-4 text-sm">
            <li class="flex items-start">
              <IconMapPin class="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <span class="font-medium text-gray-900 dark:text-white">Cotonou, Bénin</span>
                <p class="text-gray-500 text-xs">Haie Vive</p>
              </div>
            </li>
            <li class="flex items-start">
              <IconPhone class="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <span class="font-medium text-gray-900 dark:text-white">{{ user?.phone }}</span>
              </div>
            </li>
            <li class="flex items-start">
              <IconMail class="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <span class="font-medium text-gray-900 dark:text-white">{{ user?.email }}</span>
              </div>
            </li>
          </ul>
        </div>

        <div class="bg-primary-600 text-white rounded-xl p-6 relative overflow-hidden">
          <div class="relative z-10">
            <h4 class="font-bold mb-2">Besoin d'aide ?</h4>
            <p class="text-primary-100 text-sm mb-4">Contactez le support pour mettre à jour vos documents.</p>
            <button class="btn bg-white text-primary-700 border-0 btn-sm">Support</button>
          </div>
          <IconHeadset class="absolute -bottom-4 -right-4 w-24 h-24 text-white/10" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import {
  IconShieldCheck, IconTruck, IconTruckDelivery, IconCertificate,
  IconFileCheck, IconMapPin, IconPhone, IconMail, IconHeadset
} from '@tabler/icons-vue';

const authStore = useAuthStore();
const user = computed(() => authStore.currentUser);

definePageMeta({
  layout: 'default'
});
</script>
