<template>
  <div class="min-h-screen bg-gray-50 font-body">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- Global WhatsApp Floating Button -->
    <a href="https://wa.me/33613443329?text=Bonjour Equipe de la Bourse de Fret. J'aimerais en savoir plus sur vos services."
      target="_blank" rel="noopener noreferrer"
      class="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center">
      <IconBrandWhatsapp class="w-4 h-4" />
    </a>
  </div>
</template>

<script setup lang="ts">
import { useCmnAuthStore } from '~/stores/cmnAuth';
import { useNotificationStore } from '~/stores/notification';
import { IconBrandWhatsapp } from '@tabler/icons-vue';

const heroImagePath = "https://assets.volvo.com/is/image/VolvoInformationTechnologyAB/Volvo-High-Capacity-Transport-1?wid=1024";
const baseUrl = "https://boursefret.netlify.app";
const authStore = useCmnAuthStore();
const notificationStore = useNotificationStore();

onMounted(() => {
  authStore.restoreSession();
  if (authStore.isAuthenticated) {
    notificationStore.fetchNotifications();
    notificationStore.startPolling();
  }
});

onUnmounted(() => {
  notificationStore.stopPolling();
});

useHead({
  titleTemplate: '%s | Bourse de Fret Bénin',
  meta: [
    {
      key: 'description',
      name: 'description',
      content: 'Plateforme moderne de mise en relation entre chargeurs et transporteurs.'
    },

    // Open Graph (Facebook, LinkedIn)
    { property: 'og:title', content: 'Plateforme de mise en relation' },
    { property: 'og:description', content: 'Plateforme moderne de mise en relation entre chargeurs et transporteurs.' },
    { property: 'og:image', content: heroImagePath },
    { property: 'og:url', content: baseUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'fr_FR' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Plateforme de mise en relation' },
    { name: 'twitter:description', content: 'Plateforme moderne de mise en relation entre chargeurs et transporteurs.' },
    { name: 'twitter:image', content: heroImagePath },
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon.ico' },
    { rel: 'canonical', href: baseUrl }
  ]
});
</script>
