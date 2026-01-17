<template>
  <div class="container-custom py-12 max-w-4xl">
    <div class="card p-8 md:p-12">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
          <IconShieldCheck class="w-6 h-6 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Sécurité & confiance</h1>
      </div>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        Votre sécurité est notre priorité. Découvrez comment nous protégeons nos utilisateurs.
      </p>

      <div class="prose dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-gray-300">
        <!-- Section 1 -->
        <section class="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <IconUserCheck class="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Vérification des utilisateurs</h2>
              <p>
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
              <p>
                Vos données personnelles sont cryptées et stockées de manière sécurisée. Nous utilisons le protocole
                HTTPS et des certifications SSL pour garantir la confidentialité de vos informations.
              </p>
            </div>
          </div>
        </section>

        <!-- Section 3 -->
        <section
          class="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-200 dark:border-purple-800">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <IconMessages class="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Communication sécurisée</h2>
              <p>
                La messagerie intégrée vous permet de communiquer avec les autres utilisateurs sans partager vos
                coordonnées personnelles. Nous surveillons les échanges pour détecter tout comportement suspect.
              </p>
            </div>
          </div>
        </section>

        <!-- Section 4 -->
        <section
          class="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-200 dark:border-orange-800">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <IconStar class="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Système d'évaluations</h2>
              <p>
                Les évaluations et avis des utilisateurs vous aident à choisir des partenaires fiables. Seules les
                transactions effectuées donnent lieu à des évaluations, garantissant leur authenticité.
              </p>
            </div>
          </div>
        </section>

        <!-- Tips Section -->
        <section>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            <IconAlertTriangle class="w-5 h-5 inline-block mr-2 text-yellow-500" />
            Conseils de sécurité
          </h2>
          <ul class="space-y-3">
            <li class="flex items-start gap-3">
              <IconCheck class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Vérifiez toujours le profil et les évaluations avant de conclure un accord</span>
            </li>
            <li class="flex items-start gap-3">
              <IconCheck class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Communiquez uniquement via la messagerie de la plateforme</span>
            </li>
            <li class="flex items-start gap-3">
              <IconCheck class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Ne partagez jamais vos informations de paiement en dehors de la plateforme</span>
            </li>
            <li class="flex items-start gap-3">
              <IconCheck class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Signalez immédiatement tout comportement suspect à notre équipe</span>
            </li>
            <li class="flex items-start gap-3">
              <IconCheck class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Privilégiez les transporteurs avec le badge "Vérifié"</span>
            </li>
          </ul>
        </section>

        <!-- Report Section -->
        <section class="p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Signaler un problème</h2>
          <p class="mb-4">
            Si vous remarquez un comportement suspect, une arnaque potentielle ou tout autre problème de sécurité,
            contactez-nous immédiatement.
          </p>
          <NuxtLink to="/h/contact"
            class="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors">
            <IconAlertCircle class="w-5 h-5" />
            Signaler un problème
          </NuxtLink>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconShieldCheck, IconUserCheck, IconLock, IconMessages, IconStar, IconAlertTriangle, IconCheck, IconAlertCircle } from '@tabler/icons-vue';

useHead({
  title: 'Sécurité & Confiance'
});

definePageMeta({
  layout: 'guest'
});
</script>
