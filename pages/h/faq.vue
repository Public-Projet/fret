<template>
  <div class="container-custom py-12 max-w-4xl">
    <div class="card p-8 md:p-12">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Questions fréquentes</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        Retrouvez les réponses aux questions les plus posées par nos utilisateurs.
      </p>

      <!-- Category Tabs -->
      <div class="flex flex-wrap gap-2 mb-8">
        <button v-for="category in categories" :key="category" @click="activeCategory = category" :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition-all',
          activeCategory === category
            ? 'bg-primary-500 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
        ]">
          {{ category }}
        </button>
      </div>

      <!-- FAQ Items -->
      <div class="space-y-4">
        <div v-for="(faq, index) in filteredFaqs" :key="index"
          class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <button @click="toggleFaq(index)"
            class="w-full flex items-center justify-between p-5 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <span class="font-semibold text-gray-900 dark:text-white pr-4">{{ faq.question }}</span>
            <IconChevronDown
              :class="['w-5 h-5 text-gray-500 transition-transform duration-300', openIndex === index ? 'rotate-180' : '']" />
          </button>
          <div class="grid transition-all duration-300 ease-in-out"
            :class="openIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
            <div class="overflow-hidden">
              <div class="p-5 pt-0 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800">
                {{ faq.answer }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-if="filteredFaqs.length === 0" class="text-center py-12">
        <IconHelpCircle class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 dark:text-gray-400">Aucune question trouvée dans cette catégorie.</p>
      </div>

      <!-- Contact CTA -->
      <div class="mt-12 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl text-center">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Vous n'avez pas trouvé votre réponse ?</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">Notre équipe est disponible pour répondre à toutes vos
          questions.</p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <NuxtLink to="/h/help"
            class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
            <IconHelp class="w-5 h-5" />
            Centre d'aide
          </NuxtLink>
          <NuxtLink to="/h/contact"
            class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors">
            <IconMail class="w-5 h-5" />
            Nous contacter
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { IconChevronDown, IconHelpCircle, IconHelp, IconMail } from '@tabler/icons-vue';

useHead({
  title: 'FAQ'
});

definePageMeta({
  layout: 'guest'
});

const categories = ['Toutes', 'Général', 'Compte', 'Transport', 'Paiement', 'Sécurité'];
const activeCategory = ref('Toutes');
const openIndex = ref<number | null>(null);

const faqs = [
  {
    category: 'Général',
    question: "Qu'est-ce que Bourse de Fret Bénin ?",
    answer: "Bourse de Fret Bénin est une plateforme digitale qui met en relation les expéditeurs (entreprises ou particuliers ayant des marchandises à transporter) avec des transporteurs professionnels vérifiés. Notre objectif est de simplifier et sécuriser le transport de marchandises au Bénin."
  },
  {
    category: 'Général',
    question: "La plateforme est-elle gratuite ?",
    answer: "L'inscription et la consultation des annonces sont gratuites. Nous proposons des plans payants pour les transporteurs professionnels souhaitant accéder à des fonctionnalités avancées comme la réponse illimitée aux annonces et le badge vérifié."
  },
  {
    category: 'Compte',
    question: "Comment créer un compte ?",
    answer: "Pour créer un compte, cliquez sur 'S'inscrire' en haut de la page et choisissez votre profil (Expéditeur ou Transporteur). Remplissez le formulaire avec vos informations et validez votre email. Votre compte sera actif immédiatement."
  },
  {
    category: 'Compte',
    question: "Comment devenir un transporteur vérifié ?",
    answer: "Pour obtenir le badge 'Vérifié', vous devez soumettre vos documents professionnels (licence de transport, assurance, pièce d'identité) depuis votre espace personnel. Notre équipe vérifie les documents sous 24-48h."
  },
  {
    category: 'Transport',
    question: "Comment publier une annonce de transport ?",
    answer: "Connectez-vous à votre compte, allez dans 'Mes annonces' et cliquez sur 'Nouvelle annonce'. Décrivez votre marchandise, les points de départ et d'arrivée, la date souhaitée et votre budget. Votre annonce sera visible par tous les transporteurs."
  },
  {
    category: 'Transport',
    question: "Comment répondre à une annonce ?",
    answer: "Les transporteurs Pro peuvent répondre aux annonces en cliquant sur 'Faire une offre'. Vous pouvez proposer votre prix, votre disponibilité et un message personnalisé. L'expéditeur recevra votre proposition et pourra vous contacter."
  },
  {
    category: 'Paiement',
    question: "Quels sont les moyens de paiement acceptés ?",
    answer: "Nous acceptons les cartes bancaires (Visa, Mastercard), le Mobile Money (MTN Money, Moov Money) et les virements bancaires pour les entreprises. Tous les paiements sont sécurisés."
  },
  {
    category: 'Paiement',
    question: "Puis-je annuler mon abonnement ?",
    answer: "Oui, vous pouvez annuler votre abonnement à tout moment depuis vos paramètres de compte. L'abonnement restera actif jusqu'à la fin de la période payée."
  },
  {
    category: 'Sécurité',
    question: "Comment signaler un problème ou une fraude ?",
    answer: "Si vous rencontrez un comportement suspect, utilisez le bouton 'Signaler' sur le profil de l'utilisateur concerné ou contactez directement notre support via la page Contact. Nous traitons chaque signalement avec la plus grande attention."
  },
  {
    category: 'Sécurité',
    question: "Mes données personnelles sont-elles protégées ?",
    answer: "Absolument. Nous utilisons un cryptage SSL et respectons les meilleures pratiques en matière de protection des données. Vos informations ne sont jamais partagées avec des tiers sans votre consentement."
  }
];

const filteredFaqs = computed(() => {
  if (activeCategory.value === 'Toutes') {
    return faqs;
  }
  return faqs.filter(faq => faq.category === activeCategory.value);
});

const toggleFaq = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};
</script>
