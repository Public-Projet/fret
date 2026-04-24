<template>
  <footer class="bg-gray-900 text-gray-300">
    <div class="container-custom py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        <!-- À propos -->
        <div class="lg:col-span-1">
          <div class="flex items-center space-x-2 mb-4">
            <span class="text-xl font-bold text-white">Bourse de Fret Bénin</span>
          </div>
          <p class="text-sm text-gray-400 mb-4">
            La plateforme moderne de mise en relation entre chargeurs et transporteurs.
          </p>
          <div class="flex space-x-4">
            <template v-for="link in store.socialLinks" :key="link.id">
              <a v-if="link.isActive" :href="link.url" target="_blank" rel="noopener noreferrer"
                class="group text-gray-400 hover:text-white transition-all transform hover:scale-110"
                :title="link.label">
                <component :is="getIconComponent(link.icon)" class="w-6 h-6" />
              </a>
            </template>
          </div>
        </div>

        <!-- Sections Dynamiques -->
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
import { computed, onMounted } from 'vue';
import * as Icons from '@tabler/icons-vue';
import { usePbcSiteContentStore } from '~/stores/pbcSiteContent';

const store = usePbcSiteContentStore();
const currentYear = computed(() => new Date().getFullYear());

// Fetch social links
await store.fetchSocialLinks();

const getIconComponent = (iconName: string) => {
  return (Icons as any)[iconName] || Icons.IconShare;
};

const footerSections = [
  {
    title: 'Liens rapides',
    links: [
      { label: 'À propos', to: '/about' },
      { label: 'Comment ça marche', to: '/#features' },
      { label: 'Pourquoi choisir', to: '/#advantages' },
      { label: 'Tarifs', to: '/pricing' }
    ]
  },
  {
    title: 'Plateforme',
    links: [
      { label: 'Annonces', to: '/annonces?tab=fret' },
      { label: 'Disponibilités', to: '/annonces?tab=avail' },
      { label: 'Transporteurs', to: '/users?tab=carrier' },
      { label: 'Expéditeurs', to: '/users?tab=shipper' }
    ]
  },
  {
    title: 'Support',
    links: [
      { label: "Centre d'aide", to: '/support/help' },
      { label: 'Contact', to: '/support/contact' },
      { label: 'FAQ', to: '/support/faq' },
      { label: 'Sécurité', to: '/support/safety' }
    ]
  },
  {
    title: 'Légal',
    links: [
      { label: "Conditions d'utilisation", to: '/legal/terms' },
      { label: 'Politique de confidentialité', to: '/legal/privacy' },
      { label: 'Cookies', to: '/legal/cookies' },
      { label: 'Mentions légales', to: '/legal/mention' }
    ]
  }
];
</script>
