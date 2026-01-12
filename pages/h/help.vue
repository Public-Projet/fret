<template>
  <div class="container-custom py-12 max-w-4xl">
    <div class="card p-8 md:p-12">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Centre d'Aide</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        Trouvez rapidement les réponses à vos questions sur Bourse de Fret Bénin.
      </p>

      <!-- Search -->
      <div class="relative mb-12">
        <IconSearch class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input v-model="searchQuery" type="text" placeholder="Rechercher dans l'aide..."
          class="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
      </div>

      <!-- Categories -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div v-for="category in categories" :key="category.title"
          class="group p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all cursor-pointer">
          <div :class="['w-12 h-12 rounded-xl flex items-center justify-center mb-4', category.iconBg]">
            <component :is="category.icon" class="w-6 h-6 text-white" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">{{ category.title }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ category.description }}</p>
          <span class="text-sm text-primary-600 dark:text-primary-400 font-medium group-hover:underline">
            {{ category.articles }} articles →
          </span>
        </div>
      </div>

      <!-- Popular Articles -->
      <div>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Articles populaires</h2>
        <div class="space-y-4">
          <div v-for="article in popularArticles" :key="article.title"
            class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
            <div class="flex items-center gap-4">
              <IconArticle class="w-5 h-5 text-gray-400" />
              <span class="text-gray-900 dark:text-white font-medium">{{ article.title }}</span>
            </div>
            <IconChevronRight class="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      <!-- Contact Support -->
      <div
        class="mt-12 p-6 bg-gradient-to-r from-primary-500 to-blue-600 dark:from-primary-600 dark:to-blue-700 rounded-2xl text-center">
        <h3 class="text-xl font-bold text-white mb-2">Besoin d'aide supplémentaire ?</h3>
        <p class="text-blue-100 mb-4">Notre équipe support est là pour vous aider 24h/24, 7j/7.</p>
        <NuxtLink to="/h/contact"
          class="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-xl font-bold hover:bg-gray-100 transition-colors">
          <IconMail class="w-5 h-5" />
          Contacter le support
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IconSearch, IconArticle, IconChevronRight, IconMail, IconTruck, IconUser, IconCreditCard, IconShieldCheck, IconSettings, IconMessageCircle } from '@tabler/icons-vue';

useHead({
  title: 'Centre d\'aide'
});

definePageMeta({
  layout: 'guest'
});

const searchQuery = ref('');

const categories = [
  {
    icon: IconUser,
    iconBg: 'bg-blue-500',
    title: 'Mon Compte',
    description: 'Inscription, connexion, profil et paramètres',
    articles: 8
  },
  {
    icon: IconTruck,
    iconBg: 'bg-green-500',
    title: 'Publier une annonce',
    description: 'Créer et gérer vos offres de transport',
    articles: 12
  },
  {
    icon: IconCreditCard,
    iconBg: 'bg-purple-500',
    title: 'Paiements & Facturation',
    description: 'Abonnements, factures et moyens de paiement',
    articles: 6
  },
  {
    icon: IconShieldCheck,
    iconBg: 'bg-orange-500',
    title: 'Sécurité & Vérification',
    description: 'Vérification de profil et sécurité des transactions',
    articles: 5
  },
  {
    icon: IconSettings,
    iconBg: 'bg-gray-500',
    title: 'Paramètres',
    description: 'Notifications, préférences et confidentialité',
    articles: 7
  },
  {
    icon: IconMessageCircle,
    iconBg: 'bg-teal-500',
    title: 'Communication',
    description: 'Messagerie et contact avec les utilisateurs',
    articles: 4
  }
];

const popularArticles = [
  { title: 'Comment créer mon premier compte ?' },
  { title: 'Comment publier une annonce de transport ?' },
  { title: 'Comment devenir transporteur vérifié ?' },
  { title: 'Quels sont les moyens de paiement acceptés ?' },
  { title: 'Comment contacter un transporteur ?' }
];
</script>
