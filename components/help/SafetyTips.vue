<template>
  <section class="mt-8">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
      <IconAlertTriangle class="w-5 h-5 inline-block mr-2 text-yellow-500" />
      Conseils de sécurité
    </h2>
    <ul class="space-y-3 text-gray-600 dark:text-gray-300">
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
</template>

<script setup lang="ts">
import { IconAlertTriangle, IconCheck } from '@tabler/icons-vue';
</script>
