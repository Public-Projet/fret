<template>
  <div class="container-custom pb-24">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">

      <!-- Starter Plan -->
      <div class="relative group">
        <div
          class="absolute inset-0 bg-gradient-to-b from-gray-200 to-transparent dark:from-gray-700 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        </div>
        <div
          class="relative p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Découverte</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 h-10">Idéal pour les expéditeurs occasionnels.</p>
          <div class="flex items-baseline mb-6">
            <span class="text-4xl font-extrabold text-gray-900 dark:text-white">Gratuit</span>
          </div>
          <NuxtLink to="/auth/register"
            class="w-full btn bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white border-none rounded-xl py-3 font-semibold mb-8">
            Commencer
          </NuxtLink>
          <ul class="space-y-4 mb-8 flex-1">
            <li class="flex items-start">
              <IconCheck class="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span class="text-sm text-gray-600 dark:text-gray-300">Accès aux annonces publiques</span>
            </li>
            <li class="flex items-start">
              <IconCheck class="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span class="text-sm text-gray-600 dark:text-gray-300">Publier jusqu'à 3 annonces/mois</span>
            </li>
            <li class="flex items-start">
              <IconCheck class="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span class="text-sm text-gray-600 dark:text-gray-300">Support par email basique</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Pro Plan (Most Popular) -->
      <div class="relative transform md:-translate-y-4">
        <div class="absolute inset-0 bg-gradient-to-r from-primary-500 to-blue-600 rounded-3xl blur-sm opacity-70">
        </div>
        <div
          class="relative p-8 bg-white dark:bg-gray-900 rounded-3xl border border-primary-500/30 shadow-2xl h-full flex flex-col">
          <div
            class="absolute top-0 right-0 bg-gradient-to-r from-primary-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-3xl">
            POPULAIRE
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Transporteur Pro</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 h-10">Pour les professionnels du transport actif.
          </p>
          <div class="flex items-baseline mb-6">
            <span class="text-4xl font-extrabold text-gray-900 dark:text-white">{{ isAnnual ? '15.000' : '18.750'
            }}</span>
            <span class="text-lg text-gray-500 dark:text-gray-400 ml-1">FCFA</span>
            <span class="text-sm text-gray-400 ml-2">/ mois</span>
          </div>
          <p class="text-xs text-green-600 dark:text-green-400 font-medium mb-6" v-if="isAnnual">
            Facturé 180.000 FCFA par an (2 mois offerts)
          </p>
          <p class="text-xs text-gray-400 font-medium mb-6" v-else>
            Facturation mensuelle sans engagement
          </p>

          <NuxtLink to="/auth/register"
            class="w-full btn btn-primary rounded-xl py-3 font-bold shadow-lg shadow-primary-500/30 mb-8 transform transition-transform hover:scale-[1.02]">
            Devenir Pro
          </NuxtLink>
          <ul class="space-y-4 mb-8 flex-1">
            <li class="flex items-start">
              <IconCheck class="w-5 h-5 text-primary-500 mr-3 flex-shrink-0" />
              <span class="text-sm text-gray-600 dark:text-gray-300">Toutes les options gratuites</span>
            </li>
            <li class="flex items-start">
              <IconCheck class="w-5 h-5 text-primary-500 mr-3 flex-shrink-0" />
              <span class="text-sm text-gray-600 dark:text-gray-300 font-medium">Répondre aux annonces en
                illimité</span>
            </li>
            <li class="flex items-start">
              <IconCheck class="w-5 h-5 text-primary-500 mr-3 flex-shrink-0" />
              <span class="text-sm text-gray-600 dark:text-gray-300">Profil vérifié ("Badge Pro")</span>
            </li>
            <li class="flex items-start">
              <IconCheck class="w-5 h-5 text-primary-500 mr-3 flex-shrink-0" />
              <span class="text-sm text-gray-600 dark:text-gray-300">Notifications instantanées prioritaires</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Enterprise Plan -->
      <div class="relative group">
        <div
          class="absolute inset-0 bg-gradient-to-b from-gray-200 to-transparent dark:from-gray-700 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        </div>
        <div
          class="relative p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Entreprise</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 h-10">Pour les flottes et grandes logistiques.</p>
          <div class="flex items-baseline mb-6">
            <span class="text-4xl font-extrabold text-gray-900 dark:text-white">Sur devis</span>
          </div>
          <NuxtLink to="/h/contact"
            class="w-full btn bg-white dark:bg-transparent border-2 border-primary-600 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl py-3 font-semibold mb-8">
            Contacter l'équipe
          </NuxtLink>
          <ul class="space-y-4 mb-8 flex-1">
            <li class="flex items-start">
              <IconCheck class="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
              <span class="text-sm text-gray-600 dark:text-gray-300">Multi-utilisateurs & Gestion de flotte</span>
            </li>
            <li class="flex items-start">
              <IconCheck class="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
              <span class="text-sm text-gray-600 dark:text-gray-300">API d'intégration TMS</span>
            </li>
            <li class="flex items-start">
              <IconCheck class="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
              <span class="text-sm text-gray-600 dark:text-gray-300">Gestionnaire de compte dédié</span>
            </li>
            <li class="flex items-start">
              <IconCheck class="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
              <span class="text-sm text-gray-600 dark:text-gray-300">Facturation centralisée</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconCheck } from '@tabler/icons-vue';

defineProps<{
  isAnnual: boolean;
}>();
</script>
