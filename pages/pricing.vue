<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">
    <!-- Hero Section -->
    <div class="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[100px]"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div class="container-custom relative z-10 text-center">
        <span
          class="inline-block py-1 px-3 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold tracking-wider uppercase mb-4 animate-fade-in-up">
          Tarification simple et transparente
        </span>
        <h1
          class="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight animate-fade-in-up delay-100">
          Choisissez l'offre adaptée à <br class="hidden md:block" />
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400">
            vos besoins logistiques
          </span>
        </h1>
        <p
          class="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
          Que vous soyez un expéditeur occasionnel ou une entreprise de transport, nous avons une solution pour vous.
          Commencez gratuitement dès aujourd'hui.
        </p>

        <!-- Billing Toggle -->
        <div class="flex items-center justify-center space-x-4 mb-12 animate-fade-in-up delay-300">
          <span class="text-sm font-medium"
            :class="!isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'">Mensuel</span>
          <button @click="isAnnual = !isAnnual"
            class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
            :class="isAnnual ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'">
            <span
              class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              :class="isAnnual ? 'translate-x-5' : 'translate-x-0'"></span>
          </button>
          <span class="text-sm font-medium"
            :class="isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'">
            Annuel <span class="text-green-500 text-xs font-bold ml-1">-20%</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Pricing Cards Section -->
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
            <NuxtLink to="/contact"
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

    <!-- FAQ Section -->
    <div class="py-24 bg-white dark:bg-gray-800/50">
      <div class="container-custom max-w-4xl">
        <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Questions fréquentes</h2>

        <div class="space-y-6">
          <div v-for="(faq, index) in faqs" :key="index"
            class="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            @click="toggleFaq(index)">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white pr-4">{{ faq.question }}</h3>
              <div
                class="w-8 h-8 rounded-full bg-white dark:bg-gray-600 flex items-center justify-center transition-transform duration-300"
                :class="faq.isOpen ? 'rotate-180' : ''">
                <IconChevronDown class="w-5 h-5 text-gray-500 dark:text-gray-300" />
              </div>
            </div>
            <div class="grid transition-all duration-300 ease-in-out"
              :class="faq.isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'">
              <div class="overflow-hidden">
                <p class="text-gray-600 dark:text-gray-300">{{ faq.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="py-20">
      <div class="container-custom">
        <div class="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary-600 to-blue-600 shadow-2xl">
          <div class="absolute inset-0 bg-[url('/img/pattern.png')] opacity-10"></div>
          <div class="relative px-8 py-16 md:py-20 text-center">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">Prêt à optimiser votre logistique ?</h2>
            <p class="text-blue-100 text-lg max-w-2xl mx-auto mb-10">
              Rejoignez des milliers de transporteurs et d'expéditeurs qui font confiance à Bourse de Fret Bénin.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <NuxtLink to="/auth/register"
                class="btn bg-white text-primary-600 hover:bg-gray-50 border-none font-bold py-3 px-8 rounded-xl shadow-lg">
                Commencer gratuitement
              </NuxtLink>
              <NuxtLink to="/contact"
                class="btn bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-3 px-8 rounded-xl">
                Parler à un expert
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IconCheck, IconChevronDown } from '@tabler/icons-vue';

useHead({
  title: 'Tarification'
});

definePageMeta({
  layout: 'guest'
});

const isAnnual = ref(true);

const faqs = ref([
  {
    question: "Puis-je changer de forfait à tout moment ?",
    answer: "Oui, absolument. Vous pouvez passer d'un forfait mensuel à annuel, ou changer de niveau de service à tout moment depuis vos paramètres de compte. Les changements prennent effet immédiatement.",
    isOpen: false
  },
  {
    question: "Y a-t-il des frais cachés ?",
    answer: "Non, aucun frais caché. Les prix affichés sont transparents. Aucune commission n'est prise sur les transactions entre expéditeurs et transporteurs pour les abonnés Pro.",
    isOpen: false
  },
  {
    question: "Comment fonctionne la période d'essai ?",
    answer: "Le plan Découverte est gratuit à vie avec des fonctionnalités limitées. Pour tester les fonctionnalités Pro, nous offrons parfois des codes promotionnels ou des périodes d'essai lors d'événements spéciaux.",
    isOpen: false
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer: "Nous acceptons les cartes bancaires (Visa, Mastercard), Mobile Money (MTN, Moov) et les virements bancaires pour les plans Entreprise.",
    isOpen: false
  }
]);

const toggleFaq = (index: number) => {
  faqs.value[index].isOpen = !faqs.value[index].isOpen;
};
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.delay-100 {
  animation-delay: 0.1s;
}

.delay-200 {
  animation-delay: 0.2s;
}

.delay-300 {
  animation-delay: 0.3s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
