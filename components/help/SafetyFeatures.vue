<template>
  <div class="space-y-8">
    <!-- Section 1 -->
    <section class="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <IconUserCheck class="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Vérification des utilisateurs</h2>
          <p class="text-gray-600 dark:text-gray-300">
            Tous les transporteurs professionnels passent par un processus de vérification rigoureux. Nous vérifions
            leur identité, leurs documents professionnels (licence de transport, assurance) et leur historique.
          </p>
        </div>
      </div>
    </section>

    <!-- Section 2 -->
    <section class="p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <IconLock class="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Protection des données</h2>
          <p class="text-gray-600 dark:text-gray-300">
            Vos données personnelles sont cryptées et stockées de manière sécurisée. Nous utilisons le protocole
            HTTPS et des certifications SSL pour garantir la confidentialité de vos informations.
          </p>
        </div>
      </div>
    </section>

    <!-- Section 3 -->
    <section class="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-200 dark:border-purple-800">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <IconMessages class="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Communication sécurisée</h2>
          <p class="text-gray-600 dark:text-gray-300">
            La messagerie intégrée vous permet de communiquer avec les autres utilisateurs sans partager vos
            coordonnées personnelles. Nous surveillons les échanges pour détecter tout comportement suspect.
          </p>
        </div>
      </div>
    </section>

    <!-- Section 4 -->
    <section class="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-200 dark:border-orange-800">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <IconStar class="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Système d'évaluations</h2>
          <p class="text-gray-600 dark:text-gray-300">
            Les évaluations et avis des utilisateurs vous aident à choisir des partenaires fiables. Seules les
            transactions effectuées donnent lieu à des évaluations, garantissant leur authenticité.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { IconUserCheck, IconLock, IconMessages, IconStar } from '@tabler/icons-vue';
</script>
