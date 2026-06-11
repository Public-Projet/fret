<template>
  <NuxtLayout name="legal" title="Documents légaux">
    <div class="space-y-8">
      <div class="text-center md:text-left">
        <p class="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
          Bienvenue dans notre centre légal. Veuillez sélectionner l'un des documents ci-dessous pour consulter nos conditions d'utilisation, politiques de confidentialité et autres mentions obligatoires.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NuxtLink
          v-for="link in allLinks"
          :key="link.to"
          :to="link.to"
          class="group flex flex-col justify-between p-6 rounded-2xl bg-gray-50/50 dark:bg-gray-800/20 border border-gray-100 dark:border-gray-800 hover:border-primary-400/50 dark:hover:border-primary-600/40 hover:shadow-md transition-all duration-300"
        >
          <div>
            <div class="flex items-center gap-4 mb-4">
              <div class="p-3 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                <component :is="link.icon" class="w-6 h-6" />
              </div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {{ link.label }}
              </h3>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {{ link.description }}
            </p>
          </div>
          <div class="mt-6 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            Consulter le document
            <IconArrowRight class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { IconFileText, IconEye, IconCookieMan, IconFileDescription, IconArrowRight } from '@tabler/icons-vue';

const allLinks = [
  { 
    to: '/legal/terms', 
    label: "Conditions d'utilisation", 
    icon: IconFileText,
    description: "Consultez les termes et conditions générales régissant l'utilisation de la plateforme Bourse de Fret."
  },
  { 
    to: '/legal/privacy', 
    label: 'Confidentialité', 
    icon: IconEye,
    description: "Découvrez comment nous protégeons, traitons et gérons vos données personnelles et votre vie privée."
  },
  { 
    to: '/legal/cookies', 
    label: 'Cookies', 
    icon: IconCookieMan,
    description: "Apprenez-en plus sur notre utilisation des cookies et traceurs pour améliorer votre expérience utilisateur."
  },
  { 
    to: '/legal/mention', 
    label: 'Mentions légales', 
    icon: IconFileDescription,
    description: "Retrouvez toutes les informations d'identification légales de l'éditeur et de l'hébergeur du site."
  },
];

useHead({
  title: 'Documents légaux',
  meta: [
    { name: 'description', content: 'Consultez les conditions d’utilisation, politique de confidentialité, charte de cookies et mentions légales de Bourse de Fret.' },
    { name: 'robots', content: 'index, follow' }
  ]
});

definePageMeta({
  layout: false
});
</script>
