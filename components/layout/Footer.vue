<template>
  <footer class="bg-gray-900 text-gray-300">
    <div class="container-custom py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- À propos -->
        <div>
          <div class="flex items-center space-x-2 mb-4">
            <span class="text-xl font-bold text-white">Bourse de Fret Bénin</span>
          </div>
          <p class="text-sm text-gray-400 mb-4">
            La plateforme moderne de mise en relation entre chargeurs et transporteurs.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <IconBrandFacebook class="w-5 h-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <IconBrandX class="w-5 h-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <IconBrandLinkedin class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- Liens rapides -->
        <!-- Sections dynamiques -->
        <div v-for="section in footerSections" :key="section.title">
          <h3 class="text-white font-semibold mb-4">{{ section.title }}</h3>
          <ul class="space-y-2">
            <li v-for="link in section.links" :key="link.to">
              <NuxtLink :to="link.to" class="text-sm hover:text-white transition-colors">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Copyright -->
      <div class="border-t border-gray-800 mt-8 pt-8 text-center">
        <p class="text-sm text-gray-400">
          © {{ currentYear }} Bourse de Fret Bénin. Tous droits réservés.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IconBrandFacebook, IconBrandLinkedin, IconBrandX } from '@tabler/icons-vue';

const currentYear = computed(() => new Date().getFullYear());

const footerSections = [
  {
    title: 'Liens rapides',
    links: [
      { label: 'Annonces', to: '/annonces?tab=fret' },
      { label: 'À propos', to: '/about' },
      { label: 'Comment ça marche', to: '/#features' },
      { label: 'Tarifs', to: '/pricing' }
    ]
  },
  {
    title: 'Support',
    links: [
      { label: "Centre d'aide", to: '/h/help' },
      { label: 'Contact', to: '/h/contact' },
      { label: 'FAQ', to: '/h/faq' },
      { label: 'Sécurité', to: '/h/safety' }
    ]
  },
  {
    title: 'Légal',
    links: [
      { label: "Conditions d'utilisation", to: '/l/terms' },
      { label: 'Politique de confidentialité', to: '/l/privacy' },
      { label: 'Cookies', to: '/l/cookies' },
      { label: 'Mentions légales', to: '/l/legal' }
    ]
  }
];
</script>
